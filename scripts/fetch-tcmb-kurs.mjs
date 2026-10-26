#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Euro-Kurs der türkischen Zentralbank für die Euro-Gegenwerte im TR-Markt.
//
//   npm run tr:kurs        holt den Tageskurs und schreibt data/tr/kurs.json
//
// Quelle: TCMB „Gösterge Niteliğindeki Merkez Bankası Kurları"
// (https://www.tcmb.gov.tr/kurlar/today.xml), ohne Schlüssel abrufbar. Die
// TCMB veröffentlicht werktags gegen 15:30 Uhr Istanbuler Zeit. Verwendet wird
// der Devisenankaufskurs (Döviz Alış) — der Kurs, zu dem Euro in Lira
// getauscht werden. Die App zeigt Euro-Gegenwerte nur, solange die Datei
// höchstens fünf Tage alt ist; ein alter Kurs wird nicht weitergerechnet.
// ---------------------------------------------------------------------------

import { mkdir, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "data", "tr", "kurs.json");
const URL_TODAY = "https://www.tcmb.gov.tr/kurlar/today.xml";

const res = await fetch(URL_TODAY, { headers: { "User-Agent": "belowmark/1.0", Accept: "application/xml" } }).catch((error) => {
  console.error(`TCMB nicht erreichbar: ${error.message}`);
  process.exit(1);
});
if (!res.ok) {
  console.error(`TCMB antwortet ${res.status}`);
  process.exit(1);
}
const xml = await res.text();

// <Tarih_Date Tarih="24.10.2026" Date="10/24/2026" Bulten_No="2026/200">
const dateMatch = xml.match(/<Tarih_Date[^>]*\bTarih="(\d{2})\.(\d{2})\.(\d{4})"[^>]*Bulten_No="([^"]*)"/);
const block = xml.match(/<Currency[^>]*CurrencyCode="EUR"[^>]*>([\s\S]*?)<\/Currency>/);
const field = (name) => {
  const value = block?.[1].match(new RegExp(`<${name}>([^<]*)</${name}>`))?.[1];
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
};
const unit = field("Unit") ?? 1;
const buying = field("ForexBuying");
const selling = field("ForexSelling");

if (!dateMatch || buying === null) {
  console.error("Die Antwort der TCMB enthält keinen EUR-Devisenkurs. Nichts geschrieben.");
  process.exit(1);
}

const [, day, month, year, bulletin] = dateMatch;
const data = {
  meta: {
    source: "TCMB · Gösterge niteliğindeki Merkez Bankası kurları",
    url: URL_TODAY,
    bulletin,
    date: `${year}-${month}-${day}`,
    fetchedAt: new Date().toISOString(),
  },
  eur: { buying: buying / unit, selling: selling === null ? null : selling / unit },
};

await mkdir(dirname(OUT), { recursive: true });
await writeFile(`${OUT}.tmp`, JSON.stringify(data, null, 1), "utf8");
await rename(`${OUT}.tmp`, OUT);
console.log(`EUR ${data.meta.date} (Bülten ${bulletin}): Döviz Alış ${data.eur.buying} ₺, Satış ${data.eur.selling ?? "—"} ₺ → ${OUT}`);
