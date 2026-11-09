#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Belowmark Instagram Live-Publisher v2 (Heim-PC Viral Autopilot)
//
// Veröffentlicht täglich vollautomatisch über die gespeicherte Playwright-Session
// auf @belowmark_com:
//   1. Auto-Unblock für EU/DSGVO Consent-Screens (/consent/)
//   2. 5-Slide Swipe-Karussell (1080×1350, configure_sidecar) mit Luftbild-Karte,
//      Wertgrenzen-Balken, Cash-Rechnung & Risiko-Check (Fallback: Einzelbild)
//   3. 9:16 Video-Reel (1080×1920 MP4, H.264 + AAC) für Nicht-Follower-Reichweite
//   4. 9:16 Story (1080×1920) inkl. Link-Sticker-Metadaten auf die öffentliche
//      Stadt-Landingpage (https://belowmark.com/zwangsversteigerung/<stadt>)
//   5. Live-Metriken-Sync (Follower, Likes, Kommentare, Reel-Plays) in lokale
//      & Remote-SQLite (pycie.sqlite -> client_social_connections,
//      social_post_stats, social_profile_metric_snapshots)
//
// CLI-Flags:
//   --datum=YYYY-MM-DD   Ziel-Datum (Standard: heute UTC)
//   --sync-only          Nur Live-Metriken von Instagram in pycie.sqlite synchronisieren
//   --reel-only          Nur das 9:16 Reel (+ optional --with-story) veröffentlichen
//   --no-reel            Kein Reel hochladen
//   --no-story           Keine Story hochladen
//   --force              Trotz vorhandenem published-log Eintrag erneut senden
// ---------------------------------------------------------------------------

import crypto from "node:crypto";
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

const IG_ACCOUNT_ID = "40651163039";
const CLIENT_ID = "CLIENT_PYCIE_DEMO";
const PROFILE_ID_MAIN = "6b886e5285e1bfa87c304550";
const PROFILE_ID_DE = "6b886e5285e1bfa87c304551";
const CONN_ID_MAIN = "6b886e5285e1bfa87c304560";
const CONN_ID_DE = "6b886e5285e1bfa87c304561";
const CONN_ID_TR = "6b886e5285e1bfa87c304562";

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

function deterministicHex24(seed) {
  return crypto.createHash("sha256").update(String(seed)).digest("hex").slice(0, 24);
}

function shortcodeToPk(code) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  let id = 0n;
  for (const ch of String(code || "")) {
    const idx = alphabet.indexOf(ch);
    if (idx === -1) return null;
    id = id * 64n + BigInt(idx);
  }
  return id > 0n ? id.toString() : null;
}

/**
 * Klickt eventuelle Meta EU/DSGVO Consent-Screens (/consent/) sowie
 * Ein-Klick-Session-Resume-Dialoge ("Mach weiter als belowmark_com") frei,
 * damit Headless-Runs niemals steckenbleiben.
 */
async function dismissInstagramConsent(page) {
  // 1. Ein-Klick-Session-Fortsetzung ("Mach weiter als ...") oder Popup-Banner schließen
  for (let i = 0; i < 4; i++) {
    const resumed = await page.evaluate(() => {
      const btns = [...document.querySelectorAll('button, div[role="button"]')];
      for (const b of btns) {
        const t = (b.innerText || "").replace(/\s+/g, " ").trim();
        if (
          /^(Mach weiter als|Weiter als|Continue as)\b/i.test(t) ||
          /^(Jetzt nicht|Not Now|Informationen speichern|Save info)$/i.test(t)
        ) {
          b.click();
          return t;
        }
      }
      return null;
    });
    if (!resumed) break;
    logLine(`[Belowmark Publish] Dialog/Session bestätigt: "${resumed}"`);
    await page.waitForTimeout(2800);
  }

  // 2. EU/DSGVO /consent/ Flow
  for (let step = 0; step < 8; step++) {
    if (!page.url().includes("/consent/")) return;
    await page.evaluate(() => {
      const els = [...document.querySelectorAll('input[type="radio"], [role="radio"], label, div[tabindex="0"]')];
      for (const el of els) {
        const txt = (el.innerText || el.textContent || "").replace(/\s+/g, " ");
        if (/kostenfrei.*werbung|kostenlos.*werbung|free with ads/i.test(txt)) {
          el.click();
          break;
        }
      }
    });
    await page.waitForTimeout(700);
    const clicked = await page.evaluate(() => {
      const patterns = [
        /^los geht/i,
        /^weiter$/i,
        /^continue$/i,
        /^zustimmen$/i,
        /^agree$/i,
        /^ok$/i,
        /^weiter mit personalisierter werbung$/i,
        /kostenfrei.*nutzen|kostenlos.*nutzen|use free/i,
        /alle cookies erlauben|allow all cookies/i,
      ];
      const btns = [...document.querySelectorAll('button, [role="button"]')];
      for (const rx of patterns) {
        const b = btns.find((el) => {
          const t = (el.innerText || el.textContent || "").replace(/\s+/g, " ").trim();
          const dis = el.disabled || el.getAttribute("aria-disabled") === "true";
          return !dis && rx.test(t);
        });
        if (b) {
          b.click();
          return (b.innerText || el.textContent || "").replace(/\s+/g, " ").trim();
        }
      }
      return null;
    });
    if (!clicked) break;
    logLine(`[Belowmark Publish] Consent-Dialog bestätigt: "${clicked}"`);
    await page.waitForTimeout(2800);
  }
}

/**
 * Lädt ein 5-Slide Swipe-Karussell (configure_sidecar) hoch.
 * Falls weniger als 2 Slides vorliegen, Fallback auf Einzelbild (configure).
 */
async function uploadFeedCarouselOrPhoto(page, { slideB64List, fallbackPngB64, caption }) {
  if (slideB64List.length >= 2) {
    return page.evaluate(
      async ({ slides, caption }) => {
        const csrf =
          document.cookie
            .split("; ")
            .find((r) => r.startsWith("csrftoken="))
            ?.split("=")[1] || "";

        const uploadIds = [];
        for (let i = 0; i < slides.length; i++) {
          const pngB64 = slides[i];
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
          const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.95));
          const arrayBuf = await blob.arrayBuffer();

          const uploadId = `${Date.now()}${i}`;
          const ruploadParams = {
            media_type: 1,
            upload_id: uploadId,
            upload_media_height: height,
            upload_media_width: width,
            is_sidecar: "1",
            xsharing_user_ids: JSON.stringify([]),
            image_compression: JSON.stringify({
              lib_name: "moz",
              lib_version: "3.1.m",
              quality: "85",
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
            return { ok: false, step: `rupload_slide_${i + 1}`, status: r1.status, body: t1.slice(0, 400) };
          }
          uploadIds.push(uploadId);
          await new Promise((r) => setTimeout(r, 900));
        }

        await new Promise((r) => setTimeout(r, 2200));

        const payload = {
          caption,
          children_metadata: uploadIds.map((id) => ({ upload_id: id })),
          client_sidecar_id: Date.now().toString(),
          disable_comments: "0",
          like_and_view_counts_disabled: 0,
          media_share_flow: "creation_flow",
          source_type: "library",
        };

        const r2 = await fetch("/api/v1/media/configure_sidecar/", {
          method: "POST",
          headers: {
            "X-CSRFToken": csrf,
            "X-IG-App-ID": "936619743392459",
            "X-ASBD-ID": "129477",
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          credentials: "include",
        });
        const t2 = await r2.text();
        let parsed = null;
        try {
          parsed = JSON.parse(t2);
        } catch {}
        return {
          ok: r2.ok && Boolean(parsed?.media?.id),
          mode: "carousel",
          slideCount: uploadIds.length,
          status: r2.status,
          mediaId: parsed?.media?.id || null,
          code: parsed?.media?.code || null,
          body: t2.slice(0, 400),
        };
      },
      { slides: slideB64List, caption }
    );
  }

  return page.evaluate(
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
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.95));
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
          quality: "85",
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
        mode: "single",
        slideCount: 1,
        status: r2.status,
        mediaId: parsed?.media?.id || null,
        code: parsed?.media?.code || null,
        body: t2.slice(0, 400),
      };
    },
    { pngB64: fallbackPngB64, caption }
  );
}

/**
 * Veröffentlicht das 9:16 MP4-Reel über Instagrams offiziellen Web-Composer
 * (umgeht i.instagram.com CORS-Hürden und nutzt Instagrams 202-Transcode-Polling).
 */
async function uploadReelViaComposer(page, { account, mp4Path, caption }) {
  let capturedClipsMedia = null;
  const onResponse = async (res) => {
    try {
      if (res.url().includes("/api/v1/media/configure_to_clips/") && res.status() === 200) {
        const j = await res.json().catch(() => null);
        if (j?.media?.id) {
          capturedClipsMedia = { id: j.media.id, code: j.media.code || null };
        }
      }
    } catch {}
  };
  page.on("response", onResponse);

  try {
    await page.goto(`https://www.instagram.com/${account}/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(3000);
    await dismissInstagramConsent(page);

    // 1. Klick auf "Neuer Beitrag" / "Erstellen"
    const newPostSvg = page.locator('svg[aria-label="Neuer Beitrag"], svg[aria-label="New post"]').first();
    if (await newPostSvg.count()) {
      await newPostSvg.click({ force: true, timeout: 6000 });
    } else {
      await page.evaluate(() => {
        const btn = [...document.querySelectorAll('a, div[role="button"], span')].find((el) =>
          /^(Erstellen|Create|Neuer Beitrag|New post)$/i.test((el.innerText || "").trim())
        );
        btn?.click();
      });
    }
    await page.waitForTimeout(1800);

    // Falls Untermenü ("Beitrag" / "Live-Video") erscheint -> "Beitrag" klicken
    const postSub = page.locator('a, div[role="button"], span').filter({ hasText: /^(Beitrag|Post)$/ }).first();
    if (await postSub.count()) {
      await postSub.click({ force: true, timeout: 4000 }).catch(() => {});
      await page.waitForTimeout(1800);
    }

    // Datei-Input für Video/Bild suchen
    const fileInput = page.locator('input[type="file"]').last();
    await fileInput.setInputFiles(mp4Path, { timeout: 10000 });
    await page.waitForTimeout(3500);

    // Eventuellen Erst-Reel-Hinweis ("Video-Beiträge werden jetzt als Reels geteilt" -> "OK") wegklicken
    const okBtn = page.locator('button, div[role="button"]').filter({ hasText: /^(OK|Verstanden|Got it)$/i }).first();
    if (await okBtn.count()) {
      await okBtn.click({ force: true, timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(1200);
    }

    // Format zwingend auf 9:16 Hochformat stellen (sonst schneidet IG Web auf 1:1 720×720!)
    const cropBtn = page
      .locator(
        'div[role="dialog"] button:has(svg[aria-label="Zuschnitt auswählen"]), div[role="dialog"] button:has(svg[aria-label="Select crop"])'
      )
      .first();
    if (await cropBtn.count()) {
      await cropBtn.click({ timeout: 5000 });
      await page.waitForTimeout(1000);
      const portraitOpt = page
        .locator(
          'div[role="dialog"] div[role="button"]:has(svg[aria-label*="Hochformat"]), div[role="dialog"] div[role="button"]:has(svg[aria-label*="portrait" i])'
        )
        .first();
      if (await portraitOpt.count()) {
        await portraitOpt.click({ timeout: 4000 });
        await page.waitForTimeout(1000);
      } else {
        const fallback916 = page.getByRole("button", { name: /^9:16$/ }).first();
        if (await fallback916.count()) {
          await fallback916.click({ timeout: 4000 });
          await page.waitForTimeout(1000);
        }
      }
    }

    // Schritt 1 -> Schritt 2 ("Weiter" / "Next")
    const clickDialogNext = async () => {
      const nextBtn = page
        .locator('div[role="dialog"] div[role="button"], div[role="dialog"] button')
        .filter({ hasText: /^(Weiter|Next)$/i })
        .first();
      if (await nextBtn.count()) {
        await nextBtn.click({ force: true, timeout: 5000 });
        return true;
      }
      return false;
    };

    await clickDialogNext();
    await page.waitForTimeout(2200);
    // Schritt 2 -> Schritt 3 ("Weiter" / "Next")
    await clickDialogNext();
    await page.waitForTimeout(2200);

    // Caption zeilenweise per keyboard.insertText in den Lexical-Editor schreiben (.fill() wird von Lexical ignoriert!)
    const textbox = page.locator('div[role="dialog"] div[role="textbox"][contenteditable="true"]').first();
    if (await textbox.count()) {
      await textbox.click({ force: true, timeout: 5000 });
      await page.waitForTimeout(400);
      const lines = String(caption).split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (i > 0) await page.keyboard.press("Enter");
        if (lines[i]) await page.keyboard.insertText(lines[i]);
      }
      await page.waitForTimeout(1200);
    }

    // "Teilen" / "Share" im Dialog-Header klicken
    const shareBtn = page
      .locator('div[role="dialog"] div[role="button"], div[role="dialog"] button')
      .filter({ hasText: /^(Teilen|Share)$/i })
      .first();
    if (!(await shareBtn.count())) {
      return { ok: false, reason: "Teilen-Button im Reel-Dialog nicht gefunden" };
    }
    await shareBtn.click({ force: true, timeout: 5000 });

    // Auf configure_to_clips (inkl. 202-Transcode-Retries) warten — bis zu 90s
    let sharedDialogConfirmed = false;
    const deadline = Date.now() + 90_000;
    while (Date.now() < deadline) {
      if (capturedClipsMedia?.id) break;
      const doneText = await page.evaluate(() => {
        const d = document.querySelector('div[role="dialog"]');
        return d ? d.innerText : "";
      });
      if (/wurde geteilt|has been shared|Reel geteilt/i.test(doneText)) {
        sharedDialogConfirmed = true;
        await page.waitForTimeout(2500);
        break;
      }
      await page.waitForTimeout(2000);
    }

    if (capturedClipsMedia?.id) {
      return { ok: true, mediaId: capturedClipsMedia.id, code: capturedClipsMedia.code };
    }

    // Fallback: Wenn der Dialog "wurde geteilt" meldet (z. B. via GraphQL), Shortcode aus /reels/ lesen
    await page.goto(`https://www.instagram.com/${account}/reels/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(3200);
    const latestHref = await page.evaluate(() =>
      document.querySelector('a[href*="/reel/"]')?.getAttribute("href") || null
    );
    if (latestHref) {
      const m = latestHref.match(/\/reel\/([A-Za-z0-9_-]+)/);
      const code = m ? m[1] : null;
      const pk = code ? shortcodeToPk(code) : null;
      if (pk && sharedDialogConfirmed) {
        return { ok: true, mediaId: `${pk}_${IG_ACCOUNT_ID}`, code };
      }
    }

    return { ok: false, reason: "Kein Reel-Media-ID nach Upload gefunden" };
  } finally {
    page.off("response", onResponse);
  }
}

/**
 * Veröffentlicht die 9:16 Story inklusive Link-Sticker-Metadaten (storyUrl).
 */
async function uploadStoryWithLink(page, { storyPngB64, storyUrl }) {
  return page.evaluate(
    async ({ pngB64, linkUrl }) => {
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
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.95));
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
          quality: "85",
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
      if (!r1.ok) return { ok: false, status: r1.status, step: "rupload_story" };

      await new Promise((r) => setTimeout(r, 2000));

      const form = new URLSearchParams();
      form.set("source_type", "library");
      form.set("upload_id", uploadId);
      form.set("configure_mode", "1");
      if (linkUrl) {
        const stickerModel = [
          {
            x: 0.5,
            y: 0.88,
            z: 0,
            width: 0.64,
            height: 0.075,
            rotation: 0.0,
            type: "story_link",
            link_type: "web",
            url: linkUrl,
            custom_sticker_text: "Auktion & Gutachten prüfen",
            tap_state: 0,
            tap_state_str_id: "link_sticker_default",
          },
        ];
        form.set("tap_models", JSON.stringify(stickerModel));
        form.set("story_link_stickers", JSON.stringify(stickerModel));
        form.set("story_cta", JSON.stringify([{ links: [{ webUri: linkUrl }] }]));
        form.set("mas_opt_in", "NOT_PROMPTED");
      }

      const r2 = await fetch("/api/v1/media/configure_to_story/", {
        method: "POST",
        headers: {
          "X-CSRFToken": csrf,
          "X-IG-App-ID": "936619743392459",
          "X-ASBD-ID": "129477",
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
      const media = parsed?.media;
      return {
        ok: r2.ok && Boolean(media?.id),
        status: r2.status,
        mediaId: media?.id || null,
        hasLinkSticker: Boolean(
          (Array.isArray(media?.story_link_stickers) && media.story_link_stickers.length > 0) ||
            (Array.isArray(media?.story_cta) && media.story_cta.length > 0)
        ),
      };
    },
    { pngB64: storyPngB64, linkUrl: storyUrl }
  );
}

/**
 * Liest echte Live-Zahlen (Follower + Post/Reel-Interaktionen) aus der aktiven
 * Instagram-Session und synchronisiert sie in lokale & Remote-SQLite (pycie.sqlite).
 */
async function syncLiveMetrics(page, { account, publishedLog }) {
  await page.goto(`https://www.instagram.com/${account}/`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3200);
  await dismissInstagramConsent(page);

  const followerCount = await page.evaluate(() => {
    const headerText = document.querySelector("header")?.innerText || document.body.innerText || "";
    const m = headerText.match(/([\d.,]+)\s*(?:Follower|Followers|Abonnenten)/i);
    if (!m) return 0;
    return Number(m[1].replace(/[.,]/g, "")) || 0;
  });

  const mediaEntries = [];
  for (const [dayKey, entry] of Object.entries(publishedLog)) {
    if (entry?.feedId) {
      mediaEntries.push({
        dayKey,
        mediaId: entry.feedId,
        kind: entry.feedMode === "carousel" ? "carousel" : "card",
        headline: entry.headline || `Objekt des Tages (${dayKey})`,
        publishedAt: entry.publishedAt,
      });
    }
    if (entry?.reelId) {
      mediaEntries.push({
        dayKey,
        mediaId: entry.reelId,
        kind: "reel",
        headline: `[Reel] ${entry.reelHeadline || entry.headline || `Objekt des Tages (${dayKey})`}`,
        publishedAt: entry.reelPublishedAt || entry.publishedAt,
      });
    }
  }

  const liveStats = [];
  for (const item of mediaEntries) {
    const pk = String(item.mediaId).split("_")[0];
    if (!/^\d+$/.test(pk)) continue;
    const info = await page.evaluate(async (mediaPk) => {
      const csrf =
        document.cookie
          .split("; ")
          .find((r) => r.startsWith("csrftoken="))
          ?.split("=")[1] || "";
      const r = await fetch(`/api/v1/media/${mediaPk}/info/`, {
        headers: {
          "X-CSRFToken": csrf,
          "X-IG-App-ID": "936619743392459",
          "X-ASBD-ID": "129477",
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include",
      });
      if (!r.ok) return null;
      const j = await r.json().catch(() => null);
      const m = j?.items?.[0];
      if (!m) return null;
      return {
        pk: String(m.pk || mediaPk),
        code: m.code || null,
        mediaType: m.media_type,
        productType: m.product_type || null,
        likes: Number(m.like_count ?? 0),
        comments: Number(m.comment_count ?? 0),
        views: Number(m.play_count ?? m.ig_play_count ?? m.view_count ?? 0),
        shares: Number(m.reshare_count ?? 0),
        takenAtIso: m.taken_at ? new Date(m.taken_at * 1000).toISOString() : null,
      };
    }, pk);

    if (info) {
      const visualType =
        info.productType === "clips" || info.mediaType === 2
          ? "reel"
          : info.mediaType === 8
          ? "carousel"
          : item.kind;
      liveStats.push({
        _id: deterministicHex24(`belowmark:${PROFILE_ID_DE}:${info.pk}`),
        postId: info.pk,
        code: info.code,
        title: item.headline,
        visualType,
        likes: info.likes,
        comments: info.comments,
        views: info.views,
        shares: info.shares,
        totalInteractions: info.likes + info.comments + info.shares,
        createdAt: info.takenAtIso || item.publishedAt || new Date().toISOString(),
      });
    }
  }

  if (followerCount === 0 && liveStats.length === 0 && mediaEntries.length > 0) {
    logLine(`[Belowmark Sync] ⚠️ Instagram API temporär gedrosselt nach Upload — überspringe Null-Überschreibung.`);
    return { followerCount: 0, postsSynced: 0, totalInteractions: 0 };
  }

  const totalInteractions = liveStats.reduce((sum, s) => sum + s.totalInteractions, 0);
  const denom = Math.max(1, liveStats.length * Math.max(1, followerCount));
  const engagementRate = Number(((totalInteractions / denom) * 100).toFixed(2));
  const nowIso = new Date().toISOString();
  const snapshotDay = nowIso.slice(0, 10);
  const snapIdMain = deterministicHex24(`snap:${PROFILE_ID_MAIN}:instagram:${snapshotDay}`);
  const snapIdDe = deterministicHex24(`snap:${PROFILE_ID_DE}:instagram:${snapshotDay}`);

  // 1. Lokale SQLite-Datenbanken aktualisieren
  try {
    const { DatabaseSync } = await import("node:sqlite");
    for (const dbPath of [
      "C:/Users/emrea/Desktop/pycie/data/pycie.sqlite",
      "C:/Users/emrea/Desktop/1_Projekte_und_Apps/workspace/pycie/backend/data/pycie.sqlite",
    ]) {
      if (!fs.existsSync(dbPath)) continue;
      const db = new DatabaseSync(dbPath);
      db.prepare(
        `UPDATE client_social_connections
         SET status = 'active',
             platform_account_id = ?,
             autopilot_enabled = 1,
             follower_count = ?,
             engagement_rate = ?,
             last_active_at = ?,
             updated_at = ?
         WHERE _id IN (?, ?)`
      ).run(IG_ACCOUNT_ID, followerCount, engagementRate, nowIso, nowIso, CONN_ID_MAIN, CONN_ID_DE);

      // TR hat noch kein separates Konto -> ehrlich auf 'inactive' statt rotem 'error'
      db.prepare(
        `UPDATE client_social_connections
         SET status = 'inactive', autopilot_enabled = 0, updated_at = ?
         WHERE _id = ? AND status = 'error'`
      ).run(nowIso, CONN_ID_TR);

      const upsertSnap = db.prepare(`
        INSERT INTO social_profile_metric_snapshots
          (_id, client_id, profile_id, platform, snapshot_day, follower_count, captured_at, created_at)
        VALUES (?, ?, ?, 'instagram', ?, ?, ?, ?)
        ON CONFLICT(client_id, profile_id, platform, snapshot_day) DO UPDATE SET
          follower_count = excluded.follower_count,
          captured_at = excluded.captured_at
      `);
      upsertSnap.run(snapIdMain, CLIENT_ID, PROFILE_ID_MAIN, snapshotDay, followerCount, nowIso, nowIso);
      upsertSnap.run(snapIdDe, CLIENT_ID, PROFILE_ID_DE, snapshotDay, followerCount, nowIso, nowIso);

      const upsertPost = db.prepare(`
        INSERT INTO social_post_stats (
          _id, client_id, profile_id, platform, post_id, brand_key, pillar, title, visual_type, creator,
          metrics_likes, metrics_comments, metrics_score, metrics_upvote_ratio,
          metrics_views, metrics_shares, metrics_total_interactions,
          last_checked_at, created_at, updated_at
        ) VALUES (?, ?, ?, 'instagram', ?, 'belowmark_de', 'Objekt des Tages', ?, ?, 'Katrin Weiss (DE)',
                  ?, ?, 0, 0, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(_id) DO UPDATE SET
          title = excluded.title,
          visual_type = excluded.visual_type,
          metrics_likes = excluded.metrics_likes,
          metrics_comments = excluded.metrics_comments,
          metrics_views = excluded.metrics_views,
          metrics_shares = excluded.metrics_shares,
          metrics_total_interactions = excluded.metrics_total_interactions,
          last_checked_at = excluded.last_checked_at,
          updated_at = excluded.updated_at
      `);
      for (const s of liveStats) {
        upsertPost.run(
          s._id,
          CLIENT_ID,
          PROFILE_ID_DE,
          s.postId,
          s.title,
          s.visualType,
          s.likes,
          s.comments,
          s.views,
          s.shares,
          s.totalInteractions,
          nowIso,
          s.createdAt,
          nowIso
        );
      }
      db.close();
    }
  } catch (e) {
    logLine(`[Belowmark Sync] Lokaler SQLite-Sync Hinweis: ${e.message}`);
  }

  // 2. Remote pycie-prod SQLite aktualisieren (verhindert Überschreiben beim nächsten SCP-Pull)
  try {
    const syncPayloadB64 = Buffer.from(
      JSON.stringify({
        igAccountId: IG_ACCOUNT_ID,
        clientId: CLIENT_ID,
        profileIdMain: PROFILE_ID_MAIN,
        profileIdDe: PROFILE_ID_DE,
        connIdMain: CONN_ID_MAIN,
        connIdDe: CONN_ID_DE,
        connIdTr: CONN_ID_TR,
        followerCount,
        engagementRate,
        nowIso,
        snapshotDay,
        snapIdMain,
        snapIdDe,
        liveStats,
      })
    ).toString("base64");

    const pyScript = `import base64, json, sqlite3, sys
p = json.loads(base64.b64decode(sys.argv[1]).decode('utf-8'))
c = sqlite3.connect('/root/backend/data/pycie.sqlite', timeout=10)
c.execute(
    "UPDATE client_social_connections SET status='active', platform_account_id=?, autopilot_enabled=1, follower_count=?, engagement_rate=?, last_active_at=?, updated_at=? WHERE _id IN (?, ?)",
    (p['igAccountId'], p['followerCount'], p['engagementRate'], p['nowIso'], p['nowIso'], p['connIdMain'], p['connIdDe'])
)
c.execute(
    "UPDATE client_social_connections SET status='inactive', autopilot_enabled=0, updated_at=? WHERE _id=? AND status='error'",
    (p['nowIso'], p['connIdTr'])
)
for sid, pid in [(p['snapIdMain'], p['profileIdMain']), (p['snapIdDe'], p['profileIdDe'])]:
    c.execute(
        "INSERT INTO social_profile_metric_snapshots (_id, client_id, profile_id, platform, snapshot_day, follower_count, captured_at, created_at) VALUES (?, ?, ?, 'instagram', ?, ?, ?, ?) ON CONFLICT(client_id, profile_id, platform, snapshot_day) DO UPDATE SET follower_count=excluded.follower_count, captured_at=excluded.captured_at",
        (sid, p['clientId'], pid, p['snapshotDay'], p['followerCount'], p['nowIso'], p['nowIso'])
    )
for s in p['liveStats']:
    c.execute(
        "INSERT INTO social_post_stats (_id, client_id, profile_id, platform, post_id, brand_key, pillar, title, visual_type, creator, metrics_likes, metrics_comments, metrics_score, metrics_upvote_ratio, metrics_views, metrics_shares, metrics_total_interactions, last_checked_at, created_at, updated_at) VALUES (?, ?, ?, 'instagram', ?, 'belowmark_de', 'Objekt des Tages', ?, ?, 'Katrin Weiss (DE)', ?, ?, 0, 0, ?, ?, ?, ?, ?, ?) ON CONFLICT(_id) DO UPDATE SET title=excluded.title, visual_type=excluded.visual_type, metrics_likes=excluded.metrics_likes, metrics_comments=excluded.metrics_comments, metrics_views=excluded.metrics_views, metrics_shares=excluded.metrics_shares, metrics_total_interactions=excluded.metrics_total_interactions, last_checked_at=excluded.last_checked_at, updated_at=excluded.updated_at",
        (s['_id'], p['clientId'], p['profileIdDe'], s['postId'], s['title'], s['visualType'], s['likes'], s['comments'], s['views'], s['shares'], s['totalInteractions'], p['nowIso'], s['createdAt'], p['nowIso'])
    )
c.commit()
c.close()
`;

    execFileSync("ssh", ["-o", "BatchMode=yes", "-o", "ConnectTimeout=8", "pycie-prod", `python3 - ${syncPayloadB64}`], {
      input: pyScript,
      stdio: ["pipe", "ignore", "pipe"],
    });
  } catch (e) {
    logLine(`[Belowmark Sync] Remote pycie-prod Sync Hinweis: ${e.message}`);
  }

  logLine(
    `[Belowmark Sync] ✅ Live-Metriken synchronisiert: ${followerCount} Follower, ${liveStats.length} Posts/Reels geprüft (${totalInteractions} Interaktionen).`
  );
  return { followerCount, postsSynced: liveStats.length, totalInteractions };
}

// ===========================================================================
// HAUPTABLAUF
// ===========================================================================

const isoDay = args.datum || new Date().toISOString().slice(0, 10);
const account = String(args.account || "belowmark_com");
const lang = String(args.lang || "de");
const theme = "objekt";

const publishedLog = fs.existsSync(PUBLISHED_LOG_FILE)
  ? JSON.parse(fs.readFileSync(PUBLISHED_LOG_FILE, "utf8"))
  : {};

const syncOnly = Boolean(args["sync-only"]);
const reelOnly = Boolean(args["reel-only"]);
const existingEntry = publishedLog[isoDay] || null;

if (!syncOnly && !reelOnly && existingEntry?.feedId && !args.force) {
  logLine(
    `[Belowmark Publish] Tag ${isoDay} wurde bereits auf @${account} veröffentlicht (Feed-ID: ${existingEntry.feedId}) — führe nur Live-Metriken-Sync aus.`
  );
}

const dayDir = path.resolve(OUT_ROOT, isoDay);
const feedPngPath = path.resolve(dayDir, `${lang}-${theme}-feed.png`);
const storyPngPath = path.resolve(dayDir, `${lang}-${theme}-story.png`);
const reelMp4Path = path.resolve(dayDir, `${lang}-${theme}-reel.mp4`);
const captionPath = path.resolve(dayDir, `${lang}-${theme}.txt`);
const manifestPath = path.resolve(dayDir, "manifest.json");

const manifest = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, "utf8"))
  : {};
const postMeta = manifest?.posts?.[lang]?.[theme] || {};

const needPublishFeed = !syncOnly && !reelOnly && (!existingEntry?.feedId || Boolean(args.force));
const needPublishReel =
  !syncOnly &&
  !args["no-reel"] &&
  fs.existsSync(reelMp4Path) &&
  (reelOnly || !existingEntry?.reelId || Boolean(args.force));
const needPublishStory =
  !syncOnly &&
  !args["no-story"] &&
  fs.existsSync(storyPngPath) &&
  (Boolean(args["with-story"]) || (!reelOnly && (!existingEntry?.storyId || Boolean(args.force))));

let caption = "";
if (needPublishFeed || needPublishReel) {
  if (!fs.existsSync(captionPath)) {
    logLine(`[Belowmark Publish] FEHLER: ${captionPath} fehlt für ${isoDay}.`);
    process.exit(1);
  }
  caption = fs.readFileSync(captionPath, "utf8").trim();
  if (!/(\d[\d.]*\s*€|\d[\d.]*\s*TL)/.test(caption)) {
    logLine(`[Belowmark Publish] ABBRUCH: Caption für ${isoDay} enthält keinen echten Preis!`);
    process.exit(1);
  }
}

const headline =
  postMeta.headline ||
  (caption ? caption.split("\n")[0] : null) ||
  existingEntry?.headline ||
  `Objekt des Tages (${isoDay})`;

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
  await page.waitForTimeout(3500);
  await dismissInstagramConsent(page);

  const activeCookies = await context.cookies("https://www.instagram.com");
  const hasSessionCookie = activeCookies.some((c) => c.name === "sessionid" && Boolean(c.value));
  if (!hasSessionCookie) {
    const msg = `[Belowmark Publish] ❌ Instagram-Session für @${account} ist ausgeloggt (kein sessionid-Cookie) — bitte 'npm run insta:login' ausführen.`;
    logLine(msg);
    throw new Error(msg);
  }

  let feedId = existingEntry?.feedId || null;
  let feedMode = existingEntry?.feedMode || null;
  let reelId = existingEntry?.reelId || null;
  let reelCode = existingEntry?.reelCode || null;
  let storyId = existingEntry?.storyId || null;
  let storyHasLinkSticker = existingEntry?.storyHasLinkSticker ?? false;

  // 1. 5-Slide Swipe-Karussell (oder Einzelbild-Fallback) veröffentlichen
  if (needPublishFeed) {
    if (!fs.existsSync(feedPngPath)) {
      throw new Error(`Feed-PNG fehlt: ${feedPngPath}`);
    }
    const slideFiles =
      Array.isArray(postMeta.slideFiles) && postMeta.slideFiles.length > 0
        ? postMeta.slideFiles
        : [1, 2, 3, 4, 5].map((n) => `${lang}-${theme}-slide-${n}.png`);
    const slidePaths = slideFiles
      .map((f) => path.resolve(dayDir, f))
      .filter((p) => fs.existsSync(p));
    const slideB64List = slidePaths.map((p) => fs.readFileSync(p).toString("base64"));
    const fallbackPngB64 = fs.readFileSync(feedPngPath).toString("base64");

    logLine(
      `[Belowmark Publish] Starte Feed-Upload für ${isoDay} (${
        slideB64List.length >= 2 ? `${slideB64List.length}-Slide Karussell` : "Einzelbild"
      }): "${headline}"...`
    );

    const feedRes = await uploadFeedCarouselOrPhoto(page, {
      slideB64List,
      fallbackPngB64,
      caption,
    });

    if (!feedRes.ok) {
      throw new Error(`Feed-Upload fehlgeschlagen (${feedRes.status}): ${feedRes.body}`);
    }
    feedId = feedRes.mediaId;
    feedMode = feedRes.mode;
    logLine(
      `[Belowmark Publish] ✅ ${
        feedRes.mode === "carousel" ? `${feedRes.slideCount}-Slide Karussell` : "Feed-Post"
      } veröffentlicht (ID: ${feedId}${feedRes.code ? `, Shortcode: ${feedRes.code}` : ""})`
    );
  }

  // 2. 9:16 Video-Reel veröffentlichen
  if (needPublishReel) {
    logLine(`[Belowmark Publish] Starte 9:16 Video-Reel Upload (${path.basename(reelMp4Path)})...`);
    const reelRes = await uploadReelViaComposer(page, {
      account,
      mp4Path: reelMp4Path,
      caption,
    });
    if (reelRes.ok) {
      reelId = reelRes.mediaId;
      reelCode = reelRes.code || null;
      logLine(
        `[Belowmark Publish] ✅ 9:16 Video-Reel veröffentlicht (ID: ${reelId}${
          reelCode ? `, URL: https://www.instagram.com/reel/${reelCode}/` : ""
        })`
      );
    } else {
      logLine(`[Belowmark Publish] ⚠️ Reel-Upload Warnung: ${reelRes.reason}`);
    }
  }

  // 3. 9:16 Story mit Link-Sticker veröffentlichen
  if (needPublishStory) {
    await page.goto(`https://www.instagram.com/${account}/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2500);
    const storyPngB64 = fs.readFileSync(storyPngPath).toString("base64");
    const storyUrl =
      postMeta.storyUrl ||
      `https://www.belowmark.com/zwangsversteigerungen?utm_source=instagram&utm_medium=story_sticker&utm_campaign=belowmark_${lang}_${isoDay}`;

    const storyRes = await uploadStoryWithLink(page, { storyPngB64, storyUrl });
    if (storyRes.ok) {
      storyId = storyRes.mediaId;
      storyHasLinkSticker = storyRes.hasLinkSticker;
      logLine(
        `[Belowmark Publish] ✅ Story veröffentlicht (ID: ${storyId}, Link-Sticker aktiv: ${
          storyHasLinkSticker ? "JA" : "NEIN (IG-Kontotyp/API-Filter)"
        }, Ziel: ${storyUrl})`
      );
    } else {
      logLine(`[Belowmark Publish] ⚠️ Story-Upload fehlgeschlagen (Status: ${storyRes.status})`);
    }
  }

  // 4. published-log.json aktualisieren (sofern heute etwas veröffentlicht wurde)
  if (needPublishFeed || needPublishReel || needPublishStory) {
    publishedLog[isoDay] = {
      ...(existingEntry || {}),
      isoDay,
      publishedAt: existingEntry?.publishedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      account,
      theme,
      headline: existingEntry?.headline || headline,
      reelHeadline: needPublishReel ? headline : existingEntry?.reelHeadline || null,
      reelPublishedAt: needPublishReel ? new Date().toISOString() : existingEntry?.reelPublishedAt || null,
      feedId,
      feedMode,
      reelId,
      reelCode,
      storyId,
      storyHasLinkSticker,
      storyUrl: postMeta.storyUrl || existingEntry?.storyUrl || null,
    };
    fs.writeFileSync(PUBLISHED_LOG_FILE, JSON.stringify(publishedLog, null, 2));

    // Wochenplan-Tag in SQLite als 'veroeffentlicht' markieren
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
      logLine(`[Belowmark Publish] Lokaler Plan-Status Hinweis: ${e.message}`);
    }

    try {
      const planPy = `import sqlite3, sys
c = sqlite3.connect('/root/backend/data/pycie.sqlite', timeout=10)
c.execute("UPDATE social_week_plan_days SET status = 'veroeffentlicht', publish_error = '', last_attempt_at = datetime('now') WHERE plan_id = '6b9000000000000000000001' AND date = ?", (sys.argv[1],))
c.commit()
c.close()
`;
      execFileSync(
        "ssh",
        ["-o", "BatchMode=yes", "-o", "ConnectTimeout=8", "pycie-prod", `python3 - ${isoDay}`],
        { input: planPy, stdio: ["pipe", "ignore", "pipe"] }
      );
    } catch {}
  }

  // 5. Echte Live-Metriken (Follower, Likes, Kommentare, Reel-Plays) in pycie.sqlite synchronisieren
  await syncLiveMetrics(page, { account, publishedLog });

  logLine(`[Belowmark Publish] 🎉 Lauf für ${isoDay} erfolgreich abgeschlossen.`);
} finally {
  await Promise.race([
    context.close().catch(() => {}),
    new Promise((resolve) => setTimeout(resolve, 5000)),
  ]);
}
process.exit(0);
