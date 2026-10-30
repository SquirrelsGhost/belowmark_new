#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Belowmark Instagram & Meta Ads Autopilot (1:1 wie ImanTree)
//
// Ablauf jeden Tag (automatisch per Task Scheduler oder manuell via
// `npm run insta:autopilot`):
//   1. Prüft Alter von data/snapshots/de.json & tr.json (> 18h -> `npm run sync`)
//   2. Erzeugt für heute alle 3 Themen (`--alle`) + die 7-Tage-Wochenvorschau
//      (Mo/Mi/Fr = Objekt, Di/Sa = Wissen, Do/So = Zahl) als 4:5 Feed (1080×1350),
//      9:16 Story (1080×1920), SEO-Caption (.txt) und Meta-Ads-Spec (ads.json)
//   3. Schreibt marketing/instagram/week-plan.json
//   4. Synchronisiert Bilder, Wochenplan & Meta-Ads-Vorlagen auf pycie-prod
//      (/root/backend/public/generated/belowmark/ + pycie.sqlite) sowie in die
//      lokale PYCIE-Datenbank (C:\Users\emrea\Desktop\pycie\data\pycie.sqlite).
// ---------------------------------------------------------------------------

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_ROOT = resolve(ROOT, "marketing", "instagram");
const SNAP_DE = resolve(ROOT, "data", "snapshots", "de.json");
const SNAP_TR = resolve(ROOT, "data", "snapshots", "tr.json");
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

const WEEKDAY_NAMES_DE = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
// Jeden Tag immer ein echtes, aktuelles Objekt mit Preis & Gerichtstermin posten
const WEEKDAY_THEME = ["objekt", "objekt", "objekt", "objekt", "objekt", "objekt", "objekt"];

const PILLAR_MAP = {
  de: {
    objekt: "Objekt des Tages",
    zahl: "Zahl des Tages",
    wissen: "Wissen",
  },
  tr: {
    objekt: "Günün ilanı",
    zahl: "Günün rakamı",
    wissen: "Bilgi",
  },
};

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  })
);

function snapshotAgeHours(file) {
  if (!existsSync(file)) return Infinity;
  try {
    const meta = JSON.parse(readFileSync(file, "utf8"))?.meta;
    const ts = Date.parse(meta?.generatedAt || "");
    if (Number.isNaN(ts)) return Infinity;
    return (Date.now() - ts) / HOUR;
  } catch {
    return Infinity;
  }
}

function runNode(scriptArgs, label) {
  console.log(`[Belowmark Autopilot] ${label}...`);
  execFileSync(process.execPath, scriptArgs, { cwd: ROOT, stdio: "inherit" });
}

// 1. Frische Aushänge sicherstellen (jeden Morgen vor dem Posten aktualisieren)
const ageDe = snapshotAgeHours(SNAP_DE);
const ageTr = snapshotAgeHours(SNAP_TR);
if (args.sync || ageDe > 10 || ageTr > 10) {
  try {
    runNode(["--use-system-ca", "scripts/sync-live.mjs"], `Sync amtliche Aushänge (Alter DE=${ageDe.toFixed(1)}h, TR=${ageTr.toFixed(1)}h)`);
  } catch (err) {
    console.warn(`[Belowmark Autopilot] Warnung: Live-Sync fehlgeschlagen (${err.message}), nutze vorhandenen Datenstand.`);
  }
}

// 2. Datum & aktuelle Kalenderwoche (Montag bis Sonntag) bestimmen
const today = args.datum
  ? new Date(`${args.datum}T00:00:00Z`)
  : new Date(new Date().toISOString().slice(0, 10) + "T00:00:00Z");
const todayIso = today.toISOString().slice(0, 10);

const utcDay = today.getUTCDay(); // 0=So, 1=Mo ... 6=Sa
const diffToMonday = utcDay === 0 ? -6 : 1 - utcDay;
const monday = new Date(today.getTime() + diffToMonday * DAY);
const weekStartIso = monday.toISOString().slice(0, 10);

const weekDates = [];
for (let i = 0; i < 7; i++) {
  const d = new Date(monday.getTime() + i * DAY);
  weekDates.push({
    iso: d.toISOString().slice(0, 10),
    dayName: WEEKDAY_NAMES_DE[d.getUTCDay()],
    theme: WEEKDAY_THEME[d.getUTCDay()],
  });
}

// Alle Tage der aktuellen Woche vorrendern (für die 7-Tage-Wochenvorschau im CRM)
for (const wd of weekDates) {
  if (wd.iso === todayIso) continue;
  const manifestPath = resolve(OUT_ROOT, wd.iso, "manifest.json");
  if (!existsSync(manifestPath) || args["force-week"]) {
    runNode(
      ["scripts/instagram-daily.mjs", `--datum=${wd.iso}`, `--thema=${wd.theme}`, "--trotzdem"],
      `Wochenplan-Tag ${wd.dayName} (${wd.iso} · ${wd.theme})`
    );
  }
}

// Heute mit allen 3 Themen rendern (aktualisiert latest.json + ads.json)
runNode(["scripts/instagram-daily.mjs", `--datum=${todayIso}`, "--alle"], `Tages-Render (${todayIso} · alle 3 Themen)`);

// 3. Wochenplan-Manifest (week-plan.json) für DE & TR zusammenbauen
const latest = JSON.parse(readFileSync(resolve(OUT_ROOT, "latest.json"), "utf8"));
const todayAds = existsSync(resolve(OUT_ROOT, todayIso, "ads.json"))
  ? JSON.parse(readFileSync(resolve(OUT_ROOT, todayIso, "ads.json"), "utf8")).ads
  : [];

const weekPlan = {
  generatedAt: new Date().toISOString(),
  todayIso,
  weekStart: weekStartIso,
  scheduledThemeToday: latest.scheduledTheme,
  profiles: {
    belowmark_de: { lang: "de", market: "DE", days: [] },
    belowmark_tr: { lang: "tr", market: "TR", days: [] },
  },
  todayPosts: latest.posts,
  todayAds,
};

for (const wd of weekDates) {
  const dayManifestFile = resolve(OUT_ROOT, wd.iso, "manifest.json");
  const dayManifest = existsSync(dayManifestFile)
    ? JSON.parse(readFileSync(dayManifestFile, "utf8"))
    : latest;

  for (const [profileKey, lang] of [
    ["belowmark_de", "de"],
    ["belowmark_tr", "tr"],
  ]) {
    const themeObj =
      dayManifest.posts?.[lang]?.[wd.theme] ||
      dayManifest.posts?.[lang]?.wissen ||
      latest.posts?.[lang]?.[wd.theme] ||
      latest.posts?.[lang]?.wissen;

    if (!themeObj) continue;
    const firstLine = (themeObj.caption || "").split("\n")[0] || themeObj.headline;
    weekPlan.profiles[profileKey].days.push({
      day: wd.dayName,
      date: wd.iso,
      time: lang === "de" ? "09:30" : "10:00",
      platform: "instagram",
      theme: wd.theme,
      pillar: PILLAR_MAP[lang][wd.theme],
      title: `${themeObj.rubric}: ${firstLine}`.slice(0, 110),
      note: `Amtlicher Aushang (${wd.theme.toUpperCase()}) · 4:5 Feed + 9:16 Story + SEO-Caption`,
      assignedTo: lang === "de" ? "Katrin Weiss (DE)" : "Katrin Weiss (TR)",
      feedPath: `${wd.iso}/${themeObj.feedFile}`,
      storyPath: `${wd.iso}/${themeObj.storyFile}`,
      caption: themeObj.caption,
      headline: themeObj.headline,
      ad: themeObj.ad,
    });
  }
}

mkdirSync(OUT_ROOT, { recursive: true });
const weekPlanFile = resolve(OUT_ROOT, "week-plan.json");
writeFileSync(weekPlanFile, JSON.stringify(weekPlan, null, 2));
console.log(`[Belowmark Autopilot] Wochenplan geschrieben: ${weekPlanFile}`);

// 4. Remote-Sync zu pycie-prod (sofern nicht --local-only)
if (!args["local-only"]) {
  try {
    console.log("[Belowmark Autopilot] Synchronisiere Assets & Wochenplan nach pycie-prod...");
    execFileSync(
      "ssh",
      ["-o", "ConnectTimeout=8", "pycie-prod", "mkdir -p /root/backend/public/generated/belowmark"],
      { stdio: "inherit" }
    );

    // Kopiere latest.json, week-plan.json, verlauf.json und alle Wochen-Ordner
    const dirsToCopy = Array.from(new Set([todayIso, ...weekDates.map((w) => w.iso)]))
      .map((d) => resolve(OUT_ROOT, d))
      .filter((p) => existsSync(p));

    execFileSync(
      "scp",
      [
        "-o",
        "ConnectTimeout=8",
        "-r",
        resolve(OUT_ROOT, "latest.json"),
        weekPlanFile,
        ...dirsToCopy,
        "pycie-prod:/root/backend/public/generated/belowmark/",
      ],
      { stdio: "inherit" }
    );

    // Falls das Remote-Sync-Skript auf pycie-prod existiert, ausführen
    execFileSync(
      "ssh",
      [
        "-o",
        "ConnectTimeout=8",
        "pycie-prod",
        "if [ -f /root/backend/scripts/sync-belowmark-social.mjs ]; then node /root/backend/scripts/sync-belowmark-social.mjs; fi",
      ],
      { stdio: "inherit" }
    );

    const localPycieDb = "C:/Users/emrea/Desktop/pycie/data/pycie.sqlite";
    if (existsSync("C:/Users/emrea/Desktop/pycie/data")) {
      execFileSync("scp", ["-o", "ConnectTimeout=8", "pycie-prod:/root/backend/data/pycie.sqlite", localPycieDb], {
        stdio: "inherit",
      });
    }
    console.log("[Belowmark Autopilot] Remote-Sync auf pycie-prod abgeschlossen.");
  } catch (err) {
    console.warn(`[Belowmark Autopilot] Remote-Sync Hinweis: ${err.message}`);
  }
}

// 5. Täglicher Live-Post (Objekt des Tages mit Preis + Story) auf @belowmark_com veröffentlichen
if (!args["no-publish"]) {
  try {
    runNode(["scripts/instagram-publish.mjs", `--datum=${todayIso}`], `Veröffentliche Tages-Objekt (${todayIso}) auf @belowmark_com`);
  } catch (err) {
    console.error(`[Belowmark Autopilot] Live-Publish Fehler: ${err.message}`);
  }
}

