#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Belowmark Instagram Viral Content Engine v2 (DE & TR):
//   - Echte Satelliten-Luftbilder (PLZ-Sektor)
//   - 5-Slide Swipe-Karussell (1080×1350) für Objekt-Deals
//   - 9:16 Video-Reel (1080×1920 MP4, 30fps, H.264 + AAC) via ffmpeg
//   - 9:16 Story mit öffentlicher Ziel-URL für klickbaren Link-Sticker
//   - Strikte DE-Ländertrennung & Viral-Deal-Scorer
// ---------------------------------------------------------------------------

import { mkdirSync, readFileSync, writeFileSync, existsSync, copyFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ImageResponse } from "next/og.js";
import { Frame, SIZES } from "./instagram/brand.mjs";
import { objectCard, statCard, tipCard } from "./instagram/cards.mjs";
import { buildObjectCarouselSlides } from "./instagram/carousel.mjs";
import { buildReelSceneNodes, renderReelMp4 } from "./instagram/reel.mjs";
import { loadAerialGrid } from "./instagram/mapTile.mjs";
import { objectCaption, statCaption, tipCaption } from "./instagram/captions.mjs";
import { objectAdSpec, statAdSpec, tipAdSpec, formatAdSheet } from "./instagram/ads.mjs";
import { loadSnapshot, pickObject, pickStat, buildListingPublicUrl } from "./instagram/data.mjs";
import { T, dateShort } from "./instagram/texts.mjs";
import { TIPS_DE, TIPS_TR } from "./instagram/tips.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FONT_DIR = resolve(ROOT, "scripts", "instagram", "fonts");
const OUT_ROOT = resolve(ROOT, "marketing", "instagram");
const TILE_CACHE = resolve(OUT_ROOT, ".tile-cache");
const DE_POINTS_FILE = resolve(ROOT, "data", "geo", "de-points.json");
const HISTORY = resolve(OUT_ROOT, "verlauf.json");
const LATEST_MANIFEST = resolve(OUT_ROOT, "latest.json");
const DAY = 24 * 60 * 60 * 1000;
const MAX_SNAPSHOT_AGE_DAYS = 2;
const WEEKDAY_THEME = ["objekt", "objekt", "objekt", "objekt", "objekt", "objekt", "objekt"];

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  })
);

const day = args.datum
  ? new Date(`${args.datum}T00:00:00Z`)
  : new Date(new Date().toISOString().slice(0, 10) + "T00:00:00Z");
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

const dePoints = existsSync(DE_POINTS_FILE) ? JSON.parse(readFileSync(DE_POINTS_FILE, "utf8")) : {};

function resolveListingGeo(listing) {
  if (listing?.geo?.lat && listing?.geo?.lng) return listing.geo;
  if (listing?.postcode && dePoints[listing.postcode]) {
    const [lat, lng] = dePoints[listing.postcode];
    return { lat, lng, precision: "postcode" };
  }
  return null;
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

const history = (existsSync(HISTORY) ? JSON.parse(readFileSync(HISTORY, "utf8")) : []).filter((h) => h.date !== isoDay);
const recent = new Set(history.filter((h) => Date.parse(h.date) > day.getTime() - 60 * DAY).map((h) => h.key));
const outDir = resolve(OUT_ROOT, isoDay);
mkdirSync(outDir, { recursive: true });

async function compose(theme, market, lang, snapshot) {
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

    const geo = resolveListingGeo(listing);
    const aerial = await loadAerialGrid(TILE_CACHE, geo);

    return {
      listing,
      aerial,
      rubric: t.rubric.object,
      source: t.source(snapshotDate),
      slides: (size) => buildObjectCarouselSlides({ listing, lang, size, day, aerial }),
      body: (size) => objectCard({ listing, lang, size, day, aerial }),
      caption: objectCaption({ listing, lang, day, snapshotDate }),
      ad: objectAdSpec({ listing, lang, day, isoDay, snapshotDate }),
      storyUrl: buildListingPublicUrl(listing, {
        source: "instagram",
        medium: "story_sticker",
        campaign: `belowmark_${lang}_${isoDay}`,
      }),
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
const checks = [];
const adsBundle = [];
const postsManifest = {};

for (const [market, lang] of [["DE", "de"], ["TR", "tr"]]) {
  const snapshot = loadSnapshot(ROOT, market);
  postsManifest[lang] = {};
  for (const theme of themes) {
    const post = await compose(theme, market, lang, snapshot);
    if (!post) continue;
    const t = T[lang];
    const date = dateShort(day.toISOString(), lang);

    const slideFiles = [];
    let reelFile = null;
    let reelCoverFile = null;

    if (theme === "objekt" && post.slides) {
      // 1. 5-Slide Swipe-Karussell (4:5)
      const slideChildren = post.slides(SIZES.feed);
      for (let idx = 0; idx < slideChildren.length; idx++) {
        const sName = `${lang}-${theme}-slide-${idx + 1}.png`;
        const sPath = resolve(outDir, sName);
        const node = Frame({
          size: SIZES.feed,
          lang,
          date,
          rubric: post.rubric,
          source: post.source,
          disclaimer: t.disclaimer,
          cta: null,
          children: slideChildren[idx],
        });
        await render(node, SIZES.feed, sPath);
        slideFiles.push(sName);
        written.push(sPath);
      }

      // Slide 1 zugleich als Haupt-Feed-Vorschau (de-objekt-feed.png) für CRM & Ads ablegen
      const feedPath = resolve(outDir, `${lang}-${theme}-feed.png`);
      copyFileSync(resolve(outDir, slideFiles[0]), feedPath);
      written.push(feedPath);

      // 2. 9:16 Story (mit Luftbild; ohne toten „Link in Bio“-Kasten unten, damit Platz für den echten Link-Sticker bleibt!)
      const storyPath = resolve(outDir, `${lang}-${theme}-story.png`);
      const storyNode = Frame({
        size: SIZES.story,
        lang,
        date,
        rubric: post.rubric,
        source: post.source,
        disclaimer: t.disclaimer,
        cta: null,
        children: post.body(SIZES.story),
      });
      await render(storyNode, SIZES.story, storyPath);
      written.push(storyPath);

      // 3. 9:16 Video-Reel (MP4) rendern (sofern nicht --no-reel übergeben wurde)
      if (!args["no-reel"]) {
        const reelName = `${lang}-${theme}-reel.mp4`;
        const reelPath = resolve(outDir, reelName);
        const reelScenes = buildReelSceneNodes({
          listing: post.listing,
          lang,
          day,
          aerial: post.aerial,
          date,
        });
        const okReel = await renderReelMp4({
          scenes: reelScenes,
          renderPng: render,
          outDir,
          mp4File: reelPath,
        });
        if (okReel) {
          reelFile = reelName;
          reelCoverFile = `${lang}-${theme}-story.png`;
          written.push(reelPath);
        }
      }
    } else {
      for (const [format, size] of Object.entries(SIZES)) {
        const file = resolve(outDir, `${lang}-${theme}-${format}.png`);
        const node = Frame({
          size,
          lang,
          date,
          rubric: post.rubric,
          source: post.source,
          disclaimer: t.disclaimer,
          cta: format === "story" ? t.ctaStory : null,
          children: post.body(size),
        });
        await render(node, size, file);
        written.push(file);
      }
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
        slideFiles,
        reelFile,
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
      slideFiles,
      reelFile,
      reelCoverFile,
      storyUrl: post.storyUrl ?? null,
      listingKey: post.listing?.key ?? null,
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
