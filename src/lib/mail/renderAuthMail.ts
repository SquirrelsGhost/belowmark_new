import { escapeHtml, MAIL_COLORS, renderMailFrame } from "@/lib/mail/mailLayout";
import { IMailTemplate } from "@/translations/auth/IAuthTranslation";

export interface RenderedMail {
  subject: string;
  text: string;
  html: string;
}

interface MailParts {
  template: Omit<IMailTemplate, "Expiry"> & { Expiry?: string };
  url: string;
  signature: string;
  footer: string;
  lang: string;
}

/**
 * Renders all account & security mails (E-Mail-Bestätigung, Passwort-Reset,
 * Sicherheitshinweis) in the structured "Amtlicher Aushang / Official Dossier"
 * layout, paired with a clean plain-text twin.
 */
export function renderAuthMail({ template, url, signature, footer, lang }: MailParts): RenderedMail {
  const C = MAIL_COLORS;
  const isTr = lang === "tr";

  const lines = [
    "BELOWMARK — KONTO & SICHERHEIT",
    "═".repeat(48),
    "",
    template.Greeting,
    "",
    template.Body,
    "",
    `▸ ${template.Action}:`,
    url,
    "",
  ];
  if (template.Expiry) lines.push(`ℹ ${template.Expiry}`, "");
  lines.push(template.Ignore, "", "—", signature, footer);

  const safeUrl = escapeHtml(url);
  const copyLabel = isTr ? "Kopyalamak için doğrudan bağlantı" : "Direktlink (falls die Schaltfläche nicht öffnet)";
  const securityLabel = isTr ? "Güvenlik Notu" : "Sicherheitshinweis";

  const bodyHtml = `
    <tr>
      <td style="padding:4px 32px 28px;">
        <p style="margin:0 0 10px;font-size:16px;font-weight:700;color:${C.ink};">
          ${escapeHtml(template.Greeting)}
        </p>
        <p style="margin:0 0 22px;font-size:15px;line-height:1.65;color:${C.inkSoft};">
          ${escapeHtml(template.Body)}
        </p>

        <!-- Primary Action Box -->
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

        <!-- Fallback URL Copy Box -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.paper};border:1px solid ${C.rule};margin-bottom:20px;">
          <tr>
            <td style="padding:12px 16px;">
              <div style="font-family:'Courier New',Courier,monospace;font-size:10px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:${C.muted};margin-bottom:5px;">
                ${escapeHtml(copyLabel)}
              </div>
              <div style="font-family:'Courier New',Courier,monospace;font-size:12px;line-height:1.5;word-break:break-all;color:${C.ink};">
                <a href="${safeUrl}" style="color:${C.ink};text-decoration:underline;">${safeUrl}</a>
              </div>
            </td>
          </tr>
        </table>

        <!-- Security Notice -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${C.rule};padding-top:14px;">
          <tr>
            <td style="font-size:13px;line-height:1.6;color:${C.muted};">
              <strong style="font-family:'Courier New',Courier,monospace;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:${C.inkSoft};">${escapeHtml(securityLabel)}:</strong>
              ${escapeHtml(template.Ignore)}
            </td>
          </tr>
        </table>
      </td>
    </tr>`;

  const html = renderMailFrame({
    lang,
    docCode: isTr ? "BM-HESAP · GÜVENLİK" : "BM-KONTO · SICHERHEIT",
    eyebrow: isTr ? "Hesap ve Erişim Doğrulaması" : "Konto- & Zugangsbestätigung",
    subject: template.Subject,
    preheader: template.Preheader,
    bodyHtml,
    signature,
    footer,
  });

  return { subject: template.Subject, text: lines.join("\n"), html };
}
