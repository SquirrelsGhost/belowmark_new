/**
 * Builds one map per European country (data/geo/countries/<land>.json). Every
 * country is its own board in the app, so every country gets its own
 * projection, fitted to its own extent — no squashed Spain on a German grid.
 *
 *   node scripts/build-country-geo.mjs <ordner-mit-rohdaten>
 *
 * Inputs:
 *   data/geo/de.json            Germany, Austria, Switzerland (already in the repo, built by build-geo.mjs).
 *                               The outlines are projected; they are turned back into degrees here.
 *   <ordner>/nutsrg_1.json      NUTS 2016, level 1 (France, United Kingdom)   github.com/eurostat/Nuts2json  pub/v2/2016/4326/10M/
 *   <ordner>/nutsrg_2.json      NUTS 2016, level 2 (Italy, Spain)             same place
 *   <ordner>/ne_admin1.json     Natural Earth 10m admin-1 (Canary Islands only, public domain)
 *                               github.com/nvkelso/natural-earth-vector  geojson/ne_10m_admin_1_states_provinces.geojson
 *
 * Projection: equirectangular, scaled by the cosine of the middle latitude, the
 * same formula as build-geo.mjs and src/lib/geo.ts. Spain's Canary Islands are
 * drawn as an inset below the mainland; the shift is stored in the projection
 * so the app moves the proceedings' dots the same way.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SOURCE_DIR = process.argv[2];
const OUT_DIR = join(process.cwd(), "data", "geo", "countries");
const WIDTH = 1000;
const PAD = 8;
const INSET_GAP = 24;

if (!SOURCE_DIR) {
  console.error("Pfad zum Ordner mit den Rohdaten angeben.");
  process.exit(1);
}

const NUTS_SOURCE = {
  label: "Regionen (NUTS 2016)",
  by: "© EuroGeographics für die Verwaltungsgrenzen · Eurostat GISCO, über Nuts2json",
  license: "GISCO-Nutzungsbedingungen",
  url: "https://ec.europa.eu/eurostat/web/gisco/geodata/statistical-units/territorial-units-statistics",
};
const NATURAL_EARTH = { label: "Kanarische Inseln", by: "Natural Earth", license: "Public Domain", url: "https://www.naturalearthdata.com/" };

/** NUTS id → app region code and German name. Several ids may share one code (merged). */
const NUTS = {
  IT: {
    level: 2,
    regions: {
      ITC1: ["it-pie", "Piemont"], ITC2: ["it-vda", "Aostatal"], ITC3: ["it-lig", "Ligurien"], ITC4: ["it-lom", "Lombardei"],
      ITH1: ["it-taa", "Trentino-Südtirol"], ITH2: ["it-taa", "Trentino-Südtirol"], ITH3: ["it-ven", "Venetien"],
      ITH4: ["it-fvg", "Friaul-Julisch Venetien"], ITH5: ["it-emr", "Emilia-Romagna"], ITI1: ["it-tos", "Toskana"],
      ITI2: ["it-umb", "Umbrien"], ITI3: ["it-mar", "Marken"], ITI4: ["it-laz", "Latium / Rom"], ITF1: ["it-abr", "Abruzzen"],
      ITF2: ["it-mol", "Molise"], ITF3: ["it-cam", "Kampanien"], ITF4: ["it-pug", "Apulien"], ITF5: ["it-bas", "Basilikata"],
      ITF6: ["it-cal", "Kalabrien"], ITG1: ["it-sic", "Sizilien"], ITG2: ["it-sar", "Sardinien"],
    },
  },
  ES: {
    level: 2,
    regions: {
      ES11: ["es-ga", "Galicien"], ES12: ["es-as", "Asturien"], ES13: ["es-cb", "Kantabrien"], ES21: ["es-pv", "Baskenland"],
      ES22: ["es-nc", "Navarra"], ES23: ["es-ri", "La Rioja"], ES24: ["es-ar", "Aragonien"], ES30: ["es-md", "Madrid"],
      ES41: ["es-cl", "Kastilien und León"], ES42: ["es-cm", "Kastilien-La Mancha"], ES43: ["es-ex", "Extremadura"],
      ES51: ["es-ct", "Katalonien"], ES52: ["es-vc", "Valencia"], ES53: ["es-ib", "Balearen / Mallorca"],
      ES61: ["es-an", "Andalusien"], ES62: ["es-mc", "Murcia"], ES63: ["es-ce", "Ceuta"], ES64: ["es-ml", "Melilla"],
    },
  },
  FR: {
    level: 1,
    regions: {
      FR1: ["fr-idf", "Île-de-France / Paris"], FRB: ["fr-cvl", "Centre-Val de Loire"], FRC: ["fr-bfc", "Burgund-Franche-Comté"],
      FRD: ["fr-nor", "Normandie"], FRE: ["fr-hdf", "Hauts-de-France"], FRF: ["fr-ges", "Grand Est / Elsass"],
      FRG: ["fr-pdl", "Pays de la Loire"], FRH: ["fr-bre", "Bretagne"], FRI: ["fr-naq", "Nouvelle-Aquitaine"],
      FRJ: ["fr-occ", "Okzitanien"], FRK: ["fr-ara", "Auvergne-Rhône-Alpes"], FRL: ["fr-paca", "Provence-Alpes-Côte d'Azur"],
      FRM: ["fr-cor", "Korsika"],
    },
  },
  GB: {
    level: 1,
    regions: {
      UKC: ["gb-nee", "North East England"], UKD: ["gb-nwe", "North West England"], UKE: ["gb-yrk", "Yorkshire & Humber"],
      UKF: ["gb-emd", "East Midlands"], UKG: ["gb-wmd", "West Midlands"], UKH: ["gb-ee", "East of England"],
      UKI: ["gb-lon", "Greater London"], UKJ: ["gb-see", "South East England"], UKK: ["gb-swe", "South West England"],
      UKL: ["gb-wls", "Wales"], UKM: ["gb-sct", "Schottland"], UKN: ["gb-nir", "Nordirland"],
    },
  },
};

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));

function rings(geometry) {
  if (geometry.type === "Polygon") return [geometry.coordinates[0]];
  if (geometry.type === "MultiPolygon") return geometry.coordinates.map((polygon) => polygon[0]);
  return [];
}

function boundsOf(features) {
  let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
  for (const feature of features) {
    for (const ring of rings(feature.geometry)) {
      for (const [lng, lat] of ring) {
        minLng = Math.min(minLng, lng); maxLng = Math.max(maxLng, lng);
        minLat = Math.min(minLat, lat); maxLat = Math.max(maxLat, lat);
      }
    }
  }
  return { minLng, maxLng, minLat, maxLat };
}

function makeProjection(features) {
  const { minLng, maxLng, minLat, maxLat } = boundsOf(features);
  const k = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180);
  const scale = (WIDTH - 2 * PAD) / ((maxLng - minLng) * k);
  const height = Math.ceil((maxLat - minLat) * scale + 2 * PAD);
  return { minLng, maxLat, k, scale, pad: PAD, width: WIDTH, height };
}

/** Same rule as projectPoint in src/lib/geo.ts, insets included. */
function project(p, [lng, lat]) {
  const inset = p.insets?.find(({ bounds: [a, b, c, d] }) => lng >= a && lng <= c && lat >= b && lat <= d);
  const x = p.pad + (lng - p.minLng) * p.k * p.scale + (inset?.dx ?? 0);
  const y = p.pad + (p.maxLat - lat) * p.scale + (inset?.dy ?? 0);
  return [x, y];
}

function simplify(points, tolerance) {
  if (points.length < 4) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = points[a];
    const [bx, by] = points[b];
    const len = Math.hypot(bx - ax, by - ay);
    let max = 0, index = -1;
    for (let i = a + 1; i < b; i++) {
      const d = len === 0
        ? Math.hypot(points[i][0] - ax, points[i][1] - ay)
        : Math.abs((by - ay) * points[i][0] - (bx - ax) * points[i][1] + bx * ay - by * ax) / len;
      if (d > max) { max = d; index = i; }
    }
    if (max > tolerance && index > 0) {
      keep[index] = 1;
      stack.push([a, index], [index, b]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

const area = (pts) => Math.abs(pts.reduce((sum, [x, y], i) => {
  const [nx, ny] = pts[(i + 1) % pts.length];
  return sum + x * ny - nx * y;
}, 0) / 2);

const r1 = (n) => Math.round(n * 10) / 10;

/** Outlines of one region (several features may be merged into one code). */
function regionShape(projection, geometries, tolerance) {
  const projected = geometries.flatMap((geometry) => rings(geometry).map((ring) => simplify(ring.map((c) => project(projection, c)), tolerance)));
  const largest = Math.max(...projected.map(area));
  const kept = projected.filter((ring) => ring.length >= 4 && area(ring) >= Math.max(2, largest * 0.002));
  const path = kept.map((ring) => `M${ring.map(([x, y]) => `${r1(x)} ${r1(y)}`).join("L")}Z`).join("");
  const xs = kept.flat().map((p) => p[0]);
  const ys = kept.flat().map((p) => p[1]);
  const bbox = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)].map(r1);
  return { path, bbox };
}

/** Groups features by app region code. */
function groupByCode(entries) {
  const byCode = new Map();
  for (const { code, name, geometry } of entries) {
    const entry = byCode.get(code) ?? { code, name, geometries: [] };
    entry.geometries.push(geometry);
    byCode.set(code, entry);
  }
  return [...byCode.values()];
}

function writeCountry(country, regions, projection, sources) {
  const geo = { market: "DE", country, projection, regions, sources };
  writeFileSync(join(OUT_DIR, `${country.toLowerCase()}.json`), JSON.stringify(geo));
  console.log(`${country}: ${regions.length} Regionen, ${projection.width}×${projection.height}`);
}

/** Germany, Austria, Switzerland: the existing outlines, turned back into degrees and fitted to each country. */
function buildFromDach(country) {
  const dach = readJson(join(process.cwd(), "data", "geo", "de.json"));
  const p = dach.projection;
  const toDegrees = (x, y) => [(x - p.pad) / (p.k * p.scale) + p.minLng, p.maxLat - (y - p.pad) / p.scale];
  const belongs = (code) => (country === "DE" ? !code.includes("-") : code.startsWith(`${country.toLowerCase()}-`));
  const features = dach.regions.filter((region) => belongs(region.code)).map((region) => ({
    code: region.code,
    name: region.name,
    geometry: {
      type: "MultiPolygon",
      coordinates: region.path.split("Z").filter(Boolean).map((ring) => [ring.replace(/^M/, "").split("L").map((pair) => toDegrees(...pair.trim().split(/\s+/).map(Number)))]),
    },
  }));
  const projection = makeProjection(features);
  // The outlines are simplified already; keep every point
  const regions = groupByCode(features).map(({ code, name, geometries }) => ({ code, name, ...regionShape(projection, geometries, 0.4) }));
  const sources = dach.sources.filter((source) => /AT & CH/.test(source.label) === (country !== "DE"));
  writeCountry(country, regions, projection, sources);
}

function buildFromNuts(country) {
  const { level, regions: table } = NUTS[country];
  const nuts = readJson(join(SOURCE_DIR, `nutsrg_${level}.json`)).features;
  const entries = nuts.filter((feature) => table[feature.properties.id]).map((feature) => {
    const [code, name] = table[feature.properties.id];
    return { code, name, geometry: feature.geometry };
  });
  const missing = Object.keys(table).filter((id) => !nuts.some((feature) => feature.properties.id === id));
  if (missing.length) console.warn(`${country}: ohne Umriss ${missing.join(", ")}`);

  const projection = makeProjection(entries);
  const sources = [NUTS_SOURCE];

  if (country === "ES") {
    // Canary Islands: not in the European NUTS cut — Natural Earth, drawn below the mainland, left
    const canaries = readJson(join(SOURCE_DIR, "ne_admin1.json")).features.filter((feature) => feature.properties.adm0_a3 === "ESP" && feature.properties.region_cod === "ES.CN");
    const box = boundsOf(canaries);
    const bounds = [box.minLng - 0.3, box.minLat - 0.3, box.maxLng + 0.3, box.maxLat + 0.3];
    const [left, top] = project(projection, [box.minLng, box.maxLat]);
    const [, bottom] = project(projection, [box.minLng, box.minLat]);
    const insetHeight = bottom - top;
    const dx = PAD - left;
    const dy = projection.height - PAD + INSET_GAP - top;
    projection.insets = [{ bounds: bounds.map((n) => Math.round(n * 100) / 100), dx: r1(dx), dy: r1(dy) }];
    projection.height = Math.ceil(projection.height + INSET_GAP + insetHeight);
    for (const feature of canaries) entries.push({ code: "es-cn", name: "Kanarische Inseln", geometry: feature.geometry });
    sources.push(NATURAL_EARTH);
  }

  const regions = groupByCode(entries).map(({ code, name, geometries }) => ({ code, name, ...regionShape(projection, geometries, 0.6) }));
  writeCountry(country, regions, projection, sources);
}

mkdirSync(OUT_DIR, { recursive: true });
for (const country of ["DE", "AT", "CH"]) buildFromDach(country);
for (const country of ["IT", "ES", "FR", "GB"]) buildFromNuts(country);
