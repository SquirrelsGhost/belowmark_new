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
  const s = String(raw).trim().replace(/\s+/g, "");
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
