#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Daily Live Multi-Country Auction Sync + Safe Auto-Commit/Push + GSC/IndexNow
// Runs at 05:45 on Heim-PC via Scheduled Task `BELOWMARK_Daily_Live_Sync`.
// ---------------------------------------------------------------------------

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function runCmd(bin, cmdArgs) {
  return execFileSync(bin, cmdArgs, { cwd: ROOT, stdio: "inherit" });
}

console.log(`[${new Date().toISOString()}] Starting Belowmark 8-Country Live Sync...`);
runCmd(process.execPath, ["--use-system-ca", "scripts/sync-live.mjs"]);

// Safety guard: verify non-empty snapshots before committing
const deJson = JSON.parse(fs.readFileSync(path.join(ROOT, "data/snapshots/de.json"), "utf8"));
const trJson = JSON.parse(fs.readFileSync(path.join(ROOT, "data/snapshots/tr.json"), "utf8"));
const deCount = (deJson.listings ?? []).length;
const trCount = (trJson.listings ?? []).length;

if (deCount < 3500 || trCount < 8000) {
  console.error(`Safety guard triggered: de=${deCount}, tr=${trCount}. Aborting auto-commit.`);
  process.exit(1);
}

const diffOut = execFileSync("git", ["status", "--porcelain", "data/snapshots/de.json", "data/snapshots/tr.json"], {
  cwd: ROOT,
  encoding: "utf8",
}).trim();

if (!diffOut) {
  console.log("No snapshot diff detected — nothing to push.");
  process.exit(0);
}

const day = new Date().toISOString().slice(0, 10);
runCmd("git", ["add", "data/snapshots/de.json", "data/snapshots/tr.json"]);
runCmd("git", ["commit", "-m", `chore(data): daily 8-country auction sync ${day} (${deCount + trCount} active)`]);
runCmd("git", ["push", "origin", "main"]);

console.log("Waiting 75s for Vercel production build before IndexNow & GSC refresh...");
await new Promise((r) => setTimeout(r, 75_000));
runCmd(process.execPath, ["--use-system-ca", "scripts/seo-funnel-autopilot.mjs", "--push-indexnow-all"]);
