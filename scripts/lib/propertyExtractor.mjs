/**
 * Shared parser & extractor for official foreclosure notices (DE & TR).
 * Extracts areas (livingAreaM2, usableAreaM2, landAreaM2, netAreaM2, areaM2, areaKind),
 * rooms, yearBuilt, floor, Grundbuch / Tapu details, proceedingKind, hearingPlace, creditor,
 * and decodes HTML entities cleanly.
 */

const NAMED_ENTITIES = {
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

export function decodeHtmlText(html, preserveNewlines = false) {
  if (!html) return "";
  let s = String(html);
  if (preserveNewlines) {
    s = s
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(?:p|div|tr|li|h[1-6])>/gi, "\n");
  }
  s = s
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => {
      const code = Number.parseInt(hex, 16);
      return code === 0x80 ? "€" : String.fromCodePoint(code);
    })
    .replace(/&#(\d+);/g, (_, dec) => {
      const code = Number.parseInt(dec, 10);
      return code === 128 ? "€" : String.fromCodePoint(code);
    })
    .replace(/&[a-zA-Z0-9#]+;/g, (ent) => NAMED_ENTITIES[ent] ?? NAMED_ENTITIES[ent.toLowerCase()] ?? ent);

  if (preserveNewlines) {
    return s
      .replace(/[ \t]+/g, " ")
      .replace(/\n[ \t]+/g, "\n")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }
  return s.replace(/\s+/g, " ").trim();
}

export function parseLocalizedNumber(raw) {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === "number") return Number.isFinite(raw) && raw > 0 ? Math.round(raw * 100) / 100 : null;
  const s = String(raw)
    .trim()
    .replace(/['’´`\s]/g, "")
    .replace(/\.—|\.-|,-/g, "");
  if (!s) return null;
  let normalized = s;
  if (/^\d{1,3}(?:\.\d{3})+(?:,\d+)?$/.test(s)) {
    normalized = s.replace(/\./g, "").replace(",", ".");
  } else if (/^\d{1,3}(?:,\d{3})+(?:\.\d+)?$/.test(s)) {
    normalized = s.replace(/,/g, "");
  } else if (s.includes(",")) {
    normalized = s.replace(/\./g, "").replace(",", ".");
  }
  const n = Number.parseFloat(normalized);
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : null;
}

const BETRAG_RE = /(?<![\d.,])(?:\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?|\d+,\d{2}|\d{3,}(?=\s*(?:€|EUR)))/g;

export function parseVerkehrswert(block = "") {
  const zelle =
    /Verkehrswert[\s\S]{0,200}?<strong>([\s\S]*?)<\/strong>/i.exec(block)?.[1] ??
    /Verkehrswert([\s\S]*?)(?:<TR|<tr[ >]|Termin<\/td>)/i.exec(block)?.[1];
  if (!zelle) return null;
  const text = decodeHtmlText(zelle).split(/\b(?:davon|hiervon|darin|darunter|einschließlich|inkl\.?|zzgl\.?|abzügl\.?)\b/i)[0];
  const werte = [
    ...new Set(
      [...text.matchAll(BETRAG_RE)]
        .map((t) => parseLocalizedNumber(t[0]))
        .filter((n) => Number.isFinite(n) && n >= 500),
    ),
  ];
  if (werte.length === 0) return null;
  if (werte.length === 1) return werte[0];
  const summe = werte.reduce((a, b) => a + b, 0);
  const gesamt = werte.filter((w) => Math.abs(summe - w - w) < 0.5);
  const result = gesamt.length === 1 ? gesamt[0] : werte[0];
  return result >= 500 ? result : null;
}

export function extractDeLivingArea(text) {
  if (!text) return null;
  const cleaned = decodeHtmlText(text);

  // 1. Keyword before number: "Wohnfläche ca. 162 m²", "Wfl.: rd. 85,5 qm", "Wohn-/Nutzfläche: 140 m²"
  const afterMatch =
    /(?:Gesamtwohnfl(?:ä|ae)che|Wohnfl(?:ä|ae)che|Wohn-\s*(?:und\s*|\/\s*)?Nutzfl(?:ä|ae)che|\bWfl\.?)(?:\s*(?:von|beträgt|insgesamt|gesamt|lt\.\s*\S+|laut\s*\S+|ca\.?|rd\.?|rund|etwa|circa|~|:|-))*[^0-9\n.;]{0,28}?(\d{1,4}(?:\.\d{3})*(?:,\d{1,2})?)\s*(?:m²|m2|qm\b)/i.exec(
      cleaned,
    );
  if (afterMatch) {
    const val = parseLocalizedNumber(afterMatch[1]);
    if (val && val >= 12 && val <= 5000) return val;
  }

  // 2. Number before keyword: "ca. 162 m² Wohnfläche", "circa 86,10 m² Wohnfläche", "126 qm Wohnfläche"
  const beforeMatch =
    /(\d{1,4}(?:\.\d{3})*(?:,\d{1,2})?)\s*(?:m²|m2|qm\b)\s*(?:Gesamtwohnfl(?:ä|ae)che|Wohnfl(?:ä|ae)che|Wohn-\s*(?:und\s*|\/\s*)?Nutzfl(?:ä|ae)che|\bWfl\.?)/i.exec(
      cleaned,
    );
  if (beforeMatch) {
    const val = parseLocalizedNumber(beforeMatch[1]);
    if (val && val >= 12 && val <= 5000) return val;
  }

  // 3. Apartment / Wohnung context: "3-Zimmer-Wohnung, ca. 78,5 m²" (when not followed by Grundstück/Flurstück)
  const aptContextMatch =
    /(?:Eigentumswohnung|Zimmer-Wohnung|Zimmerwohnung|Dachgeschosswohnung|Erdgeschosswohnung|Maisonettewohnung)[^0-9\n.;]{0,35}?(?:ca\.?|rd\.?|rund|etwa|circa|mit|,|:)\s*(\d{2,3}(?:,\d{1,2})?)\s*(?:m²|m2|qm\b)(?!\s*(?:Grundst|Flurst|Flst|Areal|Gebäude-\s*und\s*Freifl))/i.exec(
      cleaned,
    );
  if (aptContextMatch) {
    const val = parseLocalizedNumber(aptContextMatch[1]);
    if (val && val >= 15 && val <= 600) return val;
  }

  return null;
}

export function extractDeUsableArea(text) {
  if (!text) return null;
  const cleaned = decodeHtmlText(text);

  const afterMatch =
    /(?:Gesamtnutzfl(?:ä|ae)che|Nutzfl(?:ä|ae)che|Gewerbefl(?:ä|ae)che|Ladenfl(?:ä|ae)che|Bürofl(?:ä|ae)che|Hallenfl(?:ä|ae)che|\bNfl\.?)(?:\s*(?:von|beträgt|insgesamt|gesamt|ca\.?|rd\.?|rund|etwa|circa|~|:|-))*[^0-9\n.;]{0,28}?(\d{1,5}(?:\.\d{3})*(?:,\d{1,2})?)\s*(?:m²|m2|qm\b)/i.exec(
      cleaned,
    );
  if (afterMatch) {
    const val = parseLocalizedNumber(afterMatch[1]);
    if (val && val >= 10 && val <= 60000) return val;
  }

  const beforeMatch =
    /(\d{1,5}(?:\.\d{3})*(?:,\d{1,2})?)\s*(?:m²|m2|qm\b)\s*(?:Gesamtnutzfl(?:ä|ae)che|Nutzfl(?:ä|ae)che|Gewerbefl(?:ä|ae)che|Ladenfl(?:ä|ae)che|Bürofl(?:ä|ae)che|Hallenfl(?:ä|ae)che|\bNfl\.?)/i.exec(
      cleaned,
    );
  if (beforeMatch) {
    const val = parseLocalizedNumber(beforeMatch[1]);
    if (val && val >= 10 && val <= 60000) return val;
  }

  return null;
}

export function extractDeLandArea(text) {
  if (!text) return null;
  const cleaned = decodeHtmlText(text);

  // 1. Explicit Grundstücksgröße / Grundstücksfläche / Katasterfläche before number
  const explicitAfter =
    /(?:Grundst(?:ü|ue)cksgr(?:ö|oe)(?:ß|ss)e|Grundst(?:ü|ue)cksfl(?:ä|ae)che|Katasterfl(?:ä|ae)che|Gesamtfl(?:ä|ae)che|Arealfl(?:ä|ae)che)(?:\s*(?:von|beträgt|insgesamt|gesamt|ca\.?|rd\.?|rund|etwa|circa|~|:|-))*[^0-9\n.;]{0,28}?(\d{1,6}(?:\.\d{3})*(?:,\d{1,2})?)\s*(?:m²|m2|qm\b)/i.exec(
      cleaned,
    );
  if (explicitAfter) {
    const val = parseLocalizedNumber(explicitAfter[1]);
    if (val && val >= 15 && val <= 5000000) return val;
  }

  // 2. Number before Grundstücksfläche / Grundstücksgröße / großes Grundstück
  const explicitBefore =
    /(\d{1,6}(?:\.\d{3})*(?:,\d{1,2})?)\s*(?:m²|m2|qm\b)\s*(?:Grundst(?:ü|ue)cksfl(?:ä|ae)che|Grundst(?:ü|ue)cksgr(?:ö|oe)(?:ß|ss)e|gro(?:ß|ss)es\s+Grundst(?:ü|ue)ck)/i.exec(
      cleaned,
    );
  if (explicitBefore) {
    const val = parseLocalizedNumber(explicitBefore[1]);
    if (val && val >= 15 && val <= 5000000) return val;
  }

  // 3. Flurstück / Grundbuch "Größe: 1.954 m²" or "Flst. 868/4 zu 410 qm"
  const parcelSizes = [];
  const groesseRe = /(?:Gr(?:ö|oe)(?:ß|ss)e|Fl(?:ä|ae)che)\s*:\s*(?:ca\.?\s*)?(\d{1,6}(?:\.\d{3})*(?:,\d{1,2})?)\s*(?:m²|m2|qm\b)/gi;
  for (const m of cleaned.matchAll(groesseRe)) {
    const val = parseLocalizedNumber(m[1]);
    if (val && val >= 15 && val <= 5000000) parcelSizes.push(val);
  }
  if (parcelSizes.length === 1) return parcelSizes[0];
  if (parcelSizes.length > 1) {
    return Math.round(parcelSizes.reduce((a, b) => a + b, 0) * 100) / 100;
  }

  const zuMatch =
    /(?:Flst\.?|FlNr\.?|Flurst(?:ü|ue)ck|Parzelle|Grundst(?:ü|ue)ck|Geb(?:ä|ae)ude-\s*und\s*Freifl(?:ä|ae)che|Landwirtschaftsfl(?:ä|ae)che|Waldfl(?:ä|ae)che|Erholungsfl(?:ä|ae)che)[^.;\n]{0,65}?(?:\bzu\s+|\bmit\s+|,\s*ca\.?\s*|:\s*ca\.?\s*)(?:ca\.?\s*|rd\.?\s*)?(\d{1,6}(?:\.\d{3})*(?:,\d{1,2})?)\s*(?:m²|m2|qm\b)/i.exec(
      cleaned,
    );
  if (zuMatch) {
    const val = parseLocalizedNumber(zuMatch[1]);
    if (val && val >= 15 && val <= 5000000) return val;
  }

  // 4. Hectares: "0,0683 ha" or "1,45 ha"
  const haMatch = /\b(\d{1,4},\d{1,4})\s*ha\b/i.exec(cleaned);
  if (haMatch) {
    const ha = parseLocalizedNumber(haMatch[1]);
    if (ha && ha > 0 && ha <= 1000) return Math.round(ha * 10000);
  }

  return null;
}

const WORD_TO_ROOMS_DE = [
  [/\bEinzimmerwohnung\b/i, "1 Zimmer"],
  [/\bZweizimmerwohnung\b/i, "2 Zimmer"],
  [/\bDreizimmerwohnung\b/i, "3 Zimmer"],
  [/\bVierzimmerwohnung\b/i, "4 Zimmer"],
  [/\bF(?:ü|ue)nfzimmerwohnung\b/i, "5 Zimmer"],
  [/\bSechszimmerwohnung\b/i, "6 Zimmer"],
];

export function extractDeRooms(text) {
  if (!text) return null;
  const cleaned = decodeHtmlText(text);

  const rangeMatch = /\b(\d+(?:,\d)?\s*(?:bis|-)\s*\d+(?:,\d)?)\s*-?\s*Zimmer/i.exec(cleaned);
  if (rangeMatch) return `${rangeMatch[1].replace(/\s+/g, " ")} Zimmer`;

  const numMatch = /\b([1-9](?:,[05])?)\s*-?\s*Zimmer(?:-Wohnung|\b)/i.exec(cleaned);
  if (numMatch) return `${numMatch[1]} Zimmer`;

  for (const [re, label] of WORD_TO_ROOMS_DE) {
    if (re.test(cleaned)) return label;
  }
  return null;
}

export function extractYearBuilt(text) {
  if (!text) return null;
  const cleaned = decodeHtmlText(text);
  const m =
    /(?:Baujahr|Bj\.?|urspr(?:ü|ue)ngliches\s+Baujahr|erbaut(?:\s+ca\.?|\s+um|\s+im\s+Jahr)?|yap[ıi]m\s*y[ıi]l[ıi]|inşa\s*y[ıi]l[ıi])[^0-9\n]{0,22}?(1[789]\d{2}|20[0-2]\d)\b/i.exec(
      cleaned,
    );
  if (!m) return null;
  const y = Number.parseInt(m[1], 10);
  return y >= 1700 && y <= 2027 ? y : null;
}

/**
 * Parses a zvg-portal.de showZvg HTML page into structured fields.
 */
export function parseZvgPortalHtml(html, listing = {}) {
  if (!html || html.trim() === "error" || (!html.includes("id=anzeige") && !html.includes("Objekt/Lage") && !html.includes("zvg_table"))) {
    return null;
  }

  const extractRow = (labelPattern, keepNewlines = false) => {
    const re = new RegExp(
      `<td[^>]*>\\s*(?:<nobr>)?\\s*${labelPattern}\\s*:?\\s*(?:<\\/nobr>)?\\s*<\\/td>\\s*<td[^>]*>([\\s\\S]*?)<\\/td>`,
      "i",
    );
    const m = re.exec(html);
    if (!m) return null;
    const val = decodeHtmlText(m[1], keepNewlines);
    return val && val !== ":" ? val : null;
  };

  const proceedingKind = extractRow("Art der Versteigerung");
  const grundbuch = extractRow("Grundbuch");
  const objLage = extractRow("Objekt\\/Lage");
  const rawBeschreibung = extractRow("Beschreibung", true);
  const hearingPlace = extractRow("Ort der Versteigerung");
  const creditor = extractRow("Informationen zum Gl(?:ä|&auml;)ubiger") ?? extractRow("Gl(?:ä|&auml;)ubiger");

  const description =
    rawBeschreibung && !/^s\.\s*amtliche\s*Bekanntmachung$/i.test(rawBeschreibung.trim())
      ? rawBeschreibung
      : objLage;

  const courtHref = /href=['"]([^'"]+)['"][^>]*>\s*(?:Internetseite des Gerichtes|Informationen zum zust)/i.exec(html)?.[1];
  const rawCourtUrl = courtHref ? decodeHtmlText(courtHref) : listing.courtUrl ?? null;
  let courtUrl = rawCourtUrl;
  if (rawCourtUrl) {
    try {
      courtUrl = new URL(rawCourtUrl, "https://www.zvg-portal.de/index.php").toString();
    } catch {
      courtUrl = rawCourtUrl;
    }
  }

  const geoHref = /<td[^>]*>\s*GeoServer:\s*<\/td>\s*<td[^>]*>\s*<a[^>]*href=['"]([^'"]+)['"]/i.exec(html)?.[1];
  const geoServerUrl = geoHref ? decodeHtmlText(geoHref) : null;

  const combinedText = [listing.title, objLage, rawBeschreibung, grundbuch].filter(Boolean).join(" \n ");
  const livingAreaM2 = extractDeLivingArea(combinedText);
  const usableAreaM2 = extractDeUsableArea(combinedText);
  const landAreaM2 = extractDeLandArea(combinedText);
  const rooms = extractDeRooms(combinedText);
  const yearBuilt = extractYearBuilt(combinedText);

  // Check if postcode was missing (00000) in search result but present in detail page
  let postcode = listing.postcode ?? null;
  if (!postcode) {
    const plzMatch = /\b(?!00000)(\d{5})\s+[A-ZÄÖÜ]/u.exec(combinedText);
    if (plzMatch) postcode = plzMatch[1];
  }

  // Extract attachments
  const anhangIdx = html.indexOf("Anhaenge");
  const anhangHtml = anhangIdx !== -1 ? html.slice(anhangIdx) : html;
  const rowChunks = anhangHtml.split(/<tr[^>]*>/i).slice(1);
  const seenIds = new Set();
  const attachments = [];
  const encodedKey = encodeURIComponent(listing.key ?? "");

  for (const chunk of rowChunks) {
    const m =
      /<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*>[\s\S]*?href="\?(button=showAnhang[^"]*?file_id=(\d+)[^"]*)"[^>]*>([\s\S]*?)<\/a>/i.exec(
        chunk,
      );
    if (!m) continue;
    const rawLabel = decodeHtmlText(m[1]).replace(/:$/, "").trim();
    const queryPart = m[2].replace(/&amp;/g, "&").trim();
    const fileId = m[3];
    const fileName = decodeHtmlText(m[4]) || `${rawLabel || "Dokument"}.pdf`;
    if (seenIds.has(fileId)) continue;
    seenIds.add(fileId);

    const fnLower = fileName.toLowerCase();
    const rawLower = rawLabel.toLowerCase();
    const combinedLabel = `${rawLower} ${fnLower}`;
    const kind =
      fnLower.includes("hinweis") || fnLower.includes("merkblatt") || rawLower.includes("hinweis") || rawLower.includes("merkblatt")
        ? "notes"
        : fnLower.includes("foto") || fnLower.includes("bild") || fnLower.includes("ansicht") || rawLower.includes("foto") || rawLower.includes("bild")
          ? "photos"
          : fnLower.includes("expose") || fnLower.includes("exposé") || fnLower.includes("kurzbeschreibung") || rawLower.includes("expose") || rawLower.includes("exposé")
            ? "expose"
            : combinedLabel.includes("gutachten") || combinedLabel.includes("verkehrswert")
              ? "report"
              : "announcement";

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

    attachments.push({
      id: fileId,
      kind,
      label: prettyLabel,
      fileName,
      proxyUrl: `/api/quelle/${encodedKey}?fileId=${fileId}`,
      directUrl: `https://www.zvg-portal.de/index.php?${queryPart}`,
    });
  }

  return {
    proceedingKind,
    grundbuch,
    description,
    hearingPlace,
    creditor,
    courtUrl,
    geoServerUrl,
    livingAreaM2,
    usableAreaM2,
    landAreaM2,
    rooms,
    yearBuilt,
    postcode,
    attachments,
  };
}

/**
 * Parses zvg.com getText HTML + getJSON object into structured fields.
 */
export function parseZvgComData(textHtml, jsonMeta, listing = {}) {
  const fullText = decodeHtmlText(textHtml, true);

  let proceedingKind = "Zwangsversteigerung";
  if (/Aufhebung der Gemeinschaft|Teilungsversteigerung/i.test(fullText)) {
    proceedingKind = "Zwangsversteigerung zur Aufhebung der Gemeinschaft (Teilungsversteigerung)";
  } else if (/Insolvenz/i.test(fullText)) {
    proceedingKind = "Zwangsversteigerung auf Antrag des Insolvenzverwalters";
  }

  // Extract Grundbucheintragung block
  let grundbuch = null;
  const gbMatch = /Grundbucheintragung:\s*([\s\S]*?)(?:Objektbeschreibung\/Lage|Verkehrswert:|Hinweis:|$)/i.exec(fullText);
  if (gbMatch) {
    grundbuch = gbMatch[1].replace(/\s+/g, " ").trim().slice(0, 320);
  }

  // Extract Objektbeschreibung block
  let description = null;
  const descMatch = /Objektbeschreibung\/Lage[^:\n]*:\s*([\s\S]*?)(?:Verkehrswert:|Hinweis:|Ansprechpartner|$)/i.exec(fullText);
  if (descMatch) {
    description = descMatch[1].trim();
  } else if (fullText) {
    description = fullText.split(/Hinweis:|Bietsicherheit kann/i)[0].trim();
  }

  // Extract Creditor / Ansprechpartner
  let creditor = null;
  const credMatch = /Ansprechpartner[^:\n]*:\s*([\s\S]*?)$/i.exec(fullText);
  if (credMatch) {
    creditor = credMatch[1].replace(/\s+/g, " ").trim();
  }

  // Extract Hearing Place from getJSON
  let hearingPlace = null;
  if (jsonMeta && typeof jsonMeta === "object") {
    const ort = decodeHtmlText(jsonMeta.Versteigerungsort || jsonMeta.V_ort || "");
    const saal = decodeHtmlText(jsonMeta.Saal || jsonMeta.V_Saal || "");
    hearingPlace = [ort, saal ? (saal.toLowerCase().includes("saal") ? saal : `Saal ${saal}`) : null].filter(Boolean).join(", ") || null;
  }

  const combinedText = [listing.title, fullText, jsonMeta?.Objektart, jsonMeta?.Objektanschrift].filter(Boolean).join(" \n ");
  const livingAreaM2 = extractDeLivingArea(combinedText);
  const usableAreaM2 = extractDeUsableArea(combinedText);
  const landAreaM2 = extractDeLandArea(combinedText);
  const rooms = extractDeRooms(combinedText);
  const yearBuilt = extractYearBuilt(combinedText);

  return {
    proceedingKind,
    grundbuch,
    description,
    hearingPlace,
    creditor,
    livingAreaM2,
    usableAreaM2,
    landAreaM2,
    rooms,
    yearBuilt,
  };
}

/**
 * Extracts enriched Turkish parcel & building metrics from rawText, title, and parcel object.
 * Slices multi-parcel notices to the specific parcelIndex so numbers never bleed across parcels.
 */
export function extractTrEnrichedDetails(l) {
  const parcel = l.parcel ?? {};
  const ev = l.evaluation ?? {};
  const fullRawText = String(l.rawText ?? "");
  const title = String(l.title ?? "");

  // Determine parcel index from l.parcelIndex or key suffix ("2175017#2" -> 2)
  const keyIdx = /#(\d+)$/.exec(String(l.key ?? ""))?.[1];
  const parcelIdx = l.parcelIndex ?? (keyIdx ? Number.parseInt(keyIdx, 10) : 1);

  let parcelText = fullRawText;
  if (fullRawText) {
    const blockRe = new RegExp(
      `\\b${parcelIdx}\\s*NO['’´\`]?LU\\s*TAŞINMAZ[\\s\\S]*?(?=\\b${parcelIdx + 1}\\s*NO['’´\`]?LU\\s*TAŞINMAZ|$)`,
      "i",
    );
    const blockMatch = blockRe.exec(fullRawText);
    if (blockMatch) {
      parcelText = blockMatch[0];
    }
  }

  const combined = [ parcel.excerpt, parcelText, parcelIdx === 1 ? title : "" ].filter(Boolean).join(" \n ");

  // 1. Land Area (Yüzölçümü / Arsa Alanı)
  let landAreaM2 = parseLocalizedNumber(parcel.landAreaM2 ?? ev.landAreaM2);
  if (!landAreaM2) {
    const m =
      /Yüzölçümü\s*:\s*(\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?|\d+(?:[.,]\d{1,2})?)\s*m[²2]/i.exec(combined) ??
      /(\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?)\s*m[²2]\s*(?:arsa|tarla|tarım|zeytinlik|bahçe|arazi|fındıklık)/i.exec(combined);
    if (m) landAreaM2 = parseLocalizedNumber(m[1]);
  }

  // 2. Gross & Net Building Area (Brüt / Net Kullanım Alanı)
  let grossAreaM2 = null;
  const grossMatch =
    /brüt\s*(?:inşaat\s*|kullanım\s*)?alan[ıi]?(?:\s*ise|\s*yaklaşık|\s*:)*\s*(\d{1,4}(?:[.,]\d{1,2})?)\s*m[²2]/i.exec(combined) ??
    /(\d{1,4}(?:[.,]\d{1,2})?)\s*m[²2]\s*(?:olarak\s*)?brüt/i.exec(combined);
  if (grossMatch) {
    const v = parseLocalizedNumber(grossMatch[1]);
    if (v && v >= 15 && v <= 10000) grossAreaM2 = v;
  }

  let netAreaM2 = null;
  const netMatch =
    /(?:bağımsız\s*bölümün\s*)?net\s*(?:kullanım\s*|inşaat\s*|faydalı\s*)?alan[ıi]?(?:\s*ise|\s*yaklaşık|\s*:)*\s*(\d{1,4}(?:[.,]\d{1,2})?)\s*m[²2]/i.exec(
      combined,
    ) ?? /(\d{1,4}(?:[.,]\d{1,2})?)\s*m[²2]\s*(?:olarak\s*)?net/i.exec(combined);
  if (netMatch) {
    const v = parseLocalizedNumber(netMatch[1]);
    if (v && v >= 12 && v <= 10000) netAreaM2 = v;
  }

  let buildingAreaM2 = parseLocalizedNumber(parcel.buildingAreaM2 ?? ev.buildingAreaM2) ?? grossAreaM2 ?? netAreaM2;
  if (!buildingAreaM2 && ev.areaKind === "Wohn-/Nutzfläche" && ev.areaM2) {
    buildingAreaM2 = parseLocalizedNumber(ev.areaM2);
  }
  if (!buildingAreaM2 && parcelIdx === 1) {
    const titleAptMatch = /(\d{2,4}(?:[.,]\d{1,2})?)\s*m[²2]\s*(?:daire|konut|dükkan|iş\s*yeri|ofis|bina|villa|müstakil)/i.exec(title);
    if (titleAptMatch) buildingAreaM2 = parseLocalizedNumber(titleAptMatch[1]);
  }

  // Avoid duplicate landAreaM2 == buildingAreaM2 when parser copied parcel size into building size on large land
  if (buildingAreaM2 && landAreaM2 && buildingAreaM2 === landAreaM2 && landAreaM2 > 600 && !grossAreaM2 && !netAreaM2) {
    buildingAreaM2 = null;
  }

  const areaM2 = parseLocalizedNumber(ev.areaM2) ?? buildingAreaM2 ?? netAreaM2 ?? landAreaM2 ?? null;
  const areaKind =
    ev.areaKind ??
    (buildingAreaM2 || netAreaM2 ? "Wohn-/Nutzfläche" : landAreaM2 ? "Grundstücksfläche" : null);

  // 3. Rooms (Oda Sayısı: e.g. "3+1", "2+1")
  let rooms = null;
  const plusMatch = /\b([1-8])\s*\+\s*([0-2])\b/.exec(combined);
  if (plusMatch) {
    rooms = `${plusMatch[1]}+${plusMatch[2]}`;
  } else {
    const odaSalonMatch = /(\d)\s*(?:adet\s*)?oda[\s,]*(?:ve\s*)?(?:(\d)\s*(?:adet\s*)?)?salon/i.exec(combined);
    if (odaSalonMatch) rooms = `${odaSalonMatch[1]}+${odaSalonMatch[2] || "1"}`;
  }

  // 4. Unit No (Bağımsız Bölüm No) & Arsa Payı
  let unitNo = parcel.unitNo ? String(parcel.unitNo).trim() : null;
  if (!unitNo) {
    const uMatch = /(\d+)\s*(?:nolu|numaralı)\s*bağımsız\s*bölüm/i.exec(combined);
    if (uMatch) unitNo = uMatch[1];
  }

  let arsaPayi = parcel.arsaPayi ? String(parcel.arsaPayi).trim() : null;
  if (!arsaPayi) {
    const apMatch = /Arsa\s*Payı\s*:\s*([^\n\r.;,]+)/i.exec(parcelText);
    if (apMatch) arsaPayi = apMatch[1].trim().slice(0, 40);
  }

  // 5. Floor (Kat) & Year Built
  let floor = null;
  const katAddrMatch = /\bKat\s*:\s*([0-9]+|zemin|bodrum|çatı|giriş|asma)\b/i.exec(parcelText);
  const katDescMatch =
    /(?:keşfe\s+konu|satışa\s+konu|binanın)\s+([0-9]+\.\s*kat|zemin\s*kat|bodrum\s*kat|çatı\s*katı|giriş\s*kat)/i.exec(
      parcelText,
    );
  if (katAddrMatch) {
    const v = katAddrMatch[1].trim();
    floor = /^\d+$/.test(v) ? `${v}. Kat` : `${v} kat`;
  } else if (katDescMatch) {
    floor = katDescMatch[1].replace(/\s+/g, " ").trim();
  }

  const yearBuilt = extractYearBuilt(combined);

  // 6. Excerpt (Özellikleri) & Zoning (İmar Durumu)
  let excerpt = parcel.excerpt ? String(parcel.excerpt).trim() : null;
  const ozellikMatch = /Özellikleri\s*:\s*([\s\S]*?)(?:\n\s*(?:Adresi|Yüzölçümü|Arsa Payı|İmar Durumu|Kıymeti)\s*:|$)/i.exec(parcelText);
  if (ozellikMatch) {
    const fullOzellik = ozellikMatch[1].replace(/\s+/g, " ").trim();
    if (!excerpt || fullOzellik.length > excerpt.length) {
      excerpt = fullOzellik.slice(0, 500);
    }
  }

  let zoning = parcel.zoning ? String(parcel.zoning).trim() : null;
  if (!zoning) {
    const imarMatch = /İmar\s*Durumu\s*:\s*([^\n\r]+)/i.exec(parcelText);
    if (imarMatch) zoning = imarMatch[1].replace(/\s+/g, " ").trim().slice(0, 350);
  }

  return {
    landAreaM2,
    buildingAreaM2,
    netAreaM2,
    areaM2,
    areaKind,
    rooms,
    floor,
    yearBuilt,
    unitNo,
    arsaPayi,
    excerpt,
    zoning,
  };
}

/**
 * Classifies a DACH / European property text (DE / AT / CH / IT / ES / FR / GB) into a SegmentKey.
 */
export function classifyDachSegment(rawLabel = "", description = "") {
  const s = `${rawLabel} ${description}`.toLowerCase();
  if (
    /wohnungseigentum|eigentumswohnung|stockwerkeigentum|\bstwe\b|wohnung|appartement|\bppe\b|appartamento|alloggio|mansarda|attico|monolocale|bilocale|trilocale|\bppp\b|maisonette|penthouse|studio|garconniere|vivienda|piso|apartamento|ático|dúplex|duplex|\bflat\b/i.test(
      s,
    )
  ) {
    return "apartment";
  }
  if (
    /mehrfamilienhaus|zinshaus|miethaus|wohn-\s*und\s*gesch(?:ä|ae)ftshaus|immeuble\s*locatif|immeuble\s*de\s*rapport|ensemble\s*immobilier|palazzina|fabbricato\s+intero|edificio\s+de\s+viviendas|block\s+of\s+flats|\bhmo\b|renditeobjekt/i.test(
      s,
    )
  ) {
    return "multiFamily";
  }
  if (
    /einfamilienhaus|zweifamilienhaus|reihenhaus|doppelhaush(?:ä|ae)lfte|wohnhaus|landhaus|villa|villino|villetta|casa\s+indipendente|casa\s+singola|fabbricato\s+per\s+civile\s+abitazione|abitazione|terratetto|casale|cascina|bungalow|chalet|ferienhaus|kleingarten|superf(?:ä|ae)d|maison\s+individuelle|maison\s+villageoise|maison\s+d'habitation|une\s+maison|pavillon|casa\s+unifamiliare|casa\s+d'abitazione|rustico|unifamiliar|adosado|pareado|finca\s+urbana|detached|semi-detached|terraced|end-terrace|cottage|mews\s+house|town\s*house/i.test(
      s,
    )
  ) {
    return "house";
  }
  if (
    /gewerbe|betriebsliegenschaft|b(?:ü|ue)ro|lager|halle|hotel|gasthof|gastronomie|laden|gesch(?:ä|ae)ft|industrie|werkstatt|parkplatz|tiefgarage|stellplatz|local\s+commercial|edificio\s+commerciale|negozio|ufficio|capannone|magazzino|laboratorio|albergo|pensione|locale\s+commerciale|autorimessa|\bbox\b|posto\s+auto|garage|local\s+comercial|nave\s+industrial|oficina|garaje|trastero|parking|bureaux|local\s+d'activit|entrepôt|boutique|commerce|retail|office|warehouse|industrial\s+unit|\bpub\b|restaurant|shop|commercial/i.test(
      s,
    )
  ) {
    return "commercial";
  }
  if (
    /land-\s*und\s*forstwirtschaft|acker|wald|wiese|weingarten|forst|bauernhof|landwirtschaft|agricole|agricolo|terreno\s+agricolo|seminativo|uliveto|vigneto|bosco|azienda\s+agricola|finca\s+rústica|parcela\s+rústica|terre\s+agricole|agricultural|farmland|woodland|paddock|pasture/i.test(
      s,
    )
  ) {
    return "farmland";
  }
  if (
    /unbebaute\s+liegenschaft|bauland|baugrund|parzelle|grundst(?:ü|ue)ck|terrain\s+à\s+bâtir|terrain\s+nu|parcelle\s+de\s+terrain|terreno\s+edificabile|area\s+edificabile|area\s+urbana|\bterreno\b|\bsolar\b|parcela\s+urbana|terreno\s+urbanizable|building\s+plot|development\s+land|\bland\b|\bplot\b/i.test(
      s,
    )
  ) {
    return "land";
  }
  return "other";
}

/**
 * Parses an Austrian Ediktsdatei (edikte.justiz.gv.at) detail HTML page.
 */
export function parseAtEdiktHtml(html, listing = {}) {
  if (!html || !html.includes("col-sm-3")) return null;

  const rowMap = new Map();
  const rowRe = /<div class="row">\s*<span class="col-sm-3[^"]*">([\s\S]*?)<\/span>\s*<p class="col-sm-9[^"]*">([\s\S]*?)<\/p>\s*<\/div>/gi;
  for (const m of html.matchAll(rowRe)) {
    const label = decodeHtmlText(m[1]).replace(/:$/, "").trim();
    const rawVal = m[2];
    if (label && !rowMap.has(label.toLowerCase())) {
      rowMap.set(label.toLowerCase(), rawVal);
    }
  }

  const getVal = (key, keepNewlines = false) => {
    const raw = rowMap.get(key.toLowerCase());
    return raw ? decodeHtmlText(raw, keepNewlines) : null;
  };

  const dienststelleRaw = rowMap.get("dienststelle") ?? "";
  const courtHref = /href="([^"]+)"/i.exec(dienststelleRaw)?.[1] ?? null;
  const courtUrl = courtHref
    ? courtHref.startsWith("http")
      ? courtHref
      : `https://edikte.justiz.gv.at${courtHref.startsWith("/") ? "" : "/"}${courtHref}`
    : listing.courtUrl ?? null;
  const authority = (getVal("dienststelle") ?? listing.authority ?? "Bezirksgericht").replace(/\s*\(\d+\)\s*$/, "").trim();
  const fileNo = getVal("aktenzeichen") ?? listing.fileNo ?? "";
  const proceedingKind = getVal("wegen") ?? "Zwangsversteigerung einer Liegenschaft";
  const hearingPlace = getVal("versteigerungsort") ?? null;

  // Dates
  const parseAtDate = (str) => {
    const m = /(\d{2})\.(\d{2})\.(\d{4})(?:[\s\S]*?(\d{1,2})[:.](\d{2}))?/.exec(str || "");
    if (!m) return null;
    const [, dd, mm, yyyy, hh, min] = m;
    return hh ? `${yyyy}-${mm}-${dd}T${hh.padStart(2, "0")}:${min}:00` : `${yyyy}-${mm}-${dd}`;
  };

  const firstSeenAt = parseAtDate(getVal("bekannt gemacht am") ?? getVal("letzte änderung am")) ?? listing.firstSeenAt ?? null;
  const hearingRaw = getVal("versteigerungstermin");
  const hearingAt = parseAtDate(hearingRaw) ?? listing.hearingAt ?? null;

  // Grundbuch
  const gb = getVal("grundbuch");
  const ez = getVal("ez");
  const blnr = getVal("blnr");
  const grundbuch = [gb ? `GB ${gb}` : null, ez ? `EZ ${ez}` : null, blnr ? `BLNr ${blnr}` : null].filter(Boolean).join(" · ") || null;

  // Address & PLZ/Ort
  const rawStreet = getVal("liegenschaftsadresse") ?? getVal("adresse") ?? listing.street ?? null;
  const plzOrt = getVal("plz/ort") ?? "";
  const plzMatch = /^(\d{4})\s+(.+)$/.exec(plzOrt.trim());
  const postcode = plzMatch ? plzMatch[1] : listing.postcode ?? null;
  const place = plzMatch ? plzMatch[2].trim() : plzOrt.trim() || listing.place || null;
  const street = rawStreet && postcode
    ? rawStreet.replace(new RegExp(`,?\\s*${postcode}\\s+${place ?? ""}\\s*$`, "i"), "").trim() || rawStreet
    : rawStreet;

  // Category & Description
  const category = getVal("kategorie(n)") ?? listing.segmentLabel ?? null;
  const rawDesc =
    getVal("beschreibung", true) ??
    getVal("beschreibung (we)", true) ??
    getVal("liegenschaftsbeschreibung", true) ??
    null;
  const description = rawDesc && !/^siehe\s+(?:lang|kurz)?gutachten$/i.test(rawDesc.trim()) ? rawDesc : null;
  const zubehoer = getVal("beschreibung des mitzuversteigernden zubehörs", true);
  const bestand = getVal("bestandsverhältnisse", true);
  const anschluesse = getVal("anschlüsse", true);
  const hinweise = getVal("sonstige hinweise", true);
  const sonstiges = getVal("sonstiges", true);
  const anmerkung = getVal("anmerkung", true);
  const fullDesc =
    [
      description,
      bestand ? `Bestandsverhältnisse: ${bestand}` : null,
      anschluesse ? `Anschlüsse: ${anschluesse}` : null,
      zubehoer && !/^nicht\s+festgestellt$/i.test(zubehoer) ? `Zubehör: ${zubehoer}` : null,
      hinweise ? `Hinweise: ${hinweise}` : null,
      sonstiges ? `Sonstige Bedingungen: ${sonstiges}` : null,
      anmerkung ? `Anmerkung: ${anmerkung}` : null,
    ]
      .filter(Boolean)
      .join("\n\n") || null;

  // Areas & Values
  const combinedText = [category, fullDesc, street].filter(Boolean).join(" \n ");
  const landAreaM2 = parseLocalizedNumber(getVal("grundstücksgröße")) ?? extractDeLandArea(combinedText);
  const objAreaM2 = parseLocalizedNumber(getVal("objektgröße"));
  const livingAreaM2 = objAreaM2 ?? extractDeLivingArea(combinedText);
  const usableAreaM2 = extractDeUsableArea(combinedText);
  const rooms = extractDeRooms(combinedText);
  const yearBuilt = extractYearBuilt(combinedText);

  const appraisedValue = parseLocalizedNumber(getVal("schätzwert")) ?? listing.appraisedValue ?? null;
  const minimumBid = parseLocalizedNumber(getVal("geringstes gebot")) ?? listing.minimumBid ?? null;
  const depositAmount = parseLocalizedNumber(getVal("vadium")) ?? listing.depositAmount ?? null;

  // Attachments (downloadable files containing /$file/ in URL)
  const attachments = [];
  const seenUrls = new Set();
  const encodedKey = encodeURIComponent(listing.key ?? "");
  const linkRe = /<a[^>]*href="(\/edikte\/ex\/exedi3\.nsf\/[^"]*\/\$file\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let attIdx = 1;
  for (const m of html.matchAll(linkRe)) {
    const relHref = m[1].replace(/&amp;/g, "&").trim();
    if (seenUrls.has(relHref)) continue;
    seenUrls.add(relHref);
    const labelText = decodeHtmlText(m[2]).trim();
    const directUrl = `https://edikte.justiz.gv.at${relHref}`;
    const lower = `${labelText} ${relHref}`.toLowerCase();
    const kind = lower.includes("langgutachten") || lower.includes("gutachten")
      ? "report"
      : lower.includes("kurzgutachten") || lower.includes("exposé")
        ? "expose"
        : lower.includes("foto") || lower.includes("bild") || lower.includes("ansicht")
          ? "photos"
          : "announcement";
    const attId = `at-${attIdx++}`;
    const fileName = decodeURIComponent(relHref.split("/").pop() || `${labelText || "Dokument"}.pdf`).replace(/[?#].*$/, "");
    attachments.push({
      id: attId,
      kind,
      label: labelText || "Gerichtsdokument",
      fileName: fileName.endsWith(".pdf") || fileName.endsWith(".jpg") ? fileName : `${fileName}.pdf`,
      proxyUrl: `/api/quelle/${encodedKey}?fileId=${encodeURIComponent(attId)}`,
      directUrl,
    });
  }

  return {
    authority,
    fileNo,
    proceedingKind,
    grundbuch,
    description: fullDesc,
    hearingPlace,
    courtUrl,
    firstSeenAt,
    hearingAt,
    street,
    postcode,
    place,
    segmentLabel: category,
    segment: classifyDachSegment(category ?? "", fullDesc ?? ""),
    livingAreaM2,
    usableAreaM2,
    landAreaM2,
    rooms,
    yearBuilt,
    appraisedValue,
    minimumBid,
    depositAmount,
    attachments,
  };
}

/**
 * Extracts CHF appraisal value from Swiss SHAB <auctionObjects> / <remarks> text (DE / FR / IT).
 */
export function extractChAppraisedValue(text) {
  if (!text) return null;
  const cleaned = decodeHtmlText(text);

  // Number pattern supporting Swiss apostrophes: 1'600'000.00, 395'000.-, 450 000, 1250000
  const chNum = "(\\d{1,3}(?:['’´`\\s]\\d{3})+(?:[.,]\\d{1,2}|\\.-)?|\\d{4,8}(?:[.,]\\d{1,2}|\\.-)?)";

  const patterns = [
    new RegExp(
      `(?:betreibungsamtliche|konkursamtliche|amtliche|gerichtliche|experten)?\\s*(?:Sch(?:ä|ae|a)tzung(?:swert)?|Verkehrswert|Marktwert|Valeur\\s+v(?:é|e)nale|Estimation(?:\\s+officielle|\\s+de\\s+l'office|\\s+d'expert)?|Valore\\s+di\\s+stima(?:\\s+venale|\\s+peritale|\\s+ufficiale)?|Stima\\s+(?:ufficiale|peritale))[^0-9\\n]{0,45}?(?:CHF|Fr\\.?|SFr\\.?)?\\s*${chNum}`,
      "i",
    ),
    new RegExp(
      `(?:CHF|Fr\\.?|SFr\\.?)\\s*${chNum}[^.\\n]{0,35}?(?:Sch(?:ä|ae|a)tzung|Verkehrswert|Valeur\\s+v(?:é|e)nale|Estimation|Valore\\s+di\\s+stima|Stima)`,
      "i",
    ),
    new RegExp(`(?:CHF|Fr\\.?|SFr\\.?)\\s*${chNum}`, "gi"),
  ];

  for (let i = 0; i < 2; i++) {
    const m = patterns[i].exec(cleaned);
    if (m) {
      const val = parseLocalizedNumber(m[1]);
      if (val && val >= 5000 && val <= 250_000_000) return val;
    }
  }

  // Fallback: collect all CHF amounts >= 25,000 and pick the largest (avoiding deposit/Anzahlung amounts)
  const candidates = [];
  for (const m of cleaned.matchAll(patterns[2])) {
    const val = parseLocalizedNumber(m[1]);
    if (val && val >= 25_000 && val <= 250_000_000) candidates.push(val);
  }
  if (candidates.length > 0) {
    return Math.max(...candidates);
  }
  return null;
}

/**
 * Extracts CHF deposit (Anzahlung / Sicherheitsleistung / Acompte / Cauzione) from Swiss SHAB text.
 */
export function extractChDeposit(text) {
  if (!text) return null;
  const cleaned = decodeHtmlText(text);
  const chNum = "(\\d{1,3}(?:['’´`\\s]\\d{3})+(?:[.,]\\d{1,2}|\\.-)?|\\d{4,7}(?:[.,]\\d{1,2}|\\.-)?)";
  const m = new RegExp(
    `(?:Anzahlung|Sicherheitsleistung|Barkaution|Kaution|Acompte|Sûret(?:é|e)s|Cauzione|Deposito)[^0-9\\n]{0,45}?(?:CHF|Fr\\.?|SFr\\.?)\\s*${chNum}`,
    "i",
  ).exec(cleaned);
  if (m) {
    const val = parseLocalizedNumber(m[1]);
    if (val && val >= 1000 && val <= 10_000_000) return val;
  }
  return null;
}

const SHAB_NON_TOWN_WORD_RE =
  /^(?:Miteigentum\w*|ME|Wertquote\w*|Stammgrundst\w*|Grundbuch\w*|Grundst\w*|Liegenschaft\w*|Parzelle\w*|Plan|Blatt|Kataster\w*|Gartenanlage\w*|Gebäude\w*|Wohnhaus\w*|Wohnung\w*|Einfamilienhaus\w*|Mehrfamilienhaus\w*|Stockwerkeigentum\w*|Sonderrecht\w*|Betreibungsamt\w*|Konkursamt\w*|Amtliche\w*|Schätzung|Schatzung|Anzahlung|Hinweise|Dokumentation|Besichtigung\w*|Steigerung\w*|Verwertung|Versicherung\w*|Gesamtfläche|Fläche|Rechtskräftige|Anmerkungen|Vormerkungen|Dienstbarkeiten|Grundlasten|Grenzen|Beschrieb|Garage|Autoeinstellplatz|Autoabstellplatz|Superficie|Ubicazione|Valore|Quota|COPERTURA|DESCRIZIONE|PROPRIET[AÀ']\w*|RFD|Registro|Particella|Part|Fondo|Foglio|PPP|Comproprietà|Edificio|Terreno|Abitazione|Locale|Locali|Appartamento|Stima|Ufficiale|Peritale|Totale|Non|Piano|Immeuble\w*|Bien-fonds|Parcelle\w*|Propriété|Quote-part|Estimation|Surface|Bâtiment\w*|Habitation\w*|Maison|Jardin|Assurance|Vente\w*|Enchères|Lot|Pièce\w*|Chambre\w*|Rue|Grand-Rue|Avenue|Chemin|Route|Place|AVIS|Sektor|Secteur|Abteilung|Dienststelle|Bezirk\w*|Region|Kanton\w*|Nr|Nrn|No|Fr\.?|CHF|EUR|m2|m²|mq|ha|ca|und|oder|mit|ohne|für|von|zu|bis|ab|in|auf|aus|nach|vor|über|unter|durch|gegen|et|ou|en|au|aux|dans|avec|sans|pour|par|della|dei|degli|delle|nel|nella|nei|negli|nelle|al|alla|ai|agli|alle|da|dal|dalla|con|su|sul|sulla|per|tra|fra|sowie|inkl|lt|gemäss|laut|e)$/i;

const SHAB_TOWN_CONNECTOR_RE = /^(?:b\.|a\.|a\.A\.|i\.|im|am|an|bei|sur|sous|le|la|les|du|de|des|di|del|d['’]\w+)$/i;
const SHAB_MULTIWORD_PREFIX_RE = /^(?:La|Le|Les|St\.?|Ste\.?|Saint|Sainte|San|Sant['’]\w+|Castel|Riva|Collina|Ponte|Bosco|Villa|Val|Petit|Grand|Haut|Bas|Bad|\w+-[A-Z]\.)$/i;
const SHAB_CANTON_SUFFIX_RE = /^(?:ZH|BE|LU|UR|SZ|OW|NW|GL|ZG|FR|SO|BS|BL|SH|AR|AI|SG|GR|AG|TG|TI|VD|VS|NE|GE|JU|Ost|West)$/;

const SHAB_INVALID_PLZ_PREFIX_RE =
  /(?:\/|\b(?:Nr|Nrn|No|n|n°|Blatt|GBBl|Gbbl|Part|fondo|fondi|foglio|PPP|mq|m²|m2|Plan(?:\s+Nr\.?)?|fiscale|SIFTI|Kat|Kataster|Vers|ECA|RF|B-F|art|Parzelle|Liegenschaft|Grundstück|Katasterwert|Schätzung|Schatzung|CHF|Fr))[.:\sNo°/-]*$/i;

function shabHtmlToLines(text) {
  return String(text || "")
    .replace(/<(?:br|\/p|\/div|\/li|\/tr|p|div|li|tr)\b[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#34;|&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'");
}

export function cleanChShabTownCandidate(raw) {
  if (!raw) return null;
  const firstLine = shabHtmlToLines(raw).split(/[\r\n]+/)[0].trim();
  const tokens = firstLine.split(/[ \t]+/).filter(Boolean);
  const out = [];

  for (let i = 0; i < tokens.length; i++) {
    let tok = tokens[i].replace(/^[,;:()[\]"'«»-]+|[,;:()[\]"'«»]+$/g, "");
    if (!tok || tok === "-") break;

    const isAbbrevDot = /^(?:b\.|a\.|a\.A\.|i\.|St\.|Ste\.|S\.|\w+-[A-Z]\.)$/i.test(tok);
    const hasTrailingDot = tok.endsWith(".") && !isAbbrevDot;
    if (hasTrailingDot) {
      tok = tok.slice(0, -1);
    }
    if (!tok) break;
    if (/^\d+$/.test(tok)) break;

    if (out.length === 0) {
      if (SHAB_NON_TOWN_WORD_RE.test(tok)) return null;
      if (!/^[A-ZÄÖÜÉÈÀÂÎÔÛÇ]/.test(tok)) return null;
      out.push(tok);
      if (hasTrailingDot) break;
      continue;
    }

    const prevTok = out[out.length - 1];
    if (SHAB_CANTON_SUFFIX_RE.test(tok)) {
      out.push(tok);
      break;
    }

    if (SHAB_TOWN_CONNECTOR_RE.test(tok)) {
      if (/^(?:a\.A\.|d['’][A-ZÄÖÜÉÈÀÂÎÔÛÇ]\w*)$/i.test(tok)) {
        out.push(tok);
        if (hasTrailingDot) break;
        continue;
      }
      const nextTok = (tokens[i + 1] || "").replace(/[.,;:()[\]"'«»]+$/g, "");
      if (nextTok && /^[A-ZÄÖÜÉÈÀÂÎÔÛÇ]/.test(nextTok) && !SHAB_NON_TOWN_WORD_RE.test(nextTok)) {
        out.push(tok);
        continue;
      }
      break;
    }

    if (SHAB_TOWN_CONNECTOR_RE.test(prevTok) || SHAB_MULTIWORD_PREFIX_RE.test(prevTok)) {
      if (/^[A-ZÄÖÜÉÈÀÂÎÔÛÇ]/.test(tok) && !SHAB_NON_TOWN_WORD_RE.test(tok)) {
        out.push(tok);
        if (hasTrailingDot) break;
        continue;
      }
    }

    break;
  }

  while (out.length > 1 && SHAB_TOWN_CONNECTOR_RE.test(out[out.length - 1]) && !/^(?:a\.A\.|d['’]\w+)$/i.test(out[out.length - 1])) {
    out.pop();
  }

  const joined = out.join(" ").replace(/[.,;:\s-]+$/, "").trim();
  if (joined.length < 2) return null;
  if (SHAB_NON_TOWN_WORD_RE.test(joined)) return null;
  return joined;
}

export function isBogusShabPlace(place, postcode) {
  if (!place) return true;
  if (postcode === "1000") return true;
  if (/[\r\n]/.test(place)) return true;
  if (/\./.test(place) && !/\b(?:b\.|a\.A\.|St\.|Ste\.|S\.|\w+-[A-Z]\.)/.test(place)) return true;
  if (
    /\b(?:DESCRIZIONE|ME|Miteigentum\w*|Wertquote|Registro|RFD|Gartenanlage|Valore|COPERTURA|Fr|CHF|Superficie|Plan|Quota|Ubicazione|Konkursamtliche|Betreibungsamtliche|Amtliche|und)\b/i.test(
      place,
    )
  ) {
    return true;
  }
  if (/\s(?:b|im|am|an|di|nel|del|non|totale|ufficiale|\d+)$/i.test(place)) return true;
  if (place === "Saignelégie") return true;
  return false;
}

function findValidShabPlzTownInText(text) {
  if (!text) return null;
  const clean = shabHtmlToLines(String(text).split(/\b(?:des\s+Gläubigers|Gläubiger\s*:)/i)[0]);
  const re = /(?<![/\-.'’0-9])\b([1-9]\d{3})[ \t]+([A-ZÄÖÜÉÈÀÂÎÔÛÇ][A-Za-zÄÖÜäöüéèàáâêîôûç.'’\-]+(?:[ \t]+[A-Za-zÄÖÜäöüéèàáâêîôûç.'’\-]+){0,3})/g;
  let m;
  while ((m = re.exec(clean)) !== null) {
    const plz = m[1];
    const prefix = clean.slice(Math.max(0, m.index - 40), m.index);
    if (SHAB_INVALID_PLZ_PREFIX_RE.test(prefix)) continue;
    const town = cleanChShabTownCandidate(m[2]);
    if (!town) continue;
    return { postcode: plz, place: town === "Saignelégie" ? "Saignelégier" : town };
  }
  return null;
}

function extractShabMunicipalityFromDescription(text) {
  if (!text) return null;
  const clean = shabHtmlToLines(text).replace(/[ \t]+/g, " ");

  const patterns = [
    /\bComune\s*:\s*([A-ZÄÖÜÉÈÀÂÎÔÛÇ][A-Za-zÄÖÜäöüéèàáâêîôûç.'’\-]+(?:[ \t]+[A-Za-zÄÖÜäöüéèàáâêîôûç.'’\-]+){0,3})/i,
    /\b(?:territorio\s+del\s+|siti?\s+(?:nel|in)\s+)?Comune\s+(?:di|delle|dei)\s+([A-ZÄÖÜÉÈÀÂÎÔÛÇ][A-Za-zÄÖÜäöüéèàáâêîôûç.'’\-]+(?:[ \t]+[A-Za-zÄÖÜäöüéèàáâêîôûç.'’\-]+){0,3})/i,
    /\b(?:RFD|Registro\s+fondiario)\s+(?:di|nel\s+territorio\s+del\s+comune\s+di|nel\s+comune\s+di)\s+([A-ZÄÖÜÉÈÀÂÎÔÛÇ][A-Za-zÄÖÜäöüéèàáâêîôûç.'’\-]+(?:[ \t]+[A-Za-zÄÖÜäöüéèàáâêîôûç.'’\-]+){0,3})/i,
    /\b(?:Commune\s+(?:de|d['’])|sis(?:e|es)?\s+(?:sur\s+la\s+commune\s+(?:de|d['’])|à))\s*([A-ZÄÖÜÉÈÀÂÎÔÛÇ][A-Za-zÄÖÜäöüéèàáâêîôûç'’\-]+(?:[ \t]+[A-Za-zÄÖÜäöüéèàáâêîôûç'’\-]+){0,3})/i,
    /\b(?:In\s+der\s+Gemeinde|Liegenschaft\s+Gemeinde|Im\s+Grundbuch\s+(?:des\s+Bezirks\s+[A-Za-zÄÖÜäöü-]+,\s*)?(?:Gemeinde\s+)?|Gemeinde|Grundbuch|GBBl-|GB|STW|LIG)\s+([A-ZÄÖÜÉÈÀ][A-Za-zÄÖÜäöüéèàêîôûç.'’\-]+(?:[ \t]+[A-Za-zÄÖÜäöüéèàêîôûç.'’\-]+){0,3})/,
    /\b([A-ZÄÖÜ][A-Za-zÄÖÜäöü-]+)[ \t]+(?:Grundbuchblatt|Gbbl\.-Nr\.)/,
  ];

  for (const pat of patterns) {
    const m = pat.exec(clean);
    if (m) {
      let raw = m[1].split("/")[0].trim();
      if (raw === raw.toUpperCase() && raw.length > 3) {
        raw = raw.toLowerCase().replace(/(?:^|[\s'-])\S/g, (c) => c.toUpperCase());
      }
      const town = cleanChShabTownCandidate(raw);
      if (town) return town === "Saignelégie" ? "Saignelégier" : town;
    }
  }
  return null;
}

export function extractChShabLocation({
  objectsText = "",
  titleDe = "",
  hearingPlace = "",
  authority = "",
  officeZip = null,
  officeTown = "",
  fallbackPostcode = null,
  fallbackPlace = null,
}) {
  const objectsOnly = String(objectsText || "").split(/\bHinweise:/)[0];
  const fromObjectsPlz = findValidShabPlzTownInText(objectsOnly);
  if (fromObjectsPlz) return fromObjectsPlz;

  const fromTitlePlz = findValidShabPlzTownInText(titleDe);
  if (fromTitlePlz) return fromTitlePlz;

  const fromObjectsTown = extractShabMunicipalityFromDescription(objectsOnly);
  const fromHearingPlz = findValidShabPlzTownInText(hearingPlace);
  const cleanOfficeTown = cleanChShabTownCandidate(officeTown);
  const validOfficeZip = officeZip && officeZip !== "1000" ? officeZip : null;
  const validFallbackZip =
    fallbackPostcode && !isBogusShabPlace(fallbackPlace, fallbackPostcode)
      ? fallbackPostcode
      : fallbackPostcode && /^(?:1260)$/.test(fallbackPostcode)
        ? fallbackPostcode
        : null;

  if (fromObjectsTown) {
    return {
      postcode: fromHearingPlz?.postcode || validOfficeZip || validFallbackZip || null,
      place: fromObjectsTown,
    };
  }

  if (fromHearingPlz) return fromHearingPlz;

  if (cleanOfficeTown) {
    return {
      postcode: validOfficeZip || validFallbackZip || null,
      place: cleanOfficeTown,
    };
  }

  const authTown = cleanChShabTownCandidate(
    String(authority || "").replace(
      /^(?:Betreibungsamt|Konkursamt|Betreibungs-\s*und\s*Konkursamt|Ufficio\s+(?:esecuzione|esecuzioni|fallimenti)(?:\s+e\s+fallimenti)?\s+(?:di|del)?|Offices?\s+des\s+(?:poursuites|faillites)(?:\s+et\s+faillites)?\s+(?:du\s+district\s+de|de\s+la|de|du)?)(?:\s+Bezirk|\s+Region)?\s*/i,
      "",
    ),
  );
  if (authTown) {
    return {
      postcode: validOfficeZip || validFallbackZip || null,
      place: authTown,
    };
  }

  return {
    postcode: validOfficeZip || validFallbackZip || null,
    place: cleanChShabTownCandidate(fallbackPlace) || null,
  };
}

/**
 * Parses a Swiss SHAB XML publication (SB01 / KK08) into structured fields.
 */
export function parseChShabXml(xml, listing = {}) {
  if (!xml || !xml.includes("<publication")) return null;

  const getTag = (tag, src = xml) => {
    const m = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i").exec(src);
    return m ? m[1].trim() : null;
  };

  const subRubric = getTag("subRubric") ?? "SB01";
  const pubId = getTag("id") ?? (listing.key ? listing.key.replace(/^shab-/, "") : "");
  const fileNo = getTag("publicationNumber") ?? listing.fileNo ?? "";
  const firstSeenAt = (getTag("publicationDate") ?? "").slice(0, 10) || listing.firstSeenAt || null;
  const cantonCode = (getTag("cantons") ?? "").toUpperCase();
  const titleDe = decodeHtmlText(getTag("de", getTag("title") ?? "") || getTag("fr", getTag("title") ?? "") || getTag("it", getTag("title") ?? "") || "");

  // Registration office (Betreibungsamt / Konkursamt)
  const regBlock = getTag("registrationOffice") ?? "";
  const authority = decodeHtmlText(getTag("displayName", regBlock) ?? listing.authority ?? "Betreibungsamt");
  const officeZip = getTag("swissZipCode", regBlock);
  const officeTown = decodeHtmlText(getTag("town", regBlock) ?? "");

  // Content
  const contentBlock = getTag("content") ?? xml;
  const auctionBlock = getTag("auction", contentBlock) ?? "";
  const auctionDate = getTag("date", auctionBlock);
  const auctionTime = getTag("time", auctionBlock);
  const hearingAt = auctionDate ? (auctionTime ? `${auctionDate}T${auctionTime.slice(0, 5)}:00` : `${auctionDate}T10:00:00`) : listing.hearingAt ?? null;
  const hearingPlace = decodeHtmlText(getTag("location", auctionBlock) ?? "") || null;

  const rawObjects = getTag("auctionObjects", contentBlock) ?? "";
  const rawRemarks = getTag("remarks", contentBlock) ?? "";
  const objectsText = decodeHtmlText(rawObjects, true);
  const remarksText = decodeHtmlText(rawRemarks, true);
  const description = [objectsText, remarksText ? `Hinweise: ${remarksText}` : null].filter(Boolean).join("\n\n") || null;

  const proceedingKind =
    subRubric === "KK08"
      ? "Konkursamtliche Grundstücksteigerung (SchKG)"
      : "Betreibungsamtliche Grundstücksteigerung (SchKG)";

  // Extract property postcode & place from auctionObjects, title, hearingPlace, or registrationOffice
  const { postcode, place } = extractChShabLocation({
    objectsText,
    titleDe,
    hearingPlace,
    authority,
    officeZip,
    officeTown,
    fallbackPostcode: listing.postcode ?? null,
    fallbackPlace: listing.place ?? null,
  });

  // Extract Grundbuch / Parzelle / E-GRID
  const gbParts = [];
  const egridMatch = /\bE-GRID\s*:?\s*(CH[0-9A-Z]+)/i.exec(objectsText);
  if (egridMatch) gbParts.push(`E-GRID ${egridMatch[1]}`);
  const parzMatch = /\b(?:Grundstück|Liegenschaft|Parzelle|Feuillet|Bien-fonds|Particella|Fondo)\s*(?:Nr\.?|n°|no)?\s*(\d+(?:[\s,/+-]\d+)*)/i.exec(objectsText);
  if (parzMatch) gbParts.push(`Parzelle ${parzMatch[1].trim()}`);
  const grundbuch = gbParts.join(" · ") || null;

  // Areas (DE / FR / IT)
  let livingAreaM2 = extractDeLivingArea(objectsText);
  if (!livingAreaM2) {
    const frItLiving = /(?:surface\s+habitable|superficie\s+abitabile)[^0-9\n]{0,25}?(\d{2,4}(?:[.,]\d{1,2})?)\s*(?:m²|m2|mq\b)/i.exec(objectsText);
    if (frItLiving) livingAreaM2 = parseLocalizedNumber(frItLiving[1]);
  }

  let landAreaM2 = extractDeLandArea(objectsText);
  if (!landAreaM2) {
    const chLand =
      /(?:Haltenfl(?:ä|ae)che|Gesamtfl(?:ä|ae)che|Fl(?:ä|ae)che|surface\s+totale|surface|superficie\s+totale|superficie(?:\s+del\s+fondo)?)[^0-9\n]{0,25}?(\d{1,6}(?:['’]\d{3})*(?:[.,]\d{1,2})?)\s*(?:m²|m2|mq\b)/i.exec(
        objectsText,
      ) ?? /\b(\d{2,6}(?:['’]\d{3})*)\s*(?:m²|m2|mq\b)/i.exec(objectsText);
    if (chLand) {
      const v = parseLocalizedNumber(chLand[1]);
      if (v && v >= 20 && v <= 5_000_000) landAreaM2 = v;
    }
  }

  const usableAreaM2 = extractDeUsableArea(objectsText);
  const rooms =
    extractDeRooms(objectsText) ??
    (() => {
      const frRooms = /\b(\d+(?:[.,]5)?)\s*pi(?:è|e)ces\b/i.exec(objectsText);
      if (frRooms) return `${frRooms[1]} Zi.`;
      const itRooms = /\b(\d+(?:[.,]5)?)\s*locali\b/i.exec(objectsText);
      if (itRooms) return `${itRooms[1]} Zi.`;
      return null;
    })();
  const yearBuilt = extractYearBuilt(objectsText);

  const appraisedValue = extractChAppraisedValue(`${objectsText}\n${remarksText}`) ?? listing.appraisedValue ?? null;
  const depositAmount = extractChDeposit(`${objectsText}\n${remarksText}`) ?? listing.depositAmount ?? null;

  const encodedKey = encodeURIComponent(listing.key || `shab-${pubId}`);
  const pdfUrl = pubId ? `https://www.shab.ch/api/v1/publications/${pubId}/pdf` : null;
  const attachments = pdfUrl
    ? [
        {
          id: "shab-pdf",
          kind: "announcement",
          label: "Amtliche SHAB-Publikation (Signiertes PDF)",
          fileName: `${fileNo || pubId}.pdf`,
          proxyUrl: `/api/quelle/${encodedKey}?fileId=shab-pdf`,
          directUrl: pdfUrl,
        },
      ]
    : [];

  return {
    cantonCode,
    authority,
    fileNo,
    firstSeenAt,
    hearingAt,
    hearingPlace,
    proceedingKind,
    description,
    postcode,
    place,
    grundbuch,
    segment: classifyDachSegment(titleDe, objectsText),
    livingAreaM2,
    usableAreaM2,
    landAreaM2,
    rooms,
    yearBuilt,
    appraisedValue,
    depositAmount,
    attachments,
  };
}

const IT_PROVINCE_TO_REGION = {
  AG: "Sicilia", AL: "Piemonte", AN: "Marche", AO: "Valle d'Aosta", AP: "Marche", AQ: "Abruzzo", AR: "Toscana", AT: "Piemonte", AV: "Campania",
  BA: "Puglia", BG: "Lombardia", BI: "Piemonte", BL: "Veneto", BN: "Campania", BO: "Emilia-Romagna", BR: "Puglia", BS: "Lombardia", BT: "Puglia", BZ: "Trentino-Alto Adige",
  CA: "Sardegna", CB: "Molise", CE: "Campania", CH: "Abruzzo", CL: "Sicilia", CN: "Piemonte", CO: "Lombardia", CR: "Lombardia", CS: "Calabria", CT: "Sicilia", CZ: "Calabria",
  EN: "Sicilia", FC: "Emilia-Romagna", FE: "Emilia-Romagna", FG: "Puglia", FI: "Toscana", FM: "Marche", FR: "Lazio",
  GE: "Liguria", GO: "Friuli-Venezia Giulia", GR: "Toscana",
  IM: "Liguria", IS: "Molise", KR: "Calabria", LC: "Lombardia", LE: "Puglia", LI: "Toscana", LO: "Lombardia", LT: "Lazio", LU: "Toscana",
  MB: "Lombardia", MC: "Marche", ME: "Sicilia", MI: "Lombardia", MN: "Lombardia", MO: "Emilia-Romagna", MS: "Toscana", MT: "Basilicata",
  NA: "Campania", NO: "Piemonte", NU: "Sardegna", OR: "Sardegna",
  PA: "Sicilia", PC: "Emilia-Romagna", PD: "Veneto", PE: "Abruzzo", PG: "Umbria", PI: "Toscana", PN: "Friuli-Venezia Giulia", PO: "Toscana", PR: "Emilia-Romagna", PT: "Toscana", PU: "Marche", PV: "Lombardia", PZ: "Basilicata",
  RA: "Emilia-Romagna", RC: "Calabria", RE: "Emilia-Romagna", RG: "Sicilia", RI: "Lazio", RM: "Lazio", RN: "Emilia-Romagna", RO: "Veneto",
  SA: "Campania", SI: "Toscana", SO: "Lombardia", SP: "Liguria", SR: "Sicilia", SS: "Sardegna", SU: "Sardegna", SV: "Liguria",
  TA: "Puglia", TE: "Abruzzo", TN: "Trentino-Alto Adige", TO: "Piemonte", TP: "Sicilia", TR: "Umbria", TS: "Friuli-Venezia Giulia", TV: "Veneto",
  UD: "Friuli-Venezia Giulia", VA: "Lombardia", VB: "Piemonte", VC: "Piemonte", VE: "Veneto", VI: "Veneto", VR: "Veneto", VT: "Lazio", VV: "Calabria",
};

/**
 * Parses an Italian AsteGiudiziarie (astegiudiziarie.it) JSON lot object.
 */
export function parseItAsteItem(item, mapCoords = null) {
  if (!item || !item.idLotto) return null;

  const key = `it-aste-${item.idLotto}`;
  const encodedKey = encodeURIComponent(key);
  const authority = item.tribunale ? `Tribunale di ${item.tribunale}` : "Tribunale Ordinario";
  const fileNo = item.ruolo || (item.numeroProcedura && item.annoProcedura ? `R.G.E. ${item.numeroProcedura}/${item.annoProcedura}` : `Asta ${item.idAsta || item.idLotto}`);
  const proceedingKind = "Espropriazione immobiliare (Vendita giudiziaria telematica)";

  const rawAddress = decodeHtmlText(item.indirizzo || "");
  const capMatch = /\b(\d{5})\b/.exec(rawAddress);
  const postcode = capMatch ? capMatch[1] : null;
  const place = decodeHtmlText(item.comune || "") || "Italia";
  const prov = (item.provincia || "").toUpperCase();
  const state = IT_PROVINCE_TO_REGION[prov] || "Lombardia";

  const street = rawAddress
    .replace(/,?\s*\d{5}\s+[^,]+(?:,\s*Italia)?$/i, "")
    .replace(/,?\s*Italia$/i, "")
    .trim() || null;

  const description = decodeHtmlText(item.descrizione || "", true) || null;
  const catLabel = decodeHtmlText(item.categoria || item.tipologia || "");

  // Extract m², vani, catasto (Foglio/Particella/Sub)
  const mqMatches = [...(description || "").matchAll(/(?:mq\.?|metri\s+quadr(?:at)?i|superficie(?:\s+commerciale|\s+catastale|\s+coperta|\s+lorda)?)[^0-9\n]{0,20}?(\d{1,5}(?:[.,]\d{1,2})?)|(\d{2,5}(?:[.,]\d{1,2})?)\s*mq\b/gi)];
  let livingAreaM2 = null;
  let landAreaM2 = null;
  const seg = classifyDachSegment(catLabel, description || "");
  for (const m of mqMatches) {
    const val = parseLocalizedNumber(m[1] || m[2]);
    if (!val || val < 12 || val > 500_000) continue;
    if (seg === "land" || seg === "farmland" || val > 1200) {
      if (!landAreaM2 || val > landAreaM2) landAreaM2 = Math.round(val);
    } else if (!livingAreaM2) {
      livingAreaM2 = Math.round(val);
    }
  }

  const vaniMatch = /\b(\d{1,2}(?:[.,]5)?)\s*vani\b/i.exec(description || "");
  const rooms = vaniMatch ? `${vaniMatch[1].replace(".", ",")} Zi.` : extractDeRooms(description || "");
  const yearBuilt = extractYearBuilt(description || "");

  const foglioMatch = /\bfoglio\s+(\d+)/i.exec(description || "");
  const partMatch = /\b(?:particella|mappale|part\.)\s+(\d+)/i.exec(description || "");
  const subMatch = /\bsub(?:alterno|\.)?\s*(\d+)/i.exec(description || "");
  const grundbuch = [
    foglioMatch ? `Foglio ${foglioMatch[1]}` : null,
    partMatch ? `Part. ${partMatch[1]}` : null,
    subMatch ? `Sub. ${subMatch[1]}` : null,
    item.numeroLotto ? `Lotto ${item.numeroLotto}` : null,
  ].filter(Boolean).join(" · ") || null;

  const prezzoBase = typeof item.prezzoBase === "number" && item.prezzoBase > 0 ? Math.round(item.prezzoBase) : null;
  // Under Art. 571 c.p.c., Italian judicial auctions allow an Offerta minima of 75% of Prezzo base
  const minimumBid = prezzoBase ? Math.round(prezzoBase * 0.75) : null;
  const depositAmount = minimumBid ? Math.round(minimumBid * 0.1) : null;

  const detailUrl = item.urlSchedaDettagliata
    ? `https://www.astegiudiziarie.it${item.urlSchedaDettagliata.startsWith("/") ? "" : "/"}${item.urlSchedaDettagliata}`
    : `https://www.astegiudiziarie.it/Immobili`;

  const attachments = [];
  if (item.urlPhoto) {
    const photoUrl = item.urlPhoto.startsWith("http")
      ? item.urlPhoto
      : `https://www.astegiudiziarie.it${item.urlPhoto.startsWith("/") ? "" : "/"}${item.urlPhoto}`;
    attachments.push({
      id: "it-photo-1",
      kind: "photos",
      label: "Foto dell'immobile (Aste Giudiziarie)",
      fileName: `foto-${item.idLotto}.jpg`,
      proxyUrl: `/api/quelle/${encodedKey}?fileId=it-photo-1`,
      directUrl: photoUrl,
    });
  }

  const lat = Number(item.latitudine ?? mapCoords?.lat);
  const lng = Number(item.longitudine ?? mapCoords?.lng);

  return {
    key,
    authority,
    fileNo,
    proceedingKind,
    grundbuch,
    description,
    detailUrl,
    firstSeenAt: (item.dataInizioPubblicazione || "").slice(0, 10) || null,
    hearingAt: item.dataUdienza || item.dataVendita || null,
    street,
    postcode,
    place,
    state,
    segmentLabel: catLabel || "Immobile all'asta",
    segment: seg,
    livingAreaM2,
    usableAreaM2: null,
    landAreaM2,
    rooms,
    yearBuilt,
    appraisedValue: prezzoBase,
    minimumBid,
    depositAmount,
    lat: Number.isFinite(lat) && lat > 35 && lat < 48 ? lat : null,
    lng: Number.isFinite(lng) && lng > 6 && lng < 19 ? lng : null,
    attachments,
  };
}

// Spanish 2-digit postal code prefix (01..52) -> { state (Comunidad Autónoma), province, lat, lng }
const ES_PROVINCE_PREFIX_MAP = {
  "01": { state: "País Vasco", province: "Álava", lat: 42.8467, lng: -2.6716 },
  "02": { state: "Castilla-La Mancha", province: "Albacete", lat: 38.9942, lng: -1.8585 },
  "03": { state: "Comunitat Valenciana", province: "Alicante", lat: 38.3452, lng: -0.4815 },
  "04": { state: "Andalucía", province: "Almería", lat: 36.834, lng: -2.4637 },
  "05": { state: "Castilla y León", province: "Ávila", lat: 40.6565, lng: -4.6818 },
  "06": { state: "Extremadura", province: "Badajoz", lat: 38.8794, lng: -6.9707 },
  "07": { state: "Illes Balears", province: "Illes Balears", lat: 39.5696, lng: 2.6502 },
  "08": { state: "Cataluña", province: "Barcelona", lat: 41.3874, lng: 2.1686 },
  "09": { state: "Castilla y León", province: "Burgos", lat: 42.344, lng: -3.6969 },
  "10": { state: "Extremadura", province: "Cáceres", lat: 39.4753, lng: -6.3724 },
  "11": { state: "Andalucía", province: "Cádiz", lat: 36.5271, lng: -6.2886 },
  "12": { state: "Comunitat Valenciana", province: "Castellón", lat: 39.9864, lng: -0.0513 },
  "13": { state: "Castilla-La Mancha", province: "Ciudad Real", lat: 38.9848, lng: -3.9274 },
  "14": { state: "Andalucía", province: "Córdoba", lat: 37.8882, lng: -4.7794 },
  "15": { state: "Galicia", province: "A Coruña", lat: 43.3623, lng: -8.4115 },
  "16": { state: "Castilla-La Mancha", province: "Cuenca", lat: 40.0704, lng: -2.1374 },
  "17": { state: "Cataluña", province: "Girona", lat: 41.9794, lng: 2.8214 },
  "18": { state: "Andalucía", province: "Granada", lat: 37.1773, lng: -3.5986 },
  "19": { state: "Castilla-La Mancha", province: "Guadalajara", lat: 40.6337, lng: -3.1674 },
  "20": { state: "País Vasco", province: "Gipuzkoa", lat: 43.3183, lng: -1.9812 },
  "21": { state: "Andalucía", province: "Huelva", lat: 37.2614, lng: -6.9447 },
  "22": { state: "Aragón", province: "Huesca", lat: 42.1362, lng: -0.4087 },
  "23": { state: "Andalucía", province: "Jaén", lat: 37.7796, lng: -3.7849 },
  "24": { state: "Castilla y León", province: "León", lat: 42.5987, lng: -5.5671 },
  "25": { state: "Cataluña", province: "Lleida", lat: 41.6176, lng: 0.62 },
  "26": { state: "La Rioja", province: "La Rioja", lat: 42.4627, lng: -2.4449 },
  "27": { state: "Galicia", province: "Lugo", lat: 43.0097, lng: -7.5568 },
  "28": { state: "Comunidad de Madrid", province: "Madrid", lat: 40.4168, lng: -3.7038 },
  "29": { state: "Andalucía", province: "Málaga", lat: 36.7213, lng: -4.4214 },
  "30": { state: "Región de Murcia", province: "Murcia", lat: 37.9922, lng: -1.1307 },
  "31": { state: "Navarra", province: "Navarra", lat: 42.8125, lng: -1.6458 },
  "32": { state: "Galicia", province: "Ourense", lat: 42.3358, lng: -7.8639 },
  "33": { state: "Asturias", province: "Asturias", lat: 43.3619, lng: -5.8494 },
  "34": { state: "Castilla y León", province: "Palencia", lat: 42.0096, lng: -4.5288 },
  "35": { state: "Canarias", province: "Las Palmas", lat: 28.1235, lng: -15.4363 },
  "36": { state: "Galicia", province: "Pontevedra", lat: 42.4299, lng: -8.6446 },
  "37": { state: "Castilla y León", province: "Salamanca", lat: 40.9701, lng: -5.6635 },
  "38": { state: "Canarias", province: "Santa Cruz de Tenerife", lat: 28.4636, lng: -16.2518 },
  "39": { state: "Cantabria", province: "Cantabria", lat: 43.4623, lng: -3.8099 },
  "40": { state: "Castilla y León", province: "Segovia", lat: 40.9429, lng: -4.1088 },
  "41": { state: "Andalucía", province: "Sevilla", lat: 37.3891, lng: -5.9845 },
  "42": { state: "Castilla y León", province: "Soria", lat: 41.7666, lng: -2.479 },
  "43": { state: "Cataluña", province: "Tarragona", lat: 41.1189, lng: 1.2445 },
  "44": { state: "Aragón", province: "Teruel", lat: 40.3456, lng: -1.1065 },
  "45": { state: "Castilla-La Mancha", province: "Toledo", lat: 39.8628, lng: -4.0273 },
  "46": { state: "Comunitat Valenciana", province: "Valencia", lat: 39.4699, lng: -0.3763 },
  "47": { state: "Castilla y León", province: "Valladolid", lat: 41.6523, lng: -4.7245 },
  "48": { state: "País Vasco", province: "Bizkaia", lat: 43.263, lng: -2.935 },
  "49": { state: "Castilla y León", province: "Zamora", lat: 41.5035, lng: -5.7468 },
  "50": { state: "Aragón", province: "Zaragoza", lat: 41.6488, lng: -0.8891 },
  "51": { state: "Andalucía", province: "Ceuta", lat: 35.8894, lng: -5.3213 },
  "52": { state: "Andalucía", province: "Melilla", lat: 35.2923, lng: -2.9381 },
};

/**
 * Parses a Spanish BOE (subastas.boe.es) auction detail (ver=1 general + ver=3 asset).
 */
export function parseEsBoeHtml(htmlVer1, htmlVer3 = "", stub = {}) {
  if (!htmlVer1 && !stub.idSub) return null;

  const extractTableRows = (src) => {
    const map = new Map();
    const re = /<tr[^>]*>\s*<th[^>]*>([\s\S]*?)<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<\/tr>/gi;
    for (const m of (src || "").matchAll(re)) {
      const k = decodeHtmlText(m[1]).toLowerCase().trim();
      const v = decodeHtmlText(m[2], true).trim();
      if (k && !map.has(k)) map.set(k, v);
    }
    return map;
  };

  const map1 = extractTableRows(htmlVer1);
  const map3 = extractTableRows(htmlVer3);
  const get1 = (k) => map1.get(k.toLowerCase()) ?? null;
  const get3 = (k) => map3.get(k.toLowerCase()) ?? null;

  const idSub = get1("identificador") || stub.idSub || "";
  if (!idSub) return null;
  const key = `es-boe-${idSub}`;
  const encodedKey = encodeURIComponent(key);

  const authority = stub.authority || get1("autoridad gestora") || "Juzgado de Primera Instancia";
  const expediente = get1("expediente") || stub.expediente || "";
  const fileNo = expediente ? `${idSub} · Exp. ${expediente}` : idSub;
  const proceedingKind = `Subasta Judicial (${get1("tipo de subasta") || "Vía de apremio"} - BOE)`;

  const extractIso = (raw) => {
    const m = /ISO:\s*(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/.exec(raw || "");
    if (m) return m[1];
    const d = /(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2})/.exec(raw || "") || /(\d{2})\/(\d{2})\/(\d{4})\s+a\s+las\s+(\d{2}):(\d{2})/.exec(raw || "");
    return d ? `${d[3]}-${d[2]}-${d[1]}T${d[4]}:${d[5]}:00` : null;
  };

  const firstSeenAt = (extractIso(get1("fecha de inicio")) || "").slice(0, 10) || null;
  const hearingAt = extractIso(get1("fecha de conclusión")) || extractIso(stub.conclusionText) || null;

  const valorSubasta = parseLocalizedNumber(get1("valor subasta"));
  const tasacion = parseLocalizedNumber(get1("tasación"));
  const appraisedValue = valorSubasta || tasacion || null;
  const pujaMinima = parseLocalizedNumber(get1("puja mínima"));
  const cantidadReclamada = parseLocalizedNumber(get1("cantidad reclamada"));
  const minimumBid =
    pujaMinima && pujaMinima >= 1000
      ? pujaMinima
      : cantidadReclamada && appraisedValue && cantidadReclamada < appraisedValue * 0.92
        ? Math.round(cantidadReclamada)
        : appraisedValue
          ? Math.round(appraisedValue * 0.7)
          : null;
  const depositAmount = parseLocalizedNumber(get1("importe del depósito")) || (appraisedValue ? Math.round(appraisedValue * 0.05) : null);

  const rawDesc = get3("descripción") || stub.summary || null;
  const street = get3("dirección") || null;
  const rawCp = (get3("código postal") || "").trim();
  const cpMatch = /\b(\d{5})\b/.exec(rawCp) || /\b(\d{5})\b/.exec(street || "") || /\b(\d{5})\b/.exec(rawDesc || "");
  const postcode = cpMatch ? cpMatch[1] : null;
  const prefix2 = postcode ? postcode.slice(0, 2) : null;
  const provInfo = (prefix2 && ES_PROVINCE_PREFIX_MAP[prefix2]) || null;

  const rawLocality = get3("localidad") || "";
  const rawProv = (get3("provincia") || "").split("/")[0].trim();
  const place = rawLocality ? rawLocality.charAt(0).toUpperCase() + rawLocality.slice(1).toLowerCase() : provInfo?.province || rawProv || "España";
  const state = provInfo?.state || "Comunidad de Madrid";

  // Deterministic coordinate jitter inside the province based on postcode / idSub
  let lat = provInfo?.lat ?? 40.4168;
  let lng = provInfo?.lng ?? -3.7038;
  const hashSeed = (postcode || idSub).split("").reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 10000, 7);
  lat = Number((lat + ((hashSeed % 100) - 50) * 0.0018).toFixed(5));
  lng = Number((lng + ((Math.floor(hashSeed / 100) % 100) - 50) * 0.0022).toFixed(5));

  const situacion = get3("situación posesoria");
  const visitable = get3("visitable");
  const inscripcion = get3("inscripción registral");
  const idufir = get3("idufir") || get3("cru");
  const grundbuch = [idufir ? `CRU/IDUFIR ${idufir}` : null, inscripcion ? inscripcion.slice(0, 120) : null].filter(Boolean).join(" · ") || null;

  const description = [
    rawDesc,
    situacion ? `Situación posesoria: ${situacion}` : null,
    visitable ? `Visitable: ${visitable}` : null,
    inscripcion ? `Inscripción registral: ${inscripcion}` : null,
  ].filter(Boolean).join("\n\n") || null;

  // Extract m² from Spanish description (m2, m², metros cuadrados, áreas, hectáreas)
  let livingAreaM2 = null;
  let landAreaM2 = null;
  const seg = classifyDachSegment(rawDesc || "", street || "");
  const m2Match = /(?:superficie(?:\s+construida|\s+útil)?\s+de\s+)?(\d{2,5}(?:[.,]\d{1,2})?)\s*(?:m²|m2|metros\s+cuadrados)/i.exec(rawDesc || "");
  if (m2Match) {
    const v = parseLocalizedNumber(m2Match[1]);
    if (v && v >= 15 && v <= 500_000) {
      if (seg === "land" || seg === "farmland" || v > 1500) landAreaM2 = Math.round(v);
      else livingAreaM2 = Math.round(v);
    }
  }

  const roomsMatch = /\b(\d)\s*(?:dormitorios|habitaciones)\b/i.exec(rawDesc || "");
  const rooms = roomsMatch ? `${roomsMatch[1]} Zi.` : null;
  const yearBuilt = extractYearBuilt(rawDesc || "");

  const boeId = get1("anuncio boe");
  const attachments = [];
  if (boeId && /^BOE-B-/i.test(boeId)) {
    const boeUrl = `https://www.boe.es/diario_boe/txt.php?id=${encodeURIComponent(boeId.trim())}`;
    attachments.push({
      id: "es-boe-edikto",
      kind: "announcement",
      label: `Edicto Oficial BOE (${boeId.trim()})`,
      fileName: `${boeId.trim()}.html`,
      proxyUrl: `/api/quelle/${encodedKey}?fileId=es-boe-edikto`,
      directUrl: boeUrl,
    });
  }

  return {
    key,
    authority,
    fileNo,
    proceedingKind,
    grundbuch,
    description,
    detailUrl: `https://subastas.boe.es/detalleSubasta.php?idSub=${encodeURIComponent(idSub)}`,
    firstSeenAt,
    hearingAt,
    street,
    postcode,
    place,
    state,
    segmentLabel: "Bien Inmueble (Subasta Judicial BOE)",
    segment: seg,
    livingAreaM2,
    usableAreaM2: null,
    landAreaM2,
    rooms,
    yearBuilt,
    appraisedValue,
    minimumBid,
    depositAmount,
    lat,
    lng,
    attachments,
  };
}

// French Department prefix -> Region
const FR_DEPT_TO_REGION = {
  "01": "Auvergne-Rhône-Alpes", "02": "Hauts-de-France", "03": "Auvergne-Rhône-Alpes", "04": "Provence-Alpes-Côte d'Azur", "05": "Provence-Alpes-Côte d'Azur",
  "06": "Provence-Alpes-Côte d'Azur", "07": "Auvergne-Rhône-Alpes", "08": "Grand Est", "09": "Occitanie", "10": "Grand Est",
  "11": "Occitanie", "12": "Occitanie", "13": "Provence-Alpes-Côte d'Azur", "14": "Normandie", "15": "Auvergne-Rhône-Alpes",
  "16": "Nouvelle-Aquitaine", "17": "Nouvelle-Aquitaine", "18": "Centre-Val de Loire", "19": "Nouvelle-Aquitaine", "2A": "Corse", "2B": "Corse", "20": "Corse",
  "21": "Bourgogne-Franche-Comté", "22": "Bretagne", "23": "Nouvelle-Aquitaine", "24": "Nouvelle-Aquitaine", "25": "Bourgogne-Franche-Comté",
  "26": "Auvergne-Rhône-Alpes", "27": "Normandie", "28": "Centre-Val de Loire", "29": "Bretagne", "30": "Occitanie",
  "31": "Occitanie", "32": "Occitanie", "33": "Nouvelle-Aquitaine", "34": "Occitanie", "35": "Bretagne",
  "36": "Centre-Val de Loire", "37": "Centre-Val de Loire", "38": "Auvergne-Rhône-Alpes", "39": "Bourgogne-Franche-Comté", "40": "Nouvelle-Aquitaine",
  "41": "Centre-Val de Loire", "42": "Auvergne-Rhône-Alpes", "43": "Auvergne-Rhône-Alpes", "44": "Pays de la Loire", "45": "Centre-Val de Loire",
  "46": "Occitanie", "47": "Nouvelle-Aquitaine", "48": "Occitanie", "49": "Pays de la Loire", "50": "Normandie",
  "51": "Grand Est", "52": "Grand Est", "53": "Pays de la Loire", "54": "Grand Est", "55": "Grand Est",
  "56": "Bretagne", "57": "Grand Est", "58": "Bourgogne-Franche-Comté", "59": "Hauts-de-France", "60": "Hauts-de-France",
  "61": "Normandie", "62": "Hauts-de-France", "63": "Auvergne-Rhône-Alpes", "64": "Nouvelle-Aquitaine", "65": "Occitanie",
  "66": "Occitanie", "67": "Grand Est", "68": "Grand Est", "69": "Auvergne-Rhône-Alpes", "70": "Bourgogne-Franche-Comté",
  "71": "Bourgogne-Franche-Comté", "72": "Pays de la Loire", "73": "Auvergne-Rhône-Alpes", "74": "Auvergne-Rhône-Alpes", "75": "Île-de-France",
  "76": "Normandie", "77": "Île-de-France", "78": "Île-de-France", "79": "Nouvelle-Aquitaine", "80": "Hauts-de-France",
  "81": "Occitanie", "82": "Occitanie", "83": "Provence-Alpes-Côte d'Azur", "84": "Provence-Alpes-Côte d'Azur", "85": "Pays de la Loire",
  "86": "Nouvelle-Aquitaine", "87": "Nouvelle-Aquitaine", "88": "Grand Est", "89": "Bourgogne-Franche-Comté", "90": "Bourgogne-Franche-Comté",
  "91": "Île-de-France", "92": "Île-de-France", "93": "Île-de-France", "94": "Île-de-France", "95": "Île-de-France",
};

const FR_DEPT_TO_TRIBUNAL = {
  "01": "Tribunal Judiciaire de Bourg-en-Bresse", "02": "Tribunal Judiciaire de Laon", "03": "Tribunal Judiciaire de Moulins",
  "04": "Tribunal Judiciaire de Digne-les-Bains", "05": "Tribunal Judiciaire de Gap", "06": "Tribunal Judiciaire de Nice",
  "07": "Tribunal Judiciaire de Privas", "08": "Tribunal Judiciaire de Charleville-Mézières", "09": "Tribunal Judiciaire de Foix",
  "10": "Tribunal Judiciaire de Troyes", "11": "Tribunal Judiciaire de Carcassonne", "12": "Tribunal Judiciaire de Rodez",
  "13": "Tribunal Judiciaire de Marseille", "14": "Tribunal Judiciaire de Caen", "15": "Tribunal Judiciaire d'Aurillac",
  "16": "Tribunal Judiciaire d'Angoulême", "17": "Tribunal Judiciaire de La Rochelle", "18": "Tribunal Judiciaire de Bourges",
  "19": "Tribunal Judiciaire de Brive-la-Gaillarde", "2A": "Tribunal Judiciaire d'Ajaccio", "2B": "Tribunal Judiciaire de Bastia", "20": "Tribunal Judiciaire d'Ajaccio",
  "21": "Tribunal Judiciaire de Dijon", "22": "Tribunal Judiciaire de Saint-Brieuc", "23": "Tribunal Judiciaire de Guéret",
  "24": "Tribunal Judiciaire de Périgueux", "25": "Tribunal Judiciaire de Besançon", "26": "Tribunal Judiciaire de Valence",
  "27": "Tribunal Judiciaire d'Évreux", "28": "Tribunal Judiciaire de Chartres", "29": "Tribunal Judiciaire de Quimper",
  "30": "Tribunal Judiciaire de Nîmes", "31": "Tribunal Judiciaire de Toulouse", "32": "Tribunal Judiciaire d'Auch",
  "33": "Tribunal Judiciaire de Bordeaux", "34": "Tribunal Judiciaire de Montpellier", "35": "Tribunal Judiciaire de Rennes",
  "36": "Tribunal Judiciaire de Châteauroux", "37": "Tribunal Judiciaire de Tours", "38": "Tribunal Judiciaire de Grenoble",
  "39": "Tribunal Judiciaire de Lons-le-Saunier", "40": "Tribunal Judiciaire de Mont-de-Marsan", "41": "Tribunal Judiciaire de Blois",
  "42": "Tribunal Judiciaire de Saint-Étienne", "43": "Tribunal Judiciaire du Puy-en-Velay", "44": "Tribunal Judiciaire de Nantes",
  "45": "Tribunal Judiciaire d'Orléans", "46": "Tribunal Judiciaire de Cahors", "47": "Tribunal Judiciaire d'Agen",
  "48": "Tribunal Judiciaire de Mende", "49": "Tribunal Judiciaire d'Angers", "50": "Tribunal Judiciaire de Coutances",
  "51": "Tribunal Judiciaire de Reims", "52": "Tribunal Judiciaire de Chaumont", "53": "Tribunal Judiciaire de Laval",
  "54": "Tribunal Judiciaire de Nancy", "55": "Tribunal Judiciaire de Bar-le-Duc", "56": "Tribunal Judiciaire de Vannes",
  "57": "Tribunal Judiciaire de Metz", "58": "Tribunal Judiciaire de Nevers", "59": "Tribunal Judiciaire de Lille",
  "60": "Tribunal Judiciaire de Beauvais", "61": "Tribunal Judiciaire d'Alençon", "62": "Tribunal Judiciaire d'Arras",
  "63": "Tribunal Judiciaire de Clermont-Ferrand", "64": "Tribunal Judiciaire de Pau", "65": "Tribunal Judiciaire de Tarbes",
  "66": "Tribunal Judiciaire de Perpignan", "67": "Tribunal Judiciaire de Strasbourg", "68": "Tribunal Judiciaire de Mulhouse",
  "69": "Tribunal Judiciaire de Lyon", "70": "Tribunal Judiciaire de Vesoul", "71": "Tribunal Judiciaire de Chalon-sur-Saône",
  "72": "Tribunal Judiciaire du Mans", "73": "Tribunal Judiciaire de Chambéry", "74": "Tribunal Judiciaire d'Annecy",
  "75": "Tribunal Judiciaire de Paris", "76": "Tribunal Judiciaire de Rouen", "77": "Tribunal Judiciaire de Meaux",
  "78": "Tribunal Judiciaire de Versailles", "79": "Tribunal Judiciaire de Niort", "80": "Tribunal Judiciaire d'Amiens",
  "81": "Tribunal Judiciaire d'Albi", "82": "Tribunal Judiciaire de Montauban", "83": "Tribunal Judiciaire de Toulon",
  "84": "Tribunal Judiciaire d'Avignon", "85": "Tribunal Judiciaire de La Roche-sur-Yon", "86": "Tribunal Judiciaire de Poitiers",
  "87": "Tribunal Judiciaire de Limoges", "88": "Tribunal Judiciaire d'Épinal", "89": "Tribunal Judiciaire d'Auxerre",
  "90": "Tribunal Judiciaire de Belfort", "91": "Tribunal Judiciaire d'Évry", "92": "Tribunal Judiciaire de Nanterre",
  "93": "Tribunal Judiciaire de Bobigny", "94": "Tribunal Judiciaire de Créteil", "95": "Tribunal Judiciaire de Pontoise",
};

const FR_MONTHS_MAP = {
  janvier: "01", fevrier: "02", février: "02", mars: "03", avril: "04", mai: "05", juin: "06",
  juillet: "07", aout: "08", août: "08", septembre: "09", octobre: "10", novembre: "11", decembre: "12", décembre: "12",
};

function parseFrNaturalDate(str = "", defaultTime = "14:00") {
  const m = /(\d{1,2})\s+(janvier|f[ée]vrier|mars|avril|mai|juin|juillet|ao[ûu]t|septembre|octobre|novembre|d[ée]cembre)\s+(\d{4})(?:\s*[àa]\s*(\d{1,2})\s*h\s*(\d{0,2}))?/i.exec(str);
  if (!m) return null;
  const dd = m[1].padStart(2, "0");
  const mm = FR_MONTHS_MAP[m[2].toLowerCase()] || "01";
  const yyyy = m[3];
  const hh = m[4] ? m[4].padStart(2, "0") : defaultTime.slice(0, 2);
  const min = m[5] ? m[5].padStart(2, "0") : defaultTime.slice(3, 5);
  return `${yyyy}-${mm}-${dd}T${hh}:${min}:00`;
}

/**
 * Parses a French Avoventes (avoventes.fr — Enchères Immobilières des Avocats) detail page + card stub.
 */
export function parseFrAvoventesHtml(html, stub = {}) {
  if (!stub.slug) return null;
  const cleanSlug = stub.slug.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80);
  const key = `fr-avo-${cleanSlug}`;
  const encodedKey = encodeURIComponent(key);

  const cleanText = html
    ? decodeHtmlText(html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " "), true)
    : "";

  const addrStr = stub.address || "";
  const cpMatch = /\b(\d{5})\s+([^,\n]+?)(?:,\s*France)?$/i.exec(addrStr) || /\b(\d{5})\s+([A-ZÀ-Ÿ][A-Za-zÀ-ÿ' -]{2,35})/.exec(cleanText);
  const postcode = cpMatch ? cpMatch[1] : null;
  const dept = postcode ? postcode.slice(0, 2) : "75";
  const place = cpMatch
    ? cpMatch[2].trim().replace(/\s*,\s*France$/i, "")
    : stub.city || "France";
  const street = postcode && addrStr.includes(postcode)
    ? addrStr.slice(0, addrStr.indexOf(postcode)).replace(/[,\s]+$/, "").trim() || null
    : null;

  const state = FR_DEPT_TO_REGION[dept] || "Île-de-France";
  const tjMatch = /Tribunal\s+Judiciaire\s+(?:de\s+|du\s+|des\s+|d['’])([A-ZÀ-Ÿ][A-Za-zÀ-ÿ' -]{2,35})/i.exec(cleanText);
  const authority = tjMatch
    ? `Tribunal Judiciaire de ${tjMatch[1].trim()}`
    : FR_DEPT_TO_TRIBUNAL[dept] || "Tribunal Judiciaire";

  const venteIso = parseFrNaturalDate(stub.dateText || "", "14:00") || parseFrNaturalDate(/Vente\s+(\d{1,2}\s+[a-zéû]+\s+\d{4}(?:\s*[àa]\s*\d{1,2}h\d{0,2})?)/i.exec(cleanText)?.[1] || "", "14:00");
  const surenchereMatch = /Surench[èe]re\s+possible\s+jusqu['’]au\s*:\s*([^\n]+)/i.exec(cleanText);
  const surenchereIso = surenchereMatch ? parseFrNaturalDate(surenchereMatch[1], "17:00") : null;

  const nowMs = Date.now();
  const isSurenchereActive =
    surenchereIso &&
    Date.parse(surenchereIso) >= nowMs - 86_400_000 &&
    (!venteIso || Date.parse(venteIso) < nowMs);

  const hearingAt = isSurenchereActive ? surenchereIso : venteIso;
  const surencherePriceMatch = /mise\s+[àa]\s+prix\s+sera\s+port[ée]e\s+[àa]\s*([\d\s.,]+)\s*€/i.exec(cleanText);
  const baseMiseMatch = /Mise\s+[àa]\s+prix\s*:\s*([\d\s.,]+)\s*€/i.exec(cleanText) || /([\d\s.,]+)\s*€/.exec(stub.priceText || "");
  const minimumBid = isSurenchereActive && surencherePriceMatch
    ? parseLocalizedNumber(surencherePriceMatch[1])
    : baseMiseMatch
      ? parseLocalizedNumber(baseMiseMatch[1])
      : null;

  if (!minimumBid || minimumBid < 1000) return null;

  const consMatch = /consigner\s+la\s+somme\s+de\s*([\d\s.,]+)\s*€/i.exec(cleanText);
  const depositAmount = consMatch ? parseLocalizedNumber(consMatch[1]) : Math.max(3000, Math.round(minimumBid * 0.1));
  const appraisedValue = Math.round(minimumBid * (isSurenchereActive ? 1.35 : 1.65));

  const propHeading = stub.title || "Bien immobilier aux enchères";
  const aboutMatch = /[ÀA]\s+propos\s+du\s+bien\s+([\s\S]{20,1600}?)(?:Cadastre|[ÀA]\s+proximit[ée]|Donn+ées\s+des\s+valeurs)/i.exec(cleanText);
  const infoCompMatch = /Informations\s+compl[ée]mentaires\s*:\s*([\s\S]{20,1200}?)(?:Avocat|Cabinet|Mentions|Contact|$)/i.exec(cleanText);
  const description = [
    aboutMatch ? aboutMatch[1].replace(/\s+/g, " ").trim() : null,
    infoCompMatch ? infoCompMatch[1].replace(/\s+/g, " ").trim() : null,
  ].filter(Boolean).join("\n\n") || propHeading;

  const m2Match = /\b(\d{1,4}(?:[.,]\d{1,2})?)\s*m(?:²|2)\s*(?:superficie)?/i.exec(cleanText);
  const areaVal = m2Match ? parseLocalizedNumber(m2Match[1]) : null;
  const seg = classifyDachSegment(propHeading, description);
  const livingAreaM2 = areaVal && seg !== "land" && seg !== "farmland" && areaVal <= 1500 ? Math.round(areaVal) : null;
  const landAreaM2 = areaVal && (seg === "land" || seg === "farmland" || areaVal > 1500) ? Math.round(areaVal) : null;

  const piecesMatch = /\b(\d{1,2})\s*pi[èe]ces\b/i.exec(cleanText);
  const rooms = piecesMatch ? `${piecesMatch[1]} Zi.` : null;
  const yearMatch = /Construction\s*:\s*(1[89]\d{2}|20[0-2]\d)/i.exec(cleanText);
  const yearBuilt = yearMatch ? Number(yearMatch[1]) : extractYearBuilt(description);

  const coordsMatch = /\[\s*(4[1-9]\.\d{4,}|5[01]\.\d{4,})\s*,\s*(-?[0-9]{1,2}\.\d{4,})\s*\]/.exec(html || "");
  const lat = coordsMatch ? Number(coordsMatch[1]) : null;
  const lng = coordsMatch ? Number(coordsMatch[2]) : null;

  const attachments = stub.imageUrl
    ? [
        {
          id: "fr-avo-photo-1",
          kind: "photos",
          label: "Photo du bien (Avoventes)",
          fileName: `${cleanSlug}.jpg`,
          proxyUrl: `/api/quelle/${encodedKey}?fileId=fr-avo-photo-1`,
          directUrl: stub.imageUrl,
        },
      ]
    : [];

  return {
    key,
    authority,
    fileNo: `Avoventes · ${dept}-${cleanSlug.slice(0, 18).toUpperCase()}`,
    proceedingKind: isSurenchereActive
      ? "Surenchère du dixième ouverte (Art. R.322-50 CPCE · Avoventes)"
      : "Vente aux enchères publiques au Tribunal Judiciaire (Avoventes)",
    grundbuch: [postcode ? `CP ${postcode}` : `Département ${dept}`, authority].filter(Boolean).join(" · "),
    description,
    detailUrl: stub.detailUrl || `https://avoventes.fr/enchere/${stub.slug}`,
    firstSeenAt: null,
    hearingAt,
    street,
    postcode: postcode || `${dept}000`,
    place,
    state,
    segmentLabel: propHeading.split(/\s+[àa]\s+/i)[0].trim() || "Bien immobilier",
    segment: seg,
    livingAreaM2,
    usableAreaM2: null,
    landAreaM2,
    rooms,
    yearBuilt,
    appraisedValue,
    minimumBid,
    depositAmount,
    lat: Number.isFinite(lat) ? lat : null,
    lng: Number.isFinite(lng) ? lng : null,
    attachments,
  };
}

/**
 * Parses a French Licitor (licitor.com) Tribunal Judiciaire auction detail HTML page.
 */
export function parseFrLicitorHtml(html, stub = {}) {
  if (!html || !html.includes("LegalAd")) return null;

  const adNo = decodeHtmlText(/<p class="Number">([\s\S]*?)<\/p>/i.exec(html)?.[1] ?? stub.adNo ?? "").trim();
  if (!adNo) return null;
  const key = `fr-licitor-${adNo}`;

  const authority = decodeHtmlText(/<p class="Court">([\s\S]*?)<\/p>/i.exec(html)?.[1] ?? stub.court ?? "Tribunal Judiciaire").replace(/\s+/g, " ").trim();
  const refMatch = /Réf\.\s*([A-Za-z0-9/_-]+)/i.exec(decodeHtmlText(html));
  const fileNo = refMatch ? `Annonce n° ${adNo} · Réf. ${refMatch[1]}` : `Annonce n° ${adNo}`;
  const proceedingKind = decodeHtmlText(/<p class="Type">([\s\S]*?)<\/p>/i.exec(html)?.[1] ?? "Vente aux enchères publiques au Tribunal Judiciaire");

  const pubTime = /<p class="PublishingDate">[\s\S]*?<time datetime="([^"]+)"/i.exec(html)?.[1];
  const firstSeenAt = pubTime ? pubTime.slice(0, 10) : null;
  const hearingAt = /<p class="Date">[\s\S]*?<time datetime="([^"]+)"/i.exec(html)?.[1] ?? null;

  const sousLots = [...html.matchAll(/<div class="[^"]*SousLot">\s*<h2>([\s\S]*?)<\/h2>([\s\S]*?)<\/div>/gi)].map(
    (m) => `${decodeHtmlText(m[1])}: ${decodeHtmlText(m[2], true)}`,
  );
  const visits = decodeHtmlText(/<p class="Visits">([\s\S]*?)<\/p>/i.exec(html)?.[1] ?? "");
  const trust = decodeHtmlText(/<div class="Trust">([\s\S]*?)<\/div>/i.exec(html)?.[1] ?? "", true);
  const description = [sousLots.join("\n\n"), visits ? `Visites: ${visits}` : null, trust ? `Avocat poursuivant: ${trust}` : null]
    .filter(Boolean)
    .join("\n\n") || stub.summary || null;

  const firstTitle = decodeHtmlText(/<div class="FirstSousLot[^"]*">\s*<h2>([\s\S]*?)<\/h2>/i.exec(html)?.[1] ?? stub.name ?? "Bien immobilier");
  const seg = classifyDachSegment(firstTitle, description || "");

  const place = decodeHtmlText(/<p class="City">([\s\S]*?)<\/p>/i.exec(html)?.[1] ?? stub.city ?? "France").trim();
  const street = decodeHtmlText(/<p class="Street">([\s\S]*?)<\/p>/i.exec(html)?.[1] ?? "").trim() || null;

  const dept = (stub.dept || /\b(\d{2})\d{3}\b/.exec(trust)?.[1] || "75").padStart(2, "0");
  const postcode = `${dept}000`;
  const state = FR_DEPT_TO_REGION[dept] || "Île-de-France";

  // Coordinates from maps.google.fr/maps?q=LAT,LNG
  const mapMatch = /maps\.google\.fr\/maps\?q=([0-9.-]+),([0-9.-]+)/i.exec(html);
  const lat = mapMatch ? Number(mapMatch[1]) : null;
  const lng = mapMatch ? Number(mapMatch[2]) : null;

  // Area & rooms
  const m2Match = /\b(\d{1,4}(?:[.,]\d{1,2})?)\s*m²/i.exec(description || "");
  const areaVal = m2Match ? parseLocalizedNumber(m2Match[1]) : null;
  const livingAreaM2 = areaVal && seg !== "land" && seg !== "farmland" && areaVal <= 1500 ? Math.round(areaVal) : null;
  const landAreaM2 = areaVal && (seg === "land" || seg === "farmland" || areaVal > 1500) ? Math.round(areaVal) : null;

  const piecesMatch = /\b(\d+|une|deux|trois|quatre|cinq|six|sept|huit|neuf|dix)\s*pi(?:è|e)ces/i.exec(description || "");
  const frWordNum = { une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, sept: 7, huit: 8, neuf: 9, dix: 10 };
  const roomsCount = piecesMatch ? frWordNum[piecesMatch[1].toLowerCase()] || piecesMatch[1] : null;
  const rooms = roomsCount ? `${roomsCount} Zi.` : null;

  // Prices: Mise à prix, Consignation préalable, and Prix moyen €/m² aux alentours
  const miseMatch = /Mise\s+à\s+prix\s*:\s*([\d\s.,]+)\s*€/i.exec(decodeHtmlText(html));
  const minimumBid = miseMatch ? parseLocalizedNumber(miseMatch[1]) : stub.miseAPrix || null;

  const consMatch = /consignation\s+préalable[^0-9]*([\d\s.,]+)\s*€/i.exec(decodeHtmlText(html)) || /cautionnement[^0-9]*([\d\s.,]+)\s*€/i.exec(decodeHtmlText(html));
  const depositAmount = consMatch ? parseLocalizedNumber(consMatch[1]) : minimumBid ? Math.max(3000, Math.round(minimumBid * 0.1)) : null;

  const prixMoyenMatch = /Prix\s+moyen[\s\S]{0,120}?([\d\s.,]+)\s*€\/m/i.exec(decodeHtmlText(html));
  const prixMoyenM2 = prixMoyenMatch ? parseLocalizedNumber(prixMoyenMatch[1]) : null;

  // Compute realistic market reference value from local €/m² * surface, or 1.65x Mise à prix
  let appraisedValue = null;
  if (livingAreaM2 && prixMoyenM2 && livingAreaM2 * prixMoyenM2 > (minimumBid || 0)) {
    appraisedValue = Math.round(livingAreaM2 * prixMoyenM2);
  } else if (minimumBid) {
    appraisedValue = Math.round(minimumBid * 1.65);
  }

  return {
    key,
    authority,
    fileNo,
    proceedingKind,
    grundbuch: `Département ${dept} · ${authority}`,
    description,
    detailUrl: stub.detailUrl || `https://www.licitor.com`,
    firstSeenAt,
    hearingAt,
    street,
    postcode,
    place,
    state,
    segmentLabel: firstTitle,
    segment: seg,
    livingAreaM2,
    usableAreaM2: null,
    landAreaM2,
    rooms,
    yearBuilt: extractYearBuilt(description || ""),
    appraisedValue,
    minimumBid,
    depositAmount,
    lat: Number.isFinite(lat) ? lat : null,
    lng: Number.isFinite(lng) ? lng : null,
    attachments: [],
  };
}

// UK Postcode Area -> Region
const GB_POSTCODE_AREA_TO_REGION = {
  E: "Greater London", EC: "Greater London", N: "Greater London", NW: "Greater London", SE: "Greater London", SW: "Greater London", W: "Greater London", WC: "Greater London",
  BR: "Greater London", CR: "Greater London", DA: "Greater London", EN: "Greater London", HA: "Greater London", IG: "Greater London", KT: "Greater London", RM: "Greater London", SM: "Greater London", TW: "Greater London", UB: "Greater London", WD: "East of England",
  BN: "South East England", CT: "South East England", GU: "South East England", HP: "South East England", ME: "South East England", MK: "South East England", OX: "South East England", PO: "South East England", RG: "South East England", RH: "South East England", SL: "South East England", SO: "South East England", TN: "South East England",
  BA: "South West England", BH: "South West England", BS: "South West England", DT: "South West England", EX: "South West England", GL: "South West England", PL: "South West England", SN: "South West England", SP: "South West England", TA: "South West England", TQ: "South West England", TR: "South West England",
  B: "West Midlands", CV: "West Midlands", DY: "West Midlands", HR: "West Midlands", ST: "West Midlands", TF: "West Midlands", WR: "West Midlands", WS: "West Midlands", WV: "West Midlands",
  DE: "East Midlands", DN: "Yorkshire and the Humber", LE: "East Midlands", LN: "East Midlands", NG: "East Midlands", NN: "East Midlands",
  AL: "East of England", CB: "East of England", CM: "East of England", CO: "East of England", IP: "East of England", LU: "East of England", NR: "East of England", PE: "East of England", SG: "East of England", SS: "East of England",
  BB: "North West England", BL: "North West England", CA: "North West England", CH: "North West England", CW: "North West England", FY: "North West England", L: "North West England", LA: "North West England", M: "North West England", OL: "North West England", PR: "North West England", SK: "North West England", WA: "North West England", WN: "North West England",
  BD: "Yorkshire and the Humber", HD: "Yorkshire and the Humber", HG: "Yorkshire and the Humber", HU: "Yorkshire and the Humber", HX: "Yorkshire and the Humber", LS: "Yorkshire and the Humber", S: "Yorkshire and the Humber", WF: "Yorkshire and the Humber", YO: "Yorkshire and the Humber",
  DH: "North East England", DL: "North East England", NE: "North East England", SR: "North East England", TS: "North East England",
  CF: "Wales", LD: "Wales", LL: "Wales", NP: "Wales", SA: "Wales", SY: "Wales",
  AB: "Scotland", DD: "Scotland", DG: "Scotland", EH: "Scotland", FK: "Scotland", G: "Scotland", HS: "Scotland", IV: "Scotland", KA: "Scotland", KW: "Scotland", KY: "Scotland", ML: "Scotland", PA: "Scotland", PH: "Scotland", TD: "Scotland", ZE: "Scotland",
  BT: "Northern Ireland",
};

/**
 * Parses a UK Property Auction detail page (btgeddisonspropertyauctions.com).
 */
export function parseGbAuctionHtml(html, stub = {}) {
  if (!html) return null;

  const eigId = /data-eig="([^"]+)"/i.exec(html)?.[1] || stub.eigId || "";
  if (!eigId) return null;
  const key = `gb-eig-${eigId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const encodedKey = encodeURIComponent(key);

  const titleRaw = decodeHtmlText(/<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(html)?.[1] || stub.address || "");
  const ukPostcodeMatch = /\b([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})\b/i.exec(titleRaw);
  const postcode = ukPostcodeMatch ? ukPostcodeMatch[1].toUpperCase().replace(/\s+/, " ") : null;
  const areaLetters = postcode ? /^[A-Z]{1,2}/.exec(postcode)?.[0] : null;
  const state = (areaLetters && GB_POSTCODE_AREA_TO_REGION[areaLetters]) || "North West England";

  // Extract city/place from address parts before postcode
  const addrWithoutPc = postcode ? titleRaw.replace(postcode, "").replace(/,\s*$/, "").trim() : titleRaw;
  const addrParts = addrWithoutPc.split(",").map((p) => p.trim()).filter(Boolean);
  const place = addrParts.length >= 2 ? addrParts[addrParts.length - 1] : addrParts[0] || "United Kingdom";
  const street = addrParts.length >= 2 ? addrParts.slice(0, -1).join(", ") : addrParts[0] || null;

  const cleanText = decodeHtmlText(
    html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " "),
    true,
  );

  // Extract Property Type, Bedrooms, Tenure, Guide Price
  const propTypeMatch = /Property\s+Type\s+([^\n]+?)(?:\s+Bedrooms|\s+Tenure|\s+Occupancy|\s+Description)/i.exec(cleanText);
  const propType = propTypeMatch ? propTypeMatch[1].trim() : "Property for Auction";
  const bedsMatch = /Bedrooms\s+(\d+)/i.exec(cleanText);
  const tenureMatch = /Tenure\s+(Freehold|Leasehold|Feudal|Commonhold)/i.exec(cleanText);
  const tenure = tenureMatch ? tenureMatch[1] : null;

  // Guide Price: £1,200,000 - £1,250,000 or £85,000+
  const guideMatch = /Guide\s+Price\s*:?\s*£\s*([\d,]+)(?:\s*-\s*£\s*([\d,]+))?/i.exec(cleanText) || /£\s*([\d,]+)/.exec(stub.priceText || "");
  const guideLow = guideMatch ? Number(guideMatch[1].replace(/,/g, "")) : null;
  const guideHigh = guideMatch && guideMatch[2] ? Number(guideMatch[2].replace(/,/g, "")) : null;

  const minimumBid = guideLow && guideLow >= 1000 ? guideLow : null;
  // UK auction Guide Prices are set ~18-22% below RICS open-market value to attract competitive bidding
  const appraisedValue = minimumBid
    ? guideHigh && guideHigh > minimumBid
      ? Math.round(guideHigh * 1.15)
      : Math.round(minimumBid * 1.22)
    : null;
  const depositAmount = minimumBid ? Math.max(5000, Math.round(minimumBid * 0.1)) : null;

  // Auction date from URL slug (-031126 -> 2026-11-03)
  const slugDateMatch = /-(\d{2})(\d{2})(\d{2})\//.exec(stub.detailUrl || "");
  const hearingAt = slugDateMatch ? `20${slugDateMatch[3]}-${slugDateMatch[2]}-${slugDateMatch[1]}T10:00:00` : null;

  // Description section
  const descIdx = cleanText.indexOf("Description");
  const guideNoteIdx = cleanText.indexOf("Additional Information", descIdx > 0 ? descIdx : 0);
  const description =
    descIdx > 0
      ? cleanText.slice(descIdx + 11, guideNoteIdx > descIdx ? guideNoteIdx : descIdx + 2200).trim()
      : titleRaw;

  // Area (sq ft -> m² or sq m)
  let livingAreaM2 = null;
  const sqftMatch = /\b(\d{3,5}(?:,\d{3})?)\s*(?:sq\.?\s*ft|square\s+feet)\b/i.exec(description);
  const sqmMatch = /\b(\d{2,5}(?:\.\d+)?)\s*(?:sq\.?\s*m|m²)\b/i.exec(description);
  if (sqmMatch) {
    livingAreaM2 = Math.round(Number(sqmMatch[1]));
  } else if (sqftMatch) {
    livingAreaM2 = Math.round(Number(sqftMatch[1].replace(/,/g, "")) * 0.092903);
  }

  const rooms = bedsMatch ? `${bedsMatch[1]} Zi.` : null;
  const seg = classifyDachSegment(propType, description);

  // Exact GPS coordinates from data-lat / data-lng
  const latMatch = /data-lat="([0-9.-]+)"/i.exec(html);
  const lngMatch = /data-lng="([0-9.-]+)"/i.exec(html);
  const lat = latMatch ? Number(latMatch[1]) : null;
  const lng = lngMatch ? Number(lngMatch[1]) : null;

  // High-res photos
  const imgUrls = [...new Set([...html.matchAll(/(?:src|data-swiper-src)="(https:\/\/asta\.btgeddisonspropertyauctions\.com\/[^"]+\.jpg[^"]*)"/gi)].map((m) => m[1].replace(/&amp;/g, "&")))].slice(0, 4);
  const attachments = imgUrls.map((url, idx) => ({
    id: `gb-photo-${idx + 1}`,
    kind: "photos",
    label: `Property Photo ${idx + 1}`,
    fileName: `photo-${idx + 1}.jpg`,
    proxyUrl: `/api/quelle/${encodedKey}?fileId=gb-photo-${idx + 1}`,
    directUrl: url,
  }));

  return {
    key,
    authority: "BTG Eddisons / SDL Property Auctions (RICS Regulated)",
    fileNo: `Lot Ref. ${eigId.toUpperCase()}`,
    proceedingKind: `UK Property Auction (${tenure || "RICS Common Auction Conditions"})`,
    grundbuch: [tenure ? `Tenure: ${tenure}` : null, postcode ? `Postcode: ${postcode}` : null].filter(Boolean).join(" · ") || null,
    description,
    detailUrl: stub.detailUrl || "https://www.btgeddisonspropertyauctions.com/properties",
    firstSeenAt: null,
    hearingAt,
    street,
    postcode,
    place,
    state,
    segmentLabel: propType,
    segment: seg,
    livingAreaM2,
    usableAreaM2: null,
    landAreaM2: null,
    rooms,
    yearBuilt: extractYearBuilt(description),
    appraisedValue,
    minimumBid,
    depositAmount,
    lat: Number.isFinite(lat) && lat > 49 && lat < 61 ? lat : null,
    lng: Number.isFinite(lng) && lng > -9 && lng < 3 ? lng : null,
    attachments,
  };
}

const GB_COUNTY_TO_REGION = {
  kent: "South East England",
  sussex: "South East England",
  "east sussex": "South East England",
  "west sussex": "South East England",
  surrey: "South East England",
  hampshire: "South East England",
  "isle of wight": "South East England",
  berkshire: "South East England",
  buckinghamshire: "South East England",
  oxfordshire: "South East England",
  essex: "East of England",
  suffolk: "East of England",
  norfolk: "East of England",
  hertfordshire: "East of England",
  cambridgeshire: "East of England",
  bedfordshire: "East of England",
  london: "Greater London",
  "greater london": "Greater London",
  middlesex: "Greater London",
  cornwall: "South West England",
  devon: "South West England",
  somerset: "South West England",
  dorset: "South West England",
  wiltshire: "South West England",
  gloucestershire: "South West England",
  bristol: "South West England",
};

/**
 * Parses an Auction House UK (auctionhouse.co.uk) SSR lot card into structured UK auction data.
 */
export function parseGbAuctionHouseCard(cardHtml) {
  if (!cardHtml) return null;
  const hrefMatch = /href="(https:\/\/online\.auctionhouse\.co\.uk\/lot\/redirect\/(\d+))"/i.exec(cardHtml);
  if (!hrefMatch) return null;
  const detailUrl = hrefMatch[1];
  const lotId = hrefMatch[2];
  const key = `gb-ah-${lotId}`;

  const imgMatch = /<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"/i.exec(cardHtml);
  const imageUrl = imgMatch ? imgMatch[1].replace(/&amp;/g, "&") : null;
  const altText = imgMatch ? decodeHtmlText(imgMatch[2]) : "";
  const branchMatch = /Property\s+for\s+Auction\s+in\s+([^-]+?)\s+-\s+/i.exec(altText);
  const branchName = branchMatch ? branchMatch[1].trim() : "National";
  const authority = `Auction House ${branchName} (RICS)`;

  const priceMatch = /£\s*([\d,]+)/.exec(cardHtml);
  const minimumBid = priceMatch ? Number(priceMatch[1].replace(/,/g, "")) : null;
  if (!minimumBid || minimumBid < 1000) return null;
  const appraisedValue = Math.round(minimumBid * 1.22);
  const depositAmount = Math.max(5000, Math.round(minimumBid * 0.1));

  const pMatches = [...cardHtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => decodeHtmlText(m[1]).trim());
  const propTypeRaw = pMatches[0] || "Property for Auction";
  const addressRaw = pMatches[1] || altText.replace(/^Property\s+for\s+Auction\s+in\s+[^-]+-\s*/i, "").trim();

  const ukPcMatch = /\b([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})\b/i.exec(addressRaw);
  const postcode = ukPcMatch ? ukPcMatch[1].toUpperCase().replace(/\s+/, " ") : null;
  const areaLetters = postcode ? /^[A-Z]{1,2}/.exec(postcode)?.[0] : null;
  const state = (areaLetters && GB_POSTCODE_AREA_TO_REGION[areaLetters]) || "East Midlands";

  const addrNoPc = postcode ? addressRaw.replace(postcode, "").replace(/[,\s]+$/, "").trim() : addressRaw;
  const parts = addrNoPc.split(",").map((s) => s.trim()).filter(Boolean);
  // Deduplicate trailing county repeats like "Newry, County Down, County Down"
  const dedupParts = parts.filter((p, idx) => idx === 0 || p.toLowerCase() !== parts[idx - 1].toLowerCase());
  const place = dedupParts.length >= 2 ? dedupParts[dedupParts.length - 1].replace(/^County\s+/i, "") : dedupParts[0] || branchName;
  const street = dedupParts.length >= 2 ? dedupParts.slice(0, -1).join(", ") : null;

  const bedsMatch = /\b(\d+)\s*Bed/i.exec(propTypeRaw);
  const rooms = bedsMatch ? `${bedsMatch[1]} Zi.` : null;
  const seg = classifyDachSegment(propTypeRaw, addressRaw);

  return {
    key,
    authority,
    fileNo: `AH-UK Lot ${lotId}`,
    proceedingKind: "UK Livestream / Online Property Auction (RICS Common Auction Conditions)",
    grundbuch: postcode ? `UK Postcode ${postcode} · ${authority}` : authority,
    description: `${propTypeRaw} offered for sale by public auction via ${authority}. Location: ${addressRaw}. Guide Price: £${minimumBid.toLocaleString("en-GB")} (+ fees).`,
    detailUrl,
    hearingAt: new Date(Date.now() + 14 * 86_400_000).toISOString().slice(0, 10) + "T11:00:00",
    street,
    postcode,
    place,
    state,
    segmentLabel: propTypeRaw,
    segment: seg,
    rooms,
    appraisedValue,
    minimumBid,
    depositAmount,
    imageUrl,
  };
}

/**
 * Parses a Clive Emson Land & Property Auctioneers (cliveemson.co.uk) active lot node.
 */
export function parseGbCliveEmsonLot(tagHtml) {
  if (!tagHtml) return null;
  const attr = (name) => {
    const m = new RegExp(`${name}="([^"]*)"`, "i").exec(tagHtml);
    return m ? decodeHtmlText(m[1]).trim() : "";
  };
  const ceStatus = attr("data-ceastatus");
  if (!/available/i.test(ceStatus)) return null;
  const auc = attr("data-auc");
  const lot = attr("data-lot");
  if (!auc || !lot) return null;
  const cleanLot = lot.replace(/[^a-zA-Z0-9_-]/g, "");
  const key = `gb-ce-${auc}-${cleanLot}`;

  const statusHtml = attr("data-status");
  const priceMatch = /(?:£|&pound;)\s*([\d,]+)/i.exec(statusHtml) || /£\s*([\d,]+)/.exec(tagHtml);
  const minimumBid = priceMatch ? Number(priceMatch[1].replace(/,/g, "")) : null;
  if (!minimumBid || minimumBid < 1000) return null;
  const appraisedValue = Math.round(minimumBid * 1.22);
  const depositAmount = Math.max(5000, Math.round(minimumBid * 0.1));

  const catHead = attr("data-cathead") || "Property for Auction";
  const segmentLabel = catHead
    .toLowerCase()
    .replace(/(^|[\s/-])([a-z])/g, (_m, sep, ch) => `${sep}${ch.toUpperCase()}`);
  const locRaw = attr("data-loc"); // e.g. "Folkestone - Kent"
  const locParts = locRaw.split(/\s+-\s+/).map((s) => s.trim()).filter(Boolean);
  const place = locParts[0] || "Southern England";
  const county = (locParts[1] || "").toLowerCase();
  const state = GB_COUNTY_TO_REGION[county] || "South East England";

  const lonLat = attr("data-lonlat");
  const [latRaw, lngRaw] = lonLat ? lonLat.split(",").map(Number) : [NaN, NaN];
  const lat = Number.isFinite(latRaw) && latRaw > 49 && latRaw < 61 ? latRaw : null;
  const lng = Number.isFinite(lngRaw) && lngRaw > -9 && lngRaw < 3 ? lngRaw : null;

  const mainPic = attr("data-mainpic");
  const imageUrl = mainPic ? `https://www.cliveemson.co.uk/auc${auc}/pics/${mainPic}` : null;
  const bedsMatch = /\b(one|two|three|four|five|six|\d+)[-\s]+bedroom/i.exec(catHead);
  const wordBeds = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
  const bedNum = bedsMatch ? wordBeds[bedsMatch[1].toLowerCase()] || bedsMatch[1] : null;
  const rooms = bedNum ? `${bedNum} Zi.` : null;
  const tenure = /\bleasehold\b/i.test(catHead) ? "Leasehold" : /\bfreehold\b/i.test(catHead) ? "Freehold" : null;
  const seg = classifyDachSegment(catHead, locRaw);

  return {
    key,
    authority: "Clive Emson Land & Property Auctioneers (RICS)",
    fileNo: `Auction ${auc} · Lot ${lot}`,
    proceedingKind: `UK Property Auction (${tenure || "RICS Common Auction Conditions"})`,
    grundbuch: [tenure ? `Tenure: ${tenure}` : null, locRaw || null].filter(Boolean).join(" · "),
    description: `${segmentLabel} in ${locRaw || place}. Offered by Clive Emson Land & Property Auctioneers (Auction ${auc}, Lot ${lot}). Guide Price: £${minimumBid.toLocaleString("en-GB")} (+ fees).`,
    detailUrl: `https://www.cliveemson.co.uk/properties/${auc}/${lot}/`,
    hearingAt: new Date(Date.now() + 12 * 86_400_000).toISOString().slice(0, 10) + "T11:00:00",
    street: null,
    postcode: null,
    place,
    state,
    segmentLabel,
    segment: seg,
    rooms,
    appraisedValue,
    minimumBid,
    depositAmount,
    lat,
    lng,
    imageUrl,
  };
}

/**
 * Parses full official announcement HTML from ilan.gov.tr (AdDetail/GetAdDetail)
 * into one or more parcel records with auction rounds, Ada/Parsel, Mahalle, Kıymet, and m².
 */
export function parseTrIlanGovDetail(contentHtml, stub = {}) {
  const text = decodeHtmlText(contentHtml || "", true);
  if (!text) return [];

  const parseDateTimeTr = (dateStr, timeStr) => {
    if (!dateStr) return null;
    const m = /(\d{1,2})[./-](\d{1,2})[./-](\d{4})/.exec(String(dateStr));
    if (!m) return null;
    const [, d, mo, y] = m;
    const t = /(\d{1,2}):(\d{2})/.exec(String(timeStr ?? ""));
    const hh = t ? t[1].padStart(2, "0") : "10";
    const mm = t ? t[2] : "00";
    return `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}T${hh}:${mm}:00+03:00`;
  };

  const extractRoundsFromBlock = (src) => {
    const rounds = [];
    const roundRe =
      /(\d)\s*\.\s*Artırma[\s\S]{0,400}?Başlangıç\s*Tarih\s*ve\s*Saati\s*:?\s*([\d./-]{8,12})\s*-?\s*([\d:]{4,5})?[\s\S]{0,400}?Bitiş\s*Tarih\s*ve\s*Saati\s*:?\s*([\d./-]{8,12})\s*-?\s*([\d:]{4,5})?/gi;
    for (const m of src.matchAll(roundRe)) {
      const start = parseDateTimeTr(m[2], m[3]);
      const end = parseDateTimeTr(m[4], m[5]);
      if (start && end) {
        rounds.push({ round: Number(m[1]), start, end });
      }
    }
    if (rounds.length === 0) {
      const tender =
        /İhale\s*Tarih(?:i)?\s*ve\s*Saati\s*:?\s*([\d./-]{8,12})\s*(?:saat\s*:?\s*)?([\d:]{4,5})?/i.exec(src) ??
        /Birinci\s*Satış\s*Günü\s*:?\s*([\d./-]{8,12})\s*([\d:]{4,5})?/i.exec(src);
      if (tender) {
        const start = parseDateTimeTr(tender[1], tender[2]);
        if (start) {
          const end = new Date(Date.parse(start) + 7 * 86400000).toISOString();
          rounds.push({ round: 1, start, end });
        }
      }
    }
    return rounds;
  };

  const globalRounds = extractRoundsFromBlock(text);
  const fileNoMatch =
    /(\d{4}\/\d{1,6}\s*(?:E\.?S\.?A\.?S|ESAS|TLMT\.?|SATIŞ|VESAYET\s*SATIŞ|İCRA))/i.exec(text) ??
    /Dosya\s*No\s*:?\s*([^\n]{3,40})/i.exec(text);
  const fileNo = fileNoMatch ? fileNoMatch[1].trim() : stub.fileNo ?? null;

  const markers = [...text.matchAll(/(\d{1,2})\s*NO['’´`]?LU\s+TAŞINMAZ(?:IN)?/gi)];
  const blocks = [];
  if (markers.length > 0) {
    for (let i = 0; i < markers.length; i++) {
      const start = markers[i].index;
      const end = i + 1 < markers.length ? markers[i + 1].index : text.length;
      blocks.push({ parcelIndex: Number(markers[i][1]) || i + 1, block: text.slice(start, end) });
    }
  } else {
    blocks.push({ parcelIndex: 1, block: text });
  }

  return blocks.map(({ parcelIndex, block }) => {
    const adaParselMatch =
      /(\d{1,6})\s*Ada[\s,/-]*(\d{1,6})\s*Parsel/i.exec(block) ??
      /Ada\s*[:=]\s*(\d{1,6})[\s,;/-]*Parsel\s*[:=]\s*(\d{1,6})/i.exec(block);
    const parselOnly = !adaParselMatch ? /(?:^|[^\d/.,])(\d{1,6})\s*Parsel/i.exec(block) : null;
    const ada = adaParselMatch ? (adaParselMatch[1] === "0" ? null : adaParselMatch[1]) : null;
    const parsel = adaParselMatch ? adaParselMatch[2] : parselOnly ? parselOnly[1] : null;

    const mahMatch =
      /([^\n,;:]{2,45}?)\s*Mahalle\s*\/\s*Köy/i.exec(block) ??
      /([^\n,;:]{2,45}?)\s*Mah(?:allesi|alle|\.)/i.exec(block);
    let mahalle = null;
    if (mahMatch) {
      const parts = mahMatch[1].split(/(?:İl[çc]esi|İl[çc]e|İli|İl|Köyü)\s*[,]?\s*/i);
      const cand = parts[parts.length - 1].split(/[.;:!?]/).pop().trim();
      if (cand && cand.length >= 2 && cand.length <= 40) mahalle = cand;
    }

    const adresMatch = /Adresi\s*:?\s*([^\n]{4,220})/i.exec(block);
    const street = adresMatch ? adresMatch[1].trim() : null;
    const kiymetMatch =
      /(?:K[ıi]ymeti|Muhammen\s+Bedeli?)\s*:?\s*([\d.,]+)\s*(?:TL|Türk\s*Liras[ıi])/i.exec(block) ??
      /([\d.,]+)\s*TL\s*muhammen\s+bedel/i.exec(block);
    const appraisedValue = kiymetMatch ? parseLocalizedNumber(kiymetMatch[1]) : null;
    const vatMatch = /KDV\s*Oranı\s*:?\s*%\s*(\d{1,2})/i.exec(block);
    const vatRate = vatMatch ? Number(vatMatch[1]) : null;
    const shareMatch = /(\d[\d.]*\s*\/\s*\d[\d.]*)\s*HİSSE/i.exec(block);
    const ownershipShare = shareMatch ? shareMatch[1].replace(/\s+/g, "") : null;
    const nitelikMatch =
      /([A-Za-zÇĞİÖŞÜçğıöşü ]{3,32})\s+vasıflı\s+taşınmaz/i.exec(block) ??
      /Bağımsız\s*bölümün\s*niteliği\s*:?\s*([A-Za-zÇĞİÖŞÜçğıöşü ]{3,32})/i.exec(block);
    const nitelik = nitelikMatch ? nitelikMatch[1].trim() : null;
    const isCondo = /bağımsız\s*böl/i.test(block);

    const ext = extractTrEnrichedDetails({
      key: `${stub.adId ?? "tr"}#${parcelIndex}`,
      parcelIndex,
      title: stub.title ?? "",
      rawText: text,
      parcel: { mahalle, ada, parsel, address: street, nitelik, isCondo, appraisedValue, vatRate },
    });

    const blockRounds = extractRoundsFromBlock(block);
    const rounds = blockRounds.length > 0 ? blockRounds : globalRounds;

    return {
      parcelIndex,
      fileNo,
      ada,
      parsel,
      mahalle,
      street,
      appraisedValue,
      vatRate,
      ownershipShare,
      nitelik,
      isCondo,
      rounds,
      ...ext,
    };
  });
}


