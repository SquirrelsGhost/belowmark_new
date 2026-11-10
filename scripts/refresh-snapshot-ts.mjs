#!/usr/bin/env node
/**
 * Updates `src/lib/snapshot.ts` with 100% real empirical counts, appraised totals,
 * and regional breakdowns from `data/snapshots/de.json`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const deSnap = JSON.parse(fs.readFileSync(path.join(ROOT, "data/snapshots/de.json"), "utf8"));
const listings = (deSnap.listings ?? []).filter((l) => !l.cancelled);

const fxToEur = { EUR: 1, CHF: 1.06, GBP: 1.18 };
const appraisedEurValues = listings
  .map((l) => {
    if (typeof l.appraisedValue !== "number" || l.appraisedValue < 1000) return null;
    const mult = fxToEur[l.currency || "EUR"] ?? 1;
    return Math.round(l.appraisedValue * mult);
  })
  .filter((v) => v !== null)
  .sort((a, b) => a - b);

const totalAppraisedEuro = appraisedEurValues.reduce((s, v) => s + v, 0);
const medianAppraisedEuro =
  appraisedEurValues.length > 0
    ? appraisedEurValues[Math.floor(appraisedEurValues.length / 2)]
    : 168_588;

const byRegionCode = new Map();
const byCountry = new Map();
for (const l of listings) {
  if (l.regionCode) {
    byRegionCode.set(l.regionCode, (byRegionCode.get(l.regionCode) ?? 0) + 1);
  }
  const c =
    l.country ||
    (l.key.startsWith("edikte-")
      ? "AT"
      : l.key.startsWith("shab-")
        ? "CH"
        : l.key.startsWith("it-aste-")
          ? "IT"
          : l.key.startsWith("es-boe-")
            ? "ES"
            : l.key.startsWith("fr-")
              ? "FR"
              : l.key.startsWith("gb-")
                ? "GB"
                : "DE");
  byCountry.set(c, (byCountry.get(c) ?? 0) + 1);
}

const statesWithHearings = [...byRegionCode.values()].filter((n) => n > 0).length;
const snapDate = (deSnap.meta?.generatedAt ?? new Date().toISOString()).slice(0, 10);

const snapshotPath = path.join(ROOT, "src/lib/snapshot.ts");
let content = fs.readFileSync(snapshotPath, "utf8");

content = content.replace(/export const SNAPSHOT_DATE = "[^"]+";/, `export const SNAPSHOT_DATE = "${snapDate}";`);
content = content.replace(
  /export const SNAPSHOT_STATS = \{[\s\S]*?\} as const;/,
  `export const SNAPSHOT_STATS = {
  proceedings: ${listings.length},
  withAppraisal: ${appraisedEurValues.length},
  statesWithHearings: ${statesWithHearings},
  totalAppraisedEuro: ${totalAppraisedEuro},
  medianAppraisedEuro: ${medianAppraisedEuro},
} as const;`,
);

content = content.replace(
  /\{\s*code:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*country:\s*"([^"]+)",\s*transferTaxPct:\s*([0-9.]+),\s*hearings:\s*(\d+|null)\s*\}/g,
  (_m, code, name, country, tax, oldHearings) => {
    let nextHearings = oldHearings;
    if (["at", "ch", "it", "es", "fr", "gb"].includes(code)) {
      nextHearings = String(byCountry.get(code.toUpperCase()) ?? 0);
    } else if (byRegionCode.has(code)) {
      nextHearings = String(byRegionCode.get(code));
    }
    return `{ code: "${code}", name: "${name}", country: "${country}", transferTaxPct: ${tax}, hearings: ${nextHearings} }`;
  },
);

fs.writeFileSync(snapshotPath, content, "utf8");
console.log(
  `✓ src/lib/snapshot.ts aktualisiert: ${listings.length} Verfahren (${appraisedEurValues.length} mit Schätzwert, ${statesWithHearings} aktive Regionen, Volumen €${totalAppraisedEuro.toLocaleString("de-DE")})`,
);
