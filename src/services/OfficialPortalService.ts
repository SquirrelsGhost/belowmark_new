import "server-only";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import tls from "node:tls";
import { inflateSync } from "node:zlib";
import { Listing, OfficialAttachment, OfficialPortalDetails } from "@/types/listing.types";

interface TlsWithSystemCa {
  getCACertificates?: (type: "default" | "system") => string[];
  setDefaultCACertificates?: (certs: string[]) => void;
}

try {
  const runtimeTls = tls as TlsWithSystemCa;
  if (typeof runtimeTls.getCACertificates === "function" && typeof runtimeTls.setDefaultCACertificates === "function") {
    const sys = runtimeTls.getCACertificates("system");
    const def = runtimeTls.getCACertificates("default");
    runtimeTls.setDefaultCACertificates([...new Set([...def, ...sys])]);
  }
} catch {
  // Ignore on runtimes without system CA support
}

const CACHE_DIR = join(process.cwd(), ".data", "portal-cache");
const PHOTO_CACHE_DIR = join(CACHE_DIR, "photos");
const MAX_EXTRACTED_PHOTOS = 12;

const ZVG_PORTAL_REFERER = "https://www.zvg-portal.de/index.php?button=Suchen";
const ZVG_COM_REFERER = "https://www.zvg.com/";
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const NAMED_ENTITIES: Record<string, string> = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
  "&#39;": "'",
  "&#039;": "'",
  "&uuml;": "ü",
  "&Uuml;": "Ü",
  "&auml;": "ä",
  "&Auml;": "Ä",
  "&ouml;": "ö",
  "&Ouml;": "Ö",
  "&szlig;": "ß",
  "&euro;": "€",
  "&#128;": "€",
  "&sect;": "§",
  "&sup2;": "²",
  "&sup3;": "³",
  "&ndash;": "–",
  "&mdash;": "—",
  "&bdquo;": "„",
  "&ldquo;": '"',
  "&rdquo;": '"',
  "&sbquo;": "‚",
  "&lsquo;": "'",
  "&rsquo;": "'",
  "&deg;": "°",
  "&frac12;": "1/2",
  "&frac14;": "1/4",
  "&frac34;": "3/4",
};

function cleanHtmlText(html: string | null | undefined, preserveNewlines = true): string {
  if (!html) return "";
  let s = html;
  if (preserveNewlines) {
    s = s.replace(/<br\s*\/?>/gi, "\n").replace(/<\/(?:p|div|tr|li|h[1-6])>/gi, "\n");
  }
  s = s
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => {
      const code = Number.parseInt(hex, 16);
      return code === 0x80 ? "€" : String.fromCodePoint(code);
    })
    .replace(/&#(\d+);/g, (_, dec: string) => {
      const code = Number.parseInt(dec, 10);
      return code === 128 ? "€" : String.fromCodePoint(code);
    })
    .replace(/&[a-zA-Z0-9#]+;/g, (ent) => NAMED_ENTITIES[ent] ?? NAMED_ENTITIES[ent.toLowerCase()] ?? ent);

  if (preserveNewlines) {
    return s
      .replace(/[ \t]+/g, " ")
      .replace(/\n[ \t]+/g, "\n")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n\s*\n+/g, "\n\n")
      .trim();
  }
  return s.replace(/\s+/g, " ").trim();
}

function parseGermanNum(raw: string | null | undefined): number | null {
  if (!raw) return null;
  const s = raw.trim().replace(/\s+/g, "");
  if (!s) return null;
  const cleaned = /^\d{1,3}(?:\.\d{3})+(?:,\d+)?$/.test(s) || s.includes(",") ? s.replace(/\./g, "").replace(",", ".") : s;
  const n = Number.parseFloat(cleaned);
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : null;
}

function extractLivingArea(text: string): number | null {
  if (!text) return null;
  const cleaned = cleanHtmlText(text, false);
  const afterMatch =
    /(?:Gesamtwohnfl(?:ä|ae)che|Wohnfl(?:ä|ae)che|Wohn-\s*(?:und\s*|\/\s*)?Nutzfl(?:ä|ae)che|\bWfl\.?)(?:\s*(?:von|beträgt|insgesamt|gesamt|lt\.\s*\S+|laut\s*\S+|ca\.?|rd\.?|rund|etwa|circa|~|:|-))*[^0-9\n.;]{0,28}?(\d{1,4}(?:\.\d{3})*(?:,\d{1,2})?)\s*(?:m²|m2|qm\b)/i.exec(
      cleaned,
    );
  if (afterMatch) {
    const val = parseGermanNum(afterMatch[1]);
    if (val && val >= 12 && val <= 5000) return val;
  }

  const beforeMatch =
    /(\d{1,4}(?:\.\d{3})*(?:,\d{1,2})?)\s*(?:m²|m2|qm\b)\s*(?:Gesamtwohnfl(?:ä|ae)che|Wohnfl(?:ä|ae)che|Wohn-\s*(?:und\s*|\/\s*)?Nutzfl(?:ä|ae)che|\bWfl\.?)/i.exec(
      cleaned,
    );
  if (beforeMatch) {
    const val = parseGermanNum(beforeMatch[1]);
    if (val && val >= 12 && val <= 5000) return val;
  }
  return null;
}

function extractUsableArea(text: string): number | null {
  if (!text) return null;
  const cleaned = cleanHtmlText(text, false);
  const afterMatch =
    /(?:Gesamtnutzfl(?:ä|ae)che|Nutzfl(?:ä|ae)che|Gewerbefl(?:ä|ae)che|Ladenfl(?:ä|ae)che|Bürofl(?:ä|ae)che|Hallenfl(?:ä|ae)che|\bNfl\.?)(?:\s*(?:von|beträgt|insgesamt|gesamt|ca\.?|rd\.?|rund|etwa|circa|~|:|-))*[^0-9\n.;]{0,28}?(\d{1,5}(?:\.\d{3})*(?:,\d{1,2})?)\s*(?:m²|m2|qm\b)/i.exec(
      cleaned,
    );
  if (afterMatch) {
    const val = parseGermanNum(afterMatch[1]);
    if (val && val >= 10 && val <= 60000) return val;
  }

  const beforeMatch =
    /(\d{1,5}(?:\.\d{3})*(?:,\d{1,2})?)\s*(?:m²|m2|qm\b)\s*(?:Gesamtnutzfl(?:ä|ae)che|Nutzfl(?:ä|ae)che|Gewerbefl(?:ä|ae)che|Ladenfl(?:ä|ae)che|Bürofl(?:ä|ae)che|Hallenfl(?:ä|ae)che|\bNfl\.?)/i.exec(
      cleaned,
    );
  if (beforeMatch) {
    const val = parseGermanNum(beforeMatch[1]);
    if (val && val >= 10 && val <= 60000) return val;
  }
  return null;
}

function extractLandArea(text: string): number | null {
  if (!text) return null;
  const cleaned = cleanHtmlText(text, false);

  const explicitAfter =
    /(?:Grundst(?:ü|ue)cksgr(?:ö|oe)(?:ß|ss)e|Grundst(?:ü|ue)cksfl(?:ä|ae)che|Katasterfl(?:ä|ae)che|Gesamtfl(?:ä|ae)che|Arealfl(?:ä|ae)che)(?:\s*(?:von|beträgt|insgesamt|gesamt|ca\.?|rd\.?|rund|etwa|circa|~|:|-))*[^0-9\n.;]{0,28}?(\d{1,6}(?:\.\d{3})*(?:,\d{1,2})?)\s*(?:m²|m2|qm\b)/i.exec(
      cleaned,
    );
  if (explicitAfter) {
    const val = parseGermanNum(explicitAfter[1]);
    if (val && val >= 15 && val <= 5000000) return val;
  }

  const explicitBefore =
    /(\d{1,6}(?:\.\d{3})*(?:,\d{1,2})?)\s*(?:m²|m2|qm\b)\s*(?:Grundst(?:ü|ue)cksfl(?:ä|ae)che|Grundst(?:ü|ue)cksgr(?:ö|oe)(?:ß|ss)e|gro(?:ß|ss)es\s+Grundst(?:ü|ue)ck)/i.exec(
      cleaned,
    );
  if (explicitBefore) {
    const val = parseGermanNum(explicitBefore[1]);
    if (val && val >= 15 && val <= 5000000) return val;
  }

  const parcelSizes: number[] = [];
  const groesseRe = /(?:Gr(?:ö|oe)(?:ß|ss)e|Fl(?:ä|ae)che)\s*:\s*(?:ca\.?\s*)?(\d{1,6}(?:\.\d{3})*(?:,\d{1,2})?)\s*(?:m²|m2|qm\b)/gi;
  for (const m of cleaned.matchAll(groesseRe)) {
    const val = parseGermanNum(m[1]);
    if (val && val >= 15 && val <= 5000000) parcelSizes.push(val);
  }
  if (parcelSizes.length === 1) return parcelSizes[0];
  if (parcelSizes.length > 1) return Math.round(parcelSizes.reduce((a, b) => a + b, 0) * 100) / 100;

  const zuMatch =
    /(?:Flst\.?|FlNr\.?|Flurst(?:ü|ue)ck|Parzelle|Grundst(?:ü|ue)ck)[^.;\n]{0,65}?\bzu\s+(?:ca\.?\s*)?(\d{1,6}(?:\.\d{3})*(?:,\d{1,2})?)\s*(?:m²|m2|qm\b)/i.exec(
      cleaned,
    );
  if (zuMatch) {
    const val = parseGermanNum(zuMatch[1]);
    if (val && val >= 15 && val <= 5000000) return val;
  }

  const haMatch = /\b(\d{1,4},\d{1,4})\s*ha\b/i.exec(cleaned);
  if (haMatch) {
    const ha = parseGermanNum(haMatch[1]);
    if (ha && ha > 0 && ha <= 1000) return Math.round(ha * 10000);
  }
  return null;
}

const WORD_TO_ROOMS_DE: [RegExp, string][] = [
  [/\bEinzimmerwohnung\b/i, "1 Zimmer"],
  [/\bZweizimmerwohnung\b/i, "2 Zimmer"],
  [/\bDreizimmerwohnung\b/i, "3 Zimmer"],
  [/\bVierzimmerwohnung\b/i, "4 Zimmer"],
  [/\bF(?:ü|ue)nfzimmerwohnung\b/i, "5 Zimmer"],
  [/\bSechszimmerwohnung\b/i, "6 Zimmer"],
];

function extractRooms(text: string): string | null {
  if (!text) return null;
  const cleaned = cleanHtmlText(text, false);
  const rangeMatch = /\b(\d+(?:,\d)?\s*(?:bis|-)\s*\d+(?:,\d)?)\s*-?\s*Zimmer/i.exec(cleaned);
  if (rangeMatch) return `${rangeMatch[1].replace(/\s+/g, " ")} Zimmer`;

  const numMatch = /\b([1-9](?:,[05])?)\s*-?\s*Zimmer(?:-Wohnung|\b)/i.exec(cleaned);
  if (numMatch) return `${numMatch[1]} Zimmer`;

  for (const [re, label] of WORD_TO_ROOMS_DE) {
    if (re.test(cleaned)) return label;
  }
  return null;
}

function extractYearBuilt(text: string): number | null {
  if (!text) return null;
  const cleaned = cleanHtmlText(text, false);
  const m =
    /(?:Baujahr|Bj\.?|urspr(?:ü|ue)ngliches\s+Baujahr|erbaut(?:\s+ca\.?|\s+um|\s+im\s+Jahr)?)[^0-9\n]{0,22}?(1[789]\d{2}|20[0-2]\d)\b/i.exec(
      cleaned,
    );
  if (!m) return null;
  const y = Number.parseInt(m[1], 10);
  return y >= 1700 && y <= 2027 ? y : null;
}

function classifyAttachment(label: string, fileName: string): OfficialAttachment["kind"] {
  const fnLower = fileName.toLowerCase();
  const rawLower = label.toLowerCase();
  const combined = `${rawLower} ${fnLower}`;
  if (fnLower.includes("hinweis") || fnLower.includes("merkblatt") || rawLower.includes("hinweis") || rawLower.includes("merkblatt")) return "notes";
  if (fnLower.includes("foto") || fnLower.includes("bild") || fnLower.includes("ansicht") || rawLower.includes("foto") || rawLower.includes("bild")) return "photos";
  if (fnLower.includes("expose") || fnLower.includes("exposé") || fnLower.includes("kurzbeschreibung") || rawLower.includes("expose") || rawLower.includes("exposé")) return "expose";
  if (combined.includes("gutachten") || combined.includes("verkehrswert")) return "report";
  return "announcement";
}

function safeCacheName(key: string): string {
  return key.replace(/[^a-zA-Z0-9_-]/g, "_");
}

async function readCache(key: string): Promise<OfficialPortalDetails | null> {
  try {
    const file = join(CACHE_DIR, `${safeCacheName(key)}.json`);
    await stat(file);
    const raw = await readFile(file, "utf8");
    return JSON.parse(raw) as OfficialPortalDetails;
  } catch {
    return null;
  }
}

async function writeCache(key: string, details: OfficialPortalDetails): Promise<void> {
  try {
    await mkdir(CACHE_DIR, { recursive: true });
    const file = join(CACHE_DIR, `${safeCacheName(key)}.json`);
    await writeFile(file, JSON.stringify(details), "utf8");
  } catch {
    // Ignore on read-only fs
  }
}

/**
 * Extracts real embedded JPEG building/apartment photos from a court PDF
 * (supports both raw /DCTDecode and zlib-wrapped [/FlateDecode /DCTDecode]).
 */
export function extractJpegsFromPdf(pdfBuffer: Buffer): Buffer[] {
  const s = pdfBuffer.toString("latin1");
  const cameraPhotos: Buffer[] = [];
  const pagePhotos: Buffer[] = [];

  let pos = 0;
  while ((pos = s.indexOf("/DCTDecode", pos)) !== -1) {
    const dictStart = Math.max(0, s.lastIndexOf("<<", pos));
    const streamKeyword = s.indexOf("stream", pos);
    pos += 10;
    if (streamKeyword === -1 || streamKeyword - dictStart > 600) continue;

    const dict = s.slice(dictStart, streamKeyword);
    if (!/\/Subtype\s*\/Image/i.test(dict)) continue;

    const width = Number.parseInt(/\/Width\s+(\d+)/i.exec(dict)?.[1] ?? "0", 10);
    const height = Number.parseInt(/\/Height\s+(\d+)/i.exec(dict)?.[1] ?? "0", 10);
    const length = Number.parseInt(/\/Length\s+(\d+)/i.exec(dict)?.[1] ?? "0", 10);

    // Skip small icons, stamps, or thin letterhead banners
    if (width < 180 || height < 140 || width / height > 3.2 || height / width > 3.2) continue;

    let dataStart = streamKeyword + 6;
    if (pdfBuffer[dataStart] === 13 && pdfBuffer[dataStart + 1] === 10) dataStart += 2;
    else if (pdfBuffer[dataStart] === 10 || pdfBuffer[dataStart] === 13) dataStart += 1;

    const endStream = s.indexOf("endstream", dataStart);
    if (endStream === -1) continue;

    const byteLen = length > 0 && dataStart + length <= endStream ? length : endStream - dataStart;
    if (byteLen < 6500) continue;

    const rawSlice = pdfBuffer.subarray(dataStart, dataStart + byteLen);
    let jpeg: Buffer | null = null;

    if (rawSlice[0] === 0xff && rawSlice[1] === 0xd8 && rawSlice[2] === 0xff) {
      jpeg = Buffer.from(rawSlice);
    } else if (/\/FlateDecode/i.test(dict)) {
      try {
        const inflated = inflateSync(rawSlice);
        if (inflated[0] === 0xff && inflated[1] === 0xd8 && inflated[2] === 0xff) {
          jpeg = inflated;
        }
      } catch {
        jpeg = null;
      }
    }

    if (!jpeg) continue;

    // Separate dedicated camera photos from full A4 scanned pages (e.g. 1240x1754)
    const isScannedA4 = height > width * 1.32 && width >= 1000 && height >= 1400;
    if (isScannedA4) {
      if (pagePhotos.length < MAX_EXTRACTED_PHOTOS) pagePhotos.push(jpeg);
    } else {
      if (cameraPhotos.length < MAX_EXTRACTED_PHOTOS) cameraPhotos.push(jpeg);
    }

    if (cameraPhotos.length >= MAX_EXTRACTED_PHOTOS) break;
  }

  return cameraPhotos.length > 0 ? cameraPhotos : pagePhotos.slice(0, 8);
}

async function fetchZvgComGalleryUrls(zvgComId: string): Promise<string[]> {
  try {
    const res = await fetch(`https://www.zvg.com/v2024/termine.prg?act=getGalleryPics&id=${zvgComId}`, {
      headers: {
        Referer: ZVG_COM_REFERER,
        "User-Agent": USER_AGENT,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(4500),
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { data?: unknown[]; [k: string]: unknown } | unknown[];
    const list = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
    const urls: string[] = [];
    for (const item of list) {
      const p = typeof item === "string" ? item : (item as { src?: string; url?: string })?.src;
      if (!p || typeof p !== "string") continue;
      const full = /^https?:\/\//i.test(p) ? p : p.startsWith("/") ? `https://www.zvg.com${p}` : null;
      if (full && !urls.includes(full)) urls.push(full);
    }
    return urls;
  } catch {
    return [];
  }
}

async function extractAndCachePortalPhotos(
  listing: Listing,
  attachments: OfficialAttachment[],
  showZvgReferer: string,
): Promise<string[]> {
  const safeKey = safeCacheName(listing.key);
  const encodedKey = encodeURIComponent(listing.key);

  // Preferred order: dedicated Fotos.pdf -> Exposee.pdf -> Gutachten.pdf
  const candidates = [
    ...attachments.filter((a) => a.kind === "photos"),
    ...attachments.filter((a) => a.kind === "expose"),
    ...attachments.filter((a) => a.kind === "report"),
  ];

  for (const att of candidates) {
    try {
      const res = await fetch(att.directUrl, {
        headers: {
          Referer: showZvgReferer,
          "User-Agent": USER_AGENT,
        },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 8000) continue;

      const jpegs = extractJpegsFromPdf(buf);
      if (jpegs.length === 0) continue;

      await mkdir(PHOTO_CACHE_DIR, { recursive: true });
      const urls: string[] = [];
      for (let i = 0; i < jpegs.length; i++) {
        const photoFile = join(PHOTO_CACHE_DIR, `${safeKey}-${i}.jpg`);
        await writeFile(photoFile, jpegs[i]);
        urls.push(`/api/quelle/${encodedKey}?photo=${i}`);
      }
      return urls;
    } catch {
      // Try next candidate PDF
    }
  }
  return [];
}

async function fetchZvgPortalDetails(listing: Listing): Promise<OfficialPortalDetails> {
  const encodedKey = encodeURIComponent(listing.key);
  const portalEntryUrl = `/api/quelle/${encodedKey}?mode=portal`;
  const zvgIdMatch = /zvg_id=(\d+)/.exec(listing.officialUrl ?? "") ?? /^zvgportal-(\d+)$/.exec(listing.key);
  const landMatch = /land_abk=([a-z]{2})/i.exec(listing.officialUrl ?? "");
  const zvgId = zvgIdMatch?.[1] ?? null;
  const landAbk = landMatch?.[1] ?? listing.regionCode ?? "nw";

  const base: OfficialPortalDetails = {
    sourcePortal: "zvg-portal.de",
    portalEntryUrl,
    proceedingKind: listing.proceedingKind ?? null,
    grundbuch: listing.grundbuch ?? null,
    description: listing.description ?? null,
    hearingPlace: listing.hearingPlace ?? null,
    creditor: listing.creditor ?? null,
    courtUrl: listing.courtUrl ?? null,
    geoServerUrl: listing.geoServerUrl ?? null,
    livingAreaM2: listing.livingAreaM2 ?? extractLivingArea(listing.title),
    usableAreaM2: listing.usableAreaM2 ?? extractUsableArea(listing.title),
    landAreaM2: listing.landAreaM2 ?? extractLandArea(listing.title),
    rooms: listing.rooms ?? extractRooms(listing.title),
    yearBuilt: listing.yearBuilt ?? extractYearBuilt(listing.title),
    attachments: [],
    galleryUrls: listing.imageUrl ? [listing.imageUrl] : [],
    tkgmParcelUrl: null,
  };

  if (listing.zvgComId) {
    const zvgComPics = await fetchZvgComGalleryUrls(listing.zvgComId);
    for (const u of zvgComPics) {
      if (!base.galleryUrls.includes(u)) base.galleryUrls.push(u);
    }
  }

  if (!zvgId) {
    if (listing.documentUrl) {
      const fMatch = /file_id=(\d+)/.exec(listing.documentUrl);
      const fId = fMatch?.[1] ?? "1";
      base.attachments.push({
        id: fId,
        kind: "announcement",
        label: "Amtliche Bekanntmachung",
        fileName: "Amtliche_Bekanntmachung.pdf",
        proxyUrl: `/api/quelle/${encodedKey}?fileId=${fId}`,
        directUrl: listing.documentUrl,
      });
    }
    return base;
  }

  const showUrl = `https://www.zvg-portal.de/index.php?button=showZvg&zvg_id=${zvgId}&land_abk=${landAbk}`;
  try {
    const res = await fetch(showUrl, {
      headers: {
        Referer: ZVG_PORTAL_REFERER,
        "User-Agent": USER_AGENT,
      },
      signal: AbortSignal.timeout(6500),
    });
    if (!res.ok) return base;
    const html = await res.text();
    if (html.trim() === "error" || (!html.includes("id=anzeige") && !html.includes("Objekt/Lage") && !html.includes("zvg_table"))) {
      return base;
    }

    const extractRow = (labelPattern: string, keepNewlines = false): string | null => {
      const re = new RegExp(
        `<td[^>]*>\\s*(?:<nobr>)?\\s*${labelPattern}\\s*:?\\s*(?:<\\/nobr>)?\\s*<\\/td>\\s*<td[^>]*>([\\s\\S]*?)<\\/td>`,
        "i",
      );
      const m = re.exec(html);
      const val = cleanHtmlText(m?.[1], keepNewlines);
      return val && val !== ":" ? val : null;
    };

    const objLage = extractRow("Objekt\\/Lage", false);
    const rawDesc = extractRow("Beschreibung", true);
    const cleanDesc =
      rawDesc && !/^s\.\s*amtliche\s*Bekanntmachung$/i.test(rawDesc.trim()) ? rawDesc : objLage;

    base.proceedingKind = extractRow("Art der Versteigerung") ?? base.proceedingKind;
    base.grundbuch = extractRow("Grundbuch") ?? base.grundbuch;
    base.description = cleanDesc ?? base.description;
    base.hearingPlace = extractRow("Ort der Versteigerung") ?? base.hearingPlace;
    base.creditor =
      extractRow("Informationen zum Gl(?:ä|&auml;)ubiger") ??
      extractRow("Gl(?:ä|&auml;)ubiger") ??
      base.creditor;

    const courtHref = /href=['"]([^'"]+)['"][^>]*>\s*(?:Internetseite des Gerichtes|Informationen zum zust)/i.exec(html)?.[1];
    if (courtHref) {
      const rawCourtUrl = cleanHtmlText(courtHref, false);
      try {
        base.courtUrl = new URL(rawCourtUrl, "https://www.zvg-portal.de/index.php").toString();
      } catch {
        base.courtUrl = rawCourtUrl;
      }
    }

    const geoHref = /<td[^>]*>\s*GeoServer:\s*<\/td>\s*<td[^>]*>\s*<a[^>]*href=['"]([^'"]+)['"]/i.exec(html)?.[1];
    if (geoHref) base.geoServerUrl = cleanHtmlText(geoHref, false);

    const combinedText = [listing.title, objLage, rawDesc, base.grundbuch].filter(Boolean).join(" \n ");
    base.livingAreaM2 = extractLivingArea(combinedText) ?? base.livingAreaM2;
    base.usableAreaM2 = extractUsableArea(combinedText) ?? base.usableAreaM2;
    base.landAreaM2 = extractLandArea(combinedText) ?? base.landAreaM2;
    base.rooms = extractRooms(combinedText) ?? base.rooms;
    base.yearBuilt = extractYearBuilt(combinedText) ?? base.yearBuilt;

    const anhangIdx = html.indexOf("Anhaenge");
    const anhangHtml = anhangIdx !== -1 ? html.slice(anhangIdx) : html;
    const rowChunks = anhangHtml.split(/<tr[^>]*>/i).slice(1);
    const seenIds = new Set<string>();

    for (const chunk of rowChunks) {
      const m =
        /<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*>[\s\S]*?href="\?(button=showAnhang[^"]*?file_id=(\d+)[^"]*)"[^>]*>([\s\S]*?)<\/a>/i.exec(
          chunk,
        );
      if (!m) continue;
      const rawLabel = cleanHtmlText(m[1], false).replace(/:$/, "").trim();
      const queryPart = m[2].replace(/&amp;/g, "&").trim();
      const fileId = m[3];
      const fileName = cleanHtmlText(m[4], false) || `${rawLabel || "Dokument"}.pdf`;
      if (seenIds.has(fileId)) continue;
      seenIds.add(fileId);

      const kind = classifyAttachment(rawLabel, fileName);
      const prettyLabel =
        kind === "report"
          ? "Verkehrswertgutachten"
          : kind === "photos"
            ? "Objektfotos (Gericht)"
            : kind === "expose"
              ? "Kurzexposé"
              : kind === "notes"
                ? "Merkblatt / Bieterhinweise"
                : rawLabel || "Amtliche Bekanntmachung";

      base.attachments.push({
        id: fileId,
        kind,
        label: prettyLabel,
        fileName,
        proxyUrl: `/api/quelle/${encodedKey}?fileId=${fileId}`,
        directUrl: `https://www.zvg-portal.de/index.php?${queryPart}`,
      });
    }

    if (base.galleryUrls.length === 0 && base.attachments.length > 0) {
      const extracted = await extractAndCachePortalPhotos(listing, base.attachments, showUrl);
      base.galleryUrls.push(...extracted);
    }
  } catch {
    // Fallback to snapshot fields on network timeout
  }

  if (base.attachments.length === 0 && listing.documentUrl) {
    const fMatch = /file_id=(\d+)/.exec(listing.documentUrl);
    const fId = fMatch?.[1] ?? "1";
    base.attachments.push({
      id: fId,
      kind: "announcement",
      label: "Amtliche Bekanntmachung",
      fileName: "Amtliche_Bekanntmachung.pdf",
      proxyUrl: `/api/quelle/${encodedKey}?fileId=${fId}`,
      directUrl: listing.documentUrl,
    });
  }

  return base;
}

async function fetchZvgComDetails(listing: Listing): Promise<OfficialPortalDetails> {
  const encodedKey = encodeURIComponent(listing.key);
  const idMatch =
    /^zvgcom-(\d+)$/.exec(listing.key) ??
    /\/objekt\/(\d+)\//.exec(listing.officialUrl ?? "") ??
    (listing.zvgComId ? [listing.zvgComId, listing.zvgComId] : null);
  const zvgComId = idMatch?.[1] ?? null;

  const base: OfficialPortalDetails = {
    sourcePortal: "zvg.com",
    portalEntryUrl: listing.officialUrl || "https://www.zvg.com/",
    proceedingKind: listing.proceedingKind ?? "Zwangsversteigerung",
    grundbuch: listing.grundbuch ?? null,
    description: listing.description ?? null,
    hearingPlace: listing.hearingPlace ?? null,
    creditor: listing.creditor ?? null,
    courtUrl: listing.courtUrl ?? null,
    geoServerUrl: listing.geoServerUrl ?? null,
    livingAreaM2: listing.livingAreaM2 ?? extractLivingArea(listing.title),
    usableAreaM2: listing.usableAreaM2 ?? extractUsableArea(listing.title),
    landAreaM2: listing.landAreaM2 ?? extractLandArea(listing.title),
    rooms: listing.rooms ?? extractRooms(listing.title),
    yearBuilt: listing.yearBuilt ?? extractYearBuilt(listing.title),
    attachments: [],
    galleryUrls: listing.imageUrl ? [listing.imageUrl] : [],
    tkgmParcelUrl: null,
  };

  if (!zvgComId) return base;

  const headers = {
    Referer: ZVG_COM_REFERER,
    "User-Agent": USER_AGENT,
    Accept: "application/json, text/html, */*",
  };

  try {
    const [textHtml, jsonMeta, pdfRes, galleryPics] = await Promise.all([
      fetch(`https://www.zvg.com/v2024/termine.prg?act=getText&id=${zvgComId}`, {
        headers,
        signal: AbortSignal.timeout(5000),
      })
        .then((r) => (r.ok ? r.text() : ""))
        .catch(() => ""),
      fetch(`https://www.zvg.com/v2024/termine.prg?act=getJSON&id=${zvgComId}`, {
        headers,
        signal: AbortSignal.timeout(5000),
      })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
      fetch(`https://www.zvg.com/v2024/termine.prg?act=getPDF&id=${zvgComId}`, {
        headers,
        signal: AbortSignal.timeout(5000),
      })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
      fetchZvgComGalleryUrls(zvgComId),
    ]);

    const fullText = cleanHtmlText(textHtml, true);
    if (fullText) {
      if (/Aufhebung der Gemeinschaft|Teilungsversteigerung/i.test(fullText)) {
        base.proceedingKind = "Zwangsversteigerung zur Aufhebung der Gemeinschaft (Teilungsversteigerung)";
      } else if (/Insolvenz/i.test(fullText)) {
        base.proceedingKind = "Zwangsversteigerung auf Antrag des Insolvenzverwalters";
      }

      const gbMatch = /Grundbucheintragung:\s*([\s\S]*?)(?:Objektbeschreibung\/Lage|Verkehrswert:|Hinweis:|$)/i.exec(fullText);
      if (gbMatch) {
        base.grundbuch = gbMatch[1].replace(/\s+/g, " ").trim().slice(0, 320);
      }

      const descMatch = /Objektbeschreibung\/Lage[^:\n]*:\s*([\s\S]*?)(?:Verkehrswert:|Hinweis:|Ansprechpartner|$)/i.exec(fullText);
      if (descMatch) {
        base.description = descMatch[1].trim();
      } else {
        base.description = fullText.split(/Hinweis:|Bietsicherheit kann/i)[0].trim() || base.description;
      }

      const credMatch = /Ansprechpartner[^:\n]*:\s*([\s\S]*?)$/i.exec(fullText);
      if (credMatch) {
        base.creditor = credMatch[1].replace(/\s+/g, " ").trim();
      }
    }

    if (jsonMeta && typeof jsonMeta === "object") {
      const m = jsonMeta as Record<string, string | undefined>;
      const ort = cleanHtmlText(m.Versteigerungsort || m.V_ort || "", false);
      const saal = cleanHtmlText(m.Saal || m.V_Saal || "", false);
      const hp = [ort, saal ? (saal.toLowerCase().includes("saal") ? saal : `Saal ${saal}`) : null].filter(Boolean).join(", ");
      if (hp) base.hearingPlace = hp;
    }

    const combinedText = [listing.title, fullText].filter(Boolean).join(" \n ");
    base.livingAreaM2 = extractLivingArea(combinedText) ?? base.livingAreaM2;
    base.usableAreaM2 = extractUsableArea(combinedText) ?? base.usableAreaM2;
    base.landAreaM2 = extractLandArea(combinedText) ?? base.landAreaM2;
    base.rooms = extractRooms(combinedText) ?? base.rooms;
    base.yearBuilt = extractYearBuilt(combinedText) ?? base.yearBuilt;

    const toAbs = (p: unknown): string | null => {
      if (!p || typeof p !== "string") return null;
      if (/^https?:\/\//i.test(p)) return p;
      return p.startsWith("/") ? `https://www.zvg.com${p}` : null;
    };

    const pdfUrl = toAbs(pdfRes?.pdf) ?? listing.documentUrl;
    const exposeUrl = toAbs(pdfRes?.expose) ?? listing.exposeUrl ?? null;
    const notesUrl = toAbs(pdfRes?.hinweis) ?? listing.biddingNotesUrl ?? null;

    if (pdfUrl) {
      base.attachments.push({
        id: "announcement",
        kind: "announcement",
        label: "Amtliche Bekanntmachung",
        fileName: "Bekanntmachung.pdf",
        proxyUrl: `/api/quelle/${encodedKey}?doc=announcement`,
        directUrl: pdfUrl,
      });
    }
    if (exposeUrl && exposeUrl !== pdfUrl) {
      base.attachments.push({
        id: "expose",
        kind: "expose",
        label: "Objekt-Exposé / Gutachtenauszug",
        fileName: "Expose.pdf",
        proxyUrl: `/api/quelle/${encodedKey}?doc=expose`,
        directUrl: exposeUrl,
      });
    }
    if (notesUrl) {
      base.attachments.push({
        id: "notes",
        kind: "notes",
        label: "Bieterhinweise des Amtsgerichts",
        fileName: "Bieterhinweise.pdf",
        proxyUrl: `/api/quelle/${encodedKey}?doc=notes`,
        directUrl: notesUrl,
      });
    }

    for (const picUrl of galleryPics) {
      if (!base.galleryUrls.includes(picUrl)) base.galleryUrls.push(picUrl);
    }
  } catch {
    // Fallback to snapshot fields
  }

  return base;
}

async function fetchTrDetails(listing: Listing): Promise<OfficialPortalDetails> {
  const tr = listing.tr;
  const sourcePortal = tr?.source ?? "ilan.gov.tr";
  const galleryUrls: string[] = listing.imageUrl ? [listing.imageUrl] : [];

  if (sourcePortal.includes("intengo.com") && listing.officialUrl) {
    try {
      const html = await fetch(listing.officialUrl, {
        headers: { "User-Agent": USER_AGENT },
        signal: AbortSignal.timeout(4500),
      }).then((r) => r.text());
      for (const m of html.matchAll(/https:\/\/refiles\.intengo\.com\/images\/real-estate\/[^"'\s>]+/g)) {
        if (!galleryUrls.includes(m[0])) galleryUrls.push(m[0]);
      }
    } catch {
      // Ignore network timeout
    }
  }

  const descParts = [
    tr?.excerpt ?? listing.description,
    tr?.nitelik ? `Nitelik: ${tr.nitelik}` : null,
    tr?.zoning ? `İmar Durumu: ${tr.zoning}` : null,
    tr?.arsaPayi ? `Arsa Payı: ${tr.arsaPayi}` : null,
    tr?.unitNo ? `Bağımsız Bölüm No: ${tr.unitNo}` : null,
    tr?.ownershipShare ? `Hisse: ${tr.ownershipShare}` : null,
  ].filter(Boolean);

  return {
    sourcePortal,
    portalEntryUrl: listing.officialUrl || "https://www.ilan.gov.tr/",
    proceedingKind: tr?.adType ?? "İCRA",
    grundbuch:
      tr?.ada && tr?.parsel
        ? `Ada ${tr.ada} / Parsel ${tr.parsel}${tr.mahalle ? ` (${tr.mahalle})` : ""}${tr.unitNo ? ` · BB No: ${tr.unitNo}` : ""}`
        : tr?.mahalle ?? null,
    description: descParts.join("\n") || null,
    hearingPlace: "esatis.uyap.gov.tr (Elektronik Satış Portalı)",
    creditor: null,
    courtUrl: "https://esatis.uyap.gov.tr/",
    geoServerUrl: "https://parselsorgu.tkgm.gov.tr/",
    livingAreaM2: tr?.buildingAreaM2 ?? (tr?.isCondo ? tr.areaM2 : null),
    landAreaM2: tr?.landAreaM2 ?? (!tr?.isCondo ? tr?.areaM2 ?? null : null),
    netAreaM2: tr?.netAreaM2 ?? null,
    rooms: tr?.rooms ?? listing.rooms ?? null,
    yearBuilt: tr?.yearBuilt ?? listing.yearBuilt ?? null,
    floor: tr?.floor ?? null,
    unitNo: tr?.unitNo ?? null,
    arsaPayi: tr?.arsaPayi ?? null,
    zoning: tr?.zoning ?? null,
    ownershipShare: tr?.ownershipShare ?? null,
    attachments: [],
    galleryUrls,
    tkgmParcelUrl: "https://parselsorgu.tkgm.gov.tr/",
  };
}

function resolveCourtUrl(rawCourtUrl: string | null | undefined): string | null {
  if (!rawCourtUrl) return null;
  try {
    return new URL(rawCourtUrl, "https://www.zvg-portal.de/index.php").toString();
  } catch {
    return rawCourtUrl;
  }
}

function mergeListingFallback(details: OfficialPortalDetails, listing: Listing): OfficialPortalDetails {
  const tr = listing.tr;
  const sourcePortal =
    details.sourcePortal ||
    (listing.market === "TR"
      ? tr?.source ?? "ilan.gov.tr"
      : listing.key.startsWith("zvgcom-")
        ? "zvg.com"
        : "zvg-portal.de");
  const rawCourtUrl = details.courtUrl ?? listing.courtUrl ?? null;
  return {
    ...details,
    sourcePortal,
    portalEntryUrl:
      details.portalEntryUrl ||
      (listing.market === "DE" && !listing.key.startsWith("zvgcom-")
        ? `/api/quelle/${encodeURIComponent(listing.key)}?mode=portal`
        : listing.officialUrl),
    proceedingKind: details.proceedingKind ?? listing.proceedingKind ?? null,
    grundbuch: details.grundbuch ?? listing.grundbuch ?? null,
    description: details.description ?? listing.description ?? null,
    hearingPlace: details.hearingPlace ?? listing.hearingPlace ?? null,
    creditor: details.creditor ?? listing.creditor ?? null,
    courtUrl: resolveCourtUrl(rawCourtUrl),
    geoServerUrl: details.geoServerUrl ?? listing.geoServerUrl ?? null,
    livingAreaM2: details.livingAreaM2 ?? listing.livingAreaM2 ?? tr?.buildingAreaM2 ?? null,
    usableAreaM2: details.usableAreaM2 ?? listing.usableAreaM2 ?? null,
    landAreaM2: details.landAreaM2 ?? listing.landAreaM2 ?? tr?.landAreaM2 ?? null,
    netAreaM2: details.netAreaM2 ?? tr?.netAreaM2 ?? null,
    rooms: details.rooms ?? listing.rooms ?? tr?.rooms ?? null,
    yearBuilt: details.yearBuilt ?? listing.yearBuilt ?? tr?.yearBuilt ?? null,
    floor: details.floor ?? tr?.floor ?? null,
    unitNo: details.unitNo ?? tr?.unitNo ?? null,
    arsaPayi: details.arsaPayi ?? tr?.arsaPayi ?? null,
    zoning: details.zoning ?? tr?.zoning ?? null,
    ownershipShare: details.ownershipShare ?? tr?.ownershipShare ?? null,
    attachments: Array.isArray(details.attachments)
      ? details.attachments.map((att) => ({
          ...att,
          proxyUrl: att.proxyUrl ? att.proxyUrl.replace(/\?doc=pdf\b/, "?doc=announcement") : att.proxyUrl,
        }))
      : [],
    galleryUrls:
      Array.isArray(details.galleryUrls) && details.galleryUrls.length > 0
        ? details.galleryUrls
        : listing.imageUrl
          ? [listing.imageUrl]
          : [],
    tkgmParcelUrl: details.tkgmParcelUrl ?? (listing.market === "TR" ? "https://parselsorgu.tkgm.gov.tr/" : null),
  };
}

export class OfficialPortalService {
  static async getDetails(listing: Listing): Promise<OfficialPortalDetails> {
    const cached = await readCache(listing.key);
    const isCacheComplete =
      cached !== null &&
      (Boolean(cached.description) ||
        Boolean(cached.grundbuch) ||
        Boolean(cached.livingAreaM2) ||
        Boolean(cached.landAreaM2) ||
        listing.market === "TR");
    if (cached && isCacheComplete) {
      return mergeListingFallback(cached, listing);
    }

    let details: OfficialPortalDetails;
    if (listing.market === "TR") {
      details = await fetchTrDetails(listing);
    } else if (listing.key.startsWith("zvgcom-") || listing.officialUrl?.includes("zvg.com")) {
      details = await fetchZvgComDetails(listing);
    } else {
      details = await fetchZvgPortalDetails(listing);
    }

    details = mergeListingFallback(details, listing);

    if (
      details.attachments.length > 0 ||
      details.galleryUrls.length > 0 ||
      details.description ||
      details.grundbuch ||
      details.livingAreaM2 ||
      details.landAreaM2 ||
      listing.market === "TR"
    ) {
      await writeCache(listing.key, details);
    }
    return details;
  }

  static async fetchPhotoBuffer(listing: Listing, index: number): Promise<Buffer | null> {
    const safeKey = safeCacheName(listing.key);
    const cachedFile = join(PHOTO_CACHE_DIR, `${safeKey}-${index}.jpg`);
    try {
      return await readFile(cachedFile);
    } catch {
      // Populate details & photo cache on miss
      await this.getDetails(listing);
      try {
        return await readFile(cachedFile);
      } catch {
        return null;
      }
    }
  }

  static async fetchDocumentBuffer(
    listing: Listing,
    opts: { fileId?: string | null; doc?: string | null },
  ): Promise<{ buffer: Buffer; fileName: string; contentType: string } | null> {
    const details = await this.getDetails(listing);

    let target: OfficialAttachment | undefined;
    if (opts.fileId) {
      target = details.attachments.find((a) => a.id === opts.fileId);
    } else if (opts.doc) {
      const docAlias = opts.doc === "pdf" ? "announcement" : opts.doc;
      target = details.attachments.find(
        (a) =>
          a.kind === opts.doc ||
          a.id === opts.doc ||
          a.kind === docAlias ||
          a.id === docAlias ||
          (docAlias === "announcement" && a.id === "bekanntmachung"),
      );
    }
    if (!target) {
      target =
        details.attachments.find((a) => a.kind === "report") ??
        details.attachments.find((a) => a.kind === "expose") ??
        details.attachments[0];
    }

    const directUrl = target?.directUrl ?? listing.documentUrl ?? listing.exposeUrl ?? null;
    if (!directUrl) return null;

    const isZvgPortal = directUrl.includes("zvg-portal.de");
    const zvgIdMatch = /zvg_id=(\d+)/.exec(listing.officialUrl ?? "") ?? /^zvgportal-(\d+)$/.exec(listing.key);
    const landMatch = /land_abk=([a-z]{2})/i.exec(listing.officialUrl ?? "");
    const showZvgReferer = zvgIdMatch
      ? `https://www.zvg-portal.de/index.php?button=showZvg&zvg_id=${zvgIdMatch[1]}&land_abk=${landMatch?.[1] ?? listing.regionCode ?? "nw"}`
      : ZVG_PORTAL_REFERER;

    const res = await fetch(directUrl, {
      headers: {
        Referer: isZvgPortal ? showZvgReferer : ZVG_COM_REFERER,
        "User-Agent": USER_AGENT,
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (buffer.length < 64) return null;

    return {
      buffer,
      fileName: target?.fileName ?? `${listing.key}.pdf`,
      contentType: res.headers.get("content-type") ?? "application/pdf",
    };
  }

  static buildPortalBridgeHtml(listing: Listing): string {
    const landAbk =
      /land_abk=([a-z]{2})/i.exec(listing.officialUrl ?? "")?.[1] ?? listing.regionCode ?? "nw";
    const plz = listing.postcode ?? "";
    const ort = listing.place ?? "";

    const azMatch = /(\d+)\s*(K)\s*(\d+)\s*\/\s*(\d{2,4})/i.exec(listing.fileNo ?? "");
    const az1 = azMatch ? azMatch[1].replace(/^0+/, "") : "";
    const az2 = azMatch ? "K" : "";
    const az3 = azMatch ? azMatch[3].replace(/^0+/, "") : "";
    const az4 = azMatch ? (azMatch[4].length === 2 ? `20${azMatch[4]}` : azMatch[4]) : "";

    const esc = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="referrer" content="origin-when-cross-origin" />
  <title>Verbinde mit Justizportal (${esc(listing.authority)} · ${esc(listing.fileNo)}) …</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #faf8f4; color: #1c1b18; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .box { max-width: 440px; padding: 28px 32px; border: 1px solid #d8d3c8; background: #fff; }
    .kicker { font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; color: #6e6a61; margin-bottom: 8px; }
    h1 { font-size: 18px; font-weight: 600; margin: 0 0 10px; }
    p { font-size: 13px; line-height: 1.5; color: #524f48; margin: 0 0 18px; }
    button { background: #1c1b18; color: #faf8f4; border: 0; padding: 10px 16px; font-size: 13px; cursor: pointer; }
  </style>
</head>
<body>
  <div class="box">
    <div class="kicker">Amtliches Justizportal · zvg-portal.de</div>
    <h1>${esc(listing.authority)} · Az. ${esc(listing.fileNo)}</h1>
    <p>Die amtliche Detailansicht wird über die bundesweite Suche von zvg-portal.de geöffnet …</p>
    <form id="zvgForm" method="POST" action="https://www.zvg-portal.de/index.php?button=Suchen">
      <input type="hidden" name="order_by" value="2" />
      <input type="hidden" name="land_abk" value="${esc(landAbk)}" />
      <input type="hidden" name="ger_id" value="0" />
      <input type="hidden" name="ger_name" value="-- Alle Amtsgerichte --" />
      <input type="hidden" name="az1" value="${esc(az1)}" />
      <input type="hidden" name="az2" value="${esc(az2)}" />
      <input type="hidden" name="az3" value="${esc(az3)}" />
      <input type="hidden" name="az4" value="${esc(az4)}" />
      <input type="hidden" name="art" value="" />
      <input type="hidden" name="obj" value="" />
      <input type="hidden" name="str" value="" />
      <input type="hidden" name="hnr" value="" />
      <input type="hidden" name="plz" value="${esc(az1 ? "" : plz)}" />
      <input type="hidden" name="ort" value="${esc(az1 ? "" : ort)}" />
      <input type="hidden" name="ortsteil" value="" />
      <input type="hidden" name="vtermin" value="" />
      <input type="hidden" name="btermin" value="" />
      <noscript><button type="submit">Amtlichen Eintrag öffnen →</button></noscript>
    </form>
  </div>
  <script>document.getElementById("zvgForm").submit();</script>
</body>
</html>`;
  }
}
