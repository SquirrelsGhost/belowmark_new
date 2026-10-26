#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Verbraucherpreisindex der Türkei (TÜFE) von der Zentralbank.
//
//   npm run tr:tufe        holt die Monatsreihe seit 2015 nach data/tr/tufe.json
//
// Wozu: der `muhammen bedel` im Aushang ist ein Nennbetrag aus dem Jahr, in dem
// das Verfahren begann. Das Aktenblatt zeigt, wie viel Kaufkraft er seitdem
// verloren hat.
//
// Quelle: TCMB EVDS, Serie TP.TUKFIY2025.GENEL (2025=100). Schlüssel kostenlos
// unter https://evds3.tcmb.gov.tr, hier als EVDS_API_KEY (Umgebung oder
// .env.local). Übernommen aus der alten immo-App (src/fetch-tufe.mjs) mit
// denselben Fallen:
//   * evds2 ist tot, der Dienst liegt unter evds3.tcmb.gov.tr/igmevdsms-dis/,
//     Parameter im Pfad, Schlüssel im Header `key`.
//   * TP.FG.J0 (2003=100) ist eingestellt und endet im Januar 2026 — ohne
//     Fehler. Deshalb prüft der Lauf am Ende das Alter des letzten Werts, und
//     die App blendet die Angabe aus, wenn er älter als drei Monate ist.
// ---------------------------------------------------------------------------

import { mkdir, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as dotenv from "dotenv";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: resolve(ROOT, ".env.local"), quiet: true });
const OUT = resolve(ROOT, "data", "tr", "tufe.json");
const BASE = "https://evds3.tcmb.gov.tr/igmevdsms-dis";
const SERIES = "TP.TUKFIY2025.GENEL";
const FROM = "01-01-2015";

const key = process.env.EVDS_API_KEY;
if (!key) {
  console.error("Kein EVDS-Schlüssel. EVDS_API_KEY in .env.local setzen (kostenlos unter https://evds3.tcmb.gov.tr).");
  process.exit(1);
}

const today = new Date();
const to = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;
const res = await fetch(`${BASE}/series=${SERIES}&startDate=${FROM}&endDate=${to}&type=json`, {
  headers: { "User-Agent": "belowmark/1.0", Accept: "application/json", key },
});
if (!res.ok) {
  console.error(`EVDS antwortet ${res.status}: ${(await res.text()).slice(0, 200)}`);
  process.exit(1);
}

const body = await res.json();
const column = SERIES.replace(/\./g, "_");
// Fehlende Monate bleiben Lücken — eine erfundene Zwischenstufe wäre schlimmer.
const months = {};
for (const row of body.items ?? []) {
  const value = Number(row[column]);
  if (!Number.isFinite(value)) continue;
  const [year, month] = String(row.Tarih).split("-");
  months[`${year}-${String(month).padStart(2, "0")}`] = Math.round(value * 100) / 100;
}
const keys = Object.keys(months).sort();
if (!keys.length) {
  console.error("EVDS hat geantwortet, aber keine verwertbaren Werte geliefert.");
  process.exit(1);
}

const data = {
  meta: { series: SERIES, label: "Tüketici Fiyat Endeksi (2025=100)", source: "TCMB EVDS · evds3.tcmb.gov.tr", fetchedAt: new Date().toISOString(), from: keys[0], to: keys[keys.length - 1] },
  months,
};
await mkdir(dirname(OUT), { recursive: true });
await writeFile(`${OUT}.tmp`, JSON.stringify(data, null, 1), "utf8");
await rename(`${OUT}.tmp`, OUT);

const last = keys[keys.length - 1];
console.log(`${keys.length} Monatswerte · ${data.meta.from} bis ${data.meta.to} → ${OUT}`);
const [year, month] = last.split("-").map(Number);
const age = (today.getFullYear() - year) * 12 + (today.getMonth() + 1 - month);
if (age > 3) console.log(`\n! Der letzte Wert ist ${age} Monate alt — vermutlich wurde die Reihe eingestellt und umbasiert.`);
