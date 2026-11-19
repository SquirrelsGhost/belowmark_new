#!/usr/bin/env node
/**
 * Builds per-country EU snapshot shards (`data/snapshots/countries/<cc>.json`)
 * and a lightweight `data/snapshots/atlas-summary.json` (~1.5 KB) from
 * `data/snapshots/de.json` and `data/snapshots/tr.json`.
 *
 * Why:
 * - A user in DE, PL, IT, ES, FR, GB, AT, CH, NL, CZ or SE only needs their own
 *   country's proceedings (~0.2–7 MB) instead of parsing the combined 31 MB EU file.
 * - `/api/public/atlas` loads a 1.5 KB summary in <1ms cold instead of parsing 81 MB.
 */
import fs from "node:fs";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SNAP_DIR = path.join(ROOT, "data", "snapshots");
const COUNTRIES_DIR = path.join(SNAP_DIR, "countries");

const EU_COUNTRIES = ["DE", "AT", "CH", "IT", "ES", "FR", "GB", "NL", "PL", "CZ", "SE"];
const EU_HUB_PATHS = {
  AT: { currency: "EUR", hubPath: "/oesterreich/ediktsdatei", calcPath: "/oesterreich/rechner/geringstes-gebot-vadium" },
  CH: { currency: "CHF", hubPath: "/schweiz/shab-versteigerungen", calcPath: "/schweiz/rechner/betreibungsamtliche-steigerung-schkg" },
  IT: { currency: "EUR", hubPath: "/it/aste-giudiziarie", calcPath: "/it/calcolatore/offerta-minima-75-asta-giudiziaria" },
  ES: { currency: "EUR", hubPath: "/es/subastas-boe", calcPath: "/es/calculadora/subasta-judicial-boe-70-por-ciento" },
  FR: { currency: "EUR", hubPath: "/fr/encheres-immobilieres", calcPath: "/fr/calculateur/encheres-judiciaires-licitor-frais" },
  GB: { currency: "GBP", hubPath: "/en/uk-property-auctions", calcPath: "/en/calculator/uk-property-auction-stamp-duty-deposit" },
  NL: { currency: "EUR", hubPath: "/nl/executieveiling", calcPath: "/nl/calculator/executieveiling-kosten-overdrachtsbelasting" },
  PL: { currency: "PLN", hubPath: "/pl/licytacje-komornicze", calcPath: "/pl/kalkulator/licytacja-komornicza-wadium" },
  CZ: { currency: "CZK", hubPath: "/cz/drazby-nemovitosti", calcPath: "/cz/kalkulacka/exekucni-drazba-nejnizsi-podani-jistota" },
  SE: { currency: "SEK", hubPath: "/se/exekutiv-auktion", calcPath: "/se/kalkylator/kronofogden-exekutiv-auktion-handpenning" },
};

function detectDachCountry(l) {
  if (l.country && EU_COUNTRIES.includes(l.country)) return l.country;
  const key = l.key || "";
  const rc = l.regionCode || "";
  const reg = l.region || "";
  if (key.startsWith("edikte-") || rc.startsWith("at-") || reg.endsWith("(AT)")) return "AT";
  if (key.startsWith("shab-") || rc.startsWith("ch-") || reg.endsWith("(CH)")) return "CH";
  if (key.startsWith("it-aste-") || rc.startsWith("it-") || reg.endsWith("(IT)")) return "IT";
  if (key.startsWith("es-boe-") || rc.startsWith("es-") || reg.endsWith("(ES)")) return "ES";
  if (key.startsWith("fr-") || rc.startsWith("fr-") || reg.endsWith("(FR)")) return "FR";
  if (key.startsWith("gb-") || rc.startsWith("gb-") || reg.endsWith("(UK)")) return "GB";
  if (key.startsWith("nl-") || rc.startsWith("nl-") || reg.endsWith("(NL)")) return "NL";
  if (key.startsWith("pl-") || rc.startsWith("pl-") || reg.endsWith("(PL)")) return "PL";
  if (key.startsWith("cz-") || rc.startsWith("cz-") || reg.endsWith("(CZ)")) return "CZ";
  if (key.startsWith("se-") || rc.startsWith("se-") || reg.endsWith("(SE)")) return "SE";
  return "DE";
}

function regionCountry(code) {
  if (code.startsWith("at-")) return "AT";
  if (code.startsWith("ch-")) return "CH";
  if (code.startsWith("it-")) return "IT";
  if (code.startsWith("es-")) return "ES";
  if (code.startsWith("fr-")) return "FR";
  if (code.startsWith("gb-")) return "GB";
  if (code.startsWith("nl-")) return "NL";
  if (code.startsWith("pl-")) return "PL";
  if (code.startsWith("cz-")) return "CZ";
  if (code.startsWith("se-")) return "SE";
  return "DE";
}

function slugifySimple(input) {
  return String(input || "")
    .replace(/İ/g, "i")
    .replace(/I/g, "i")
    .replace(/ı/g, "i")
    .replace(/Ł/g, "l")
    .replace(/ł/g, "l")
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

function main() {
  const t0 = performance.now();
  const dePath = path.join(SNAP_DIR, "de.json");
  const trPath = path.join(SNAP_DIR, "tr.json");
  if (!fs.existsSync(dePath) || !fs.existsSync(trPath)) {
    console.warn("[build-country-shards] Snapshot files not found, skipping.");
    return;
  }

  const deSnap = JSON.parse(fs.readFileSync(dePath, "utf8"));
  const trSnap = JSON.parse(fs.readFileSync(trPath, "utf8"));
  fs.mkdirSync(COUNTRIES_DIR, { recursive: true });

  const buckets = new Map(EU_COUNTRIES.map((c) => [c, []]));
  for (const listing of deSnap.listings ?? []) {
    const c = detectDachCountry(listing);
    buckets.get(c)?.push(listing);
  }

  const atlasEu = {};
  let deActiveCount = 0;
  const deCourts = new Set();

  for (const c of EU_COUNTRIES) {
    const items = buckets.get(c) ?? [];
    const portals = [...new Set(items.map((l) => l.sourcePortal).filter(Boolean))];
    const shardMeta = {
      ...deSnap.meta,
      source: portals.length > 0 ? portals.join(" · ") : deSnap.meta.source,
      sourceUrl: c === "DE" ? deSnap.meta.sourceUrl : portals.length > 0 ? `https://${portals[0]}/` : deSnap.meta.sourceUrl,
      states: (deSnap.meta.states ?? []).filter((s) => regionCountry(s.code) === c),
    };
    const outPath = path.join(COUNTRIES_DIR, `${c.toLowerCase()}.json`);
    const payload = JSON.stringify({ meta: shardMeta, listings: items });
    fs.writeFileSync(outPath, payload, "utf8");

    const active = items.filter((l) => !l.cancelled);
    const courts = new Set();
    for (const l of active) {
      if (l.authority) {
        const s = slugifySimple(l.authority);
        if (s && s.length >= 2) courts.add(s);
      }
    }
    if (c === "DE") {
      deActiveCount = active.length;
      for (const s of courts) deCourts.add(s);
    } else {
      atlasEu[c] = {
        market: c,
        ...EU_HUB_PATHS[c],
        totalListings: active.length,
        courtsCount: courts.size,
      };
    }
  }

  const trActive = (trSnap.listings ?? []).filter((l) => !l.cancelled);
  const trCourts = new Set();
  for (const l of trActive) {
    if (l.authority) {
      const s = slugifySimple(l.authority);
      if (s && s.length >= 3) trCourts.add(s);
    }
  }

  const atlasSummary = {
    generatedAt: deSnap.meta?.generatedAt || new Date().toISOString(),
    deTotalListings: deActiveCount,
    deCourtsCount: deCourts.size,
    trTotalListings: trActive.length,
    trCourtsCount: trCourts.size,
    euMarkets: atlasEu,
  };
  fs.writeFileSync(path.join(SNAP_DIR, "atlas-summary.json"), JSON.stringify(atlasSummary), "utf8");

  const elapsed = (performance.now() - t0).toFixed(0);
  const sizes = EU_COUNTRIES.map((c) => {
    const st = fs.statSync(path.join(COUNTRIES_DIR, `${c.toLowerCase()}.json`));
    return `${c}:${(st.size / 1024 / 1024).toFixed(1)}MB`;
  }).join(" ");
  console.log(`✓ Built 11 country shards + atlas-summary.json in ${elapsed}ms (${sizes})`);
}

main();
