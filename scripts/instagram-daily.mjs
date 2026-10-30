#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Instagram-Bilder des Tages aus den Snapshots, Deutsch (Markt DE) und
// Türkisch (Markt TR), jeweils als Feed (1080×1350) und Story (1080×1920)
// plus SEO-starke Bildunterschrift mit Hashtags und Meta-Ads-Vorlagen.
//
//   npm run insta:daily                      Thema nach Wochentag, heute
//   npm run insta:daily -- --alle            alle drei Themen
//   npm run insta:daily -- --thema=wissen    objekt | zahl | wissen
//   npm run insta:daily -- --datum=2026-10-27
//
// Ablauf am Morgen: `npm run sync`, dann `npm run insta:daily` (oder
// vollautomatisch via `npm run insta:autopilot`).
// Ausgabe: marketing/instagram/<datum>/ (de-objekt-feed.png, de-objekt-story.png,
// de-objekt.txt, de-objekt-ad.txt, tr-…, ads.json, kontrolle.txt mit den
// amtlichen Links) sowie marketing/instagram/latest.json.
// marketing/instagram/verlauf.json merkt sich die gezeigten Objekte, damit
// keines innerhalb von 60 Tagen doppelt läuft.
//
// Gerendert mit next/og (Satori + resvg, steckt in Next.js), also ohne
// Browser und ohne zusätzliche Pakete. Schriften: scripts/instagram/fonts (OFL).
// ---------------------------------------------------------------------------

import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ImageResponse } from "next/og.js";
import { Frame, SIZES } from "./instagram/brand.mjs";
import { objectCard, statCard, tipCard } from "./instagram/cards.mjs";
import { objectCaption, statCaption, tipCaption } from "./instagram/captions.mjs";
import { objectAdSpec, statAdSpec, tipAdSpec, formatAdSheet } from "./instagram/ads.mjs";
import { loadSnapshot, pickObject, pickStat } from "./instagram/data.mjs";
import { T, dateShort } from "./instagram/texts.mjs";
import { TIPS_DE, TIPS_TR } from "./instagram/tips.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FONT_DIR = resolve(ROOT, "scripts", "instagram", "fonts");
const OUT_ROOT = resolve(ROOT, "marketing", "instagram");
const HISTORY = resolve(OUT_ROOT, "verlauf.json");
const LATEST_MANIFEST = resolve(OUT_ROOT, "latest.json");
const DAY = 24 * 60 * 60 * 1000;
/** Ältere Daten zeigen womöglich aufgehobene Termine — dann kein Objekt des Tages. */
const MAX_SNAPSHOT_AGE_DAYS = 2;
/** Jeden Tag ein echtes, aktuelles Objekt des Tages mit Preis & Termin */
const WEEKDAY_THEME = ["objekt", "objekt", "objekt", "objekt", "objekt", "objekt", "objekt"];

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  })
);

const day = args.datum ? new Date(`${args.datum}T00:00:00Z`) : new Date(new Date().toISOString().slice(0, 10) + "T00:00:00Z");
if (Number.isNaN(day.getTime())) {
  console.error(`Ungültiges Datum: ${args.datum} (erwartet JJJJ-MM-TT)`);
  process.exit(1);
}
const isoDay = day.toISOString().slice(0, 10);
const scheduledTheme = WEEKDAY_THEME[day.getUTCDay()];
const themes = args.alle ? ["objekt", "zahl", "wissen"] : [args.thema ?? scheduledTheme];
if (themes.some((t) => !["objekt", "zahl", "wissen"].includes(t))) {
  console.error(`Unbekanntes Thema: ${args.thema} (objekt | zahl | wissen)`);
  process.exit(1);
}

const font = (file) => readFileSync(resolve(FONT_DIR, file));
const FONTS = [
  { name: "Archivo Condensed", data: font("Archivo-Condensed-ExtraBold.ttf"), weight: 800, style: "normal" },
  { name: "Archivo", data: font("Archivo-Regular.ttf"), weight: 400, style: "normal" },
  { name: "Archivo", data: font("Archivo-SemiBold.ttf"), weight: 600, style: "normal" },
  { name: "IBM Plex Mono", data: font("IBMPlexMono-Regular.ttf"), weight: 400, style: "normal" },
  { name: "IBM Plex Mono", data: font("IBMPlexMono-SemiBold.ttf"), weight: 600, style: "normal" },
  { name: "Newsreader", data: font("Newsreader-Italic.ttf"), weight: 400, style: "italic" },
];

async function render(node, size, file) {
  const res = new ImageResponse(node, { width: size.width, height: size.height, fonts: FONTS });
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
}

// Ein erneuter Lauf am selben Tag ersetzt dessen Einträge, statt ein anderes Objekt zu wählen.
const history = (existsSync(HISTORY) ? JSON.parse(readFileSync(HISTORY, "utf8")) : []).filter((h) => h.date !== isoDay);
const recent = new Set(history.filter((h) => Date.parse(h.date) > day.getTime() - 60 * DAY).map((h) => h.key));
const outDir = resolve(OUT_ROOT, isoDay);
mkdirSync(outDir, { recursive: true });

/** Baut Inhalt + Bildunterschrift + Ad-Vorlage für ein Thema; null, wenn es heute nichts Belegbares gibt. */
function compose(theme, market, lang, snapshot) {
  const t = T[lang];
  const snapshotDate = dateShort(snapshot.meta.generatedAt, lang);
  const ageDays = (day.getTime() + DAY - Date.parse(snapshot.meta.generatedAt)) / DAY;

  if (theme === "objekt") {
    if (ageDays > MAX_SNAPSHOT_AGE_DAYS && !args.trotzdem) {
      console.warn(`  ${market}: Datenstand ${snapshotDate} ist zu alt für ein Objekt des Tages — erst "npm run sync" (oder --trotzdem).`);
      return null;
    }
    const listing = pickObject(snapshot, market, day, recent);
    if (!listing) return null;
    history.push({ date: isoDay, market, key: listing.key });
    return {
      rubric: t.rubric.object,
      source: t.source(snapshotDate),
      body: (size) => objectCard({ listing, lang, size, day }),
      caption: objectCaption({ listing, lang, day, snapshotDate }),
      ad: objectAdSpec({ listing, lang, day, isoDay, snapshotDate }),
      ref: listing.officialUrl,
    };
  }
  if (theme === "zahl") {
    const stat = pickStat(snapshot, market, day);
    return {
      rubric: t.rubric.stat,
      source: t.source(snapshotDate),
      body: (size) => statCard({ stat, lang, size }),
      caption: statCaption({ stat, lang, snapshotDate }),
      ad: statAdSpec({ stat, lang, isoDay, snapshotDate }),
    };
  }
  const tips = lang === "de" ? TIPS_DE : TIPS_TR;
  const index = Math.floor(day.getTime() / DAY) % tips.length;
  const tip = tips[index];
  return {
    rubric: t.rubric.tip,
    source: lang === "de" ? "Gesetzestext: gesetze-im-internet.de" : "Mevzuat: mevzuat.gov.tr · UYAP e-Satış",
    body: (size) => tipCard({ tip, index: index + 1, count: tips.length, lang, size }),
    caption: tipCaption({ tip, lang }),
    ad: tipAdSpec({ tip, lang, isoDay }),
  };
}

const written = [];
/** Amtliche Aushänge zum Gegenprüfen vor dem Posten (nicht für Instagram). */
const checks = [];
const adsBundle = [];
const postsManifest = {};

for (const [market, lang] of [["DE", "de"], ["TR", "tr"]]) {
  const snapshot = loadSnapshot(ROOT, market);
  postsManifest[lang] = {};
  for (const theme of themes) {
    const post = compose(theme, market, lang, snapshot);
    if (!post) continue;
    const t = T[lang];
    const date = dateShort(day.toISOString(), lang);
    for (const [format, size] of Object.entries(SIZES)) {
      const file = resolve(outDir, `${lang}-${theme}-${format}.png`);
      const node = Frame({
        size, lang, date, rubric: post.rubric, source: post.source, disclaimer: t.disclaimer,
        cta: format === "story" ? t.ctaStory : null,
        children: post.body(size),
      });
      await render(node, size, file);
      written.push(file);
    }
    const captionFile = resolve(outDir, `${lang}-${theme}.txt`);
    writeFileSync(captionFile, post.caption);
    written.push(captionFile);

    const feedFile = `${lang}-${theme}-feed.png`;
    const storyFile = `${lang}-${theme}-story.png`;
    if (post.ad) {
      const adEntry = {
        ...post.ad,
        feedFile,
        storyFile,
        captionFile: `${lang}-${theme}.txt`,
        caption: post.caption,
      };
      adsBundle.push(adEntry);
      const adFile = resolve(outDir, `${lang}-${theme}-ad.txt`);
      writeFileSync(adFile, formatAdSheet(post.ad, feedFile, storyFile));
      written.push(adFile);
    }

    postsManifest[lang][theme] = {
      rubric: post.rubric,
      feedFile,
      storyFile,
      captionFile: `${lang}-${theme}.txt`,
      adFile: `${lang}-${theme}-ad.txt`,
      caption: post.caption,
      headline: post.ad?.headline ?? post.rubric,
      ad: post.ad ?? null,
    };

    if (post.ref) checks.push(`${lang}-${theme}: ${post.ref}`);
  }
}

if (adsBundle.length) {
  const adsJsonFile = resolve(outDir, "ads.json");
  writeFileSync(adsJsonFile, JSON.stringify({ generatedAt: new Date().toISOString(), isoDay, scheduledTheme, ads: adsBundle }, null, 2));
  written.push(adsJsonFile);
}

if (checks.length) {
  const file = resolve(outDir, "kontrolle.txt");
  writeFileSync(file, `Vor dem Posten prüfen: Termin noch angesetzt, Beträge wie im Aushang?\n\n${checks.join("\n")}\n`);
  written.push(file);
}

writeFileSync(HISTORY, JSON.stringify(history.slice(-400), null, 2));
const dayManifestPayload = {
  updatedAt: new Date().toISOString(),
  isoDay,
  scheduledTheme,
  themesGenerated: themes,
  posts: postsManifest,
};
writeFileSync(resolve(outDir, "manifest.json"), JSON.stringify(dayManifestPayload, null, 2));
if (!args.datum || args.datum === new Date().toISOString().slice(0, 10)) {
  writeFileSync(LATEST_MANIFEST, JSON.stringify(dayManifestPayload, null, 2));
}

console.log(`${written.length} Dateien in ${outDir}`);
for (const f of written) console.log(`  ${f.slice(outDir.length + 1)}`);
