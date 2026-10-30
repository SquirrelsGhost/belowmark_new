// ---------------------------------------------------------------------------
// Daten für die Instagram-Bilder: liest die Snapshots, wählt das Objekt des
// Tages und zählt die Kennzahlen. Alles stammt aus data/snapshots/*.json —
// fehlt ein Wert im Aushang, wird das Objekt nicht genommen statt geschätzt.
//
// Datenschutz: Für die Bilder werden nur Objektart, Ort, PLZ-Bereich (DE) bzw.
// İl/İlçe (TR), Gericht/Dienststelle, Termin und amtliche Beträge verwendet.
// Keine Straße, kein Aktenzeichen, keine Ada/Parsel, keine Namen.
// ---------------------------------------------------------------------------

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const DAY = 24 * 60 * 60 * 1000;

/** Objektarten, die als „Objekt des Tages“ taugen (keine Stellplätze, keine Anteile). */
const OBJECT_SEGMENTS = ["house", "apartment", "multiFamily"];

export function loadSnapshot(root, market) {
  const file = resolve(root, "data", "snapshots", `${market.toLowerCase()}.json`);
  return JSON.parse(readFileSync(file, "utf8"));
}

/** Einfacher, stabiler Hash — gleicher Tag ergibt immer dasselbe Objekt. */
function hash(text) {
  let h = 2166136261;
  for (const c of text) h = Math.imul(h ^ c.codePointAt(0), 16777619);
  return h >>> 0;
}

/** Nächste Bieterrunde, die nach `day` beginnt (DE: der Termin, TR: 1. oder 2. Artırma). */
export function nextRound(listing, day) {
  return listing.rounds.find((r) => Date.parse(r.start) >= day.getTime()) ?? null;
}

function isShare(listing) {
  if (listing.tr?.ownershipShare) return true;
  if (/hisse/i.test(listing.title)) return true;
  return listing.caveats.some((c) => /Anteil/i.test(c.short));
}

function deCandidate(l, day) {
  if (l.cancelled || !OBJECT_SEGMENTS.includes(l.segment) || !l.segmentLabel) return false;
  if (/garage|stellplatz|carport|erbbaurecht|acker|wald|gartenland|unbebaut/i.test(l.segmentLabel)) return false;
  if (!l.appraisedValue || l.appraisedValue < 30_000 || !l.place || !l.postcode) return false;
  if (!(l.livingAreaM2 || l.usableAreaM2 || l.landAreaM2)) return false;
  // Mehrere Objekte in einem Aushang haben keinen einzelnen Verkehrswert
  if (l.caveats.some((c) => /Einzelverkehrswert|mehrere/i.test(c.short))) return false;
  const start = Date.parse(l.hearingAt ?? "");
  return start >= day.getTime() + 4 * DAY && start <= day.getTime() + 35 * DAY;
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
 * Objekt des Tages. `used` sind Schlüssel der letzten Wochen (marketing/instagram/verlauf.json),
 * damit dasselbe Objekt nicht zweimal läuft. Bevorzugt Objekte, die sowohl Wohn-/Gebäudefläche
 * als auch Grundstücksfläche ausgewiesen haben.
 */
export function pickObject(snapshot, market, day, used = new Set()) {
  const test = market === "DE" ? deCandidate : trCandidate;
  const pool = snapshot.listings.filter((l) => test(l, day)).sort((a, b) => a.key.localeCompare(b.key));
  const fresh = pool.filter((l) => !used.has(l.key));
  const baseList = fresh.length ? fresh : pool;
  if (!baseList.length) return null;
  const richList = baseList.filter((l) =>
    market === "DE"
      ? Boolean((l.livingAreaM2 || l.usableAreaM2) && l.landAreaM2)
      : Boolean((l.tr?.buildingAreaM2 || l.tr?.netAreaM2) && l.tr?.landAreaM2),
  );
  const list = richList.length ? richList : baseList;
  return list[hash(`${market}:${day.toISOString().slice(0, 10)}`) % list.length];
}

/** Datenschutzfreundliche Ortsangabe: DE „PLZ 882xx · Schlier“, TR „Keçiören / Ankara“. */
export function placeLine(listing) {
  if (listing.market === "DE") {
    const area = listing.postcode ? `PLZ ${listing.postcode.slice(0, 3)}xx · ` : "";
    return `${area}${listing.place.split(",")[0].trim()}`;
  }
  return `${listing.place} / ${listing.region}`;
}

function upcoming(snapshot, day, days) {
  const from = day.getTime();
  const to = from + days * DAY;
  return snapshot.listings.filter((l) => {
    if (l.cancelled) return false;
    return l.rounds.some((r) => {
      const t = Date.parse(r.start);
      return t >= from && t < to;
    });
  });
}

function topRegions(list, n) {
  const counts = new Map();
  for (const l of list) if (l.region) counts.set(l.region, (counts.get(l.region) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([name, count]) => ({ name, count }));
}

function median(values) {
  const v = [...values].sort((a, b) => a - b);
  if (!v.length) return null;
  const m = Math.floor(v.length / 2);
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
}

/**
 * Kennzahl des Tages. Drei Varianten, die sich täglich abwechseln:
 *  - week:   Termine/Runden der nächsten 7 Tage, Top-Regionen
 *  - month:  Termine/Runden der nächsten 30 Tage, Top-Regionen
 *  - median: Median Verkehrswert / muhammen bedel je Objektart (nächste 30 Tage)
 */
export function pickStat(snapshot, market, day) {
  const variants = ["week", "median", "month"];
  const variant = variants[Math.floor(day.getTime() / DAY) % variants.length];
  const days = variant === "week" ? 7 : 30;
  const list = upcoming(snapshot, day, days);

  if (variant === "median") {
    const rows = OBJECT_SEGMENTS.map((segment) => {
      const values = list.filter((l) => l.segment === segment && l.appraisedValue && !isShare(l)).map((l) => l.appraisedValue);
      return { segment, value: median(values), count: values.length };
    }).filter((r) => r.count >= 20);
    return { variant, days, total: list.length, rows };
  }
  return { variant, days, total: list.length, regions: topRegions(list, 5) };
}
