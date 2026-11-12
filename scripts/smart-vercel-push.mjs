#!/usr/bin/env node
/**
 * Smart Intraday Delta Push + Live Alert & IndexNow Trigger for Belowmark (Vercel)
 *
 * Runs at 11:30, 15:30, and 19:30 on Heim-PC (and can be called manually anytime):
 * 1. Runs `merge-watcher-delta.mjs` to merge all 15-minute DE & TR court findings into `belowmark/data/snapshots/`.
 * 2. Verifies strict safety guards (`de+eu >= 7000`, `tr >= 14000`).
 * 3. Checks `git diff` — if nothing changed, exits cleanly in <1s with ZERO Vercel build cost.
 * 4. Commits & pushes `data/snapshots/{de,tr}.json` + `src/lib/snapshot.ts` to `origin/main`.
 * 5. Waits 85s for Vercel production deployment, then triggers:
 *    - `POST https://www.belowmark.com/api/alerts/run` (HMAC-authenticated customer search alerts!)
 *    - `POST https://www.belowmark.com/api/termine/run` (hearing deadline reminders)
 *    - `scripts/seo-funnel-autopilot.mjs --push-indexnow-all` (Bing, Yandex, ChatGPT, Perplexity)
 */

import { createHmac } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const LOG_DIR = path.join(ROOT, ".data", "logs");
fs.mkdirSync(LOG_DIR, { recursive: true });
const LOG_FILE = path.join(LOG_DIR, "smart-vercel-push.log");

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  try {
    fs.appendFileSync(LOG_FILE, `${line}\n`, "utf8");
  } catch {
    // ignore
  }
}

function loadEnvLocal() {
  const envFile = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envFile)) return;
  for (const raw of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const trimmed = raw.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

function getCronBearerToken() {
  if (process.env.ALERTS_CRON_SECRET?.trim()) {
    return process.env.ALERTS_CRON_SECRET.trim();
  }
  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
  if (!dbUrl) return "";
  return createHmac("sha256", dbUrl).update("bm-cron-auth-v1").digest("base64url");
}

export async function triggerLiveVercelAlerts(prodOrigin = "https://www.belowmark.com") {
  loadEnvLocal();
  const token = getCronBearerToken();
  if (!token) {
    log("[Alerts] Übersprungen: Weder ALERTS_CRON_SECRET noch DATABASE_URL in .env.local gesetzt.");
    return null;
  }

  const headers = { Authorization: `Bearer ${token}` };
  let alertData = null;

  try {
    const res = await fetch(`${prodOrigin}/api/alerts/run`, {
      method: "POST",
      headers,
      signal: AbortSignal.timeout(120_000),
    });
    const body = await res.json().catch(() => null);
    if (res.ok && body?.success) {
      alertData = body.data;
      log(
        `[Live Alerts OK] checked=${alertData.checked}, mailed=${alertData.mailed}, newHits=${alertData.newHits}, changeHits=${alertData.changeHits}, unverifiedReminders=${alertData.unverifiedRemindersSent ?? 0}`,
      );
    } else {
      log(`[Live Alerts Warnung] HTTP ${res.status}: ${JSON.stringify(body)}`);
    }
  } catch (err) {
    log(`[Live Alerts Fehler] ${err.message}`);
  }

  try {
    const resTermine = await fetch(`${prodOrigin}/api/termine/run`, {
      method: "POST",
      headers,
      signal: AbortSignal.timeout(60_000),
    });
    if (resTermine.ok) {
      log("[Live Termine-Reminder OK] /api/termine/run ausgeführt.");
    }
  } catch {
    // ignore optional deadline run error
  }

  return alertData;
}

async function main() {
  loadEnvLocal();
  const skipWait = process.argv.includes("--no-wait");
  const alertsOnly = process.argv.includes("--alerts-only");

  if (alertsOnly) {
    await triggerLiveVercelAlerts();
    return;
  }

  log("Starte Belowmark Smart-Delta-Merge (15-Min.-Watcher -> Production Repo)...");
  execFileSync(process.execPath, [path.join(__dirname, "merge-watcher-delta.mjs")], {
    cwd: ROOT,
    stdio: "inherit",
  });

  const deJson = JSON.parse(fs.readFileSync(path.join(ROOT, "data/snapshots/de.json"), "utf8"));
  const trJson = JSON.parse(fs.readFileSync(path.join(ROOT, "data/snapshots/tr.json"), "utf8"));
  const deCount = (deJson.listings ?? []).length;
  const trCount = (trJson.listings ?? []).length;

  if (deCount < 7000 || trCount < 14000) {
    log(`ABBRUCH Safety-Guard: de+eu=${deCount} (min 7000), tr=${trCount} (min 14000).`);
    process.exit(1);
  }

  const targetFiles = ["data/snapshots/de.json", "data/snapshots/tr.json", "src/lib/snapshot.ts"];
  const diffOut = execFileSync("git", ["status", "--porcelain", ...targetFiles], {
    cwd: ROOT,
    encoding: "utf8",
  }).trim();

  if (!diffOut) {
    log(`Keine neuen Snapshot-Änderungen seit letztem Push (EU=${deCount}, TR=${trCount}) — 0 Vercel-Build-Minuten verbraucht.`);
    return;
  }

  // Pull rebase cleanly before committing snapshot updates if upstream moved
  execFileSync("git", ["add", ...targetFiles], { cwd: ROOT, stdio: "inherit" });
  const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
  execFileSync(
    "git",
    ["commit", "-m", `chore(data): live court delta sync ${stamp} (${deCount + trCount} active)`],
    { cwd: ROOT, stdio: "inherit" },
  );

  try {
    execFileSync("git", ["pull", "--rebase", "--autostash", "-X", "theirs", "origin", "main"], { cwd: ROOT, stdio: "inherit" });
  } catch {
    try {
      execFileSync("git", ["rebase", "--abort"], { cwd: ROOT, stdio: "ignore" });
    } catch {
      // ignore
    }
  }

  try {
    execFileSync("git", ["push", "origin", "main"], { cwd: ROOT, stdio: "inherit" });
  } catch {
    execFileSync("git", ["pull", "--rebase", "--autostash", "-X", "theirs", "origin", "main"], { cwd: ROOT, stdio: "inherit" });
    execFileSync("git", ["push", "origin", "main"], { cwd: ROOT, stdio: "inherit" });
  }
  log(`Git-Push nach origin/main erfolgreich (${deCount + trCount} aktive Auktionen).`);

  if (!skipWait) {
    log("Warte 85s auf Vercel Production Deployment vor Live-Alerts & IndexNow...");
    await new Promise((r) => setTimeout(r, 85_000));
  }

  await triggerLiveVercelAlerts();

  try {
    execFileSync(process.execPath, ["--use-system-ca", "scripts/seo-funnel-autopilot.mjs", "--push-indexnow-all"], {
      cwd: ROOT,
      stdio: "inherit",
    });
  } catch (err) {
    log(`[IndexNow Hinweis] ${err.message}`);
  }

  log("Belowmark Smart-Delta-Push + Live-Alerts + IndexNow komplett abgeschlossen.");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    log(`[FATAL] ${err?.stack || err?.message || String(err)}`);
    process.exit(1);
  });
}
