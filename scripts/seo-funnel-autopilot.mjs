#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Belowmark SEO & Conversion Funnel Autopilot (GSC + Neon DB + Alerts + IndexNow)
//
//   npm run seo:monitor
//   node --use-system-ca scripts/seo-funnel-autopilot.mjs --run-alerts
//   node --use-system-ca scripts/seo-funnel-autopilot.mjs --push-indexnow-all
// ---------------------------------------------------------------------------

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as dotenv from "dotenv";
import nodemailer from "nodemailer";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(ROOT, ".env.local"), quiet: true });

const ORIGIN = "https://www.belowmark.com";
const GSC_SITE = "sc-domain:belowmark.com";
const GSC_KEY_CANDIDATES = [
  process.env.GSC_SERVICE_ACCOUNT_FILE,
  "C:/Users/emrea/Downloads/Developer_Keys_and_Certs/pycie-485818-56cf96e72f63.json",
  "C:/Users/emrea/Downloads/pycie-485818-56cf96e72f63.json",
].filter(Boolean);

const args = new Set(process.argv.slice(2));
const shouldRemindUnverified = args.has("--remind-unverified");
const shouldPushAllIndexNow = args.has("--push-indexnow-all");

async function getGscToken() {
  const keyPath = GSC_KEY_CANDIDATES.find((p) => fs.existsSync(p));
  if (!keyPath) return null;
  const sa = JSON.parse(fs.readFileSync(keyPath, "utf8"));
  const now = Math.floor(Date.now() / 1000);
  const h = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const c = Buffer.from(
    JSON.stringify({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/webmasters",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  ).toString("base64url");
  const s = crypto.createSign("RSA-SHA256").update(`${h}.${c}`).sign(sa.private_key, "base64url");
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${h}.${c}.${s}` }),
  });
  const j = await r.json();
  return j.access_token ?? null;
}

function isoDateDaysAgo(days) {
  const d = new Date(Date.now() - days * 86_400_000);
  return d.toISOString().slice(0, 10);
}

async function collectGscMetrics() {
  const token = await getGscToken();
  if (!token) return { available: false };

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  const smRes = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE)}/sitemaps`, { headers });
  const smJson = await smRes.json();
  const sitemaps = (smJson.sitemap ?? []).map((s) => ({
    path: s.path,
    lastSubmitted: s.lastSubmitted ?? null,
    lastDownloaded: s.lastDownloaded ?? null,
    errors: Number(s.errors ?? 0),
    warnings: Number(s.warnings ?? 0),
    submitted: (s.contents ?? []).reduce((n, c) => n + Number(c.submitted ?? 0), 0),
    indexed: (s.contents ?? []).reduce((n, c) => n + Number(c.indexed ?? 0), 0),
  }));

  const qUrl = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE)}/searchAnalytics/query`;
  const [last7, prev7, topQueries, topPages] = await Promise.all([
    fetch(qUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ startDate: isoDateDaysAgo(9), endDate: isoDateDaysAgo(2) }),
    }).then((r) => r.json()),
    fetch(qUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ startDate: isoDateDaysAgo(16), endDate: isoDateDaysAgo(10) }),
    }).then((r) => r.json()),
    fetch(qUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ startDate: isoDateDaysAgo(14), endDate: isoDateDaysAgo(1), dimensions: ["query"], rowLimit: 12 }),
    }).then((r) => r.json()),
    fetch(qUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ startDate: isoDateDaysAgo(14), endDate: isoDateDaysAgo(1), dimensions: ["page"], rowLimit: 12 }),
    }).then((r) => r.json()),
  ]);

  return {
    available: true,
    sitemaps,
    last7d: last7.rows?.[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: 0 },
    prev7d: prev7.rows?.[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: 0 },
    topQueries: (topQueries.rows ?? []).map((r) => ({
      query: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      position: Number(r.position.toFixed(1)),
    })),
    topPages: (topPages.rows ?? []).map((r) => ({
      page: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      position: Number(r.position.toFixed(1)),
    })),
  };
}

async function collectFunnelMetrics() {
  if (!process.env.DATABASE_URL) return { available: false };
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    const usersQ = await client.query(`
      SELECT
        COUNT(*) FILTER (WHERE email NOT LIKE '%@belowmark.%' AND email NOT LIKE '%.local' AND email NOT LIKE '%.test')::int AS external_total,
        COUNT(*) FILTER (WHERE email_verified_at IS NOT NULL AND email NOT LIKE '%@belowmark.%' AND email NOT LIKE '%.local' AND email NOT LIKE '%.test')::int AS external_verified,
        COUNT(*) FILTER (WHERE email_verified_at IS NULL AND email NOT LIKE '%@belowmark.%' AND email NOT LIKE '%.local' AND email NOT LIKE '%.test')::int AS external_unverified,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours' AND email NOT LIKE '%@belowmark.%' AND email NOT LIKE '%.local' AND email NOT LIKE '%.test')::int AS signups_24h,
        COUNT(*) FILTER (WHERE plan IS NOT NULL AND email NOT LIKE '%@belowmark.%' AND email NOT LIKE '%.local' AND email NOT LIKE '%.test')::int AS active_paid_plans,
        COUNT(*) FILTER (WHERE stripe_trial_used_at IS NOT NULL AND email NOT LIKE '%@belowmark.%' AND email NOT LIKE '%.local' AND email NOT LIKE '%.test')::int AS trials_started
      FROM users
    `);

    const unlocksQ = await client.query(`
      SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE unlocked_at >= NOW() - INTERVAL '24 hours')::int AS last_24h
      FROM free_listing_unlocks
    `);
    const alertsQ = await client.query(`SELECT COUNT(*)::int AS total FROM search_alerts WHERE is_active = true`);
    const watchQ = await client.query(`SELECT COUNT(*)::int AS total FROM watchlist`);
    const ordersQ = await client.query(`
      SELECT offer, status, COUNT(*)::int AS cnt
      FROM billing_orders
      GROUP BY offer, status
      ORDER BY offer, status
    `);
    const countersQ = await client.query(`
      SELECT key, count
      FROM rate_limits
      WHERE key LIKE 'funnel:%' OR key LIKE 'reengage:unverified-dossier-v1:%'
      ORDER BY key
    `);

    const reminderSentCount = countersQ.rows.filter((r) => r.key.startsWith("reengage:unverified-dossier-v1:")).length;
    const attributionCounters = Object.fromEntries(
      countersQ.rows.filter((r) => r.key.startsWith("funnel:")).map((r) => [r.key, r.count]),
    );

    return {
      available: true,
      users: usersQ.rows[0],
      freeDossierUnlocks: unlocksQ.rows[0],
      activeAlerts: alertsQ.rows[0].total,
      watchlistItems: watchQ.rows[0].total,
      ordersByOfferStatus: ordersQ.rows,
      unverifiedRemindersSent: reminderSentCount,
      attributionCounters,
    };
  } finally {
    await client.end();
  }
}

async function sendPendingUnverifiedReminders() {
  if (!process.env.DATABASE_URL || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return { available: false, sent: 0 };
  }
  const { MAIL_COLORS, escapeHtml, renderMailFrame } = await import(
    pathToFileURL(path.join(ROOT, "src/lib/mail/mailLayout.ts")).href
  );
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const transporter = nodemailer.createTransport({
    name: "belowmark.com",
    host: process.env.SMTP_HOST || "smtp.ionos.de",
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    tls: { servername: process.env.SMTP_HOST || "smtp.ionos.de", rejectUnauthorized: false },
  });

  let sent = 0;
  const recipients = [];
  try {
    const { rows } = await client.query(`
      SELECT id, email, locale
      FROM users
      WHERE email_verified_at IS NULL
        AND gesperrt_am IS NULL
        AND created_at <= NOW() - INTERVAL '40 minutes'
        AND created_at >= NOW() - INTERVAL '72 hours'
      ORDER BY created_at ASC
      LIMIT 8
    `);

    for (const u of rows) {
      if (/\.(local|invalid|test)$/i.test(u.email) || u.email.includes("@belowmark.")) continue;
      const idemKey = `reengage:unverified-dossier-v1:${u.id}`;
      const seen = await client.query(`SELECT 1 FROM rate_limits WHERE key = $1`, [idemKey]);
      if (seen.rows.length > 0) continue;

      const token = crypto.randomBytes(32).toString("base64url");
      const code = String(crypto.randomInt(100_000, 1_000_000));
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
      const codeHash = crypto.createHash("sha256").update(`bm-otp:${u.id}:${code}`).digest("hex");
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const codeFmt = `${code.slice(0, 3)} ${code.slice(3)}`;
      const verifyUrl = `${ORIGIN}/email-bestaetigen?token=${encodeURIComponent(token)}`;
      const isTr = (u.locale ?? "").startsWith("tr");
      const isEn = !isTr && !((u.locale ?? "de").startsWith("de"));
      const lang = isTr ? "tr" : isEn ? "en" : "de";

      const subject = isTr
        ? "1 Ücretsiz İhale Dosyanız hazır: Lütfen e-postanızı doğrulayın (Belowmark)"
        : isEn
          ? "Your 1 Free Property Dossier is waiting: Please verify your email (Belowmark)"
          : "Ihr 1 Gratis-Dossier wartet: Bitte E-Mail-Adresse bestätigen (Belowmark)";
      const bodyText = isTr
        ? `Merhaba,\n\nBelowmark'taki 1 Ücretsiz Tam İhale Dosyası hakkınızı açmak için 6 haneli kodunuz: ${codeFmt}\nDoğrulama bağlantısı (24 saat geçerli):\n${verifyUrl}\n\n— Emre Ak — Belowmark`
        : isEn
          ? `Hello,\n\nYour 6-digit verification code to unlock your 1 Free Property Dossier on Belowmark: ${codeFmt}\nDirect verification link (valid 24h):\n${verifyUrl}\n\n— Emre Ak — Belowmark`
          : `Guten Tag,\n\nIhr 6-stelliger Sicherheitscode zur Freischaltung Ihres 1 Gratis-Dossiers auf Belowmark lautet: ${codeFmt}\nDirektlink zur Bestätigung (24 Std. gültig):\n${verifyUrl}\n\n— Emre Ak — Belowmark`;

      const C = MAIL_COLORS;
      const bodyHtml = `<tr><td style="padding:8px 32px 28px;"><p style="font-size:15px;line-height:1.65;color:${C.ink};">${escapeHtml(bodyText).replace(/\n/g, "<br/>")}</p><div style="margin-top:16px;display:inline-block;font-family:monospace;font-size:24px;font-weight:900;letter-spacing:5px;padding:10px 18px;border:1.5px solid ${C.ink};background:${C.bright};">${escapeHtml(codeFmt)}</div><div style="margin-top:16px;"><a href="${escapeHtml(verifyUrl)}" style="display:inline-block;background:${C.ink};color:${C.bright};padding:12px 22px;font-weight:800;text-decoration:none;border-bottom:4px solid ${C.signal};">${isTr ? "E-POSTAYI DOĞRULA" : isEn ? "VERIFY EMAIL" : "E-MAIL BESTÄTIGEN"} &rarr;</a></div></td></tr>`;
      const html = renderMailFrame({
        lang,
        docCode: "BM-ACCOUNT",
        eyebrow: isTr ? "Hesap Doğrulama" : isEn ? "Account Verification" : "Kontobestätigung",
        subject,
        preheader: subject,
        bodyHtml,
        signature: "Emre Ak — Belowmark",
        footer: "Belowmark · belowmark.com",
        baseUrl: ORIGIN,
      });

      await client.query("BEGIN");
      await client.query(`DELETE FROM auth_tokens WHERE user_id = $1 AND purpose IN ('verify_email', 'verify_email_code')`, [u.id]);
      await client.query(
        `INSERT INTO auth_tokens (id, user_id, purpose, expires_at) VALUES ($1, $2, 'verify_email', $3), ($4, $2, 'verify_email_code', $3)`,
        [tokenHash, u.id, expiresAt, codeHash],
      );
      await client.query("COMMIT");

      await transporter.sendMail({
        messageId: `<${crypto.randomUUID()}@belowmark.com>`,
        from: process.env.MAIL_FROM || "Belowmark <contact@belowmark.com>",
        replyTo: "contact@belowmark.com",
        to: u.email,
        subject,
        text: bodyText,
        html,
        headers: { "X-Auto-Response-Suppress": "OOF, AutoReply" },
      });

      await client.query(
        `INSERT INTO rate_limits (key, count, reset_at) VALUES ($1, 1, NOW() + INTERVAL '365 days') ON CONFLICT (key) DO UPDATE SET count = rate_limits.count + 1`,
        [idemKey],
      );
      sent += 1;
      recipients.push(u.email);
    }
    return { available: true, sent, recipients };
  } finally {
    transporter.close();
    await client.end();
  }
}

async function pushAllUrlsToIndexNow() {
  const urlSitemaps = [
    `${ORIGIN}/sitemap-hubs.xml`,
    `${ORIGIN}/sitemap-listings-eu.xml`,
    `${ORIGIN}/sitemap-listings-tr.xml`,
    `${ORIGIN}/sitemap-blog.xml`,
  ];
  const allUrls = [];
  for (const sm of urlSitemaps) {
    const xml = await (await fetch(sm)).text();
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      allUrls.push(m[1]);
    }
  }
  const unique = [...new Set(allUrls)];
  const batches = [];
  for (let i = 0; i < unique.length; i += 10_000) {
    const slice = unique.slice(i, i + 10_000);
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: "www.belowmark.com",
        key: "pycie2026seoindexnowkey",
        keyLocation: `${ORIGIN}/pycie2026seoindexnowkey.txt`,
        urlList: slice,
      }),
    });
    batches.push({ batch: batches.length + 1, count: slice.length, httpStatus: res.status });
  }
  return { totalUniqueUrls: unique.length, batches };
}

const report = {
  generatedAt: new Date().toISOString(),
  gsc: await collectGscMetrics(),
  funnel: await collectFunnelMetrics(),
  unverifiedReminders: shouldRemindUnverified ? await sendPendingUnverifiedReminders() : null,
  indexNowFullPush: shouldPushAllIndexNow ? await pushAllUrlsToIndexNow() : null,
};

fs.mkdirSync(path.join(ROOT, ".data"), { recursive: true });
const outPath = path.join(ROOT, ".data", "seo-funnel-latest.json");
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

console.log("=== BELOWMARK SEO & FUNNEL AUTOPILOT ===");
if (report.gsc.available) {
  const l = report.gsc.last7d;
  const p = report.gsc.prev7d;
  console.log(
    `GSC (7d vs prev 7d): Clicks ${l.clicks} (prev ${p.clicks}) · Impressions ${l.impressions} (prev ${p.impressions}) · Pos ${Number(l.position || 0).toFixed(1)}`,
  );
  for (const sm of report.gsc.sitemaps) {
    console.log(`  Sitemap ${sm.path} -> submitted=${sm.submitted} indexed=${sm.indexed} errors=${sm.errors}`);
  }
}
if (report.funnel.available) {
  const u = report.funnel.users;
  console.log(
    `Funnel: ${u.external_total} Signups (${u.external_verified} verified / ${u.external_unverified} unverified, +${u.signups_24h} in 24h) · Reminders=${report.funnel.unverifiedRemindersSent} · FreeDossierUnlocks=${report.funnel.freeDossierUnlocks.total} · Alerts=${report.funnel.activeAlerts} · Watchlist=${report.funnel.watchlistItems} · Trials=${u.trials_started} · Paid=${u.active_paid_plans}`,
  );
  if (Object.keys(report.funnel.attributionCounters).length > 0) {
    console.log("  Attribution:", JSON.stringify(report.funnel.attributionCounters));
  }
}
if (report.unverifiedReminders) {
  console.log("Unverified Reminders (40m–72h):", JSON.stringify(report.unverifiedReminders));
}
if (report.indexNowFullPush) {
  console.log("IndexNow Full 25k Push:", JSON.stringify(report.indexNowFullPush));
}
console.log(`Saved snapshot -> ${outPath}`);
