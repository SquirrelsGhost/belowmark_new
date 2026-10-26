/**
 * Copies the official Turkish comparison series into the app (data/comparables/tr-tcmb.json):
 * TCMB "Konut Birim Fiyatları" — the median TL per m² (gross floor area) of housing
 * loan appraisals, per province and quarter (EVDS data group bie_birimfiyat).
 *
 *   node scripts/build-comparables.mjs "C:\Users\emrea\Desktop\1_Projekte_und_Apps\immo\data"
 *
 * Only birimfiyat.json is read — the old data folder also holds an EVDS API key
 * (evds.json), accounts and payment data, none of which is touched.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { slug } from "./lib/slug.mjs";

const SOURCE_DIR = process.argv[2];
const OUT_DIR = join(process.cwd(), "data", "comparables");

if (!SOURCE_DIR) {
  console.error("Pfad zum data-Ordner der alten Version angeben.");
  process.exit(1);
}

const raw = JSON.parse(readFileSync(join(SOURCE_DIR, "birimfiyat.json"), "utf8"));
const provinces = {};
for (const [name, entry] of Object.entries(raw.provinces)) {
  if (typeof entry.perM2 !== "number") continue;
  provinces[slug(name)] = { name, perM2: entry.perM2, quarter: entry.quarter, series: entry.series };
}

const out = {
  meta: {
    label: raw.meta.label,
    basis: raw.meta.basis,
    source: raw.meta.source,
    sourceUrl: "https://evds3.tcmb.gov.tr/",
    dataGroup: raw.meta.group,
    fetchedAt: raw.meta.fetchedAt,
    latestQuarter: raw.meta.latestQuarter,
    gaps: raw.meta.gaps,
  },
  country: raw.country,
  provinces,
};

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, "tr-tcmb.json"), JSON.stringify(out, null, 1));
console.log(`tr-tcmb: ${Object.keys(provinces).length} Provinzen, ${out.meta.latestQuarter}`);
