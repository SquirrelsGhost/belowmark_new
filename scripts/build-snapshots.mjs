/**
 * Builds the compact listing snapshots the app reads (data/snapshots/de.json, tr.json)
 * from the data sets of the previous Belowmark pipeline.
 *
 *   node scripts/build-snapshots.mjs "C:\Users\emrea\Desktop\1_Projekte_und_Apps\immo\data" [seit-Datum]
 *
 * The Turkish set is large, so only proceedings with a round still ahead of
 * [seit-Datum] (default: now) are kept.
 *
 * Only official notice data is copied. Nothing in the old data folder that holds
 * accounts, sessions, mail or payment data is read.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { slug } from "./lib/slug.mjs";

const SOURCE_DIR = process.argv[2];
/** Turkish proceedings whose last round ended before this moment are left out. */
const TR_SINCE = new Date(process.argv[3] ?? Date.now());
const OUT_DIR = join(process.cwd(), "data", "snapshots");

if (!SOURCE_DIR) {
  console.error("Pfad zum data-Ordner der alten Version angeben.");
  process.exit(1);
}

/** Turkish notices give local times without offset. */
const TR_OFFSET = "+03:00";

const DE_SEGMENT_RULES = [
  ["apartment", /Eigentumswohnung/i],
  ["multiFamily", /Mehrfamilienhaus|Wohn-\/Geschäftshaus/i],
  ["house", /Einfamilienhaus|Zweifamilienhaus|Doppelhaushälfte|Reihenhaus|Wohnhaus/i],
  ["commercial", /Gewerbe|gewerblich|Laden|Büro|Hotel|Gaststätte/i],
  ["land", /unbebautes Grundstück|Baugrundstück/i],
  ["farmland", /land- und forstwirtschaftlich|Landwirtschaft|Forst|Wald/i],
];

const TR_CLASS_SEGMENT = {
  daire: "apartment",
  mustakil: "house",
  arsa: "land",
  tarim: "farmland",
  zeytinlik: "farmland",
  isyeri: "commercial",
};

const TR_SEGMENT_FALLBACK = {
  konut: "apartment",
  bina: "multiFamily",
  ticari: "commercial",
  arsa: "land",
  arazi: "farmland",
};

const read = (file) => JSON.parse(readFileSync(join(SOURCE_DIR, file), "utf8"));
/** Map points from scripts/build-geo.mjs: PLZ → [lat, lng] (DE), İl slug → [lat, lng] (TR). */
const readPoints = (market) => JSON.parse(readFileSync(join(process.cwd(), "data", "geo", `${market}-points.json`), "utf8"));
const geoPoint = (point, precision) => (point ? { lat: point[0], lng: point[1], precision } : null);
const num = (value) => (typeof value === "number" && Number.isFinite(value) ? value : null);
const round2 = (value) => (value === null ? null : Math.round(value * 100) / 100);

function deSegment(raw) {
  if (!raw) return "other";
  return DE_SEGMENT_RULES.find(([, pattern]) => pattern.test(raw))?.[0] ?? "other";
}

/** "Crailsheim in Baden-Wuerttemberg" → "Crailsheim" */
function deCourt(raw) {
  return raw.replace(/\s+in\s+[A-ZÄÖÜ][\wäöüß-]+(?:-[\wäöüß]+)*$/u, "").trim();
}

function caveats(list) {
  return (list ?? []).map((c) => ({ points: c.points ?? 0, short: c.short, long: c.long }));
}

function buildDe() {
  const data = read("dataset-de.json");
  const postcodes = readPoints("de");
  const listings = data.listings.map((l) => ({
    key: l.key,
    market: "DE",
    title: l.title,
    segment: deSegment(l.segment),
    segmentLabel: l.segment ?? null,
    region: l.state,
    regionCode: l.stateCode,
    place: l.address?.city ?? l.county ?? null,
    postcode: l.address?.postcode ?? null,
    street: l.address?.street ?? null,
    authority: `AG ${deCourt(l.court)}`,
    fileNo: l.fileNo,
    fileYear: l.fileNoYear ?? null,
    rounds: (l.auction?.rounds ?? []).map((r) => ({ round: r.round, start: r.start, end: r.end })),
    hearingAt: l.auction?.at ?? null,
    cancelled: Boolean(l.auction?.cancelled),
    limitsWaived: Boolean(l.auction?.limitsWaived),
    appraisedValue: num(l.object?.appraisedValue),
    transferTaxPct: num(l.transferTaxPct),
    officialUrl: l.officialUrl,
    mapUrl: l.evidenceCoverage?.map?.url ?? null,
    documentUrl: l.documents?.announcementPdf ?? null,
    geo: geoPoint(postcodes[l.address?.postcode], "postcode"),
    history: (l.changes ?? []).map((change) => change.text).filter(Boolean),
    geoportalUrl: l.officialGeoportalEvidence?.url ?? null,
    geoportalName: l.officialGeoportalEvidence?.source ?? null,
    caveats: caveats(l.caveats),
    firstSeenAt: l.firstSeenAt ?? null,
  }));

  return {
    meta: {
      market: "DE",
      generatedAt: data.changes?.comparedWith ? latestSeen(data.listings) : null,
      source: "zvg-portal.de",
      sourceUrl: "https://www.zvg-portal.de/",
      states: data.meta.states.map((s) => ({ code: s.code, name: s.name, status: s.status, included: s.zvgPortalIncluded ?? 0 })),
    },
    listings,
  };
}

function latestSeen(listings) {
  return listings.reduce((max, l) => (l.firstSeenAt && l.firstSeenAt > max ? l.firstSeenAt : max), "");
}

/** "İZMİR 3. İCRA DAİRESİ" → "İzmir 3. İcra Dairesi" — notices are written in capitals. */
function trTitle(value) {
  if (!value) return null;
  return value
    .toLocaleLowerCase("tr")
    .split(/(\s+|\/|-)/)
    .map((word) => word.charAt(0).toLocaleUpperCase("tr") + word.slice(1))
    .join("");
}

function trTime(value) {
  if (!value) return null;
  return /[zZ]|[+-]\d\d:\d\d$/.test(value) ? value : `${value}:00${TR_OFFSET}`;
}

function buildTr() {
  const data = read("dataset.json");
  const generatedAt = data.meta.generatedAt;
  const centers = readPoints("tr");
  const listings = [];

  for (const l of data.listings) {
    const rounds = (l.auction?.rounds ?? []).map((r) => ({ round: r.round, start: trTime(r.start), end: trTime(r.end ?? r.start) }));
    const lastEnd = rounds.reduce((max, r) => (r.end > max ? r.end : max), "");
    if (!lastEnd || new Date(lastEnd) < TR_SINCE) continue;

    const parcel = l.parcel ?? {};
    const ev = l.evaluation ?? {};
    listings.push({
      key: l.key,
      market: "TR",
      title: l.title,
      segment: TR_CLASS_SEGMENT[l.marketClass] ?? TR_SEGMENT_FALLBACK[l.segment] ?? "other",
      segmentLabel: ev.marketClassLabel ?? l.segment ?? null,
      region: trTitle(l.city ?? parcel.city ?? null),
      regionCode: slug(l.city ?? parcel.city ?? "") || null,
      place: l.county ?? parcel.county ?? null,
      postcode: null,
      street: parcel.address && !/dosya numarası/i.test(parcel.address) ? parcel.address : null,
      authority: trTitle(l.authority) ?? "",
      fileNo: l.fileNo,
      fileYear: Number.parseInt(String(l.fileNo).slice(0, 4), 10) || null,
      rounds,
      hearingAt: rounds[0]?.start ?? null,
      cancelled: false,
      limitsWaived: false,
      appraisedValue: num(ev.appraisedValue ?? parcel.appraisedValue),
      transferTaxPct: null,
      officialUrl: l.officialUrl,
      mapUrl: null,
      documentUrl: null,
      geo: geoPoint(centers[slug(l.city ?? parcel.city ?? "")], "province"),
      history: [],
      geoportalUrl: null,
      geoportalName: null,
      caveats: caveats(l.caveats),
      firstSeenAt: l.firstSeenAt ?? null,
      tr: {
        adType: l.adType,
        source: l.source,
        mahalle: trTitle(parcel.mahalle ?? null),
        ada: parcel.ada ?? null,
        parsel: parcel.parsel ?? null,
        isCondo: Boolean(parcel.isCondo),
        landAreaM2: round2(num(parcel.landAreaM2)),
        buildingAreaM2: round2(num(parcel.buildingAreaM2)),
        vatRate: num(parcel.vatRate),
        startingBid: num(ev.startingBid),
        areaM2: round2(num(ev.areaM2)),
        areaKind: ev.areaKind ?? null,
        marketMedianPerM2: round2(num(ev.marketMedianPerM2)),
        marketSampleSize: num(ev.marketSampleSize),
        discountPct: round2(num(ev.discountPct)),
        confidence: ev.confidence ?? null,
        hitCount: num(l.hitCount),
      },
    });
  }

  return {
    meta: { market: "TR", generatedAt, source: "ilan.gov.tr", sourceUrl: "https://www.ilan.gov.tr/", states: [] },
    listings,
  };
}

mkdirSync(OUT_DIR, { recursive: true });
for (const [name, build] of [["de", buildDe], ["tr", buildTr]]) {
  const snapshot = build();
  writeFileSync(join(OUT_DIR, `${name}.json`), JSON.stringify(snapshot));
  console.log(`${name}: ${snapshot.listings.length} Objekte, Stand ${snapshot.meta.generatedAt}`);
}
