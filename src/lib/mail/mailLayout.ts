export const MAIL_COLORS = {
  paper: "#eeeae1",
  paperDeep: "#e4dfd3",
  bright: "#f7f4ee",
  card: "#fcfaf6",
  ink: "#12110f",
  inkSoft: "#3b3933",
  muted: "#6e695e",
  rule: "#d6d0c4",
  ruleStrong: "#12110f",
  signal: "#c8362b",
  verdict: "#1f6a45",
  caution: "#b9771a",
} as const;

export const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export interface MailFrameOptions {
  lang: string;
  docCode: string;
  eyebrow: string;
  subject: string;
  preheader?: string;
  bodyHtml: string;
  signature: string;
  footer: string;
  manageLabel?: string;
  manageUrl?: string;
  baseUrl?: string;
}

/**
 * Shared HTML email shell in Belowmark's "Amtlicher Aushang / Official Dossier"
 * aesthetic. Uses table-based layout and inline styles for maximum compatibility
 * across Apple Mail, Gmail, Outlook, Thunderbird and IONOS Webmail.
 */
export function renderMailFrame(opts: MailFrameOptions): string {
  const C = MAIL_COLORS;
  const isTr = opts.lang === "tr";
  const base = (opts.baseUrl || "https://belowmark.com").replace(/\/+$/, "");
  const preheaderText = escapeHtml(opts.preheader || opts.subject);
  const navLabels = isTr
    ? { app: "Arama", deadlines: "Süreler", alerts: "Alarmlar", account: "Hesap", legal: "Künye & Gizlilik" }
    : { app: "Suche", deadlines: "Termine", alerts: "Such-Alerts", account: "Konto", legal: "Impressum & Datenschutz" };

  const manageBlock =
    opts.manageLabel && opts.manageUrl
      ? `<td align="right" style="vertical-align:middle;">
          <a href="${escapeHtml(opts.manageUrl)}" style="display:inline-block;font-family:'Courier New',Courier,monospace;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${C.ink};background:${C.paper};border:1px solid ${C.ink};padding:7px 12px;text-decoration:none;">
            ${escapeHtml(opts.manageLabel)} →
          </a>
        </td>`
      : "";

  return `<!doctype html>
<html lang="${escapeHtml(opts.lang)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${escapeHtml(opts.subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:${C.paper};color:${C.ink};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">
    ${preheaderText}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.paper};padding:32px 12px;">
    <tr>
      <td align="center">
        <!-- Main Dossier Sheet -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:620px;background-color:${C.bright};border:2px solid ${C.ink};">
          <!-- Top Signal Bar -->
          <tr>
            <td style="height:5px;background-color:${C.signal};font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Official Header / Aktenkopf -->
          <tr>
            <td style="padding:20px 32px;background-color:${C.paper};border-bottom:1px solid ${C.rule};">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="vertical-align:middle;">
                    <a href="${escapeHtml(base)}" style="text-decoration:none;color:${C.ink};display:inline-block;">
                      <span style="font-size:19px;font-weight:900;letter-spacing:3.5px;text-transform:uppercase;color:${C.ink};display:block;">BELOWMARK</span>
                      <span style="display:block;height:3px;width:100%;background-color:${C.signal};margin-top:3px;"></span>
                    </a>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <span style="display:inline-block;font-family:'Courier New',Courier,monospace;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${C.inkSoft};background-color:${C.bright};border:1px solid ${C.rule};padding:4px 9px;">
                      ${escapeHtml(opts.docCode)}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Title & Eyebrow Block -->
          <tr>
            <td style="padding:28px 32px 20px;">
              <div style="font-family:'Courier New',Courier,monospace;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${C.signal};margin-bottom:8px;">
                ${escapeHtml(opts.eyebrow)}
              </div>
              <h1 style="margin:0;font-size:24px;font-weight:800;line-height:1.22;letter-spacing:-0.3px;color:${C.ink};">
                ${escapeHtml(opts.subject)}
              </h1>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;">
                <tr>
                  <td width="64" style="height:3px;background-color:${C.signal};font-size:0;line-height:0;">&nbsp;</td>
                  <td style="height:1px;background-color:${C.rule};font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body Content -->
          ${opts.bodyHtml}

          <!-- Signature & Manage Row -->
          <tr>
            <td style="padding:22px 32px;background-color:${C.paper};border-top:1px solid ${C.rule};">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="vertical-align:middle;">
                    <div style="font-family:'Courier New',Courier,monospace;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:${C.muted};">
                      ${isTr ? "Resmî İlan Verisi · Kaynaklı Takip" : "Amtliche Bekanntmachungen · Mit Quelle"}
                    </div>
                    <div style="font-size:14px;font-weight:700;color:${C.ink};margin-top:3px;">
                      ${escapeHtml(opts.signature)}
                    </div>
                  </td>
                  ${manageBlock}
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Sub-Sheet Footer -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:620px;margin-top:16px;">
          <tr>
            <td align="center" style="padding:0 16px;font-family:'Courier New',Courier,monospace;font-size:11px;line-height:1.6;color:${C.muted};">
              <div>${escapeHtml(opts.footer)}</div>
              <div style="margin-top:6px;">
                <a href="${escapeHtml(`${base}/app`)}" style="color:${C.inkSoft};text-decoration:underline;">${navLabels.app}</a>
                &nbsp;·&nbsp;
                <a href="${escapeHtml(`${base}/app/termine`)}" style="color:${C.inkSoft};text-decoration:underline;">${navLabels.deadlines}</a>
                &nbsp;·&nbsp;
                <a href="${escapeHtml(`${base}/app/alerts`)}" style="color:${C.inkSoft};text-decoration:underline;">${navLabels.alerts}</a>
                &nbsp;·&nbsp;
                <a href="${escapeHtml(`${base}/konto`)}" style="color:${C.inkSoft};text-decoration:underline;">${navLabels.account}</a>
                &nbsp;·&nbsp;
                <a href="${escapeHtml(`${base}/impressum`)}" style="color:${C.inkSoft};text-decoration:underline;">${navLabels.legal}</a>
              </div>
              <div style="margin-top:4px;color:${C.muted};">
                Belowmark · Emre Ak · <a href="mailto:contact@belowmark.com" style="color:${C.muted};text-decoration:none;">contact@belowmark.com</a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
