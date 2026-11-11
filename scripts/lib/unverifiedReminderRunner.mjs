import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import nodemailer from "nodemailer";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");

const PUBLIC_ORIGIN = "https://www.belowmark.com";
const REMINDER_TTL_MS = 72 * 60 * 60 * 1000;
const MARKER_TTL_DAYS = 3650;
const MARKER_PURPOSE = "verify_email_reminder_sent";

function resolvePublicBaseUrl(candidate) {
  const raw = (candidate || process.env.NEXT_PUBLIC_APP_URL || PUBLIC_ORIGIN).trim();
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(raw)) {
    return PUBLIC_ORIGIN;
  }
  return raw.replace(/\/+$/, "");
}

function isExcludedEmail(email) {
  const clean = String(email || "").trim();
  return /\.(local|invalid|test)$/i.test(clean) || /@belowmark\./i.test(clean);
}

function sha256Hex(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function formatOtpDisplay(code) {
  const digits = String(code).replace(/\D/g, "");
  return digits.length === 6 ? `${digits.slice(0, 3)} ${digits.slice(3)}` : digits;
}

function resolveSenderDomain() {
  const raw = process.env.SMTP_USER?.split("@")[1]?.trim().toLowerCase();
  return raw && /^[a-z0-9.-]+\.[a-z]{2,}$/.test(raw) ? raw : "belowmark.com";
}

function renderReminderMessage({
  bundle,
  chrome,
  lang,
  verifyUrl,
  verificationCode,
  baseUrl,
  MAIL_COLORS,
  escapeHtml,
  renderMailFrame,
}) {
  const C = MAIL_COLORS;
  const { template, highlights, docCode, eyebrow, signature, footer } = bundle;
  const formattedCode = formatOtpDisplay(verificationCode);

  const lines = [
    chrome.headerLine,
    "═".repeat(48),
    "",
    template.Greeting,
    "",
    template.Body,
    "",
    "┌──────────────────────────────────────────────┐",
    `│  ${chrome.codeHeading}: ${formattedCode}`,
    "└──────────────────────────────────────────────┘",
    "",
    ...highlights.map((p) => `  • ${p}`),
    "",
    `▸ ${template.Action}:`,
    verifyUrl,
    "",
    ...(template.Expiry ? [`ℹ ${template.Expiry}`, ""] : []),
    template.Ignore,
    "",
    "—",
    signature,
    footer,
  ];

  const safeUrl = escapeHtml(verifyUrl);
  const otpHtml = `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.paper};border:1.5px solid ${C.ink};margin-bottom:20px;">
          <tr>
            <td style="padding:16px 20px;">
              <div style="font-family:'Courier New',Courier,monospace;font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:${C.inkSoft};margin-bottom:8px;">
                ${escapeHtml(chrome.otpLabel)}
              </div>
              <div style="display:inline-block;font-family:'Courier New',Courier,monospace;font-size:26px;font-weight:900;letter-spacing:6px;color:${C.ink};background-color:${C.bright};border:1px solid ${C.ink};padding:10px 18px;">
                ${escapeHtml(formattedCode)}
              </div>
              <div style="margin-top:8px;font-size:12px;line-height:1.5;color:${C.muted};">
                ${escapeHtml(chrome.otpHint)}
              </div>
            </td>
          </tr>
        </table>`;

  const highlightsHtml = `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.paper};border:1px solid ${C.rule};border-left:4px solid ${C.verdict};margin-bottom:20px;">
          <tr>
            <td style="padding:14px 18px;">
              ${highlights
                .map(
                  (item, idx) =>
                    `<div style="font-size:13.5px;line-height:1.55;color:${C.ink};${idx > 0 ? "margin-top:6px;" : ""}"><strong>&#10003;</strong> ${escapeHtml(item)}</div>`,
                )
                .join("")}
            </td>
          </tr>
        </table>`;

  const bodyHtml = `
    <tr>
      <td style="padding:4px 32px 28px;">
        <p style="margin:0 0 10px;font-size:16px;font-weight:700;color:${C.ink};">
          ${escapeHtml(template.Greeting)}
        </p>
        <p style="margin:0 0 22px;font-size:15px;line-height:1.65;color:${C.inkSoft};">
          ${escapeHtml(template.Body)}
        </p>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.card};border:1px solid ${C.ink};border-left:5px solid ${C.signal};margin-bottom:20px;">
          <tr>
            <td style="padding:22px 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="background-color:${C.ink};border-bottom:4px solid ${C.signal};">
                    <a href="${safeUrl}" style="display:inline-block;padding:14px 26px;font-size:14px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:${C.bright};text-decoration:none;">
                      ${escapeHtml(template.Action)} &rarr;
                    </a>
                  </td>
                </tr>
              </table>
              ${
                template.Expiry
                  ? `<div style="margin-top:14px;font-family:'Courier New',Courier,monospace;font-size:12px;line-height:1.5;color:${C.inkSoft};">
                      &#9632; ${escapeHtml(template.Expiry)}
                    </div>`
                  : ""
              }
            </td>
          </tr>
        </table>

        ${otpHtml}
        ${highlightsHtml}

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.paper};border:1px solid ${C.rule};margin-bottom:20px;">
          <tr>
            <td style="padding:12px 16px;">
              <div style="font-family:'Courier New',Courier,monospace;font-size:10px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:${C.muted};margin-bottom:5px;">
                ${escapeHtml(chrome.copyLabel)}
              </div>
              <div style="font-family:'Courier New',Courier,monospace;font-size:12px;line-height:1.5;word-break:break-all;color:${C.ink};">
                <a href="${safeUrl}" style="color:${C.ink};text-decoration:underline;">${safeUrl}</a>
              </div>
            </td>
          </tr>
        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${C.rule};padding-top:14px;">
          <tr>
            <td style="font-size:13px;line-height:1.6;color:${C.muted};">
              <strong style="font-family:'Courier New',Courier,monospace;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:${C.inkSoft};">${escapeHtml(chrome.securityLabel)}:</strong>
              ${escapeHtml(template.Ignore)}
            </td>
          </tr>
        </table>
      </td>
    </tr>`;

  const html = renderMailFrame({
    lang,
    docCode,
    eyebrow,
    subject: template.Subject,
    preheader: template.Preheader,
    bodyHtml,
    signature,
    footer,
    baseUrl,
  });

  return { subject: template.Subject, text: lines.join("\n"), html };
}

/**
 * Runs the strict 1× verification reminder pass directly against PostgreSQL + SMTP.
 * Uses `auth_tokens.purpose = 'verify_email_reminder_sent'` (`sha256('verify-reminder:' + userId)`)
 * so each unverified account receives at most ONE reminder email ever.
 */
export async function runUnverifiedReminders({ dryRun = false, limit = 25, baseUrl } = {}) {
  if (!process.env.DATABASE_URL) {
    return { available: false, dryRun, eligible: 0, sent: 0, failed: 0, recipients: [], error: "DATABASE_URL missing" };
  }
  if (!dryRun && (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS)) {
    return { available: false, dryRun, eligible: 0, sent: 0, failed: 0, recipients: [], error: "SMTP credentials missing" };
  }

  const [{ MAIL_COLORS, escapeHtml, renderMailFrame }, { AUTH_MAIL_CHROME, buildVerifyReminderMailBundle, normalizeMailLang }] =
    await Promise.all([
      import(pathToFileURL(path.join(ROOT, "src/lib/mail/mailLayout.ts")).href),
      import(pathToFileURL(path.join(ROOT, "src/lib/mail/verifyReminderMailCopy.ts")).href),
    ]);

  const publicBase = resolvePublicBaseUrl(baseUrl);
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const transporter = dryRun
    ? null
    : nodemailer.createTransport({
        name: resolveSenderDomain(),
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 465),
        secure: Number(process.env.SMTP_PORT || 465) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        tls: {
          servername: process.env.SMTP_HOST || undefined,
          rejectUnauthorized: process.env.SMTP_TLS_STRICT === "true",
        },
        connectionTimeout: 15_000,
        greetingTimeout: 15_000,
        socketTimeout: 15_000,
      });

  try {
    const { rows } = await client.query(
      `
      SELECT u.id, u.email, u.locale, u.country, u.created_at
      FROM users u
      WHERE u.email_verified_at IS NULL
        AND u.gesperrt_am IS NULL
        AND u.created_at <= NOW() - INTERVAL '2 hours'
        AND u.created_at >= NOW() - INTERVAL '14 days'
        AND NOT EXISTS (
          SELECT 1
          FROM auth_tokens t
          WHERE t.user_id = u.id
            AND t.purpose = $1
        )
      ORDER BY u.created_at ASC
      LIMIT $2
      `,
      [MARKER_PURPOSE, limit],
    );

    const eligibleRows = rows.filter((u) => !isExcludedEmail(u.email));
    if (dryRun) {
      const preview = eligibleRows.map((u) => {
        const lang = normalizeMailLang(u.locale);
        const bundle = buildVerifyReminderMailBundle(lang);
        return {
          id: u.id,
          email: u.email,
          locale: lang,
          country: u.country,
          createdAt: u.created_at,
          subject: bundle.template.Subject,
          verifyBaseUrl: `${publicBase}/email-bestaetigen?token=<fresh-256bit-token>`,
        };
      });
      return {
        available: true,
        dryRun: true,
        eligible: eligibleRows.length,
        sent: 0,
        failed: 0,
        recipients: eligibleRows.map((u) => u.email),
        preview,
      };
    }

    let sent = 0;
    let failed = 0;
    const recipients = [];
    const senderDomain = resolveSenderDomain();
    const replyTo = process.env.OPERATOR_EMAIL || "contact@belowmark.com";
    const from = process.env.MAIL_FROM || "Belowmark <contact@belowmark.com>";

    for (const u of eligibleRows) {
      const markerId = sha256Hex(`verify-reminder:${u.id}`);
      const markerExpiresAt = new Date(Date.now() + MARKER_TTL_DAYS * 86_400_000);

      const claim = await client.query(
        `INSERT INTO auth_tokens (id, user_id, purpose, expires_at)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO NOTHING
         RETURNING id`,
        [markerId, u.id, MARKER_PURPOSE, markerExpiresAt],
      );
      if (claim.rowCount === 0) continue;

      const token = crypto.randomBytes(32).toString("base64url");
      const code = String(crypto.randomInt(100_000, 1_000_000));
      const tokenHash = sha256Hex(token);
      const codeHash = sha256Hex(`bm-otp:${u.id}:${code}`);
      const credExpiresAt = new Date(Date.now() + REMINDER_TTL_MS);

      try {
        await client.query("BEGIN");
        await client.query(
          `DELETE FROM auth_tokens WHERE user_id = $1 AND purpose IN ('verify_email', 'verify_email_code')`,
          [u.id],
        );
        await client.query(
          `INSERT INTO auth_tokens (id, user_id, purpose, expires_at)
           VALUES ($1, $2, 'verify_email', $3), ($4, $2, 'verify_email_code', $3)`,
          [tokenHash, u.id, credExpiresAt, codeHash],
        );
        await client.query("COMMIT");

        const lang = normalizeMailLang(u.locale);
        const bundle = buildVerifyReminderMailBundle(lang);
        const chrome = AUTH_MAIL_CHROME[lang];
        const verifyUrl = `${publicBase}/email-bestaetigen?token=${encodeURIComponent(token)}`;
        const rendered = renderReminderMessage({
          bundle,
          chrome,
          lang,
          verifyUrl,
          verificationCode: code,
          baseUrl: publicBase,
          MAIL_COLORS,
          escapeHtml,
          renderMailFrame,
        });

        await transporter.sendMail({
          messageId: `<${crypto.randomUUID()}@${senderDomain}>`,
          from,
          replyTo,
          to: u.email.trim(),
          subject: rendered.subject,
          text: rendered.text,
          html: rendered.html,
          headers: {
            "X-Auto-Response-Suppress": "OOF, AutoReply",
          },
        });

        sent += 1;
        recipients.push(u.email);
      } catch (err) {
        await client.query("ROLLBACK").catch(() => undefined);
        failed += 1;
        await client
          .query(`DELETE FROM auth_tokens WHERE id = $1 AND purpose = $2`, [markerId, MARKER_PURPOSE])
          .catch(() => undefined);
        console.error(`[unverifiedReminderRunner] send failed for ${u.email}:`, err?.message || err);
      }
    }

    return {
      available: true,
      dryRun: false,
      eligible: eligibleRows.length,
      sent,
      failed,
      recipients,
    };
  } finally {
    transporter?.close();
    await client.end();
  }
}
