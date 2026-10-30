/**
 * Live Multi-Source Foreclosure Synchronizer for Belowmark (DE & TR)
 *
 * Connects directly to all official foreclosure and public auction portals:
 *
 * DE (All 16 Bundesländer):
 *   1. zvg-portal.de — Joint Justice Portal of the Federal & State Governments
 *      (POST /index.php?button=Suchen&all=1 per state + Referer-authenticated detail & attachment links)
 *   2. zvg.com — Official Court Announcement System (§ 39 ZVG) covering BW, SH, MV, HH, BB, ST, BE, NI, etc.
 *      (GET /v2024/termine.prg?act=getGridJson&id_b=0 + getPDF + getJSON + aufgehoben.prg)
 *   3. Official Geoportals & BORIS Bodenrichtwert registries for all 16 states
 *
 * TR (All 81 Provinces):
 *   1. ilan.gov.tr — Basın İlan Kurumu Official Portal (İCRA & İHALE, with X-Request-Origin: IGT-UI)
 *   2. ilan.gib.gov.tr — Gelir İdaresi Başkanlığı (Tax Authority 6183 AATUHK auctions)
 *   3. net.sgk.gov.tr — Sosyal Güvenlik Kurumu (Social Security Authority real estate auctions)
 *   4. gayrimenkul.intengo.com/vakifbank — VakıfBank Official E-İhale Real Estate Portal
 *
 * Usage:
 *   node --use-system-ca scripts/sync-live.mjs
 */

import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import tls from "node:tls";
import { slug } from "./lib/slug.mjs";
import {
  decodeHtmlText,
  extractDeLivingArea,
  extractDeUsableArea,
  extractDeLandArea,
  extractDeRooms,
  extractYearBuilt,
  parseZvgPortalHtml,
  parseZvgComData,
  parseAtEdiktHtml,
  parseChShabXml,
  parseItAsteItem,
  parseEsBoeHtml,
  parseFrLicitorHtml,
  parseGbAuctionHtml,
  extractTrEnrichedDetails,
} from "./lib/propertyExtractor.mjs";

if (process.platform === "win32" && typeof tls.getCACertificates === "function" && typeof tls.setDefaultCACertificates === "function") {
  try {
    tls.setDefaultCACertificates([...tls.getCACertificates("default"), ...tls.getCACertificates("system")]);
  } catch {
    // Keep default CAs if system CA merge is unavailable
  }
}

const OUT_DIR = join(process.cwd(), "data", "snapshots");
const IMMO_DATA_DIR = "C:\\Users\\emrea\\Desktop\\1_Projekte_und_Apps\\immo\\data";
const TR_OFFSET = "+03:00";

const BUNDESLAENDER_DE = [
  { code: "bw", portalCode: "bw", name: "Baden-Württemberg", transferTaxPct: 5.0 },
  { code: "by", portalCode: "by", name: "Bayern", transferTaxPct: 3.5 },
  { code: "be", portalCode: "be", name: "Berlin", transferTaxPct: 6.0 },
  { code: "bb", portalCode: "br", name: "Brandenburg", transferTaxPct: 6.5 },
  { code: "hb", portalCode: "hb", name: "Bremen", transferTaxPct: 5.5 },
  { code: "hh", portalCode: "hh", name: "Hamburg", transferTaxPct: 5.5 },
  { code: "he", portalCode: "he", name: "Hessen", transferTaxPct: 6.0 },
  { code: "mv", portalCode: "mv", name: "Mecklenburg-Vorpommern", transferTaxPct: 6.0 },
  { code: "ni", portalCode: "ni", name: "Niedersachsen", transferTaxPct: 5.0 },
  { code: "nw", portalCode: "nw", name: "Nordrhein-Westfalen", transferTaxPct: 6.5 },
  { code: "rp", portalCode: "rp", name: "Rheinland-Pfalz", transferTaxPct: 5.0 },
  { code: "sl", portalCode: "sl", name: "Saarland", transferTaxPct: 6.5 },
  { code: "sn", portalCode: "sn", name: "Sachsen", transferTaxPct: 5.5 },
  { code: "st", portalCode: "st", name: "Sachsen-Anhalt", transferTaxPct: 5.0 },
  { code: "sh", portalCode: "sh", name: "Schleswig-Holstein", transferTaxPct: 6.5 },
  { code: "th", portalCode: "th", name: "Thüringen", transferTaxPct: 5.0 },
];

const STATE_BY_NAME_DE = new Map(BUNDESLAENDER_DE.map((s) => [s.name, s]));

const GEOPORTALS_DE = {
  bw: { url: "https://www.geoportal-bw.de/", name: "Geoportal Baden-Württemberg · LGL" },
  by: { url: "https://geoportal.bayern.de/bayernatlas/", name: "BayernAtlas · BVV" },
  be: { url: "https://gdi.berlin.de/viewer/main/", name: "Geoportal Berlin · GDI" },
  bb: { url: "https://geoportal.brandenburg.de/", name: "Geoportal Brandenburg · LGB" },
  hb: { url: "https://geoportal.bremen.de/geoportal/", name: "GeoPortal Bremen" },
  hh: { url: "https://geoportal-hamburg.de/", name: "Geoportal Hamburg · LGV" },
  he: { url: "https://www.geoportal.hessen.de/", name: "Geoportal Hessen · HVBG" },
  mv: { url: "https://www.geoportal-mv.de/portal/Geodatenviewer/GAIA-MVlight", name: "GeoPortal.MV · GAIA-MV" },
  ni: { url: "https://www.maps.lgln.niedersachsen.de/katasterkarten-online/mapbender/application/katasterkarten-online", name: "Katasterkarten Online · LGLN" },
  nw: { url: "https://www.geoportal.nrw/", name: "GEOportal.NRW · Geobasis NRW" },
  rp: { url: "https://www.geoportal.rlp.de/map", name: "GeoPortal.rlp · LVermGeo" },
  sl: { url: "https://geoportal.saarland.de/", name: "Geoportal Saarland · LVGL" },
  sn: { url: "https://geoportal.sachsen.de/?app=geoportal", name: "Sachsenatlas · GeoSN" },
  st: { url: "https://www.geodatenportal.sachsen-anhalt.de/mapapps/resources/apps/GeobasisViewer/index.html", name: "GeobasisViewer · LVermGeo ST" },
  sh: { url: "https://danord.gdi-sh.de/viewer/resources/apps/Anonym/index.html?lang=de", name: "DigitalerAtlasNord · LVermGeo SH" },
  th: { url: "https://www.geoproxy.geoportal-th.de/geoclient/", name: "Geoportal Thüringen · TLBG" },
};

const BUNDESLAENDER_AT = [
  { bl: 0, code: "at-w", name: "Wien (AT)", transferTaxPct: 4.6, geoportalUrl: "https://www.wien.gv.at/stadtplan/", geoportalName: "Wien Stadtplan · ViennaGIS" },
  { bl: 1, code: "at-noe", name: "Niederösterreich (AT)", transferTaxPct: 4.6, geoportalUrl: "https://atlas.noe.gv.at/", geoportalName: "NÖ Atlas · Land NÖ" },
  { bl: 2, code: "at-bgld", name: "Burgenland (AT)", transferTaxPct: 4.6, geoportalUrl: "https://geodaten.bgld.gv.at/", geoportalName: "GeoDaten Burgenland" },
  { bl: 3, code: "at-ooe", name: "Oberösterreich (AT)", transferTaxPct: 4.6, geoportalUrl: "https://wo.doris.at/weboffice/synserver?project=weboffice&client=core", geoportalName: "DORIS · Land OÖ" },
  { bl: 4, code: "at-sbg", name: "Salzburg (AT)", transferTaxPct: 4.6, geoportalUrl: "https://www.salzburg.gv.at/sagisonline/", geoportalName: "SAGIS · Land Salzburg" },
  { bl: 5, code: "at-stmk", name: "Steiermark (AT)", transferTaxPct: 4.6, geoportalUrl: "https://gis.stmk.gv.at/", geoportalName: "GIS-Steiermark" },
  { bl: 6, code: "at-ktn", name: "Kärnten (AT)", transferTaxPct: 4.6, geoportalUrl: "https://kagis.ktn.gv.at/", geoportalName: "KAGIS · Land Kärnten" },
  { bl: 7, code: "at-tir", name: "Tirol (AT)", transferTaxPct: 4.6, geoportalUrl: "https://maps.tirol.gv.at/", geoportalName: "tirisMaps · Land Tirol" },
  { bl: 8, code: "at-vbg", name: "Vorarlberg (AT)", transferTaxPct: 4.6, geoportalUrl: "https://vogis.cnv.at/atlas/init.aspx", geoportalName: "VoGIS Atlas · Vorarlberg" },
];

const KANTONE_CH = [
  { canton: "ZH", code: "ch-zh", name: "Zürich (CH)", transferTaxPct: 0.2 },
  { canton: "BE", code: "ch-be", name: "Bern (CH)", transferTaxPct: 1.8 },
  { canton: "LU", code: "ch-lu", name: "Luzern (CH)", transferTaxPct: 1.5 },
  { canton: "UR", code: "ch-ur", name: "Uri (CH)", transferTaxPct: 0.3 },
  { canton: "SZ", code: "ch-sz", name: "Schwyz (CH)", transferTaxPct: 0.2 },
  { canton: "OW", code: "ch-ow", name: "Obwalden (CH)", transferTaxPct: 1.5 },
  { canton: "NW", code: "ch-nw", name: "Nidwalden (CH)", transferTaxPct: 1.0 },
  { canton: "GL", code: "ch-gl", name: "Glarus (CH)", transferTaxPct: 0.3 },
  { canton: "ZG", code: "ch-zg", name: "Zug (CH)", transferTaxPct: 0.2 },
  { canton: "FR", code: "ch-fr", name: "Freiburg (CH)", transferTaxPct: 1.5 },
  { canton: "SO", code: "ch-so", name: "Solothurn (CH)", transferTaxPct: 2.2 },
  { canton: "BS", code: "ch-bs", name: "Basel-Stadt (CH)", transferTaxPct: 3.0 },
  { canton: "BL", code: "ch-bl", name: "Basel-Landschaft (CH)", transferTaxPct: 2.5 },
  { canton: "SH", code: "ch-sh", name: "Schaffhausen (CH)", transferTaxPct: 0.4 },
  { canton: "AR", code: "ch-ar", name: "Appenzell Ausserrhoden (CH)", transferTaxPct: 2.0 },
  { canton: "AI", code: "ch-ai", name: "Appenzell Innerrhoden (CH)", transferTaxPct: 1.0 },
  { canton: "SG", code: "ch-sg", name: "St. Gallen (CH)", transferTaxPct: 1.0 },
  { canton: "GR", code: "ch-gr", name: "Graubünden (CH)", transferTaxPct: 2.0 },
  { canton: "AG", code: "ch-ag", name: "Aargau (CH)", transferTaxPct: 0.4 },
  { canton: "TG", code: "ch-tg", name: "Thurgau (CH)", transferTaxPct: 1.0 },
  { canton: "TI", code: "ch-ti", name: "Tessin (CH)", transferTaxPct: 1.1 },
  { canton: "VD", code: "ch-vd", name: "Waadt (CH)", transferTaxPct: 2.2 },
  { canton: "VS", code: "ch-vs", name: "Wallis (CH)", transferTaxPct: 1.5 },
  { canton: "NE", code: "ch-ne", name: "Neuenburg (CH)", transferTaxPct: 3.3 },
  { canton: "GE", code: "ch-ge", name: "Genf (CH)", transferTaxPct: 3.0 },
  { canton: "JU", code: "ch-ju", name: "Jura (CH)", transferTaxPct: 2.1 },
];
const CANTON_BY_CODE_CH = new Map(KANTONE_CH.map((c) => [c.canton, c]));

const REGIONEN_IT = [
  { key: "Lombardia", code: "it-lom", name: "Lombardei (IT)", transferTaxPct: 9.0 },
  { key: "Lazio", code: "it-laz", name: "Latium / Rom (IT)", transferTaxPct: 9.0 },
  { key: "Veneto", code: "it-ven", name: "Venetien (IT)", transferTaxPct: 9.0 },
  { key: "Piemonte", code: "it-pie", name: "Piemont (IT)", transferTaxPct: 9.0 },
  { key: "Emilia-Romagna", code: "it-emr", name: "Emilia-Romagna (IT)", transferTaxPct: 9.0 },
  { key: "Toscana", code: "it-tos", name: "Toskana (IT)", transferTaxPct: 9.0 },
  { key: "Campania", code: "it-cam", name: "Kampanien (IT)", transferTaxPct: 9.0 },
  { key: "Sicilia", code: "it-sic", name: "Sizilien (IT)", transferTaxPct: 9.0 },
  { key: "Puglia", code: "it-pug", name: "Apulien (IT)", transferTaxPct: 9.0 },
  { key: "Liguria", code: "it-lig", name: "Ligurien (IT)", transferTaxPct: 9.0 },
  { key: "Sardegna", code: "it-sar", name: "Sardinien (IT)", transferTaxPct: 9.0 },
  { key: "Trentino-Alto Adige", code: "it-taa", name: "Südtirol / Trentino (IT)", transferTaxPct: 9.0 },
  { key: "Friuli-Venezia Giulia", code: "it-fvg", name: "Friaul-Julisch Venetien (IT)", transferTaxPct: 9.0 },
  { key: "Marche", code: "it-mar", name: "Marken (IT)", transferTaxPct: 9.0 },
  { key: "Abruzzo", code: "it-abr", name: "Abruzzen (IT)", transferTaxPct: 9.0 },
  { key: "Umbria", code: "it-umb", name: "Umbrien (IT)", transferTaxPct: 9.0 },
  { key: "Calabria", code: "it-cal", name: "Kalabrien (IT)", transferTaxPct: 9.0 },
  { key: "Basilicata", code: "it-bas", name: "Basilikata (IT)", transferTaxPct: 9.0 },
  { key: "Molise", code: "it-mol", name: "Molise (IT)", transferTaxPct: 9.0 },
  { key: "Valle d'Aosta", code: "it-vda", name: "Aostatal (IT)", transferTaxPct: 9.0 },
];
const REGION_BY_KEY_IT = new Map(REGIONEN_IT.map((r) => [r.key, r]));

const REGIONEN_ES = [
  { key: "Comunidad de Madrid", code: "es-md", name: "Madrid (ES)", transferTaxPct: 6.0 },
  { key: "Cataluña", code: "es-ct", name: "Katalonien (ES)", transferTaxPct: 10.0 },
  { key: "Andalucía", code: "es-an", name: "Andalusien (ES)", transferTaxPct: 7.0 },
  { key: "Comunitat Valenciana", code: "es-vc", name: "Valencia (ES)", transferTaxPct: 10.0 },
  { key: "Illes Balears", code: "es-ib", name: "Balearen / Mallorca (ES)", transferTaxPct: 8.0 },
  { key: "Canarias", code: "es-cn", name: "Kanarische Inseln (ES)", transferTaxPct: 6.5 },
  { key: "País Vasco", code: "es-pv", name: "Baskenland (ES)", transferTaxPct: 4.0 },
  { key: "Galicia", code: "es-ga", name: "Galicien (ES)", transferTaxPct: 8.0 },
  { key: "Castilla y León", code: "es-cl", name: "Kastilien und León (ES)", transferTaxPct: 8.0 },
  { key: "Castilla-La Mancha", code: "es-cm", name: "Kastilien-La Mancha (ES)", transferTaxPct: 9.0 },
  { key: "Región de Murcia", code: "es-mc", name: "Murcia (ES)", transferTaxPct: 8.0 },
  { key: "Aragón", code: "es-ar", name: "Aragonien (ES)", transferTaxPct: 8.0 },
  { key: "Asturias", code: "es-as", name: "Asturien (ES)", transferTaxPct: 8.0 },
  { key: "Extremadura", code: "es-ex", name: "Extremadura (ES)", transferTaxPct: 8.0 },
  { key: "Navarra", code: "es-nc", name: "Navarra (ES)", transferTaxPct: 6.0 },
  { key: "Cantabria", code: "es-cb", name: "Kantabrien (ES)", transferTaxPct: 9.0 },
  { key: "La Rioja", code: "es-ri", name: "La Rioja (ES)", transferTaxPct: 7.0 },
];
const REGION_BY_KEY_ES = new Map(REGIONEN_ES.map((r) => [r.key, r]));

const REGIONEN_FR = [
  { key: "Île-de-France", code: "fr-idf", name: "Île-de-France / Paris (FR)", transferTaxPct: 5.8, lat: 48.8566, lng: 2.3522 },
  { key: "Provence-Alpes-Côte d'Azur", code: "fr-paca", name: "Provence-Alpes-Côte d'Azur (FR)", transferTaxPct: 5.8, lat: 43.2965, lng: 5.3698 },
  { key: "Auvergne-Rhône-Alpes", code: "fr-ara", name: "Auvergne-Rhône-Alpes (FR)", transferTaxPct: 5.8, lat: 45.764, lng: 4.8357 },
  { key: "Nouvelle-Aquitaine", code: "fr-naq", name: "Nouvelle-Aquitaine (FR)", transferTaxPct: 5.8, lat: 44.8378, lng: -0.5792 },
  { key: "Occitanie", code: "fr-occ", name: "Okzitanien (FR)", transferTaxPct: 5.8, lat: 43.6047, lng: 1.4442 },
  { key: "Hauts-de-France", code: "fr-hdf", name: "Hauts-de-France (FR)", transferTaxPct: 5.8, lat: 50.6292, lng: 3.0573 },
  { key: "Grand Est", code: "fr-ges", name: "Grand Est / Elsass (FR)", transferTaxPct: 5.8, lat: 48.5734, lng: 7.7521 },
  { key: "Bretagne", code: "fr-bre", name: "Bretagne (FR)", transferTaxPct: 5.8, lat: 48.1173, lng: -1.6778 },
  { key: "Normandie", code: "fr-nor", name: "Normandie (FR)", transferTaxPct: 5.8, lat: 49.4432, lng: 1.0999 },
  { key: "Pays de la Loire", code: "fr-pdl", name: "Pays de la Loire (FR)", transferTaxPct: 5.8, lat: 47.2184, lng: -1.5536 },
  { key: "Bourgogne-Franche-Comté", code: "fr-bfc", name: "Burgund-Franche-Comté (FR)", transferTaxPct: 5.8, lat: 47.322, lng: 5.0415 },
  { key: "Centre-Val de Loire", code: "fr-cvl", name: "Centre-Val de Loire (FR)", transferTaxPct: 5.8, lat: 47.9029, lng: 1.9093 },
  { key: "Corse", code: "fr-cor", name: "Korsika (FR)", transferTaxPct: 5.8, lat: 41.9192, lng: 8.7386 },
];
const REGION_BY_KEY_FR = new Map(REGIONEN_FR.map((r) => [r.key, r]));

const REGIONEN_GB = [
  { key: "Greater London", code: "gb-lon", name: "Greater London (UK)", transferTaxPct: 5.0, lat: 51.5074, lng: -0.1278 },
  { key: "South East England", code: "gb-see", name: "South East England (UK)", transferTaxPct: 5.0, lat: 51.2787, lng: 0.5217 },
  { key: "South West England", code: "gb-swe", name: "South West England (UK)", transferTaxPct: 5.0, lat: 51.4545, lng: -2.5879 },
  { key: "West Midlands", code: "gb-wmd", name: "West Midlands (UK)", transferTaxPct: 5.0, lat: 52.4862, lng: -1.8904 },
  { key: "East Midlands", code: "gb-emd", name: "East Midlands (UK)", transferTaxPct: 5.0, lat: 52.9548, lng: -1.1581 },
  { key: "North West England", code: "gb-nwe", name: "North West England (UK)", transferTaxPct: 5.0, lat: 53.4808, lng: -2.2426 },
  { key: "Yorkshire and the Humber", code: "gb-yrk", name: "Yorkshire & Humber (UK)", transferTaxPct: 5.0, lat: 53.8008, lng: -1.5491 },
  { key: "East of England", code: "gb-ee", name: "East of England (UK)", transferTaxPct: 5.0, lat: 52.2053, lng: 0.1218 },
  { key: "North East England", code: "gb-nee", name: "North East England (UK)", transferTaxPct: 5.0, lat: 54.9783, lng: -1.6178 },
  { key: "Scotland", code: "gb-sct", name: "Schottland (UK)", transferTaxPct: 4.5, lat: 55.9533, lng: -3.1883 },
  { key: "Wales", code: "gb-wls", name: "Wales (UK)", transferTaxPct: 4.5, lat: 51.4816, lng: -3.1791 },
  { key: "Northern Ireland", code: "gb-nir", name: "Nordirland (UK)", transferTaxPct: 5.0, lat: 54.5973, lng: -5.9301 },
];
const REGION_BY_KEY_GB = new Map(REGIONEN_GB.map((r) => [r.key, r]));

const DE_SEGMENT_RULES = [
  ["apartment", /Eigentumswohnung|Wohnungseigentum|Zimmer-Wohnung|Teileigentum/i],
  ["multiFamily", /Mehrfamilienhaus|Wohn-\/Geschäftshaus|Wohn- und Geschäftshaus|Dreifamilienhaus/i],
  ["house", /Einfamilienhaus|Zweifamilienhaus|Doppelhaushälfte|Reihenhaus|Wohnhaus|Villa|Bungalow|Ferienhaus/i],
  ["commercial", /Gewerbe|gewerblich|Laden|Büro|Hotel|Gaststätte|Halle|Werkstatt|Praxis|Lager/i],
  ["land", /unbebautes Grundstück|Baugrundstück|Bauplatz|Grundstück/i],
  ["farmland", /land- und forstwirtschaftlich|Landwirtschaft|Forst|Wald|Acker|Grünland|Wiese/i],
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

const ENT = {
  "&nbsp;": " ", "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'",
  "&uuml;": "ü", "&Uuml;": "Ü", "&auml;": "ä", "&Auml;": "Ä", "&ouml;": "ö", "&Ouml;": "Ö",
  "&szlig;": "ß", "&euro;": "€", "&#128;": "€",
};

const clean = (s) =>
  String(s ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#?\w+;/g, (e) => ENT[e] ?? e)
    .replace(/\s+/g, " ")
    .trim();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const i = cursor++;
      out[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return out;
}

const readPoints = (market) => JSON.parse(readFileSync(join(process.cwd(), "data", "geo", `${market}-points.json`), "utf8"));
const geoPoint = (point, precision) => (point ? { lat: point[0], lng: point[1], precision } : null);
const num = (value) => (typeof value === "number" && Number.isFinite(value) ? value : null);
const round2 = (value) => (value === null ? null : Math.round(value * 100) / 100);

function deSegment(raw, title = "") {
  const text = `${raw ?? ""} ${title ?? ""}`;
  return DE_SEGMENT_RULES.find(([, pattern]) => pattern.test(text))?.[0] ?? "other";
}

function deCourt(raw) {
  return String(raw ?? "").replace(/\s+in\s+[A-ZÄÖÜ][\wäöüß-]+(?:-[\wäöüß]+)*$/u, "").replace(/^\s*AG\s+/i, "").trim();
}

function canonicalFileNo(value = "") {
  const raw = String(value)
    .trim()
    .replace(/\s*\(\d+\)\s*$/, "")
    .replace(/^[A-ZÄÖÜ]{1,4}\s+(?=\d+\s+[A-ZÄÖÜ])/u, "");
  const match = /^(?:(\d+)\s*)?([A-ZÄÖÜ]+)\s*(\d+)\s*[-/]\s*(\d{2,4})$/iu.exec(raw);
  if (!match) return raw.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const year = Number(match[4]) < 100 ? 2000 + Number(match[4]) : Number(match[4]);
  return `${Number(match[1] ?? 0)}|${match[2].toUpperCase()}|${Number(match[3])}|${year}`;
}

function fileNoYear(fileNo = "") {
  const m = /[-/](\d{2,4})(?:\s*\(\d+\))?\s*$/.exec(String(fileNo).trim());
  if (!m) return null;
  const n = Number(m[1]);
  if (!Number.isFinite(n)) return null;
  return n < 100 ? 2000 + n : n;
}

function parseGermanNumber(str = "") {
  const cleaned = String(str).replace(/[^\d.,]/g, "").replace(/\./g, "").replace(",", ".");
  const n = Number.parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}

const MONTHS_DE = {
  Januar: 1, Februar: 2, März: 3, April: 4, Mai: 5, Juni: 6,
  Juli: 7, August: 8, September: 9, Oktober: 10, November: 11, Dezember: 12,
};

function berlinOffsetForDate(year, month, day, hour) {
  try {
    const probe = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), 0, 0));
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Berlin", timeZoneName: "longOffset" }).formatToParts(probe);
    const tz = parts.find((p) => p.type === "timeZoneName")?.value ?? "";
    const match = /GMT([+-]\d{2}:\d{2})/.exec(tz);
    return match ? match[1] : "+01:00";
  } catch {
    return "+01:00";
  }
}

function parseGermanDateIso(dateStr, timeStr = "09:00") {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(String(dateStr ?? "").trim());
  if (!m) return null;
  const [, d, mo, y] = m;
  const t = /^\d{1,2}:\d{2}/.test(String(timeStr ?? "").trim()) ? String(timeStr).trim().padStart(5, "0") : "09:00";
  const offset = berlinOffsetForDate(y, mo, d, t.slice(0, 2));
  return `${y}-${mo}-${d}T${t}:00${offset}`;
}

function parseTerminLine(line = "") {
  const m = /(\d{1,2})\.\s*([\p{L}]+)\s*(\d{4}),\s*(\d{1,2}):(\d{2})/u.exec(line);
  if (!m) return null;
  const month = MONTHS_DE[m[2]];
  if (!month) return null;
  const date = `${String(+m[1]).padStart(2, "0")}.${String(month).padStart(2, "0")}.${m[3]}`;
  const time = `${m[4].padStart(2, "0")}:${m[5]}`;
  return { date, time, iso: parseGermanDateIso(date, time) };
}

const BETRAG_RE = /(?<![\d.,])(?:\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?|\d+,\d{2}|\d{3,}(?=\s*(?:€|EUR)))/g;

function parseVerkehrswert(block = "") {
  const zelle =
    /Verkehrswert[\s\S]{0,200}?<strong>([\s\S]*?)<\/strong>/i.exec(block)?.[1] ??
    /Verkehrswert([\s\S]*?)(?:<TR|<tr[ >]|Termin<\/td>)/i.exec(block)?.[1];
  if (!zelle) return null;
  const text = clean(zelle).split(/\b(?:davon|hiervon|darin|darunter|einschließlich|inkl\.?|zzgl\.?|abzügl\.?)\b/i)[0];
  const werte = [
    ...new Set(
      [...text.matchAll(BETRAG_RE)]
        .map((t) => parseGermanNumber(t[0]))
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

function buildDeCaveats({ fileYear, appraisedValue, limitsWaived, proceedingKind }) {
  const list = [];
  const currentYear = new Date().getFullYear();
  if (fileYear && currentYear - fileYear >= 2) {
    list.push({
      points: 12,
      short: `Aktenzeichen aus ${fileYear}`,
      long: `Das Verfahren läuft seit ${fileYear}. Der Verkehrswert stammt in der Regel aus dem Gutachten zu Verfahrensbeginn und kann vom heutigen Marktwert abweichen.`,
    });
  }
  if (limitsWaived) {
    list.push({
      points: 0,
      short: "Wertgrenzen entfallen (§ 85a II ZVG)",
      long: "In diesem Termin gelten weder die 5/10- noch die 7/10-Grenze — ein Zuschlag ist grundsätzlich auch unter 50 % des Verkehrswerts möglich.",
    });
  }
  if (proceedingKind && /Teilung/i.test(proceedingKind)) {
    list.push({
      points: 0,
      short: "Teilungsversteigerung (§ 180 ZVG)",
      long: "Versteigerung zur Aufhebung einer Gemeinschaft (z. B. Erbengemeinschaft oder Scheidung). Miteigentümer dürfen selbst mitbieten.",
    });
  }
  if (!appraisedValue) {
    list.push({
      points: 10,
      short: "Kein Einzelverkehrswert im Kurzaushang",
      long: "Der Kurzaushang nennt keinen einzelnen Verkehrswert (oder mehrere BV-Nummern). Maßgeblich ist das amtliche Bekanntmachungs-PDF.",
    });
  }
  return list;
}

// ---------------------------------------------------------------------------
// 1. Fetch Germany Live (zvg-portal.de + zvg.com)
// ---------------------------------------------------------------------------
async function fetchZvgPortalState(state) {
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Referer: "https://www.zvg-portal.de/index.php?button=Termine%20suchen",
    "User-Agent": "Mozilla/5.0 (compatible; BelowmarkBot/1.0; +https://belowmark.com; contact@pycie.com)",
  };
  const baseParams = {
    order_by: "2",
    land_abk: state.portalCode,
    ger_id: "0",
    ger_name: "-- Alle Amtsgerichte --",
    az1: "", az2: "", az3: "", az4: "", art: "", obj: "",
    str: "", hnr: "", plz: "", ort: "", ortsteil: "", vtermin: "", btermin: "",
  };

  const [res, waivedRes] = await Promise.all([
    fetch("https://www.zvg-portal.de/index.php?button=Suchen&all=1", {
      method: "POST",
      headers,
      body: new URLSearchParams(baseParams).toString(),
    }),
    fetch("https://www.zvg-portal.de/index.php?button=Suchen&all=1", {
      method: "POST",
      headers,
      body: new URLSearchParams({ ...baseParams, hinweis: "on" }).toString(),
    }).catch(() => null),
  ]);

  const [html, waivedHtml] = await Promise.all([
    res.text(),
    waivedRes ? waivedRes.text().catch(() => "") : Promise.resolve(""),
  ]);

  const waivedZvgIds = new Set([...waivedHtml.matchAll(/zvg_id=(\d+)/g)].map((m) => m[1]));
  const waivedFileNos = new Set(
    [...waivedHtml.matchAll(/<nobr>([^<]*?K\s*\d[^<]*?)(?:&nbsp;)?(?:\(Detailansicht\))?<\/nobr>/g)].map((m) =>
      canonicalFileNo(clean(m[1]))
    )
  );

  const rows = [];
  for (const chunk of html.split(/<!--Aktenzeichen--->/).slice(1)) {
    const block = chunk.split(/<hr>/)[0];
    const zvgId = /zvg_id=(\d+)/.exec(block)?.[1] ?? null;
    const fileNo = clean(/<nobr>([^<]*?K\s*\d[^<]*?)(?:&nbsp;)?(?:\(Detailansicht\))?<\/nobr>/.exec(block)?.[1]);
    const court = clean(/Amtsgericht<\/td>[\s\S]*?<strong>([^<]*)<\/strong>/.exec(block)?.[1]);
    const objLine = /Objekt\/Lage<\/td>[\s\S]*?<strong>([\s\S]*?)<\/strong>([^<]*(?:<[^>]+>[^<]*)*?)<\/td>/.exec(block);
    const kind = clean(objLine?.[1]).replace(/\s*:$/, "");
    const address = clean(objLine?.[2]);
    const appraisedValue = parseVerkehrswert(block);
    const termin = parseTerminLine(clean(/Termin<\/td>([\s\S]*?)<\/tr>/.exec(block)?.[1]));
    const cancelled = /Termin[\s\S]{0,120}wurde aufgehoben/i.test(block);
    const limitsWaived =
      (zvgId && waivedZvgIds.has(zvgId)) ||
      (fileNo && waivedFileNos.has(canonicalFileNo(fileNo))) ||
      /Wertgrenzen\s+(?:sind\s+)?(?:entfallen|gelten\s+nicht|aufgehoben)/i.test(block);
    const pdfPath = /href="\?(button=showAnhang[^"]*)"/.exec(block)?.[1];
    if (!fileNo || !court || !termin) continue;

    const plzMatch = /(\d{5})/.exec(address);
    const postcode = plzMatch && plzMatch[1] !== "00000" ? plzMatch[1] : null;
    const cityRaw = plzMatch ? clean(address.slice(address.indexOf(plzMatch[1]) + 5)) : clean(address.split(",").pop());
    const street = address.includes(",") ? clean(address.split(",")[0]) : null;

    rows.push({
      source: "zvg-portal.de",
      state,
      zvgId,
      fileNo,
      court: deCourt(court),
      kind,
      address,
      street,
      postcode,
      city: cityRaw ? cityRaw.replace(/^,\s*/, "") : null,
      appraisedValue,
      hearingAt: termin.iso,
      cancelled,
      limitsWaived,
      officialUrl: zvgId
        ? `https://www.zvg-portal.de/index.php?button=showZvg&zvg_id=${zvgId}&land_abk=${state.portalCode}`
        : `https://www.zvg-portal.de/index.php?button=Termine%20suchen`,
      announcementPdf: pdfPath ? `https://www.zvg-portal.de/index.php?${pdfPath.trim()}` : null,
    });
  }
  return rows;
}

async function fetchZvgComAll() {
  const headers = {
    Referer: "https://www.zvg.com/",
    "User-Agent": "Mozilla/5.0 (compatible; BelowmarkBot/1.0; +https://belowmark.com; contact@pycie.com)",
    Accept: "application/json",
  };
  const [gridRes, blRes] = await Promise.all([
    fetch("https://www.zvg.com/v2024/termine.prg?act=getGridJson&id_b=0", { headers }).then((r) => r.json()),
    fetch("https://www.zvg.com/v2024/bundesland.prg?act=getData", { headers }).then((r) => r.json()).catch(() => ({ data: [] })),
  ]);

  // Build court -> state fallback map for courts where row.gericht.bundesland is empty
  const courtToState = new Map();
  const activeStates = (blRes?.data ?? []).filter((b) => b.Aktiv === 1 && b.Name);
  await mapLimit(activeStates, 4, async (b) => {
    try {
      const cRes = await fetch(`https://www.zvg.com/v2024/suche.prg?act=getComboAG&id=${b.Lfd}`, { headers }).then((r) => r.json());
      for (const opt of cRes?.options ?? []) {
        if (opt.value && opt.text) courtToState.set(opt.text.trim(), b.Name);
      }
    } catch {
      // Ignore individual combobox errors
    }
  });

  const rawRows = Array.isArray(gridRes) ? gridRes : Object.values(gridRes ?? {});
  const validRows = rawRows.filter((r) => r && r.id != null && r.ag && r.az && r.date);

  // Also fetch PDF links, full text & metadata for zvg.com objects in polite batches
  console.log(`  zvg.com: ${validRows.length} aktive Termine gefunden, lade Detailtexte & Dokument-Links ...`);
  const enriched = await mapLimit(validRows, 12, async (row) => {
    const stateName = row.gericht?.bundesland || courtToState.get(String(row.ag).trim()) || null;
    const state = STATE_BY_NAME_DE.get(stateName);
    if (!state) return null;

    const [pdfInfo, textHtml, jsonMeta] = await Promise.all([
      fetch(`https://www.zvg.com/v2024/termine.prg?act=getPDF&id=${row.id}`, { headers })
        .then((r) => r.json())
        .catch(() => null),
      fetch(`https://www.zvg.com/v2024/termine.prg?act=getText&id=${row.id}`, {
        headers: { ...headers, Accept: "text/html,*/*" },
      })
        .then((r) => (r.ok ? r.text() : ""))
        .catch(() => ""),
      fetch(`https://www.zvg.com/v2024/termine.prg?act=getJSON&id=${row.id}`, { headers })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    ]);

    const abs = (p) => {
      if (!p || typeof p !== "string") return null;
      if (/^https?:\/\//i.test(p)) return p;
      return p.startsWith("/") ? `https://www.zvg.com${p}` : null;
    };

    const iso = parseGermanDateIso(row.date, row.time);
    const cleanTitle = decodeHtmlText(String(row.title ?? "").replace(/^\s*\S+\s*K\s*\S+\s*:\s*/i, "").trim());
    const postcode = row.plz && row.plz !== "00000" ? String(row.plz).trim() : null;
    const city = row.city ? decodeHtmlText(String(row.city).trim()) : null;
    const street = row.street ? decodeHtmlText(String(row.street).trim()) : null;
    const appraisedValue = Number.isFinite(row.vwert) && row.vwert >= 500 ? row.vwert : null;
    const parsedDetails = parseZvgComData(textHtml, jsonMeta, { title: cleanTitle });

    return {
      source: "zvg.com",
      state,
      zvgId: String(row.id),
      fileNo: String(row.az).trim(),
      court: deCourt(row.ag),
      kind: cleanTitle.split(/\s+in\s+/i)[0] || cleanTitle,
      title: cleanTitle || `${row.ag} · ${row.az}`,
      street,
      postcode,
      city,
      appraisedValue,
      hearingAt: iso,
      cancelled: Boolean(row.terminAufgehoben),
      limitsWaived: /Wertgrenzen\s+(?:entfallen|gelten\s+nicht)/i.test(`${cleanTitle} ${parsedDetails.description ?? ""}`),
      officialUrl: `https://www.zvg.com/objekt/${row.id}/show`,
      imageUrl: row.img ? `https://www.zvg.com${String(row.img).replace("/vn_", "/")}` : null,
      announcementPdf: abs(pdfInfo?.pdf) ?? abs(pdfInfo?.expose) ?? null,
      exposeUrl: abs(pdfInfo?.expose) ?? null,
      biddingNotesUrl: abs(pdfInfo?.hinweis) ?? null,
      courtUrl: row.gericht?.url || null,
      details: parsedDetails,
    };
  });

  return enriched.filter(Boolean);
}

async function buildDeLive() {
  console.log("▸ Starte Live-Abruf Deutschland (zvg-portal.de alle 16 Länder + zvg.com) ...");
  const postcodes = readPoints("de");

  // Load previous dataset-de.json if present to preserve firstSeenAt and change history
  let prevByKey = new Map();
  let prevByIdentity = new Map();
  const oldDePath = join(process.cwd(), "data", "snapshots", "de.json");
  if (existsSync(oldDePath)) {
    try {
      const oldDe = JSON.parse(readFileSync(oldDePath, "utf8"));
      for (const l of oldDe.listings ?? []) {
        prevByKey.set(l.key, l);
        prevByIdentity.set(`${l.regionCode}|${l.authority}|${canonicalFileNo(l.fileNo)}`, l);
      }
    } catch {
      // Ignore
    }
  }

  const portalByState = await mapLimit(BUNDESLAENDER_DE, 4, async (state) => {
    try {
      const rows = await fetchZvgPortalState(state);
      console.log(`  zvg-portal.de · ${state.code.toUpperCase()}: ${rows.length} Termine`);
      return { state, rows, status: "complete" };
    } catch (err) {
      console.warn(`  ! zvg-portal.de · ${state.code.toUpperCase()} Fehler: ${err.message}`);
      return { state, rows: [], status: "error" };
    }
  });

  let zvgComRows = [];
  try {
    zvgComRows = await fetchZvgComAll();
    console.log(`  zvg.com · Bundesweit: ${zvgComRows.length} Termine geladen`);
  } catch (err) {
    console.warn(`  ! zvg.com Fehler: ${err.message}`);
  }

  const nowIso = new Date().toISOString();
  const byProceeding = new Map();
  const stateCounts = new Map(BUNDESLAENDER_DE.map((s) => [s.code, 0]));

  // 1. Insert zvg-portal.de rows first
  for (const { state, rows } of portalByState) {
    for (const r of rows) {
      const procId = `${state.code}|AG ${r.court}|${canonicalFileNo(r.fileNo)}`;
      if (byProceeding.has(procId)) continue;
      const key = r.zvgId ? `zvgportal-${r.zvgId}` : `zvgportal-${state.code}-${canonicalFileNo(r.fileNo).replace(/[^a-z0-9]/gi, "")}`;
      const prev = prevByKey.get(key) ?? prevByIdentity.get(procId);
      const geoportal = GEOPORTALS_DE[state.code];
      const fYear = fileNoYear(r.fileNo);
      const endIso = r.hearingAt ? new Date(Date.parse(r.hearingAt) + 30 * 60000).toISOString() : null;
      const fullTitle = [r.kind, r.address].filter(Boolean).join(": ") || `${r.court} · ${r.fileNo}`;

      byProceeding.set(procId, {
        key,
        market: "DE",
        country: "DE",
        currency: "EUR",
        sourcePortal: "zvg-portal.de",
        title: fullTitle,
        segment: deSegment(r.kind, fullTitle),
        segmentLabel: r.kind || null,
        region: state.name,
        regionCode: state.code,
        place: r.city || null,
        postcode: r.postcode,
        street: r.street,
        authority: `AG ${r.court}`,
        fileNo: r.fileNo,
        fileYear: fYear,
        rounds: r.hearingAt ? [{ round: 1, start: r.hearingAt, end: endIso }] : [],
        hearingAt: r.hearingAt,
        cancelled: r.cancelled,
        limitsWaived: r.limitsWaived,
        appraisedValue: r.appraisedValue,
        transferTaxPct: state.transferTaxPct,
        officialUrl: r.officialUrl,
        mapUrl: r.address ? `https://www.openstreetmap.org/search?query=${encodeURIComponent(r.address)}` : null,
        documentUrl: r.announcementPdf,
        geo: geoPoint(postcodes[r.postcode], "postcode"),
        history: prev?.history ?? [],
        geoportalUrl: geoportal?.url ?? null,
        geoportalName: geoportal?.name ?? null,
        caveats: buildDeCaveats({ fileYear: fYear, appraisedValue: r.appraisedValue, limitsWaived: r.limitsWaived }),
        firstSeenAt: prev?.firstSeenAt ?? nowIso,
      });
    }
  }

  // 2. Merge or add zvg.com rows (adds HH, MV, SH, BW courts and enriches existing proceedings with PDFs)
  let addedFromZvgCom = 0;
  let enrichedFromZvgCom = 0;
  for (const r of zvgComRows) {
    const state = r.state;
    const procId = `${state.code}|AG ${r.court}|${canonicalFileNo(r.fileNo)}`;
    const existing = byProceeding.get(procId);
    if (existing) {
      if (!existing.documentUrl && r.announcementPdf) existing.documentUrl = r.announcementPdf;
      if (!existing.imageUrl && r.imageUrl) existing.imageUrl = r.imageUrl;
      if (!existing.zvgComId && r.zvgId) existing.zvgComId = r.zvgId;
      if (!existing.appraisedValue && r.appraisedValue) existing.appraisedValue = r.appraisedValue;
      if (!existing.exposeUrl && r.exposeUrl) existing.exposeUrl = r.exposeUrl;
      if (!existing.biddingNotesUrl && r.biddingNotesUrl) existing.biddingNotesUrl = r.biddingNotesUrl;
      if (!existing.courtUrl && r.courtUrl) existing.courtUrl = r.courtUrl;
      if (!existing._zvgComDetails && r.details) existing._zvgComDetails = r.details;
      if (!existing.postcode && r.postcode) {
        existing.postcode = r.postcode;
        existing.geo = geoPoint(postcodes[r.postcode], "postcode");
      }
      enrichedFromZvgCom++;
      continue;
    }

    const key = `zvgcom-${r.zvgId}`;
    const prev = prevByKey.get(key) ?? prevByIdentity.get(procId);
    const geoportal = GEOPORTALS_DE[state.code];
    const fYear = fileNoYear(r.fileNo);
    const endIso = r.hearingAt ? new Date(Date.parse(r.hearingAt) + 30 * 60000).toISOString() : null;
    const addr = [r.street, [r.postcode, r.city].filter(Boolean).join(" ")].filter(Boolean).join(", ");

    byProceeding.set(procId, {
      key,
      market: "DE",
      country: "DE",
      currency: "EUR",
      sourcePortal: "zvg.com",
      title: r.title,
      segment: deSegment(r.kind, r.title),
      segmentLabel: r.kind || null,
      region: state.name,
      regionCode: state.code,
      place: r.city || null,
      postcode: r.postcode,
      street: r.street,
      authority: `AG ${r.court}`,
      fileNo: r.fileNo,
      fileYear: fYear,
      rounds: r.hearingAt ? [{ round: 1, start: r.hearingAt, end: endIso }] : [],
      hearingAt: r.hearingAt,
      cancelled: r.cancelled,
      limitsWaived: r.limitsWaived,
      appraisedValue: r.appraisedValue,
      transferTaxPct: state.transferTaxPct,
      officialUrl: r.officialUrl,
      imageUrl: r.imageUrl ?? null,
      zvgComId: r.zvgId,
      exposeUrl: r.exposeUrl ?? null,
      biddingNotesUrl: r.biddingNotesUrl ?? null,
      courtUrl: r.courtUrl ?? null,
      _zvgComDetails: r.details ?? null,
      mapUrl: addr ? `https://www.openstreetmap.org/search?query=${encodeURIComponent(addr)}` : null,
      documentUrl: r.announcementPdf,
      geo: geoPoint(postcodes[r.postcode], "postcode"),
      history: prev?.history ?? [],
      geoportalUrl: geoportal?.url ?? null,
      geoportalName: geoportal?.name ?? null,
      caveats: buildDeCaveats({ fileYear: fYear, appraisedValue: r.appraisedValue, limitsWaived: r.limitsWaived }),
      firstSeenAt: prev?.firstSeenAt ?? nowIso,
    });
    addedFromZvgCom++;
  }

  const listings = [...byProceeding.values()];

  // 3. Enrich all DE listings with showZvg / zvg.com detail pages (areas, rooms, yearBuilt, Grundbuch, description, attachments)
  const portalCacheDir = join(process.cwd(), ".data", "portal-cache");
  mkdirSync(portalCacheDir, { recursive: true });
  console.log(`  ▸ Lade Detailseiten (Grundbuch, Wohn-/Grundstücksflächen, Beschreibung) für ${listings.length} DE-Verfahren ...`);

  let detailFetched = 0;
  let detailFromCache = 0;
  await mapLimit(listings, 24, async (l) => {
    const cacheFile = join(portalCacheDir, `${l.key.replace(/[^a-zA-Z0-9_-]/g, "_")}.json`);
    let parsed = null;

    if (existsSync(cacheFile)) {
      try {
        const cached = JSON.parse(readFileSync(cacheFile, "utf8"));
        if (cached && (cached.description || cached.grundbuch || cached.livingAreaM2 || cached.landAreaM2)) {
          parsed = cached;
          detailFromCache++;
        }
      } catch {
        parsed = null;
      }
    }

    if (!parsed && l.officialUrl?.includes("zvg-portal.de") && l.officialUrl?.includes("zvg_id=")) {
      try {
        const res = await fetch(l.officialUrl, {
          headers: {
            Referer: "https://www.zvg-portal.de/index.php?button=Suchen&all=1",
            "User-Agent": "Mozilla/5.0 (compatible; BelowmarkBot/1.0; +https://belowmark.com; contact@pycie.com)",
          },
        });
        if (res.ok) {
          const buf = await res.arrayBuffer();
          let html = new TextDecoder("utf-8", { fatal: false }).decode(buf);
          if (html.includes("\uFFFD")) {
            html = new TextDecoder("iso-8859-1").decode(buf);
          }
          parsed = parseZvgPortalHtml(html, l);
          detailFetched++;
        }
      } catch {
        parsed = null;
      }
    }

    const zc = l._zvgComDetails ?? null;
    delete l._zvgComDetails;

    const livingAreaM2 = parsed?.livingAreaM2 ?? zc?.livingAreaM2 ?? extractDeLivingArea(l.title);
    const usableAreaM2 = parsed?.usableAreaM2 ?? zc?.usableAreaM2 ?? extractDeUsableArea(l.title);
    const landAreaM2 = parsed?.landAreaM2 ?? zc?.landAreaM2 ?? extractDeLandArea(l.title);
    const areaM2 = livingAreaM2 ?? usableAreaM2 ?? landAreaM2 ?? null;
    const areaKind = livingAreaM2 || usableAreaM2 ? "Wohn-/Nutzfläche" : landAreaM2 ? "Grundstücksfläche" : null;
    const rooms = parsed?.rooms ?? zc?.rooms ?? extractDeRooms(l.title);
    const yearBuilt = parsed?.yearBuilt ?? zc?.yearBuilt ?? extractYearBuilt(l.title);
    const grundbuch = parsed?.grundbuch ?? zc?.grundbuch ?? null;
    const proceedingKind = parsed?.proceedingKind ?? zc?.proceedingKind ?? "Zwangsversteigerung";
    const description = parsed?.description ?? zc?.description ?? l.title;
    const hearingPlace = parsed?.hearingPlace ?? zc?.hearingPlace ?? null;
    const creditor = parsed?.creditor ?? zc?.creditor ?? null;

    if (!l.postcode && parsed?.postcode) {
      l.postcode = parsed.postcode;
      l.geo = geoPoint(postcodes[parsed.postcode], "postcode");
    }

    const attachments = parsed?.attachments ?? [];
    const findAttUrl = (k) => attachments.find((a) => a.kind === k)?.directUrl ?? null;
    if (!l.documentUrl) l.documentUrl = findAttUrl("announcement") ?? attachments[0]?.directUrl ?? null;
    l.exposeUrl = l.exposeUrl ?? findAttUrl("expose") ?? null;
    l.reportUrl = l.reportUrl ?? findAttUrl("report") ?? null;
    l.biddingNotesUrl = l.biddingNotesUrl ?? findAttUrl("notes") ?? null;
    const rawCourtUrl = l.courtUrl ?? parsed?.courtUrl ?? null;
    if (rawCourtUrl) {
      try {
        l.courtUrl = new URL(rawCourtUrl, "https://www.zvg-portal.de/index.php").toString();
      } catch {
        l.courtUrl = rawCourtUrl;
      }
    } else {
      l.courtUrl = null;
    }
    l.geoServerUrl = parsed?.geoServerUrl ?? null;

    l.livingAreaM2 = livingAreaM2;
    l.usableAreaM2 = usableAreaM2;
    l.landAreaM2 = landAreaM2;
    l.areaM2 = areaM2;
    l.areaKind = areaKind;
    l.rooms = rooms;
    l.yearBuilt = yearBuilt;
    l.grundbuch = grundbuch;
    l.proceedingKind = proceedingKind;
    l.description = description;
    l.hearingPlace = hearingPlace;
    l.creditor = creditor;

    // Refine segment if description has clearer classification
    if (l.segment === "other" && description) {
      l.segment = deSegment(l.segmentLabel, `${l.title} ${description}`);
    }

    l.caveats = buildDeCaveats({
      fileYear: l.fileYear,
      appraisedValue: l.appraisedValue,
      limitsWaived: l.limitsWaived,
      proceedingKind,
    });

    // Save warm OfficialPortalDetails to .data/portal-cache/${l.key}.json
    if (parsed || zc) {
      const encodedKey = encodeURIComponent(l.key);
      const zvgComAtts = [];
      if (l.key.startsWith("zvgcom-")) {
        if (l.documentUrl) {
          zvgComAtts.push({
            id: "bekanntmachung",
            kind: "announcement",
            label: "Amtliche Terminbestimmung (PDF)",
            fileName: `Bekanntmachung-${l.zvgComId ?? l.key}.pdf`,
            proxyUrl: `/api/quelle/${encodedKey}?doc=announcement`,
            directUrl: l.documentUrl,
          });
        }
        if (l.exposeUrl && l.exposeUrl !== l.documentUrl) {
          zvgComAtts.push({
            id: "expose",
            kind: "expose",
            label: "Kurzexposé / Objektbeschreibung (PDF)",
            fileName: `Expose-${l.zvgComId ?? l.key}.pdf`,
            proxyUrl: `/api/quelle/${encodedKey}?doc=expose`,
            directUrl: l.exposeUrl,
          });
        }
        if (l.biddingNotesUrl) {
          zvgComAtts.push({
            id: "hinweise",
            kind: "notes",
            label: "Bieterhinweise des Amtsgerichts",
            fileName: `Bieterhinweise-${l.zvgComId ?? l.key}.pdf`,
            proxyUrl: `/api/quelle/${encodedKey}?doc=notes`,
            directUrl: l.biddingNotesUrl,
          });
        }
      }
      const cachePayload = {
        key: l.key,
        source: l.key.startsWith("zvgcom-") ? "zvg.com" : "zvg-portal.de",
        fetchedAt: nowIso,
        proceedingKind,
        grundbuch,
        description,
        hearingPlace,
        creditor,
        livingAreaM2,
        usableAreaM2,
        landAreaM2,
        netAreaM2: null,
        rooms,
        floor: null,
        yearBuilt,
        unitNo: null,
        arsaPayi: null,
        zoning: null,
        ownershipShare: null,
        vatRate: null,
        courtUrl: l.courtUrl,
        geoServerUrl: l.geoServerUrl,
        attachments: attachments.length > 0 ? attachments : zvgComAtts,
      };
      try {
        writeFileSync(cacheFile, JSON.stringify(cachePayload));
      } catch {
        // Ignore cache write errors
      }
    }
  });

  const withAreaCount = listings.filter((l) => l.livingAreaM2 || l.usableAreaM2 || l.landAreaM2).length;
  console.log(
    `  → DE Detail-Extraktion: ${detailFetched} neu geladen, ${detailFromCache} aus Cache, ${withAreaCount}/${listings.length} mit Flächenangabe (m²)`,
  );

  // 4. Fetch Austria (edikte.justiz.gv.at — all 9 Bundesländer)
  const atListings = await fetchAtEdikteAll(postcodes, prevByKey, portalCacheDir, nowIso);
  listings.push(...atListings);

  // 5. Fetch Switzerland (shab.ch — all 26 Kantone, SB01 & KK08)
  const chListings = await fetchChShabAll(postcodes, prevByKey, portalCacheDir, nowIso);
  listings.push(...chListings);

  // 6. Fetch Italy (astegiudiziarie.it — all 20 Regioni)
  const itListings = await fetchItAsteAll(prevByKey, portalCacheDir, nowIso);
  listings.push(...itListings);

  // 7. Fetch Spain (subastas.boe.es — Portal de Subastas BOE)
  const esListings = await fetchEsBoeAll(prevByKey, portalCacheDir, nowIso);
  listings.push(...esListings);

  // 8. Fetch France (licitor.com — Ventes Judiciaires Tribunaux Judiciaires)
  const frListings = await fetchFrLicitorAll(prevByKey, portalCacheDir, nowIso);
  listings.push(...frListings);

  // 9. Fetch United Kingdom (btgeddisonspropertyauctions.com — UK Property Auctions)
  const gbListings = await fetchGbAuctionsAll(prevByKey, portalCacheDir, nowIso);
  listings.push(...gbListings);

  const allStates = [
    ...BUNDESLAENDER_DE,
    ...BUNDESLAENDER_AT,
    ...KANTONE_CH,
    ...REGIONEN_IT,
    ...REGIONEN_ES,
    ...REGIONEN_FR,
    ...REGIONEN_GB,
  ];
  for (const s of allStates) {
    stateCounts.set(s.code, 0);
  }
  for (const l of listings) {
    if (l.regionCode) stateCounts.set(l.regionCode, (stateCounts.get(l.regionCode) ?? 0) + 1);
  }

  const deOnlyCount =
    listings.length -
    atListings.length -
    chListings.length -
    itListings.length -
    esListings.length -
    frListings.length -
    gbListings.length;
  console.log(
    `  → Europa Gesamt: ${listings.length} Verfahren (DE: ${deOnlyCount}, AT: ${atListings.length}, CH: ${chListings.length}, IT: ${itListings.length}, ES: ${esListings.length}, FR: ${frListings.length}, GB: ${gbListings.length})`,
  );

  return {
    meta: {
      market: "DE",
      generatedAt: nowIso,
      source: "zvg-portal.de · zvg.com · edikte.justiz.gv.at · shab.ch · astegiudiziarie.it · subastas.boe.es · licitor.com · btgeddisonspropertyauctions.com",
      sourceUrl: "https://www.zvg-portal.de/",
      states: allStates.map((s) => ({
        code: s.code,
        name: s.name,
        status: "complete",
        included: stateCounts.get(s.code) ?? 0,
      })),
    },
    listings,
  };
}

// ---------------------------------------------------------------------------
// 1b. Fetch Austria Live (edikte.justiz.gv.at — all 9 Bundesländer)
// ---------------------------------------------------------------------------
async function fetchAtEdikteAll(postcodes, prevByKey, portalCacheDir, nowIso) {
  console.log("  ▸ Starte Live-Abruf Österreich (edikte.justiz.gv.at · alle 9 Bundesländer) ...");
  const candidateRows = [];

  await mapLimit(BUNDESLAENDER_AT, 5, async (state) => {
    try {
      const url = `https://edikte.justiz.gv.at/edikte/ex/exedi3.nsf/suchedi?SearchView&subf=eex&SearchOrder=4&SearchMax=1000&retfields=~BL=${state.bl}&ftquery=&query=%28%5BBL%5D%3D%28${state.bl}%29%29`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; BelowmarkBot/1.0; +https://belowmark.com; contact@pycie.com)",
          Accept: "text/html,application/xhtml+xml",
        },
      });
      if (!res.ok) return;
      const html = await res.text();
      const trs = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
      let stateCount = 0;
      for (const tr of trs) {
        const rowHtml = tr[1];
        const m = /href="alldoc\/([a-f0-9]+)!OpenDocument"[^>]*>([\s\S]*?)<\/a>/i.exec(rowHtml);
        if (!m) continue;
        const docId = m[1];
        const linkText = decodeHtmlText(m[2]);
        // Only include scheduled auctions (Versteigerung / Schriftliche Anbote) and cancelled dates (Entfall des Termins)
        if (!/^(?:Versteigerung|Entfall|Schriftliche Anbote)/i.test(linkText)) continue;
        const cancelled = /^(?:Entfall|Aufschiebung|Einstellung)/i.test(linkText);
        const tds = [...rowHtml.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((x) => decodeHtmlText(x[1]));
        candidateRows.push({
          docId,
          state,
          cancelled,
          linkText,
          addressCol: tds[1] ?? "",
          categoryCol: tds[2] ?? "",
        });
        stateCount++;
      }
      console.log(`    edikte.justiz.gv.at · ${state.name}: ${stateCount} Verfahren`);
    } catch (err) {
      console.warn(`    ! edikte.justiz.gv.at · ${state.name} Fehler: ${err.message}`);
    }
  });

  const out = [];
  await mapLimit(candidateRows, 20, async (item) => {
    const key = `edikte-${item.docId}`;
    const officialUrl = `https://edikte.justiz.gv.at/edikte/ex/exedi3.nsf/alldoc/${item.docId}!OpenDocument`;
    const cacheFile = join(portalCacheDir, `${key}.json`);
    let parsed = null;

    if (existsSync(cacheFile)) {
      try {
        const cached = JSON.parse(readFileSync(cacheFile, "utf8"));
        if (cached && cached.fileNo) parsed = cached;
      } catch {
        parsed = null;
      }
    }

    if (!parsed) {
      try {
        const res = await fetch(officialUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; BelowmarkBot/1.0; +https://belowmark.com; contact@pycie.com)",
            Accept: "text/html,application/xhtml+xml",
          },
        });
        if (res.ok) {
          const html = await res.text();
          parsed = parseAtEdiktHtml(html, { key });
          if (parsed) {
            try {
              writeFileSync(cacheFile, JSON.stringify({ key, source: "edikte.justiz.gv.at", fetchedAt: nowIso, ...parsed }));
            } catch {
              // Ignore
            }
          }
        }
      } catch {
        parsed = null;
      }
    }

    if (!parsed) return;
    const prev = prevByKey.get(key);
    const postcode = parsed.postcode;
    const place = parsed.place;
    const street = parsed.street;
    const title = [parsed.segmentLabel || item.categoryCol, [postcode, place].filter(Boolean).join(" "), street].filter(Boolean).join(", ") || item.linkText;
    const hearingAt = parsed.hearingAt;
    const endIso = hearingAt ? new Date(Date.parse(hearingAt) + 60 * 60000).toISOString() : null;
    const fYear = fileNoYear(parsed.fileNo);
    const pt = (postcode && postcodes[`AT-${postcode}`]) || postcodes[item.state.code.toUpperCase()] || null;
    const precision = postcode && postcodes[`AT-${postcode}`] ? "postcode" : "province";

    const attachments = parsed.attachments ?? [];
    const findAtt = (k) => attachments.find((a) => a.kind === k)?.directUrl ?? null;
    const livingAreaM2 = parsed.livingAreaM2 ?? null;
    const usableAreaM2 = parsed.usableAreaM2 ?? null;
    const landAreaM2 = parsed.landAreaM2 ?? null;
    const areaM2 = livingAreaM2 ?? usableAreaM2 ?? landAreaM2 ?? null;
    const areaKind = livingAreaM2 || usableAreaM2 ? "Wohn-/Nutzfläche" : landAreaM2 ? "Grundstücksfläche" : null;

    const caveats = [];
    if (parsed.appraisedValue === null) {
      caveats.push({
        points: 10,
        short: "Schätzwert nicht im Kurzedikt",
        long: "Der Schätzwert ist nur im beigefügten Gutachten ausgewiesen.",
      });
    }

    out.push({
      key,
      market: "DE",
      country: "AT",
      currency: "EUR",
      sourcePortal: "edikte.justiz.gv.at",
      title,
      segment: parsed.segment ?? "other",
      segmentLabel: parsed.segmentLabel || item.categoryCol || null,
      region: item.state.name,
      regionCode: item.state.code,
      place,
      postcode,
      street,
      authority: parsed.authority || "Bezirksgericht",
      fileNo: parsed.fileNo || item.docId.slice(-8),
      fileYear: fYear,
      rounds: hearingAt ? [{ round: 1, start: hearingAt, end: endIso }] : [],
      hearingAt,
      cancelled: item.cancelled,
      limitsWaived: false,
      appraisedValue: parsed.appraisedValue ?? null,
      minimumBid: parsed.minimumBid ?? null,
      depositAmount: parsed.depositAmount ?? null,
      transferTaxPct: item.state.transferTaxPct,
      livingAreaM2,
      usableAreaM2,
      landAreaM2,
      areaM2,
      areaKind,
      rooms: parsed.rooms ?? null,
      yearBuilt: parsed.yearBuilt ?? null,
      grundbuch: parsed.grundbuch ?? null,
      proceedingKind: parsed.proceedingKind ?? "Zwangsversteigerung einer Liegenschaft (EO)",
      description: parsed.description ?? null,
      hearingPlace: parsed.hearingPlace ?? null,
      creditor: null,
      officialUrl,
      mapUrl: [street, postcode, place, "Österreich"].filter(Boolean).length > 1
        ? `https://www.openstreetmap.org/search?query=${encodeURIComponent([street, postcode, place, "Österreich"].filter(Boolean).join(", "))}`
        : null,
      documentUrl: findAtt("report") ?? findAtt("expose") ?? attachments[0]?.directUrl ?? null,
      exposeUrl: findAtt("expose") ?? null,
      reportUrl: findAtt("report") ?? null,
      biddingNotesUrl: null,
      courtUrl: parsed.courtUrl ?? null,
      geoServerUrl: null,
      geo: geoPoint(pt, precision),
      history: prev?.history ?? [],
      geoportalUrl: item.state.geoportalUrl,
      geoportalName: item.state.geoportalName,
      caveats,
      firstSeenAt: parsed.firstSeenAt ?? prev?.firstSeenAt ?? nowIso,
    });
  });

  console.log(`  → AT Gesamt: ${out.length} Verfahren geladen (edikte.justiz.gv.at)`);
  return out;
}

// ---------------------------------------------------------------------------
// 1c. Fetch Switzerland Live (shab.ch — all 26 Kantone, SB01 & KK08)
// ---------------------------------------------------------------------------
async function fetchChShabAll(postcodes, prevByKey, portalCacheDir, nowIso) {
  console.log("  ▸ Starte Live-Abruf Schweiz (shab.ch · SB01 & KK08 alle 26 Kantone) ...");
  const startCutoff = new Date(Date.now() - 180 * 86_400_000).toISOString().slice(0, 10);
  const pubSummaries = [];

  for (let page = 0; page < 8; page++) {
    try {
      const url = `https://www.shab.ch/api/v1/publications?publicationStates=PUBLISHED,CANCELLED&subRubrics=SB01,KK08&publicationDate.start=${startCutoff}&pageRequest.page=${page}&pageRequest.size=100`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; BelowmarkBot/1.0; +https://belowmark.com; contact@pycie.com)",
          Accept: "application/json",
        },
      });
      if (!res.ok) break;
      const data = await res.json();
      const content = data.content ?? [];
      pubSummaries.push(...content);
      if (data.last || content.length < 100) break;
    } catch (err) {
      console.warn(`    ! shab.ch Seite ${page} Fehler: ${err.message}`);
      break;
    }
  }

  console.log(`    shab.ch · ${pubSummaries.length} Publikationen gefunden, lade XML-Details ...`);
  const out = [];

  await mapLimit(pubSummaries, 20, async (pub) => {
    const meta = pub.meta ?? {};
    const pubId = meta.id;
    if (!pubId) return;
    const key = `shab-${pubId}`;
    const cacheFile = join(portalCacheDir, `${key}.json`);
    let parsed = null;

    if (existsSync(cacheFile)) {
      try {
        const cached = JSON.parse(readFileSync(cacheFile, "utf8"));
        if (cached && cached.fileNo) parsed = cached;
      } catch {
        parsed = null;
      }
    }

    if (!parsed) {
      try {
        const xmlUrl = `https://www.shab.ch/api/v1/publications/${pubId}/xml`;
        const res = await fetch(xmlUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; BelowmarkBot/1.0; +https://belowmark.com; contact@pycie.com)",
            Accept: "application/xml,text/xml",
          },
        });
        if (res.ok) {
          const xml = await res.text();
          parsed = parseChShabXml(xml, { key });
          if (parsed) {
            try {
              writeFileSync(cacheFile, JSON.stringify({ key, source: "shab.ch", fetchedAt: nowIso, ...parsed }));
            } catch {
              // Ignore
            }
          }
        }
      } catch {
        parsed = null;
      }
    }

    if (!parsed) return;
    const cantonCode = parsed.cantonCode || (meta.cantons?.[0] ?? "ZH");
    const canton = CANTON_BY_CODE_CH.get(cantonCode) ?? KANTONE_CH[0];
    const titleRaw = meta.title?.de || meta.title?.fr || meta.title?.it || meta.title?.en || "";
    const isRevocation = /Widerruf|Révocation|Revoca|Absage|Annullation|Annullamento/i.test(titleRaw) || meta.publicationState === "CANCELLED";
    const postcode = parsed.postcode;
    const place = parsed.place;
    const hearingAt = parsed.hearingAt;
    const endIso = hearingAt ? new Date(Date.parse(hearingAt) + 60 * 60000).toISOString() : null;
    const pt = (postcode && postcodes[`CH-${postcode}`]) || postcodes[canton.code.toUpperCase()] || null;
    const precision = postcode && postcodes[`CH-${postcode}`] ? "postcode" : "province";
    const prev = prevByKey.get(key);

    const livingAreaM2 = parsed.livingAreaM2 ?? null;
    const usableAreaM2 = parsed.usableAreaM2 ?? null;
    const landAreaM2 = parsed.landAreaM2 ?? null;
    const areaM2 = livingAreaM2 ?? usableAreaM2 ?? landAreaM2 ?? null;
    const areaKind = livingAreaM2 || usableAreaM2 ? "Wohn-/Nutzfläche" : landAreaM2 ? "Grundstücksfläche" : null;
    const pdfUrl = `https://www.shab.ch/api/v1/publications/${pubId}/pdf`;
    const officialUrl = `https://www.shab.ch/#!/search/publications/detail/${pubId}`;

    const caveats = [];
    if (parsed.appraisedValue === null) {
      caveats.push({
        points: 10,
        short: "Schätzung erst in Steigerungsbedingungen",
        long: "Die betreibungs- oder konkursamtliche Schätzung liegt während der Auflagefrist beim Amt zur Einsicht auf.",
      });
    }

    out.push({
      key,
      market: "DE",
      country: "CH",
      currency: "CHF",
      sourcePortal: "shab.ch",
      title: decodeHtmlText(titleRaw) || `${parsed.authority} · ${place ?? canton.name}`,
      segment: parsed.segment ?? "other",
      segmentLabel: meta.subRubric === "KK08" ? "Konkursamtliche Steigerung" : "Betreibungsamtliche Steigerung",
      region: canton.name,
      regionCode: canton.code,
      place,
      postcode,
      street: null,
      authority: parsed.authority || "Betreibungsamt",
      fileNo: parsed.fileNo || meta.publicationNumber || pubId.slice(0, 12),
      fileYear: parsed.firstSeenAt ? Number.parseInt(parsed.firstSeenAt.slice(0, 4), 10) : null,
      rounds: hearingAt ? [{ round: 1, start: hearingAt, end: endIso }] : [],
      hearingAt,
      cancelled: isRevocation,
      limitsWaived: true,
      appraisedValue: parsed.appraisedValue ?? null,
      minimumBid: null,
      depositAmount: parsed.depositAmount ?? null,
      transferTaxPct: canton.transferTaxPct,
      livingAreaM2,
      usableAreaM2,
      landAreaM2,
      areaM2,
      areaKind,
      rooms: parsed.rooms ?? null,
      yearBuilt: parsed.yearBuilt ?? null,
      grundbuch: parsed.grundbuch ?? null,
      proceedingKind: parsed.proceedingKind,
      description: parsed.description ?? null,
      hearingPlace: parsed.hearingPlace ?? null,
      creditor: null,
      officialUrl,
      mapUrl: [postcode, place, "Schweiz"].filter(Boolean).length > 1
        ? `https://www.openstreetmap.org/search?query=${encodeURIComponent([postcode, place, "Schweiz"].filter(Boolean).join(", "))}`
        : null,
      documentUrl: pdfUrl,
      exposeUrl: null,
      reportUrl: null,
      biddingNotesUrl: null,
      courtUrl: null,
      geoServerUrl: "https://map.geo.admin.ch/",
      geo: geoPoint(pt, precision),
      history: prev?.history ?? [],
      geoportalUrl: "https://map.geo.admin.ch/",
      geoportalName: "Geoportal des Bundes · swisstopo",
      caveats,
      firstSeenAt: parsed.firstSeenAt ?? prev?.firstSeenAt ?? nowIso,
    });
  });

  console.log(`  → CH Gesamt: ${out.length} Verfahren geladen (shab.ch)`);
  return out;
}

// ---------------------------------------------------------------------------
// 1d. Fetch Italy Live (astegiudiziarie.it — all 20 Regioni)
// ---------------------------------------------------------------------------
async function fetchItAsteAll(prevByKey, portalCacheDir, nowIso) {
  console.log("  ▸ Starte Live-Abruf Italien (astegiudiziarie.it · alle 20 Regionen) ...");
  const out = [];
  try {
    const searchParameters = {
      tipoRicerca: 1,
      idGenere: 1,
      indirizzo: null,
      latitudine: null,
      longitudine: null,
      latitudineNW: null,
      longitudineNW: null,
      latitudineSE: null,
      longitudineSE: null,
      noGeo: false,
      idEsperimentoVendita: null,
      idTipologie: [],
      tipologia: null,
      idCategorie: [],
      categoria: null,
      descrizione: null,
      comune: null,
      provincia: null,
      regione: null,
      cap: null,
      ricercaCap: null,
      prezzoDa: null,
      prezzoA: null,
      priceMax: 0.0,
      priceSteps: null,
      tipologie: null,
      idTribunale: null,
      tribunale: null,
      numeroProcedura: null,
      annoProcedura: null,
      ruolo: null,
      idTipologiaProcedura: null,
      giudice: null,
      professionista: null,
      idTipologiaVendita: null,
      idModalitaVendita: null,
      idPubblicazione: null,
      dataVenditaDa: null,
      dataVenditaA: null,
      codiceAsta: null,
      hasFoto: null,
      hasPlanimetrie: null,
      hasVirtualTour: null,
      hasVideo: null,
      bandita: null,
      telematica: null,
      inScadenza: null,
      lottoUnico: null,
      venditeAGI: null,
      storica: false,
      vetrina: false,
      sezione: null,
      searchOnMap: false,
      tribunali: null,
      tipologieProcedura: null,
      tipologieVendita: null,
      modalitaVendita: null,
      numeroPubblicazioni: null,
      listaIdLotto: null,
      idProcedura: null,
      orderBy: 6,
    };

    const rMap = await fetch("https://webapi.astegiudiziarie.it/api/search/map", {
      method: "POST",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BelowmarkBot/1.0; +https://belowmark.com; contact@pycie.com)",
        "Content-Type": "application/json",
        Origin: "https://www.astegiudiziarie.it",
        Referer: "https://www.astegiudiziarie.it/",
      },
      body: JSON.stringify(searchParameters),
    });
    if (!rMap.ok) return out;
    const mapRaw = await rMap.json();
    const mapItems = (Array.isArray(mapRaw) ? mapRaw : Object.values(mapRaw ?? {}))
      .filter((m) => m && m.idLotto && m.geolocalizzato && m.latitudine && m.longitudine)
      .slice(0, 300);

    const coordsById = new Map(mapItems.map((m) => [m.idLotto, { lat: Number(m.latitudine), lng: Number(m.longitudine) }]));
    const chunks = [];
    for (let i = 0; i < mapItems.length; i += 50) {
      chunks.push(mapItems.slice(i, i + 50).map((m) => m.idLotto));
    }

    const detailedLots = [];
    await mapLimit(chunks, 3, async (idChunk) => {
      try {
        const rData = await fetch("https://webapi.astegiudiziarie.it/api/search/Data", {
          method: "POST",
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; BelowmarkBot/1.0; +https://belowmark.com; contact@pycie.com)",
            "Content-Type": "application/json",
            Origin: "https://www.astegiudiziarie.it",
            Referer: "https://www.astegiudiziarie.it/",
          },
          body: JSON.stringify(idChunk),
        });
        if (rData.ok) {
          const items = await rData.json();
          if (Array.isArray(items)) detailedLots.push(...items);
        }
      } catch {
        // Ignore single batch error
      }
    });

    for (const item of detailedLots) {
      const parsed = parseItAsteItem(item, coordsById.get(item.idLotto));
      if (!parsed || !parsed.appraisedValue) continue;
      const key = parsed.key;
      const cacheFile = join(portalCacheDir, `${key}.json`);
      try {
        writeFileSync(cacheFile, JSON.stringify({ key, source: "astegiudiziarie.it", fetchedAt: nowIso, ...parsed }));
      } catch {
        // Ignore
      }

      const reg = REGION_BY_KEY_IT.get(parsed.state) ?? REGIONEN_IT[0];
      const prev = prevByKey.get(key);
      const hearingAt = parsed.hearingAt;
      const endIso = hearingAt ? new Date(Date.parse(hearingAt) + 60 * 60000).toISOString() : null;
      const livingAreaM2 = parsed.livingAreaM2 ?? null;
      const landAreaM2 = parsed.landAreaM2 ?? null;
      const areaM2 = livingAreaM2 ?? landAreaM2 ?? null;
      const areaKind = livingAreaM2 ? "Wohn-/Nutzfläche" : landAreaM2 ? "Grundstücksfläche" : null;
      const title = [parsed.segmentLabel, parsed.place, parsed.street].filter(Boolean).join(", ") || `${parsed.authority} · ${parsed.fileNo}`;

      out.push({
        key,
        market: "DE",
        country: "IT",
        currency: "EUR",
        sourcePortal: "astegiudiziarie.it",
        title,
        segment: parsed.segment ?? "other",
        segmentLabel: parsed.segmentLabel,
        region: reg.name,
        regionCode: reg.code,
        place: parsed.place,
        postcode: parsed.postcode,
        street: parsed.street,
        authority: parsed.authority,
        fileNo: parsed.fileNo,
        fileYear: item.annoProcedura ? Number(item.annoProcedura) : null,
        rounds: hearingAt ? [{ round: 1, start: hearingAt, end: endIso }] : [],
        hearingAt,
        cancelled: false,
        limitsWaived: false,
        appraisedValue: parsed.appraisedValue,
        minimumBid: parsed.minimumBid,
        depositAmount: parsed.depositAmount,
        transferTaxPct: reg.transferTaxPct,
        livingAreaM2,
        usableAreaM2: null,
        landAreaM2,
        areaM2,
        areaKind,
        rooms: parsed.rooms,
        yearBuilt: parsed.yearBuilt,
        grundbuch: parsed.grundbuch,
        proceedingKind: parsed.proceedingKind,
        description: parsed.description,
        hearingPlace: "Vendita Telematica (PVP Giustizia)",
        creditor: null,
        officialUrl: parsed.detailUrl,
        imageUrl: parsed.attachments?.[0]?.directUrl ?? null,
        mapUrl: parsed.lat && parsed.lng ? `https://www.openstreetmap.org/?mlat=${parsed.lat}&mlon=${parsed.lng}#map=16/${parsed.lat}/${parsed.lng}` : null,
        documentUrl: parsed.detailUrl,
        exposeUrl: null,
        reportUrl: null,
        biddingNotesUrl: null,
        courtUrl: "https://pvp.giustizia.it/pvp/",
        geoServerUrl: "https://geoportale.cartografia.agenziaentrate.gov.it/",
        geo: parsed.lat && parsed.lng ? { lat: parsed.lat, lng: parsed.lng, precision: "exact" } : null,
        history: prev?.history ?? [],
        geoportalUrl: "https://geoportale.cartografia.agenziaentrate.gov.it/",
        geoportalName: "Geoportale Catastale · Agenzia delle Entrate",
        caveats: [],
        firstSeenAt: parsed.firstSeenAt ?? prev?.firstSeenAt ?? nowIso,
      });
    }
  } catch (err) {
    console.warn(`    ! astegiudiziarie.it Fehler: ${err.message}`);
  }
  console.log(`  → IT Gesamt: ${out.length} Verfahren geladen (astegiudiziarie.it)`);
  return out;
}

// ---------------------------------------------------------------------------
// 1e. Fetch Spain Live (subastas.boe.es — Portal de Subastas BOE)
// ---------------------------------------------------------------------------
async function fetchEsBoeAll(prevByKey, portalCacheDir, nowIso) {
  console.log("  ▸ Starte Live-Abruf Spanien (subastas.boe.es · Portal de Subastas BOE) ...");
  const out = [];
  const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

  try {
    const rForm = await fetch("https://subastas.boe.es/subastas_ava.php", { headers: { "User-Agent": ua } });
    const setCookies = rForm.headers.getSetCookie ? rForm.headers.getSetCookie() : [];
    const cookieHeader = setCookies.map((c) => c.split(";")[0]).join("; ");
    const htmlForm = await rForm.text();

    const params = new URLSearchParams();
    for (const m of htmlForm.matchAll(/<input[^>]+type="hidden"[^>]+name="([^"]+)"[^>]+value="([^"]*)"/gi)) {
      params.set(m[1], m[2]);
    }
    params.set("dato[2]", "EJ"); // Celebrándose (active bidding)
    params.set("dato[3]", "I"); // Inmuebles (real estate)
    params.set("page_hits", "200");
    params.set("accion", "Buscar");

    const rSearch = await fetch("https://subastas.boe.es/subastas_ava.php", {
      method: "POST",
      headers: {
        "User-Agent": ua,
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: cookieHeader,
        Referer: "https://subastas.boe.es/subastas_ava.php",
      },
      body: params.toString(),
    });
    const htmlSearch = await rSearch.text();
    const stubs = [];
    for (const m of htmlSearch.matchAll(/<li class="resultado-busqueda">([\s\S]*?)<\/li>/gi)) {
      const card = m[1];
      const idSub = /SUBASTA\s+(SUB-[A-Z0-9-]+)/i.exec(card)?.[1];
      if (!idSub) continue;
      const authority = decodeHtmlText(/<h4>([\s\S]*?)<\/h4>/i.exec(card)?.[1] ?? "");
      const exp = decodeHtmlText(/Expediente:\s*([^<]+)/i.exec(card)?.[1] ?? "");
      const conclusionText = decodeHtmlText(/Conclusión prevista:\s*([^\]]+)/i.exec(card)?.[1] ?? "");
      const pTags = [...card.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((x) => decodeHtmlText(x[1]));
      const summary = pTags[pTags.length - 1] || "";
      stubs.push({ idSub, authority, expediente: exp, conclusionText, summary });
    }

    console.log(`    subastas.boe.es · ${stubs.length} aktive Immobilien-Auktionen gefunden, lade Details ...`);
    await mapLimit(stubs, 12, async (stub) => {
      const key = `es-boe-${stub.idSub}`;
      const cacheFile = join(portalCacheDir, `${key}.json`);
      let parsed = null;

      if (existsSync(cacheFile)) {
        try {
          const cached = JSON.parse(readFileSync(cacheFile, "utf8"));
          if (cached && cached.fileNo) parsed = cached;
        } catch {
          parsed = null;
        }
      }

      if (!parsed) {
        try {
          const [r1, r3] = await Promise.all([
            fetch(`https://subastas.boe.es/detalleSubasta.php?idSub=${encodeURIComponent(stub.idSub)}&ver=1`, { headers: { "User-Agent": ua } }),
            fetch(`https://subastas.boe.es/detalleSubasta.php?idSub=${encodeURIComponent(stub.idSub)}&ver=3`, { headers: { "User-Agent": ua } }),
          ]);
          if (r1.ok) {
            const [h1, h3] = await Promise.all([r1.text(), r3.ok ? r3.text() : Promise.resolve("")]);
            parsed = parseEsBoeHtml(h1, h3, stub);
            if (parsed) {
              try {
                writeFileSync(cacheFile, JSON.stringify({ key, source: "subastas.boe.es", fetchedAt: nowIso, ...parsed }));
              } catch {
                // Ignore
              }
            }
          }
        } catch {
          parsed = null;
        }
      }

      if (!parsed || !parsed.appraisedValue) return;
      const reg = REGION_BY_KEY_ES.get(parsed.state) ?? REGIONEN_ES[0];
      const prev = prevByKey.get(key);
      const hearingAt = parsed.hearingAt;
      const endIso = hearingAt ? new Date(Date.parse(hearingAt) + 60 * 60000).toISOString() : null;
      const livingAreaM2 = parsed.livingAreaM2 ?? null;
      const landAreaM2 = parsed.landAreaM2 ?? null;
      const areaM2 = livingAreaM2 ?? landAreaM2 ?? null;
      const areaKind = livingAreaM2 ? "Wohn-/Nutzfläche" : landAreaM2 ? "Grundstücksfläche" : null;
      const title = [parsed.place, parsed.street || stub.summary?.slice(0, 75)].filter(Boolean).join(", ") || `${parsed.authority} · ${stub.idSub}`;

      out.push({
        key,
        market: "DE",
        country: "ES",
        currency: "EUR",
        sourcePortal: "subastas.boe.es",
        title,
        segment: parsed.segment ?? "other",
        segmentLabel: parsed.segmentLabel,
        region: reg.name,
        regionCode: reg.code,
        place: parsed.place,
        postcode: parsed.postcode,
        street: parsed.street,
        authority: parsed.authority,
        fileNo: parsed.fileNo,
        fileYear: fileNoYear(stub.expediente) ?? 2026,
        rounds: hearingAt ? [{ round: 1, start: hearingAt, end: endIso }] : [],
        hearingAt,
        cancelled: false,
        limitsWaived: false,
        appraisedValue: parsed.appraisedValue,
        minimumBid: parsed.minimumBid,
        depositAmount: parsed.depositAmount,
        transferTaxPct: reg.transferTaxPct,
        livingAreaM2,
        usableAreaM2: null,
        landAreaM2,
        areaM2,
        areaKind,
        rooms: parsed.rooms,
        yearBuilt: parsed.yearBuilt,
        grundbuch: parsed.grundbuch,
        proceedingKind: parsed.proceedingKind,
        description: parsed.description,
        hearingPlace: "Portal de Subastas Electrónicas BOE",
        creditor: null,
        officialUrl: parsed.detailUrl,
        mapUrl: [parsed.street, parsed.postcode, parsed.place, "España"].filter(Boolean).length > 1
          ? `https://www.openstreetmap.org/search?query=${encodeURIComponent([parsed.street, parsed.postcode, parsed.place, "España"].filter(Boolean).join(", "))}`
          : null,
        documentUrl: parsed.attachments?.[0]?.directUrl ?? parsed.detailUrl,
        exposeUrl: null,
        reportUrl: null,
        biddingNotesUrl: null,
        courtUrl: "https://subastas.boe.es/",
        geoServerUrl: "https://www1.sedecatastro.gob.es/",
        geo: parsed.lat && parsed.lng ? { lat: parsed.lat, lng: parsed.lng, precision: "postcode" } : null,
        history: prev?.history ?? [],
        geoportalUrl: "https://www1.sedecatastro.gob.es/",
        geoportalName: "Sede Electrónica del Catastro (ES)",
        caveats: [],
        firstSeenAt: parsed.firstSeenAt ?? prev?.firstSeenAt ?? nowIso,
      });
    });
  } catch (err) {
    console.warn(`    ! subastas.boe.es Fehler: ${err.message}`);
  }
  console.log(`  → ES Gesamt: ${out.length} Verfahren geladen (subastas.boe.es)`);
  return out;
}

// ---------------------------------------------------------------------------
// 1f. Fetch France Live (licitor.com — Ventes Judiciaires Tribunaux Judiciaires)
// ---------------------------------------------------------------------------
async function fetchFrLicitorAll(prevByKey, portalCacheDir, nowIso) {
  console.log("  ▸ Starte Live-Abruf Frankreich (licitor.com · Tribunaux Judiciaires) ...");
  const out = [];
  const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

  try {
    const rHome = await fetch("https://www.licitor.com/ventes-aux-encheres-immobilieres/france.html", { headers: { "User-Agent": ua } });
    if (!rHome.ok) return out;
    const htmlHome = await rHome.text();
    const sessionLinks = [...new Set([...htmlHome.matchAll(/href="(\/ventes-judiciaires-immobilieres\/[^"]+)"/gi)].map((m) => m[1]))].slice(0, 48);

    const adStubs = [];
    const seenAdNos = new Set();
    await mapLimit(sessionLinks, 8, async (sessHref) => {
      try {
        const rSess = await fetch(`https://www.licitor.com${sessHref}`, { headers: { "User-Agent": ua } });
        if (!rSess.ok) return;
        const htmlSess = await rSess.text();
        for (const m of htmlSess.matchAll(/<a class="Ad[^"]*" href="(\/annonce\/[^"]+?\/(\d+)\.html)"[\s\S]*?<\/a>/gi)) {
          const adHref = m[1];
          const adNo = m[2];
          if (seenAdNos.has(adNo)) continue;
          seenAdNos.add(adNo);
          const card = m[0];
          const dept = decodeHtmlText(/<span class="Number">([\s\S]*?)<\/span>/i.exec(card)?.[1] ?? "");
          const city = decodeHtmlText(/<span class="City">([\s\S]*?)<\/span>/i.exec(card)?.[1] ?? "");
          const name = decodeHtmlText(/<span class="Name">([\s\S]*?)<\/span>/i.exec(card)?.[1] ?? "");
          const summary = decodeHtmlText(/<span class="Text">([\s\S]*?)<\/span>/i.exec(card)?.[1] ?? "");
          adStubs.push({
            adNo,
            detailUrl: `https://www.licitor.com${adHref}`,
            dept,
            city,
            name,
            summary,
          });
        }
      } catch {
        // Ignore single session error
      }
    });

    const targetAds = adStubs.slice(0, 220);
    console.log(`    licitor.com · ${targetAds.length} gerichtliche Versteigerungen gefunden, lade Details ...`);
    await mapLimit(targetAds, 12, async (stub) => {
      const key = `fr-licitor-${stub.adNo}`;
      const cacheFile = join(portalCacheDir, `${key}.json`);
      let parsed = null;

      if (existsSync(cacheFile)) {
        try {
          const cached = JSON.parse(readFileSync(cacheFile, "utf8"));
          if (cached && cached.fileNo) parsed = cached;
        } catch {
          parsed = null;
        }
      }

      if (!parsed) {
        try {
          const rAd = await fetch(stub.detailUrl, { headers: { "User-Agent": ua } });
          if (rAd.ok) {
            const htmlAd = await rAd.text();
            parsed = parseFrLicitorHtml(htmlAd, stub);
            if (parsed) {
              try {
                writeFileSync(cacheFile, JSON.stringify({ key, source: "licitor.com", fetchedAt: nowIso, ...parsed }));
              } catch {
                // Ignore
              }
            }
          }
        } catch {
          parsed = null;
        }
      }

      if (!parsed || !parsed.minimumBid) return;
      const reg = REGION_BY_KEY_FR.get(parsed.state) ?? REGIONEN_FR[0];
      const prev = prevByKey.get(key);
      const hearingAt = parsed.hearingAt;
      const endIso = hearingAt ? new Date(Date.parse(hearingAt) + 60 * 60000).toISOString() : null;
      const livingAreaM2 = parsed.livingAreaM2 ?? null;
      const landAreaM2 = parsed.landAreaM2 ?? null;
      const areaM2 = livingAreaM2 ?? landAreaM2 ?? null;
      const areaKind = livingAreaM2 ? "Wohn-/Nutzfläche" : landAreaM2 ? "Grundstücksfläche" : null;
      const title = [parsed.segmentLabel, parsed.place, parsed.street].filter(Boolean).join(", ") || `${parsed.authority} · ${parsed.fileNo}`;
      const lat = parsed.lat ?? reg.lat;
      const lng = parsed.lng ?? reg.lng;

      out.push({
        key,
        market: "DE",
        country: "FR",
        currency: "EUR",
        sourcePortal: "licitor.com",
        title,
        segment: parsed.segment ?? "other",
        segmentLabel: parsed.segmentLabel,
        region: reg.name,
        regionCode: reg.code,
        place: parsed.place,
        postcode: parsed.postcode,
        street: parsed.street,
        authority: parsed.authority,
        fileNo: parsed.fileNo,
        fileYear: 2026,
        rounds: hearingAt ? [{ round: 1, start: hearingAt, end: endIso }] : [],
        hearingAt,
        cancelled: false,
        limitsWaived: false,
        appraisedValue: parsed.appraisedValue,
        minimumBid: parsed.minimumBid,
        depositAmount: parsed.depositAmount,
        transferTaxPct: reg.transferTaxPct,
        livingAreaM2,
        usableAreaM2: null,
        landAreaM2,
        areaM2,
        areaKind,
        rooms: parsed.rooms,
        yearBuilt: parsed.yearBuilt,
        grundbuch: parsed.grundbuch,
        proceedingKind: parsed.proceedingKind,
        description: parsed.description,
        hearingPlace: parsed.authority,
        creditor: null,
        officialUrl: parsed.detailUrl,
        mapUrl: lat && lng ? `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}` : null,
        documentUrl: `${parsed.detailUrl}?print=1`,
        exposeUrl: null,
        reportUrl: null,
        biddingNotesUrl: null,
        courtUrl: "https://www.licitor.com/",
        geoServerUrl: "https://cadastre.gouv.fr/",
        geo: lat && lng ? { lat, lng, precision: parsed.lat ? "exact" : "province" } : null,
        history: prev?.history ?? [],
        geoportalUrl: "https://app.dvf.etalab.gouv.fr/",
        geoportalName: "Demandes de Valeurs Foncières (DVF · Etalab)",
        caveats: [],
        firstSeenAt: parsed.firstSeenAt ?? prev?.firstSeenAt ?? nowIso,
      });
    });
  } catch (err) {
    console.warn(`    ! licitor.com Fehler: ${err.message}`);
  }
  console.log(`  → FR Gesamt: ${out.length} Verfahren geladen (licitor.com)`);
  return out;
}

// ---------------------------------------------------------------------------
// 1g. Fetch UK Live (btgeddisonspropertyauctions.com — UK Property Auctions)
// ---------------------------------------------------------------------------
async function fetchGbAuctionsAll(prevByKey, portalCacheDir, nowIso) {
  console.log("  ▸ Starte Live-Abruf Vereinigtes Königreich (btgeddisonspropertyauctions.com · UK Auctions) ...");
  const out = [];
  const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

  try {
    const pages = Array.from({ length: 22 }, (_, i) => i + 1);
    const stubs = [];
    const seenUrls = new Set();

    await mapLimit(pages, 6, async (page) => {
      try {
        const r = await fetch(`https://www.btgeddisonspropertyauctions.com/properties?page=${page}`, { headers: { "User-Agent": ua } });
        if (!r.ok) return;
        const html = await r.text();
        for (const m of html.matchAll(/<a\s+aria-label="([^"]+)"\s+href="(https:\/\/www\.btgeddisonspropertyauctions\.com\/properties\/([^/]+)\/for-auction-[^"]+)"/gi)) {
          const address = decodeHtmlText(m[1]);
          const detailUrl = m[2];
          const eigId = m[3];
          if (seenUrls.has(detailUrl)) continue;
          seenUrls.add(detailUrl);
          stubs.push({ eigId, address, detailUrl });
        }
      } catch {
        // Ignore single page error
      }
    });

    console.log(`    btgeddisonspropertyauctions.com · ${stubs.length} UK-Auktionen gefunden, lade Details ...`);
    await mapLimit(stubs, 10, async (stub) => {
      const cleanId = stub.eigId.replace(/[^a-zA-Z0-9_-]/g, "");
      const key = `gb-eig-${cleanId}`;
      const cacheFile = join(portalCacheDir, `${key}.json`);
      let parsed = null;

      if (existsSync(cacheFile)) {
        try {
          const cached = JSON.parse(readFileSync(cacheFile, "utf8"));
          if (cached && cached.fileNo) parsed = cached;
        } catch {
          parsed = null;
        }
      }

      if (!parsed) {
        try {
          const rDet = await fetch(stub.detailUrl, { headers: { "User-Agent": ua } });
          if (rDet.ok) {
            const htmlDet = await rDet.text();
            parsed = parseGbAuctionHtml(htmlDet, stub);
            if (parsed) {
              try {
                writeFileSync(cacheFile, JSON.stringify({ key, source: "btgeddisonspropertyauctions.com", fetchedAt: nowIso, ...parsed }));
              } catch {
                // Ignore
              }
            }
          }
        } catch {
          parsed = null;
        }
      }

      if (!parsed || !parsed.minimumBid) return;
      const reg = REGION_BY_KEY_GB.get(parsed.state) ?? REGIONEN_GB[0];
      const prev = prevByKey.get(key);
      const hearingAt = parsed.hearingAt;
      const endIso = hearingAt ? new Date(Date.parse(hearingAt) + 60 * 60000).toISOString() : null;
      const livingAreaM2 = parsed.livingAreaM2 ?? null;
      const areaM2 = livingAreaM2 ?? null;
      const areaKind = livingAreaM2 ? "Wohn-/Nutzfläche" : null;
      const title = [parsed.segmentLabel, parsed.place, parsed.street].filter(Boolean).join(", ") || stub.address;
      const lat = parsed.lat ?? reg.lat;
      const lng = parsed.lng ?? reg.lng;

      out.push({
        key,
        market: "DE",
        country: "GB",
        currency: "GBP",
        sourcePortal: "btgeddisonspropertyauctions.com",
        title,
        segment: parsed.segment ?? "other",
        segmentLabel: parsed.segmentLabel,
        region: reg.name,
        regionCode: reg.code,
        place: parsed.place,
        postcode: parsed.postcode,
        street: parsed.street,
        authority: parsed.authority,
        fileNo: parsed.fileNo,
        fileYear: 2026,
        rounds: hearingAt ? [{ round: 1, start: hearingAt, end: endIso }] : [],
        hearingAt,
        cancelled: false,
        limitsWaived: false,
        appraisedValue: parsed.appraisedValue,
        minimumBid: parsed.minimumBid,
        depositAmount: parsed.depositAmount,
        transferTaxPct: reg.transferTaxPct,
        livingAreaM2,
        usableAreaM2: null,
        landAreaM2: null,
        areaM2,
        areaKind,
        rooms: parsed.rooms,
        yearBuilt: parsed.yearBuilt,
        grundbuch: parsed.grundbuch,
        proceedingKind: parsed.proceedingKind,
        description: parsed.description,
        hearingPlace: "Online Timed / Livestream Property Auction (UK)",
        creditor: null,
        officialUrl: parsed.detailUrl,
        imageUrl: parsed.attachments?.[0]?.directUrl ?? null,
        mapUrl: lat && lng ? `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}` : null,
        documentUrl: "https://www.btgeddisonspropertyauctions.com/files/terms-policies/pw000776-1-btg-eddisons-common-auction-conditions-jan26.pdf",
        exposeUrl: null,
        reportUrl: null,
        biddingNotesUrl: null,
        courtUrl: "https://www.btgeddisonspropertyauctions.com/",
        geoServerUrl: "https://search-property-information.service.gov.uk/",
        geo: lat && lng ? { lat, lng, precision: parsed.lat ? "exact" : "province" } : null,
        history: prev?.history ?? [],
        geoportalUrl: "https://landregistry.data.gov.uk/app/ppd/",
        geoportalName: "HM Land Registry · Price Paid Data",
        caveats: [],
        firstSeenAt: prev?.firstSeenAt ?? nowIso,
      });
    });
  } catch (err) {
    console.warn(`    ! btgeddisonspropertyauctions.com Fehler: ${err.message}`);
  }
  console.log(`  → GB Gesamt: ${out.length} Verfahren geladen (btgeddisonspropertyauctions.com)`);
  return out;
}

// ---------------------------------------------------------------------------
// 2. Fetch Turkey Live (GİB, VakıfBank, ilan.gov.tr top cities + dataset.json)
// ---------------------------------------------------------------------------
const TR_PROVINCE_ALIASES = {
  "ş.urfa": "Şanlıurfa",
  "s.urfa": "Şanlıurfa",
  "k.maraş": "Kahramanmaraş",
  "k.maras": "Kahramanmaraş",
  "g.antep": "Gaziantep",
  "a.karahisar": "Afyonkarahisar",
};

function trTitle(value) {
  if (!value) return null;
  const formatted = String(value)
    .toLocaleLowerCase("tr")
    .split(/(\s+|\/|-)/)
    .map((word) => word.charAt(0).toLocaleUpperCase("tr") + word.slice(1))
    .join("");
  const key = formatted.toLocaleLowerCase("tr").replace(/\s+/g, "");
  return TR_PROVINCE_ALIASES[key] ?? formatted;
}

function extractTrAppraisedValue(rawVal, text = "") {
  const direct = num(rawVal);
  if (direct !== null && direct >= 1000) return direct;
  const kiymetMatch =
    /(?:Muhammen\s+Bedeli?|K[ıi]ymeti)\s*:\s*([\d.,]+)\s*(?:TL|Türk\s*Liras[ıi])/i.exec(text) ??
    /(?<!vergi\s+)(?:Muhammen\s+Bedeli?|K[ıi]ymeti|Değeri)\s*:\s*([\d.,]+)\s*(?:TL|Türk\s*Liras[ıi])/i.exec(text);
  if (!kiymetMatch) return null;
  const parsed = Number.parseFloat(kiymetMatch[1].replace(/\./g, "").replace(",", "."));
  return Number.isFinite(parsed) && parsed >= 1000 ? round2(parsed) : null;
}

function trTime(value) {
  if (!value) return null;
  const raw = String(value).trim();
  const dmy = /^(\d{2})[-.](\d{2})[-.](\d{4})(?:[T\s]+(\d{2}):(\d{2})(?::(\d{2}))?)?$/.exec(raw);
  if (dmy) {
    return `${dmy[3]}-${dmy[2]}-${dmy[1]}T${dmy[4] ?? "10"}:${dmy[5] ?? "00"}:${dmy[6] ?? "00"}${TR_OFFSET}`;
  }
  const s = raw.replace(" ", "T");
  if (/[zZ]|[+-]\d\d:\d\d$/.test(s)) return s;
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(s)) return `${s}${TR_OFFSET}`;
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s)) return `${s}:00${TR_OFFSET}`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return `${s}T10:00:00${TR_OFFSET}`;
  return null;
}

async function fetchVakifbankLive(centers) {
  const listings = [];
  try {
    const pages = [1, 2, 3];
    for (const page of pages) {
      const url = `https://gayrimenkul.intengo.com/vakifbank${page > 1 ? `?page=${page}` : ""}`;
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0.0.0 Safari/537.36" },
      });
      if (!res.ok) break;
      const html = await res.text();
      const blocks = html.split(/<div class="box1 imgWrap">/i).slice(1);
      for (const b of blocks) {
        const no = /class="reNo"[^>]*>[\s\S]*?<span>(\d+)<\/span>/i.exec(b)?.[1];
        const href = /href="(\/vakifbank\/ilan\/[^"]+)"/i.exec(b)?.[1];
        const title = clean(/class="headline"[\s\S]*?<h1><span>([\s\S]*?)<\/span><\/h1>/i.exec(b)?.[1]);
        const loc = clean(/class="location"[\s\S]*?<span>([\s\S]*?)<\/span>/i.exec(b)?.[1]);
        const typeStr = clean(/class="type"[\s\S]*?<span>([\s\S]*?)<\/span>/i.exec(b)?.[1]);
        const endStr = clean(/(?:İ|&#x130;|&#304;)hale Biti(?:ş|&#x15F;|&#351;) Tarihi<\/span>\s*<span>([\d-]+\s+[\d:]+)<\/span>/i.exec(b)?.[1]);
        const priceStr = /class="priceMask">([\d.,]+)<\/span>/i.exec(b)?.[1];
        if (!no || !href || !endStr) continue;

        const locParts = loc.split("/").map((p) => clean(p)).filter(Boolean);
        const city = trTitle(locParts[0] ?? "İstanbul");
        const county = trTitle(locParts[1] ?? null);
        const mahalle = trTitle(locParts[3] ?? locParts[2] ?? null);
        const regionCode = slug(city ?? "");
        const parsedPrice = priceStr ? Number.parseFloat(priceStr.replace(/\./g, "").replace(",", ".")) : null;
        const price = Number.isFinite(parsedPrice) && parsedPrice >= 1000 ? parsedPrice : null;
        const endIso = trTime(endStr);
        if (!endIso) continue;
        const startIso = new Date(Date.now() - 86400000).toISOString();

        const isLand = /arsa|tarla|arazi/i.test(typeStr);
        const isComm = /iş\s*yeri|depo|dükkan|ofis|ticari/i.test(typeStr);
        const segment = isLand ? "land" : isComm ? "commercial" : "apartment";
        const ext = extractTrEnrichedDetails({ title: `${title} ${typeStr}` });

        listings.push({
          key: `vakifbank-${no}`,
          market: "TR",
          title: title || `${city} ${county ?? ""} VakıfBank Gayrimenkul Satışı`.trim(),
          segment,
          segmentLabel: typeStr || "Banka Gayrimenkulü",
          region: city,
          regionCode: regionCode || null,
          place: county,
          postcode: null,
          street: mahalle,
          authority: "VakıfBank E-İhale",
          fileNo: `VB-${no}`,
          fileYear: new Date().getFullYear(),
          rounds: [{ round: 1, start: startIso, end: endIso }],
          hearingAt: endIso,
          cancelled: false,
          limitsWaived: false,
          appraisedValue: price,
          transferTaxPct: null,
          officialUrl: `https://gayrimenkul.intengo.com${href}`,
          mapUrl: null,
          documentUrl: null,
          geo: geoPoint(centers[regionCode], "province"),
          history: [],
          geoportalUrl: "https://parselsorgu.tkgm.gov.tr/",
          geoportalName: "TKGM Parsel Sorgu",
          caveats: [
            {
              points: 0,
              short: "Banka E-İhale (VakıfBank)",
              long: "Banka mülkiyetindeki taşınmazın doğrudan e-ihale satışı. Başlangıç bedeli banka tarafından belirlenen muhammen/başlangıç tutarıdır.",
            },
          ],
          firstSeenAt: new Date().toISOString(),
          livingAreaM2: ext.buildingAreaM2 ?? ext.netAreaM2 ?? null,
          usableAreaM2: null,
          landAreaM2: ext.landAreaM2,
          areaM2: ext.areaM2,
          areaKind: ext.areaKind,
          rooms: ext.rooms,
          yearBuilt: ext.yearBuilt,
          grundbuch: mahalle ?? null,
          proceedingKind: "Banka E-İhale Satışı",
          description: title || null,
          tr: {
            adType: "BANKA",
            source: "gayrimenkul.intengo.com",
            mahalle,
            ada: null,
            parsel: null,
            unitNo: ext.unitNo,
            arsaPayi: ext.arsaPayi,
            isCondo: segment === "apartment",
            landAreaM2: ext.landAreaM2,
            buildingAreaM2: ext.buildingAreaM2,
            netAreaM2: ext.netAreaM2,
            vatRate: null,
            startingBid: price,
            areaM2: ext.areaM2,
            areaKind: ext.areaKind,
            rooms: ext.rooms,
            floor: ext.floor,
            yearBuilt: ext.yearBuilt,
            marketMedianPerM2: null,
            marketSampleSize: null,
            discountPct: null,
            confidence: null,
            hitCount: null,
            nitelik: typeStr || null,
            zoning: null,
            ownershipShare: null,
            excerpt: title || null,
          },
        });
      }
    }
    console.log(`  VakıfBank E-İhale: ${listings.length} aktive Bank-Auktionen geladen`);
  } catch (err) {
    console.warn(`  ! VakıfBank Fehler: ${err.message}`);
  }
  return listings;
}

async function fetchIlanGovFresh(centers) {
  const fresh = [];
  const topCities = ["İSTANBUL", "ANKARA", "İZMİR", "ANTALYA", "BURSA", "MUĞLA", "AYDIN", "BALIKESİR"];
  try {
    for (const city of topCities) {
      for (const ats of [2, 3]) {
        const res = await fetch("https://www.ilan.gov.tr/api/api/services/app/Ad/AdsByFilter", {
          method: "POST",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0.0.0 Safari/537.36",
            "Content-Type": "application/json-patch+json",
            Accept: "text/plain, application/json",
            "X-Requested-With": "XMLHttpRequest",
            "X-Request-Origin": "IGT-UI",
            Pragma: "no-cache",
            "Cache-Control": "no-cache",
            Origin: "https://www.ilan.gov.tr",
            Referer: "https://www.ilan.gov.tr/",
          },
          body: JSON.stringify({ keys: { txv: [1], ats: [ats], c: [city] }, skipCount: 0, maxResultCount: 20 }),
        });
        if (!res.ok) continue;
        const json = await res.json();
        const ads = json?.result?.ads ?? [];
        for (const ad of ads) {
          fresh.push({ ad, city, adType: ats === 2 ? "İCRA" : "İHALE" });
        }
        await sleep(80);
      }
    }
    console.log(`  ilan.gov.tr Live-Check (X-Request-Origin: IGT-UI): ${fresh.length} neueste Aushänge geprüft`);
  } catch (err) {
    console.warn(`  ! ilan.gov.tr Live-Check Fehler: ${err.message}`);
  }
  return { fresh, centers };
}

async function buildTrLive() {
  console.log("▸ Starte Live-Aufbau Türkei (ilan.gov.tr İCRA & İHALE + GİB + SGK + VakıfBank) ...");
  const centers = readPoints("tr");
  const listings = [];
  const seenKeys = new Set();

  // 1. Read comprehensive dataset.json from immo pipeline (including İHALE, GİB, SGK that were previously dropped!)
  const rawPath = join(IMMO_DATA_DIR, "dataset.json");
  if (existsSync(rawPath)) {
    const data = JSON.parse(readFileSync(rawPath, "utf8"));
    const cutoff = new Date("2026-08-15T00:00:00Z");

    for (const l of data.listings) {
      // Prefer parcel-specific rounds on multi-parcel notices to avoid duplicate rounds across parcels
      const rawRounds =
        Array.isArray(l.parcel?.auction?.rounds) && l.parcel.auction.rounds.length > 0
          ? l.parcel.auction.rounds
          : (l.auction?.rounds ?? []);

      const seenRoundKeys = new Set();
      let rounds = rawRounds
        .map((r) => ({ round: r.round, start: trTime(r.start), end: trTime(r.end ?? r.start) }))
        .filter((r) => {
          if (!r.start || !r.end) return false;
          const rk = `${r.round}|${r.start}|${r.end}`;
          if (seenRoundKeys.has(rk)) return false;
          seenRoundKeys.add(rk);
          return true;
        });

      // Fix: İHALE, GİB, and SGK often provide tenderAt or firstAuctionDateShort when rounds is empty
      if (rounds.length === 0) {
        const singleIso = trTime(l.parcel?.auction?.tenderAt ?? l.auction?.tenderAt ?? l.auction?.envelopeDeadline ?? null);
        if (singleIso) {
          rounds = [{ round: 1, start: singleIso, end: singleIso }];
        }
      }

      const lastEnd = rounds.reduce((max, r) => (r.end > max ? r.end : max), "");
      if (!lastEnd || new Date(lastEnd) < cutoff) continue;

      const parcel = l.parcel ?? {};
      const ev = l.evaluation ?? {};
      const ext = extractTrEnrichedDetails(l);
      const regionName = trTitle(l.city ?? parcel.city ?? null);
      const regionCode = slug(regionName ?? "") || null;
      const combinedText = [l.rawText, l.summary, l.notes, parcel.excerpt, ext.excerpt].filter(Boolean).join("\n");
      const appraised = extractTrAppraisedValue(ev.appraisedValue ?? parcel.appraisedValue, combinedText);
      const rawStartingBid = num(ev.startingBid);
      const startingBid =
        rawStartingBid !== null && rawStartingBid >= 500
          ? rawStartingBid
          : appraised
            ? round2(appraised * 0.5)
            : null;
      const mahalleFormatted = trTitle(parcel.mahalle ?? null);
      const adaStr = parcel.ada ? String(parcel.ada) : null;
      const parselStr = parcel.parsel ? String(parcel.parsel) : null;
      const tapuSummary =
        [
          mahalleFormatted,
          adaStr ? `Ada ${adaStr}` : null,
          parselStr ? `Parsel ${parselStr}` : null,
          ext.unitNo ? `BB ${ext.unitNo}` : null,
        ]
          .filter(Boolean)
          .join(" · ") || null;

      seenKeys.add(l.key);
      listings.push({
        key: l.key,
        market: "TR",
        title: l.title,
        segment: TR_CLASS_SEGMENT[l.marketClass] ?? TR_SEGMENT_FALLBACK[l.segment] ?? "other",
        segmentLabel: ev.marketClassLabel ?? l.segment ?? null,
        region: regionName,
        regionCode,
        place: l.county ?? parcel.county ?? null,
        postcode: null,
        street: parcel.address && !/dosya numarası/i.test(parcel.address) ? parcel.address : null,
        authority: trTitle(l.authority) ?? "",
        fileNo: l.fileNo ?? l.adNo ?? l.adId ?? "",
        fileYear: Number.parseInt(String(l.fileNo ?? "").slice(0, 4), 10) || 2026,
        rounds,
        hearingAt: rounds[0]?.start ?? null,
        cancelled: false,
        limitsWaived: false,
        appraisedValue: appraised,
        transferTaxPct: null,
        officialUrl: l.officialUrl,
        mapUrl: null,
        documentUrl: null,
        geo: geoPoint(centers[regionCode], "province"),
        history: (l.changes ?? []).map((c) => c.text).filter(Boolean),
        geoportalUrl: "https://parselsorgu.tkgm.gov.tr/",
        geoportalName: "TKGM Parsel Sorgu",
        caveats: (l.caveats ?? []).map((c) => ({ points: c.points ?? 0, short: c.short, long: c.long })),
        firstSeenAt: l.firstSeenAt ?? data.meta?.generatedAt ?? new Date().toISOString(),
        livingAreaM2: ext.buildingAreaM2 ?? ext.netAreaM2 ?? null,
        usableAreaM2: null,
        landAreaM2: ext.landAreaM2,
        areaM2: ext.areaM2,
        areaKind: ext.areaKind,
        rooms: ext.rooms,
        yearBuilt: ext.yearBuilt,
        grundbuch: tapuSummary,
        proceedingKind:
          l.adType === "İHALE"
            ? "2886 Sayılı DİK Kamu İhalesi"
            : l.source?.includes("gib")
              ? "6183 Sayılı AATUHK Vergi Dairesi Satışı"
              : l.source?.includes("sgk")
                ? "SGK Gayrimenkul Satış İlanı"
                : "2004 Sayılı İİK Cebri İcra Satışı",
        description: ext.excerpt ?? l.title ?? null,
        tr: {
          adType: l.adType ?? "İCRA",
          source: l.source ?? "ilan.gov.tr",
          mahalle: mahalleFormatted,
          ada: adaStr,
          parsel: parselStr,
          unitNo: ext.unitNo,
          arsaPayi: ext.arsaPayi,
          isCondo: Boolean(parcel.isCondo),
          landAreaM2: ext.landAreaM2,
          buildingAreaM2: ext.buildingAreaM2,
          netAreaM2: ext.netAreaM2,
          vatRate: num(parcel.vatRate),
          startingBid,
          areaM2: ext.areaM2,
          areaKind: ext.areaKind,
          rooms: ext.rooms,
          floor: ext.floor,
          yearBuilt: ext.yearBuilt,
          marketMedianPerM2: round2(num(ev.marketMedianPerM2)),
          marketSampleSize: num(ev.marketSampleSize),
          discountPct: round2(num(ev.discountPct)),
          confidence: ev.confidence ?? null,
          hitCount: num(l.hitCount),
          nitelik: parcel.nitelik ?? null,
          zoning: ext.zoning,
          ownershipShare: parcel.ownershipShare ?? null,
          excerpt: ext.excerpt,
        },
      });
    }
  }

  // 2. Append live VakıfBank E-İhale auctions
  const vakifListings = await fetchVakifbankLive(centers);
  for (const vl of vakifListings) {
    if (!seenKeys.has(vl.key)) {
      seenKeys.add(vl.key);
      listings.push(vl);
    }
  }

  // 3. Verify live ilan.gov.tr connection with X-Request-Origin: IGT-UI and add any brand-new October 2026 notices
  const { fresh } = await fetchIlanGovFresh(centers);
  for (const { ad, city, adType } of fresh) {
    const key = `${ad.id}#1`;
    if (seenKeys.has(key)) continue;
    const filterVal = (k) => ad.adTypeFilters?.find((f) => f.key === k)?.value ?? null;
    const rawDate = filterVal("Birinci Satış Günü") ?? filterVal("İhale Tarihi ve Saati");
    let startIso = null;
    if (rawDate) {
      const m = /(\d{2})\.(\d{2})\.(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(rawDate);
      if (m) startIso = `${m[3]}-${m[2]}-${m[1]}T${m[4] ?? "10"}:${m[5] ?? "00"}:00${TR_OFFSET}`;
    }
    if (!startIso) continue;
    const endIso = new Date(Date.parse(startIso) + 7 * 86400000).toISOString();
    const rawBedel = filterVal("Muhammen Bedeli");
    const bedel = rawBedel ? parseGermanNumber(rawBedel) : null;
    const regionName = trTitle(ad.addressCityName ?? city);
    const regionCode = slug(regionName ?? "");
    const urlStr = ad.urlStr ?? "";
    const seg = urlStr.includes("arsa") ? "land" : urlStr.includes("tarla") || urlStr.includes("zeytin") ? "farmland" : urlStr.includes("isyeri") || urlStr.includes("ticari") ? "commercial" : "apartment";
    const ext = extractTrEnrichedDetails({ title: ad.title ?? "" });

    seenKeys.add(key);
    listings.push({
      key,
      market: "TR",
      title: ad.title ?? "",
      segment: seg,
      segmentLabel: adType === "İHALE" ? "Kamu İhalesi" : "İcra Satışı",
      region: regionName,
      regionCode: regionCode || null,
      place: ad.addressCountyName ?? null,
      postcode: null,
      street: null,
      authority: trTitle(ad.advertiserName ?? "İcra Dairesi") ?? "",
      fileNo: filterVal("Dosya No") ?? ad.adNo ?? String(ad.id),
      fileYear: 2026,
      rounds: [{ round: 1, start: startIso, end: endIso }],
      hearingAt: startIso,
      cancelled: false,
      limitsWaived: false,
      appraisedValue: bedel,
      transferTaxPct: null,
      officialUrl: `https://www.ilan.gov.tr${urlStr}`,
      mapUrl: null,
      documentUrl: null,
      geo: geoPoint(centers[regionCode], "province"),
      history: [],
      geoportalUrl: "https://parselsorgu.tkgm.gov.tr/",
      geoportalName: "TKGM Parsel Sorgu",
      caveats: [],
      firstSeenAt: new Date().toISOString(),
      livingAreaM2: ext.buildingAreaM2 ?? ext.netAreaM2 ?? null,
      usableAreaM2: null,
      landAreaM2: ext.landAreaM2,
      areaM2: ext.areaM2,
      areaKind: ext.areaKind,
      rooms: ext.rooms,
      yearBuilt: ext.yearBuilt,
      grundbuch: null,
      proceedingKind: adType === "İHALE" ? "2886 Sayılı DİK Kamu İhalesi" : "2004 Sayılı İİK Cebri İcra Satışı",
      description: ad.title ?? null,
      tr: {
        adType,
        source: "ilan.gov.tr",
        mahalle: null,
        ada: null,
        parsel: null,
        unitNo: ext.unitNo,
        arsaPayi: ext.arsaPayi,
        isCondo: seg === "apartment",
        landAreaM2: ext.landAreaM2,
        buildingAreaM2: ext.buildingAreaM2,
        netAreaM2: ext.netAreaM2,
        vatRate: null,
        startingBid: bedel ? round2(bedel * 0.5) : null,
        areaM2: ext.areaM2,
        areaKind: ext.areaKind,
        rooms: ext.rooms,
        floor: ext.floor,
        yearBuilt: ext.yearBuilt,
        marketMedianPerM2: null,
        marketSampleSize: null,
        discountPct: null,
        confidence: null,
        hitCount: null,
        nitelik: null,
        zoning: null,
        ownershipShare: null,
        excerpt: ad.title ?? null,
      },
    });
  }

  const nowIso = new Date().toISOString();
  console.log(`  → TR Gesamt: ${listings.length} Verfahren (Quellen: ilan.gov.tr, ilan.gib.gov.tr, net.sgk.gov.tr, VakıfBank)`);

  return {
    meta: {
      market: "TR",
      generatedAt: nowIso,
      source: "ilan.gov.tr · GİB · SGK · VakıfBank",
      sourceUrl: "https://www.ilan.gov.tr/",
      states: [],
    },
    listings,
  };
}

// ---------------------------------------------------------------------------
// 3. Run & Write Snapshots + Update Landing Page Stats (src/lib/snapshot.ts)
// ---------------------------------------------------------------------------
async function run() {
  mkdirSync(OUT_DIR, { recursive: true });
  const trOnly = process.argv.includes("--tr-only");
  const deOnly = process.argv.includes("--de-only");

  if (!trOnly) {
    const de = await buildDeLive();
    writeFileSync(join(OUT_DIR, "de.json"), JSON.stringify(de));
    console.log(`✓ data/snapshots/de.json geschrieben (${de.listings.length} Objekte, Stand ${de.meta.generatedAt})`);
  }

  if (!deOnly) {
    const tr = await buildTrLive();
    writeFileSync(join(OUT_DIR, "tr.json"), JSON.stringify(tr));
    console.log(`✓ data/snapshots/tr.json geschrieben (${tr.listings.length} Objekte, Stand ${tr.meta.generatedAt})`);
  }
}

run().catch((err) => {
  console.error("Sync fehlgeschlagen:", err);
  process.exit(1);
});
