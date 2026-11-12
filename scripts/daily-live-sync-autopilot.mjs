#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Daily 05:45 Full 8-Country Auction Sync + Lossless Watcher Merge + Push + Live Alerts + IndexNow
// Runs at 05:45 on Heim-PC via Scheduled Task `BELOWMARK_Daily_Live_Sync`.
// ---------------------------------------------------------------------------

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { triggerLiveVercelAlerts } from "./smart-vercel-push.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function runCmd(bin, cmdArgs) {
  return execFileSync(bin, cmdArgs, { cwd: ROOT, stdio: "inherit" });
}

console.log(`[${new Date().toISOString()}] Starting Belowmark Full 8-Country Live Sync (DE, AT, CH, IT, ES, FR, GB, TR)...`);
runCmd(process.execPath, ["--use-system-ca", "scripts/sync-live.mjs"]);

// Merge any ultra-fresh 15-minute watcher entries on top so nothing is lost
if (fs.existsSync(path.join(__dirname, "merge-watcher-delta.mjs"))) {
  runCmd(process.execPath, ["scripts/merge-watcher-delta.mjs"]);
} else {
  runCmd(process.execPath, ["scripts/refresh-snapshot-ts.mjs"]);
}

// Safety guard: verify non-empty 8-country snapshots before committing
const deJson = JSON.parse(fs.readFileSync(path.join(ROOT, "data/snapshots/de.json"), "utf8"));
const trJson = JSON.parse(fs.readFileSync(path.join(ROOT, "data/snapshots/tr.json"), "utf8"));
const deCount = (deJson.listings ?? []).length;
const trCount = (trJson.listings ?? []).length;

if (deCount < 7000 || trCount < 14000) {
  console.error(`Safety guard triggered: de+eu=${deCount}, tr=${trCount}. Aborting auto-commit.`);
  process.exit(1);
}

const targetFiles = ["data/snapshots/de.json", "data/snapshots/tr.json", "src/lib/snapshot.ts"];
const diffOut = execFileSync("git", ["status", "--porcelain", ...targetFiles], {
  cwd: ROOT,
  encoding: "utf8",
}).trim();

if (!diffOut) {
  console.log("No snapshot diff detected — nothing to push.");
  process.exit(0);
}

const day = new Date().toISOString().slice(0, 10);
runCmd("git", ["add", ...targetFiles]);
runCmd("git", ["commit", "-m", `chore(data): daily 8-country auction sync ${day} (${deCount + trCount} active)`]);
try {
  runCmd("git", ["pull", "--rebase", "--autostash", "-X", "theirs", "origin", "main"]);
} catch {
  try {
    runCmd("git", ["rebase", "--abort"]);
  } catch {
    // ignore
  }
}
try {
  runCmd("git", ["push", "origin", "main"]);
} catch {
  runCmd("git", ["pull", "--rebase", "--autostash", "-X", "theirs", "origin", "main"]);
  runCmd("git", ["push", "origin", "main"]);
}

console.log("Waiting 85s for Vercel production build before Live Customer Alerts & IndexNow...");
await new Promise((r) => setTimeout(r, 85_000));
await triggerLiveVercelAlerts();
runCmd(process.execPath, ["--use-system-ca", "scripts/seo-funnel-autopilot.mjs", "--push-indexnow-all"]);
