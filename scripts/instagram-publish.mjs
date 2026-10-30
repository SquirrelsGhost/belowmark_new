#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Belowmark Instagram Live-Publisher (Heim-PC Autopilot)
//
// Veröffentlicht das täglich frisch aus den amtlichen Portalen generierte
// "Objekt des Tages" (mit echtem Verkehrswert, Termin, Sicherheitsleistung)
// vollautomatisch über die gespeicherte Playwright-Session auf @belowmark_com:
//   1. 4:5 Feed-Post (de-objekt-feed.png + de-objekt.txt Caption)
//   2. 9:16 Story (de-objekt-story.png)
//   3. Speichert Media-IDs in marketing/instagram/published-log.json (idempotent:
//      maximal 1 Post pro Tag, niemals doppelter Upload am selben Kalendertag)
//   4. Markiert den Tag in den lokalen & Remote-SQLite-Datenbanken als 'published'
// ---------------------------------------------------------------------------

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const SOCIAL_SESSION_MODULE_URL =
  process.env.SOCIAL_SESSION_MODULE_URL ||
  "file:///C:/Users/emrea/Desktop/1_Projekte_und_Apps/workspace/pycie/backend/services/socialSessionManager.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_ROOT = path.resolve(ROOT, "marketing", "instagram");
const PUBLISHED_LOG_FILE = path.resolve(OUT_ROOT, "published-log.json");
const AUTOPILOT_LOG_FILE = path.resolve(OUT_ROOT, "autopilot.log");

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  })
);

function logLine(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  try {
    fs.appendFileSync(AUTOPILOT_LOG_FILE, line + "\n");
  } catch {}
}

const isoDay = args.datum || new Date().toISOString().slice(0, 10);
const account = String(args.account || "belowmark_com");
const lang = String(args.lang || "de");
const theme = "objekt"; // Immer ein echtes, aktuelles Objekt mit Preis

const publishedLog = fs.existsSync(PUBLISHED_LOG_FILE)
  ? JSON.parse(fs.readFileSync(PUBLISHED_LOG_FILE, "utf8"))
  : {};

if (publishedLog[isoDay]?.feedId && !args.force) {
  logLine(
    `[Belowmark Publish] Tag ${isoDay} wurde bereits auf @${account} veröffentlicht (Feed-ID: ${publishedLog[isoDay].feedId}) — überspringe.`
  );
  process.exit(0);
}

const dayDir = path.resolve(OUT_ROOT, isoDay);
const feedPngPath = path.resolve(dayDir, `${lang}-${theme}-feed.png`);
const storyPngPath = path.resolve(dayDir, `${lang}-${theme}-story.png`);
const captionPath = path.resolve(dayDir, `${lang}-${theme}.txt`);
const manifestPath = path.resolve(dayDir, "manifest.json");

if (!fs.existsSync(feedPngPath) || !fs.existsSync(captionPath)) {
  logLine(`[Belowmark Publish] FEHLER: ${feedPngPath} oder ${captionPath} fehlt für ${isoDay}.`);
  process.exit(1);
}

const caption = fs.readFileSync(captionPath, "utf8").trim();
// Sicherheitsprüfung: Muss einen echten Preis (€ oder TL) enthalten
if (!/(\d[\d.]*\s*€|\d[\d.]*\s*TL)/.test(caption)) {
  logLine(`[Belowmark Publish] ABBRUCH: Caption für ${isoDay} enthält keinen Preis!`);
  process.exit(1);
}

const manifest = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, "utf8"))
  : {};
const headline =
  manifest?.posts?.[lang]?.[theme]?.headline ||
  caption.split("\n")[0] ||
  `Objekt des Tages (${isoDay})`;

logLine(`[Belowmark Publish] Starte Veröffentlichung für ${isoDay}: "${headline}" auf @${account}...`);

const feedPngB64 = fs.readFileSync(feedPngPath).toString("base64");
const storyPngB64 = fs.existsSync(storyPngPath)
  ? fs.readFileSync(storyPngPath).toString("base64")
  : null;

const { getAuthenticatedContext, PLATFORMS } = await import(SOCIAL_SESSION_MODULE_URL);
const context = await getAuthenticatedContext(PLATFORMS.INSTAGRAM, {
  account,
  headless: true,
});

try {
  const page = context.pages()[0] || (await context.newPage());
  await page.goto(`https://www.instagram.com/${account}/`, {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(4000);

  // 1. 4:5 Feed-Post hochladen
  const feedRes = await page.evaluate(
    async ({ pngB64, caption }) => {
      const csrf =
        document.cookie
          .split("; ")
          .find((r) => r.startsWith("csrftoken="))
          ?.split("=")[1] || "";

      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = `data:image/png;base64,${pngB64}`;
      });
      const width = img.naturalWidth || 1080;
      const height = img.naturalHeight || 1350;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.95)
      );
      const arrayBuf = await blob.arrayBuffer();

      const uploadId = Date.now().toString();
      const ruploadParams = {
        media_type: 1,
        upload_id: uploadId,
        upload_media_height: height,
        upload_media_width: width,
        xsharing_user_ids: JSON.stringify([]),
        image_compression: JSON.stringify({
          lib_name: "moz",
          lib_version: "3.1.m",
          quality: "80",
        }),
      };

      const r1 = await fetch(`/rupload_igphoto/fb_uploader_${uploadId}`, {
        method: "POST",
        headers: {
          "X-CSRFToken": csrf,
          "X-IG-App-ID": "936619743392459",
          "X-Instagram-Rupload-Params": JSON.stringify(ruploadParams),
          "X-Entity-Name": `fb_uploader_${uploadId}`,
          "X-Entity-Length": String(arrayBuf.byteLength),
          Offset: "0",
          "Content-Type": "image/jpeg",
        },
        body: blob,
        credentials: "include",
      });
      const t1 = await r1.text();
      if (!r1.ok) {
        return { ok: false, step: "rupload", status: r1.status, body: t1.slice(0, 400) };
      }

      await new Promise((r) => setTimeout(r, 2500));

      const form = new URLSearchParams();
      form.set("source_type", "library");
      form.set("caption", caption);
      form.set("upload_id", uploadId);
      form.set("disable_comments", "0");
      form.set("like_and_view_counts_disabled", "0");
      form.set("igtv_share_preview_to_feed", "1");
      form.set("is_unified_video", "1");
      form.set("video_subtitles_enabled", "0");
      form.set("custom_accessibility_caption", "");

      const r2 = await fetch("/api/v1/media/configure/", {
        method: "POST",
        headers: {
          "X-CSRFToken": csrf,
          "X-IG-App-ID": "936619743392459",
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: form.toString(),
        credentials: "include",
      });
      const t2 = await r2.text();
      let parsed = null;
      try {
        parsed = JSON.parse(t2);
      } catch {}
      return {
        ok: r2.ok && Boolean(parsed?.media?.id),
        status: r2.status,
        mediaId: parsed?.media?.id || null,
        body: t2.slice(0, 400),
      };
    },
    { pngB64: feedPngB64, caption }
  );

  if (!feedRes.ok) {
    throw new Error(`Feed-Upload fehlgeschlagen (${feedRes.status}): ${feedRes.body}`);
  }

  logLine(`[Belowmark Publish] ✅ Feed-Post veröffentlicht (ID: ${feedRes.mediaId})`);

  // 2. 9:16 Story hochladen (falls vorhanden)
  let storyId = null;
  if (storyPngB64) {
    await page.waitForTimeout(2000);
    const storyRes = await page.evaluate(
      async ({ pngB64 }) => {
        const csrf =
          document.cookie
            .split("; ")
            .find((r) => r.startsWith("csrftoken="))
            ?.split("=")[1] || "";

        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = `data:image/png;base64,${pngB64}`;
        });
        const width = img.naturalWidth || 1080;
        const height = img.naturalHeight || 1920;
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, "image/jpeg", 0.95)
        );
        const arrayBuf = await blob.arrayBuffer();

        const uploadId = Date.now().toString();
        const ruploadParams = {
          media_type: 1,
          upload_id: uploadId,
          upload_media_height: height,
          upload_media_width: width,
          xsharing_user_ids: JSON.stringify([]),
          image_compression: JSON.stringify({
            lib_name: "moz",
            lib_version: "3.1.m",
            quality: "80",
          }),
        };

        const r1 = await fetch(`/rupload_igphoto/fb_uploader_${uploadId}`, {
          method: "POST",
          headers: {
            "X-CSRFToken": csrf,
            "X-IG-App-ID": "936619743392459",
            "X-Instagram-Rupload-Params": JSON.stringify(ruploadParams),
            "X-Entity-Name": `fb_uploader_${uploadId}`,
            "X-Entity-Length": String(arrayBuf.byteLength),
            Offset: "0",
            "Content-Type": "image/jpeg",
          },
          body: blob,
          credentials: "include",
        });
        if (!r1.ok) return { ok: false, status: r1.status };

        await new Promise((r) => setTimeout(r, 2000));

        const form = new URLSearchParams();
        form.set("source_type", "library");
        form.set("upload_id", uploadId);
        form.set("configure_mode", "1");

        const r2 = await fetch("/api/v1/media/configure_to_story/", {
          method: "POST",
          headers: {
            "X-CSRFToken": csrf,
            "X-IG-App-ID": "936619743392459",
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: form.toString(),
          credentials: "include",
        });
        const t2 = await r2.text();
        let parsed = null;
        try {
          parsed = JSON.parse(t2);
        } catch {}
        return {
          ok: r2.ok && Boolean(parsed?.media?.id),
          mediaId: parsed?.media?.id || null,
        };
      },
      { pngB64: storyPngB64 }
    );

    if (storyRes.ok) {
      storyId = storyRes.mediaId;
      logLine(`[Belowmark Publish] ✅ Story veröffentlicht (ID: ${storyId})`);
    }
  }

  // 3. In published-log.json speichern
  publishedLog[isoDay] = {
    isoDay,
    publishedAt: new Date().toISOString(),
    account,
    theme,
    headline,
    feedId: feedRes.mediaId,
    storyId,
  };
  fs.writeFileSync(PUBLISHED_LOG_FILE, JSON.stringify(publishedLog, null, 2));

  // 4. Status in lokaler & Remote-SQLite als 'published' markieren
  try {
    const { DatabaseSync } = await import("node:sqlite");
    for (const dbPath of [
      "C:/Users/emrea/Desktop/pycie/data/pycie.sqlite",
      "C:/Users/emrea/Desktop/1_Projekte_und_Apps/workspace/pycie/backend/data/pycie.sqlite",
    ]) {
      if (!fs.existsSync(dbPath)) continue;
      const db = new DatabaseSync(dbPath);
      db.prepare(
        "UPDATE social_week_plan_days SET status = 'veroeffentlicht', publish_error = '', last_attempt_at = datetime('now') WHERE plan_id = '6b9000000000000000000001' AND date = ?"
      ).run(isoDay);
      db.close();
    }
  } catch (e) {
    logLine(`[Belowmark Publish] Lokaler DB-Update Hinweis: ${e.message}`);
  }

  try {
    execFileSync(
      "ssh",
      [
        "-o",
        "ConnectTimeout=8",
        "pycie-prod",
        `python3 -c "import sqlite3; c=sqlite3.connect('/root/backend/data/pycie.sqlite'); c.execute(\\"UPDATE social_week_plan_days SET status = 'veroeffentlicht', publish_error = '', last_attempt_at = datetime('now') WHERE plan_id = '6b9000000000000000000001' AND date = '${isoDay}'\\"); c.commit(); c.close()"`,
      ],
      { stdio: "ignore" }
    );
  } catch {}

  logLine(`[Belowmark Publish] 🎉 Tages-Veröffentlichung für ${isoDay} komplett abgeschlossen.`);
} finally {
  await context.close().catch(() => {});
}
