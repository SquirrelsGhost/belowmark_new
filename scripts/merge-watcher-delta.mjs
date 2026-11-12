#!/usr/bin/env node
/**
 * Lossless Merger: `belowmark-watcher` (15-min DE & TR live feed) -> `belowmark` (8-country production repo)
 *
 * - Preserves 100% of AT, CH, IT, ES, FR, GB listings in `belowmark/data/snapshots/de.json`.
 * - Merges new/updated DE listings from `belowmark-watcher/data/snapshots/de.json` while keeping
 *   enriched fields (e.g. BORIS/cache fields) from previous full syncs when watcher fields are null.
 * - Merges new/updated TR listings from `belowmark-watcher/data/snapshots/tr.json` with existing
 *   TR listings (ilan.gov.tr + GİB + SGK + VakıfBank), keeping active non-expired proceedings.
 * - Recomputes `meta.states` and runs `scripts/refresh-snapshot-ts.mjs`.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BELOWMARK_ROOT = path.resolve(__dirname, "..");
const WATCHER_SNAP_DIR =
  process.env.BELOWMARK_WATCHER_SNAP_DIR ||
  "C:\\Users\\emrea\\Desktop\\belowmark-watcher\\data\\snapshots";
const TARGET_SNAP_DIR = path.join(BELOWMARK_ROOT, "data", "snapshots");

function writeJsonAtomic(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const tmp = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(payload), "utf8");
  try {
    fs.renameSync(tmp, filePath);
  } catch {
    fs.writeFileSync(filePath, JSON.stringify(payload), "utf8");
    try {
      fs.unlinkSync(tmp);
    } catch {
      // ignore
    }
  }
}

function mergeListingFields(prev, incoming, defaults = {}) {
  if (!prev) {
    return { ...defaults, ...incoming };
  }
  const merged = { ...prev, ...defaults };
  for (const [k, v] of Object.entries(incoming)) {
    if (v !== null && v !== undefined && v !== "") {
      merged[k] = v;
    } else if (!(k in merged)) {
      merged[k] = v;
    }
  }
  // Always trust latest cancellation, rounds, hearingAt, limitsWaived, history from live watcher
  merged.cancelled = Boolean(incoming.cancelled);
  if (incoming.hearingAt) merged.hearingAt = incoming.hearingAt;
  if (Array.isArray(incoming.rounds) && incoming.rounds.length > 0) merged.rounds = incoming.rounds;
  if (typeof incoming.limitsWaived === "boolean") merged.limitsWaived = incoming.limitsWaived;
  if (Array.isArray(prev.history) || Array.isArray(incoming.history)) {
    merged.history = Array.from(new Set([...(prev.history ?? []), ...(incoming.history ?? [])]));
  }
  merged.firstSeenAt = prev.firstSeenAt || incoming.firstSeenAt || new Date().toISOString();
  return merged;
}

function getListingLastActiveMs(l) {
  const candidates = [
    l?.hearingAt,
    ...(Array.isArray(l?.rounds) ? l.rounds.flatMap((r) => [r?.end, r?.start]) : []),
  ]
    .filter(Boolean)
    .map((s) => Date.parse(s))
    .filter(Number.isFinite);
  return candidates.length > 0 ? Math.max(...candidates) : Number.POSITIVE_INFINITY;
}

function isRetainedListing(l, cutoffMs) {
  return getListingLastActiveMs(l) >= cutoffMs;
}

const nowIso = new Date().toISOString();
const deCutoffMs = Date.now() - 2 * 86_400_000;
const trCutoffMs = Date.now() - 45 * 86_400_000; // retain 45d rolling pSEO & 2nd-round UYAP corpus

const watcherDePath = path.join(WATCHER_SNAP_DIR, "de.json");
const watcherTrPath = path.join(WATCHER_SNAP_DIR, "tr.json");
const targetDePath = path.join(TARGET_SNAP_DIR, "de.json");
const targetTrPath = path.join(TARGET_SNAP_DIR, "tr.json");

let deAdded = 0;
let deUpdated = 0;
let trAdded = 0;
let trUpdated = 0;

// 1. Merge DE into 7-country EU de.json (preserving AT, CH, IT, ES, FR, GB)
if (fs.existsSync(watcherDePath) && fs.existsSync(targetDePath)) {
  const watcherDe = JSON.parse(fs.readFileSync(watcherDePath, "utf8"));
  const targetDe = JSON.parse(fs.readFileSync(targetDePath, "utf8"));

  const nonDeEuListings = [];
  const prevDeByKey = new Map();

  for (const item of targetDe.listings ?? []) {
    const country = item.country || "DE";
    if (country !== "DE") {
      nonDeEuListings.push(item);
    } else if (item.key) {
      prevDeByKey.set(item.key, item);
    }
  }

  const mergedDeMap = new Map();
  // Keep valid recent/future DE listings from previous full sync, then overlay watcher DE listings
  for (const [k, prevItem] of prevDeByKey.entries()) {
    if (isRetainedListing(prevItem, deCutoffMs)) {
      mergedDeMap.set(k, prevItem);
    }
  }

  for (const wItem of watcherDe.listings ?? []) {
    if (!wItem?.key) continue;
    const prev = mergedDeMap.get(wItem.key);
    if (!prev) deAdded++;
    else if (
      prev.hearingAt !== wItem.hearingAt ||
      Boolean(prev.cancelled) !== Boolean(wItem.cancelled) ||
      prev.appraisedValue !== wItem.appraisedValue
    ) {
      deUpdated++;
    }
    mergedDeMap.set(
      wItem.key,
      mergeListingFields(prev, wItem, { country: "DE", currency: "EUR", market: "DE" }),
    );
  }

  const combinedListings = [...mergedDeMap.values(), ...nonDeEuListings];

  // Recompute meta.states counts accurately
  const countByRegion = new Map();
  for (const l of combinedListings) {
    if (!l.cancelled && l.regionCode) {
      countByRegion.set(l.regionCode, (countByRegion.get(l.regionCode) ?? 0) + 1);
    }
  }

  const nextStates = Array.isArray(targetDe.meta?.states)
    ? targetDe.meta.states.map((st) => ({
        ...st,
        included: countByRegion.get(st.code) ?? st.included ?? 0,
      }))
    : [];

  const nextDePayload = {
    meta: {
      ...(targetDe.meta ?? {}),
      market: "DE",
      generatedAt: nowIso,
      states: nextStates,
    },
    listings: combinedListings,
  };

  writeJsonAtomic(targetDePath, nextDePayload);
  console.log(
    `[Merge DE+EU] Gesamt=${combinedListings.length} (DE=${mergedDeMap.size}, EU-Partner=${nonDeEuListings.length}, +${deAdded} neu, ${deUpdated} geändert)`,
  );
}

// 2. Merge TR into tr.json
if (fs.existsSync(watcherTrPath)) {
  const watcherTr = JSON.parse(fs.readFileSync(watcherTrPath, "utf8"));
  const targetTr = fs.existsSync(targetTrPath)
    ? JSON.parse(fs.readFileSync(targetTrPath, "utf8"))
    : { meta: { market: "TR", source: "ilan.gov.tr · GİB · SGK · VakıfBank", sourceUrl: "https://www.ilan.gov.tr/", states: [] }, listings: [] };

  const mergedTrMap = new Map();
  for (const prevItem of targetTr.listings ?? []) {
    if (prevItem?.key && isRetainedListing(prevItem, trCutoffMs)) {
      mergedTrMap.set(prevItem.key, prevItem);
    }
  }

  for (const wItem of watcherTr.listings ?? []) {
    if (!wItem?.key || !isRetainedListing(wItem, trCutoffMs)) continue;
    const prev = mergedTrMap.get(wItem.key);
    if (!prev) trAdded++;
    else if (
      prev.hearingAt !== wItem.hearingAt ||
      Boolean(prev.cancelled) !== Boolean(wItem.cancelled) ||
      prev.appraisedValue !== wItem.appraisedValue
    ) {
      trUpdated++;
    }
    mergedTrMap.set(
      wItem.key,
      mergeListingFields(prev, wItem, { market: "TR", usableAreaM2: wItem.usableAreaM2 ?? null }),
    );
  }

  const combinedTr = [...mergedTrMap.values()];
  const nextTrPayload = {
    meta: {
      market: "TR",
      generatedAt: nowIso,
      source: "ilan.gov.tr · GİB · SGK · VakıfBank",
      sourceUrl: "https://www.ilan.gov.tr/",
      states: targetTr.meta?.states ?? [],
    },
    listings: combinedTr,
  };

  writeJsonAtomic(targetTrPath, nextTrPayload);
  console.log(`[Merge TR] Gesamt=${combinedTr.length} (+${trAdded} neu, ${trUpdated} geändert)`);
}

// 3. Refresh src/lib/snapshot.ts empirical stats
execFileSync(process.execPath, [path.join(__dirname, "refresh-snapshot-ts.mjs")], {
  cwd: BELOWMARK_ROOT,
  stdio: "inherit",
});
