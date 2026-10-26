/**
 * Builds the map assets the app draws its own maps from (data/geo/*.json).
 *
 *   node scripts/build-geo.mjs <ordner-mit-rohdaten>
 *
 * Expected files in that folder (all openly licensed, see SOURCES below):
 *   de-states.geo.json     Bundesländer        github.com/isellsoap/deutschlandGeoJSON (3_mittel)
 *   de-plz.csv             PLZ-Mittelpunkte    github.com/WZBSocialScienceCenter/plz_geocoord
 *   tr-provinces.geo.json  İl-Grenzen          github.com/cihadturhan/tr-geojson (tr-cities-utf8)
 *   tr-cities.json         İl-Mittelpunkte     npm memleketim-tr-cities (cities.json)
 *
 * Outlines are projected once (equirectangular, scaled by the cosine of the
 * middle latitude) and simplified, so the app can draw them as plain SVG paths
 * without a map library and without loading anything from a third party.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { slug } from "./lib/slug.mjs";

const SOURCE_DIR = process.argv[2];
const OUT_DIR = join(process.cwd(), "data", "geo");
const WIDTH = 1000;
const PAD = 8;

if (!SOURCE_DIR) {
  console.error("Pfad zum Ordner mit den Rohdaten angeben.");
  process.exit(1);
}

const SOURCES = {
  DE: [
    { label: "Bundesländer", by: "deutschlandGeoJSON (isellsoap)", license: "MIT", url: "https://github.com/isellsoap/deutschlandGeoJSON" },
    { label: "PLZ-Mittelpunkte", by: "WZB, plz_geocoord (2019)", license: "Apache-2.0", url: "https://github.com/WZBSocialScienceCenter/plz_geocoord" },
  ],
  TR: [
    { label: "İl sınırları", by: "tr-geojson (cihadturhan), © OpenStreetMap", license: "ODbL", url: "https://github.com/cihadturhan/tr-geojson" },
    { label: "İl merkezleri", by: "memleketim-tr-cities", license: "MIT", url: "https://www.npmjs.com/package/memleketim-tr-cities" },
  ],
};

const read = (file) => readFileSync(join(SOURCE_DIR, file), "utf8");

function rings(geometry) {
  if (geometry.type === "Polygon") return [geometry.coordinates[0]];
  if (geometry.type === "MultiPolygon") return geometry.coordinates.map((polygon) => polygon[0]);
  return [];
}

function makeProjection(features) {
  let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
  for (const feature of features) {
    for (const ring of rings(feature.geometry)) {
      for (const [lng, lat] of ring) {
        minLng = Math.min(minLng, lng); maxLng = Math.max(maxLng, lng);
        minLat = Math.min(minLat, lat); maxLat = Math.max(maxLat, lat);
      }
    }
  }
  const k = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180);
  const scale = (WIDTH - 2 * PAD) / ((maxLng - minLng) * k);
  const height = Math.ceil((maxLat - minLat) * scale + 2 * PAD);
  return { minLng, maxLat, k, scale, pad: PAD, width: WIDTH, height };
}

const project = (p, [lng, lat]) => [p.pad + (lng - p.minLng) * p.k * p.scale, p.pad + (p.maxLat - lat) * p.scale];

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
      // A closed ring starts and ends on the same point: measure from that point instead.
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

function regionShape(projection, geometry, tolerance) {
  const projected = rings(geometry).map((ring) => simplify(ring.map((c) => project(projection, c)), tolerance));
  const largest = Math.max(...projected.map(area));
  const kept = projected.filter((ring) => ring.length >= 4 && area(ring) >= Math.max(4, largest * 0.004));
  const path = kept.map((ring) => `M${ring.map(([x, y]) => `${r1(x)} ${r1(y)}`).join("L")}Z`).join("");
  const xs = kept.flat().map((p) => p[0]);
  const ys = kept.flat().map((p) => p[1]);
  const bbox = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)].map(r1);
  return { path, bbox };
}

function buildDe() {
  const states = JSON.parse(read("de-states.geo.json")).features;
  const projection = makeProjection(states);
  const regions = states.map((feature) => ({
    code: feature.properties.id.replace(/^DE-/, "").toLowerCase(),
    name: feature.properties.name,
    ...regionShape(projection, feature.geometry, 0.9),
  }));

  const postcodes = {};
  for (const line of read("de-plz.csv").split(/\r?\n/).slice(1)) {
    const [plz, lat, lng] = line.split(",");
    if (/^\d{5}$/.test(plz) && lat && lng) postcodes[plz] = [Number(Number(lat).toFixed(4)), Number(Number(lng).toFixed(4))];
  }
  return { geo: { market: "DE", projection, regions, sources: SOURCES.DE }, points: postcodes };
}

/** Outline names that differ from the official province name. */
const TR_NAME_FIXES = { afyon: "afyonkarahisar" };

function buildTr() {
  const provinces = JSON.parse(read("tr-provinces.geo.json")).features;
  const projection = makeProjection(provinces);
  const regions = provinces.map((feature) => ({
    code: TR_NAME_FIXES[slug(feature.properties.name)] ?? slug(feature.properties.name),
    name: feature.properties.name,
    ...regionShape(projection, feature.geometry, 0.7),
  }));

  const centers = {};
  for (const city of JSON.parse(read("tr-cities.json"))) {
    centers[slug(city.name)] = [city.coordinates.lat, city.coordinates.lng];
  }
  const missing = regions.filter((region) => !centers[region.code]).map((region) => region.code);
  if (missing.length) console.warn("Ohne İl-Mittelpunkt:", missing.join(", "));
  return { geo: { market: "TR", projection, regions, sources: SOURCES.TR }, points: centers };
}

mkdirSync(OUT_DIR, { recursive: true });
for (const [name, build] of [["de", buildDe], ["tr", buildTr]]) {
  const { geo, points } = build();
  writeFileSync(join(OUT_DIR, `${name}.json`), JSON.stringify(geo));
  writeFileSync(join(OUT_DIR, `${name}-points.json`), JSON.stringify(points));
  console.log(`${name}: ${geo.regions.length} Regionen, ${Object.keys(points).length} Punkte`);
}
