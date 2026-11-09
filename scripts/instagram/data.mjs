// ---------------------------------------------------------------------------
// Daten & Viral-Deal-Scorer für die Instagram-Pipeline (DE & TR):
//  1. Strikte Ländertrennung (kein AT/CH/UK/IT/ES/FR in deutschen ZVG-Posts!)
//  2. Harter Ausschluss von Miteigentumsanteilen, Erbbaurechten & „Sonstiges“
//  3. Viral-Deal-Scoring: bevorzugt Top-Metropolen/Speckgürtel, realistische
//     Käuferbudgets (80k–850k €), vollständige Flächendaten & Gutachten-Details
//  4. Fakten-Extraktor für das 5-Slide-Karussell & 9:16 Video-Reel
// ---------------------------------------------------------------------------

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const DAY = 24 * 60 * 60 * 1000;

/** Objektarten, die als „Objekt des Tages“ taugen (keine Stellplätze, keine Anteile). */
const OBJECT_SEGMENTS = ["house", "apartment", "multiFamily"];

/** Gefragte deutsche A- und B-Städte + starke Speckgürtel für maximale Scroll-Stop-Relevanz */
const TOP_DE_CITIES =
  /\b(berlin|münchen|muenchen|hamburg|frankfurt|köln|koeln|düsseldorf|duesseldorf|stuttgart|leipzig|dresden|nürnberg|nuernberg|hannover|bonn|münster|muenster|freiburg|potsdam|augsburg|wiesbaden|mainz|mannheim|karlsruhe|heidelberg|darmstadt|regensburg|ingolstadt|ulm|konstanz|lübeck|luebeck|kiel|rostock|erfurt|aachen|bielefeld|essen|dortmund|bochum|wuppertal|starnberg|dachau|freising|ebersberg|fürstenfeldbruck|fuerstenfeldbruck|offenbach|bad homburg|kronberg|königstein|ludwigsburg|böblingen|boeblingen|esslingen|heilbronn|leverkusen|bergisch gladbach|ratingen|meerbusch|neuss)\b/i;

/** Gefragte türkische Metropolen & Küstenmärkte */
const TOP_TR_REGIONS =
  /\b(istanbul|i̇stanbul|ankara|izmir|i̇zmir|antalya|muğla|mugla|bursa|aydın|aydin|balıkesir|balikesir|kocaeli|eskişehir|eskisehir|mersin|adana|çanakkale|canakkale|sakarya)\b/i;

export function loadSnapshot(root, market) {
  const file = resolve(root, "data", "snapshots", `${market.toLowerCase()}.json`);
  return JSON.parse(readFileSync(file, "utf8"));
}

/** Einfacher, stabiler Hash — gleicher Tag ergibt reproduzierbar dasselbe Top-Objekt. */
function hash(text) {
  let h = 2166136261;
  for (const c of text) h = Math.imul(h ^ c.codePointAt(0), 16777619);
  return h >>> 0;
}

/** Prüft strikt, ob ein Eintrag im europäischen Snapshot wirklich zu Deutschland (ZVG) gehört. */
export function isGermanListing(l) {
  if (!l) return false;
  if (l.country && l.country !== "DE") return false;
  const rc = String(l.regionCode || "").toLowerCase();
  if (/^(at|ch|it|es|fr|gb)-/.test(rc)) return false;
  const key = String(l.key || "").toLowerCase();
  if (/^(edikte|shab|it-aste|es-boe|fr-licitor|gb-eig)-/.test(key)) return false;
  const reg = String(l.region || "");
  if (/\((AT|CH|IT|ES|FR|UK|GB)\)\s*$/i.test(reg)) return false;
  if (/^BG\s+/i.test(String(l.authority || ""))) return false;
  return true;
}

/** Nächste Bieterrunde, die nach `day` beginnt (DE: der Termin, TR: 1. oder 2. Artırma). */
export function nextRound(listing, day) {
  return (listing.rounds || []).find((r) => Date.parse(r.start) >= day.getTime()) ?? null;
}

/** Erkennt Miteigentumsanteile, Bruchteile, Erbbaurechte oder unbrauchbare Sammelbezeichnungen. */
export function isShare(listing) {
  if (listing.tr?.ownershipShare) return true;
  const textBlob = [
    listing.title || "",
    listing.segmentLabel || "",
    listing.proceedingKind || "",
    ...(listing.caveats || []).map((c) => `${c.short || ""} ${c.detail || ""}`),
  ].join(" ");
  if (/\b(hisse|miteigentumsanteil|ideeller?\s+\d|bruchteil|erbbaurecht|teilfläche|wohnungs-?\s*und\s*teileigentumsanteil|\d+\/\d+\s*-?\s*anteil)\b/i.test(textBlob)) {
    return true;
  }
  const descHead = String(listing.description || "").slice(0, 220);
  if (/\b(ideeller?\s+\d+\/\d+|miteigentumsanteil\s+von\s+1\/[2-9]|erbbaurecht)\b/i.test(descHead)) {
    return true;
  }
  return false;
}

function hasBadLabel(listing) {
  const lbl = String(listing.segmentLabel || "").trim();
  if (!lbl) return true;
  if (/^(sonstige|sonstiges|unbekannt|verkehrswert|objekt)\b/i.test(lbl)) return true;
  if (/garage|stellplatz|carport|erbbaurecht|acker|wald|gartenland|unbebaut|verkehrsfläche|gewerbefläche|lagerhalle|ruine|abriss/i.test(lbl)) {
    return true;
  }
  return false;
}

function deCandidate(l, day) {
  if (l.cancelled || !isGermanListing(l)) return false;
  if (!OBJECT_SEGMENTS.includes(l.segment) || hasBadLabel(l) || isShare(l)) return false;
  if (!l.appraisedValue || l.appraisedValue < 65_000 || l.appraisedValue > 1_800_000) return false;
  if (!l.place || !l.postcode) return false;
  if (!(l.livingAreaM2 || l.usableAreaM2)) return false;
  // Mehrere Objekte in einem Aushang haben keinen sauberen Einzelverkehrswert
  if ((l.caveats || []).some((c) => /Einzelverkehrswert|mehrere/i.test(c.short || ""))) return false;
  const start = Date.parse(l.hearingAt ?? "");
  return start >= day.getTime() + 3 * DAY && start <= day.getTime() + 40 * DAY;
}

function trCandidate(l, day) {
  if (l.cancelled || !OBJECT_SEGMENTS.includes(l.segment) || isShare(l)) return false;
  if (!l.appraisedValue || !l.tr?.startingBid || !l.place || !l.region) return false;
  if (!(l.tr?.buildingAreaM2 || l.tr?.netAreaM2)) return false;
  if (l.tr.adType !== "İCRA") return false;
  const round = nextRound(l, day);
  if (!round) return false;
  const start = Date.parse(round.start);
  return start >= day.getTime() + 2 * DAY && start <= day.getTime() + 30 * DAY;
}

/**
 * Bewertet jedes Kandidaten-Objekt nach echtem Instagram-Scroll-Stop-Potenzial (0–120 Punkte):
 *  - Bekannte Stadt / starkes Bundesland
 *  - Greifbarer Einstiegspreis (5/10-Grenze zwischen 60k und 425k €)
 *  - Vollständige Eckdaten (Wohnfläche + Grundstück + Zimmer + Baujahr + Geo-Koordinaten)
 *  - Spannender m²-Einstiegspreis oder entfallene Wertgrenzen
 */
export function scoreListing(l, market) {
  let score = 0;

  if (market === "DE") {
    const placeAndRegion = `${l.place || ""} ${l.region || ""}`;
    if (TOP_DE_CITIES.test(placeAndRegion)) score += 42;
    else if (/\b(bayern|baden-württemberg|hessen|nordrhein-westfalen|berlin|hamburg)\b/i.test(l.region || "")) score += 18;

    const v = l.appraisedValue || 0;
    // Sweet-Spot: Verkehrswert 130k–850k € => 5/10-Grenze 65k–425k €
    if (v >= 150_000 && v <= 850_000) score += 28;
    else if (v >= 90_000 && v <= 1_100_000) score += 14;

    if (l.livingAreaM2 && l.livingAreaM2 >= 50 && l.livingAreaM2 <= 280) score += 14;
    if (l.landAreaM2 && l.landAreaM2 >= 200) score += 10;
    if (l.rooms) score += 6;
    if (l.yearBuilt) score += 5;
    if (l.geo?.lat && l.geo?.lng) score += 10;
    if (l.description && l.description.length > 100) score += 8;
    if (l.limitsWaived) score += 15;

    const area = l.livingAreaM2 || l.usableAreaM2 || 0;
    if (area > 0) {
      const startPerM2 = (v * 0.5) / area;
      if (startPerM2 >= 900 && startPerM2 <= 3600) score += 10;
    }
    return score;
  }

  // TR Scoring
  const trLoc = `${l.place || ""} ${l.region || ""}`;
  if (TOP_TR_REGIONS.test(trLoc)) score += 40;
  if (l.tr?.rooms) score += 10;
  if (l.tr?.netAreaM2 || l.tr?.buildingAreaM2) score += 15;
  if (l.tr?.landAreaM2) score += 8;
  if (l.geo?.lat && l.geo?.lng) score += 10;
  if (l.tr?.discountPct && l.tr.discountPct >= 25 && l.tr.discountPct <= 65) score += 18;
  return score;
}

/**
 * Objekt des Tages: Sortiert alle ungenutzten Kandidaten nach Viral-Score absteigend
 * und wählt deterministisch aus der absoluten Spitzengruppe (Top 8), damit jeden Tag
 * ein echter Hingucker läuft und kein Ladenhüter.
 */
export function pickObject(snapshot, market, day, used = new Set()) {
  const test = market === "DE" ? deCandidate : trCandidate;
  const pool = snapshot.listings.filter((l) => test(l, day));
  const fresh = pool.filter((l) => !used.has(l.key));
  const baseList = fresh.length ? fresh : pool;
  if (!baseList.length) return null;

  const ranked = [...baseList].sort((a, b) => {
    const diff = scoreListing(b, market) - scoreListing(a, market);
    return diff !== 0 ? diff : a.key.localeCompare(b.key);
  });

  const topBucket = ranked.slice(0, Math.min(8, ranked.length));
  return topBucket[hash(`${market}:${day.toISOString().slice(0, 10)}`) % topBucket.length];
}

/** Datenschutzfreundliche Ortsangabe: DE „PLZ 106xx · Berlin“, TR „Keçiören / Ankara“. */
export function placeLine(listing) {
  if (listing.market === "DE") {
    const area = listing.postcode ? `PLZ ${listing.postcode.slice(0, 3)}xx · ` : "";
    return `${area}${listing.place.split(",")[0].trim()}`;
  }
  return `${listing.place} / ${listing.region}`;
}

/** Erzeugt den PSEO-kompatiblen URL-Slug einer Stadt oder Provinz (1:1 wie PseoService.ts). */
export function slugifyCity(input) {
  return String(input || "")
    .split(",")[0]
    .trim()
    .replace(/İ/g, "i")
    .replace(/I/g, "i")
    .replace(/ı/g, "i")
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ş/g, "s")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Öffentliche Ziel-URL ohne Login-Wall für Story-Link-Sticker & Bio/Ads. */
export function buildListingPublicUrl(listing, { source = "instagram", medium = "story", campaign = "daily_deal" } = {}) {
  const params = new URLSearchParams({
    utm_source: source,
    utm_medium: medium,
    utm_campaign: campaign,
  });
  if (listing.market === "TR") {
    const slug = slugifyCity(listing.region || listing.place);
    const path = slug ? `/tr/icra-ihale/${slug}` : "/tr/icra-ihale";
    return `https://www.belowmark.com${path}?${params.toString()}`;
  }
  const citySlug = slugifyCity(listing.place);
  const path = citySlug ? `/zwangsversteigerung/${citySlug}` : "/zwangsversteigerungen";
  return `https://www.belowmark.com${path}?${params.toString()}`;
}

/** Säubert die amtliche Objektbezeichnung auf eine knackige, lesbare Überschrift (max. ~28 Zeichen). */
export function cleanObjectTitle(listing, fallback) {
  if (listing.market === "TR") return fallback;
  const raw = String(listing.segmentLabel || "")
    .replace(/^\s*(?:[A-ZÄÖÜ]{1,4}\s+)?\d+\s*K\s*[\d/-]+(?:\s*\(\d+\))?\s*:\s*/iu, "")
    .split(/[,(;:]/)[0]
    .replace(/\s+/g, " ")
    .trim();
  if (!raw || raw.length < 3 || /^sonstige/i.test(raw)) return fallback;
  if (/einfamilienhaus/i.test(raw) && raw.length > 22) return "Einfamilienhaus";
  if (/zweifamilienhaus/i.test(raw) && raw.length > 22) return "Zweifamilienhaus";
  if (/mehrfamilienhaus/i.test(raw) && raw.length > 22) return "Mehrfamilienhaus";
  if (/reihenmittelhaus/i.test(raw)) return "Reihenmittelhaus";
  if (/reihenendhaus/i.test(raw)) return "Reihenendhaus";
  if (/doppelhaushälfte/i.test(raw)) return "Doppelhaushälfte";
  if (/eigentumswohnung/i.test(raw) && raw.length > 22) return "Eigentumswohnung";
  return raw.length > 28 ? fallback : raw;
}

/**
 * Extrahiert rein faktenbasierte Highlights, Risiko-Hinweise und die exakte
 * Kaufnebenkosten-Rechnung aus dem amtlichen Aushang für Karussell & Reel.
 */
export function extractDealInsights(listing) {
  const desc = String(listing.description || "");
  const features = [];
  if (/\bbalkon\b/i.test(desc)) features.push("Balkon");
  if (/\bloggia\b/i.test(desc)) features.push("Loggia");
  if (/\bterrasse|dachterrasse\b/i.test(desc)) features.push("Terrasse");
  if (/\bgarten\b/i.test(desc)) features.push("Gartenanteil");
  if (/\bkeller|vollunterkellert|unterkellert\b/i.test(desc)) features.push("Keller");
  if (/\baufzug|fahrstuhl\b/i.test(desc)) features.push("Aufzug");
  if (/\bgarage|tiefgarage|stellplatz|carport\b/i.test(desc)) features.push("Stellplatz/Garage");
  if (/\bdachgeschoss\b/i.test(desc)) features.push("Dachgeschoss");
  if (/\berdgeschoss\b/i.test(desc)) features.push("Erdgeschoss");
  const floorMatch = desc.match(/\b([1-9]\.\s*(?:OG|Obergeschoss))\b/i);
  if (floorMatch) features.push(floorMatch[1].replace(/Obergeschoss/i, "OG"));

  const noInsideInspection = /innenbesichtigung\s+hat\s+nicht\s+stattgefunden|keine\s+innenbesichtigung|nur\s+außenbesichtigung/i.test(desc);
  const rented = /\bvermietet\b/i.test(desc) && !/nicht\s+vermietet/i.test(desc);
  const vacant = /\bleerstehend|leerstand\b/i.test(desc);
  const heritage = /\bdenkmalschutz|baudenkmal\b/i.test(desc);

  const v = listing.appraisedValue || 0;
  const startBid = listing.market === "TR" ? (listing.tr?.startingBid || v * 0.5) : v * 0.5;
  const limit70 = v * 0.7;
  const deposit10 = v * 0.1;
  const taxPct = listing.market === "TR" ? (listing.tr?.vatRate ?? 10) : (listing.transferTaxPct ?? 5);
  const taxOnStart = Math.round((startBid * taxPct) / 100);
  const courtFeesEst = Math.round(startBid * 0.015);
  const totalAtStart = Math.round(startBid + taxOnStart + courtFeesEst);

  const area =
    listing.market === "TR"
      ? (listing.tr?.netAreaM2 ?? listing.tr?.buildingAreaM2 ?? listing.tr?.areaM2 ?? null)
      : (listing.livingAreaM2 ?? listing.usableAreaM2 ?? null);
  const fullPerM2 = area && area > 0 ? Math.round(v / area) : null;
  const startPerM2 = area && area > 0 ? Math.round(startBid / area) : null;
  const limit70PerM2 = area && area > 0 ? Math.round(limit70 / area) : null;

  return {
    features: features.slice(0, 4),
    noInsideInspection,
    rented,
    vacant,
    heritage,
    hasReportPdf: Boolean(listing.reportUrl || listing.documentUrl),
    area,
    fullPerM2,
    startPerM2,
    limit70PerM2,
    startBid,
    limit70,
    deposit10,
    taxPct,
    taxOnStart,
    courtFeesEst,
    totalAtStart,
  };
}

function upcoming(snapshot, market, day, days) {
  const from = day.getTime();
  const to = from + days * DAY;
  return snapshot.listings.filter((l) => {
    if (l.cancelled) return false;
    if (market === "DE" && !isGermanListing(l)) return false;
    return (l.rounds || []).some((r) => {
      const t = Date.parse(r.start);
      return t >= from && t < to;
    });
  });
}

function topRegions(list, n) {
  const counts = new Map();
  for (const l of list) if (l.region) counts.set(l.region, (counts.get(l.region) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([name, count]) => ({ name, count }));
}

function median(values) {
  const v = [...values].sort((a, b) => a - b);
  if (!v.length) return null;
  const m = Math.floor(v.length / 2);
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
}

/**
 * Kennzahl des Tages (strikt nur für das jeweilige Land — kein UK/AT-Mix mehr in DE!).
 */
export function pickStat(snapshot, market, day) {
  const variants = ["week", "median", "month"];
  const variant = variants[Math.floor(day.getTime() / DAY) % variants.length];
  const days = variant === "week" ? 7 : 30;
  const list = upcoming(snapshot, market, day, days);

  if (variant === "median") {
    const rows = OBJECT_SEGMENTS.map((segment) => {
      const values = list
        .filter((l) => l.segment === segment && l.appraisedValue && !isShare(l))
        .map((l) => l.appraisedValue);
      return { segment, value: median(values), count: values.length };
    }).filter((r) => r.count >= 20);
    return { variant, days, total: list.length, rows };
  }
  return { variant, days, total: list.length, regions: topRegions(list, 5) };
}
