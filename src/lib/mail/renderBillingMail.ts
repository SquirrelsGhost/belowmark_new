import { escapeHtml, MAIL_COLORS, renderMailFrame } from "@/lib/mail/mailLayout";
import { RenderedMail } from "@/lib/mail/renderAuthMail";

interface BillingMailParts {
  subject: string;
  /** Body blocks; line breaks inside a block are kept */
  blocks: string[];
  /** Long plain text appended below a rule (AGB + Widerrufsbelehrung) */
  appendix?: string;
  signature: string;
  footer: string;
  lang: string;
}

const asHtml = (text: string): string => escapeHtml(text).replace(/\n/g, "<br>");

/**
 * Renders multi-line blocks that contain "Key: Value" lines as a structured
 * two-column receipt table; regular prose blocks render as paragraphs.
 */
function renderBlockHtml(block: string): string {
  const C = MAIL_COLORS;
  const lines = block
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const kvCount = lines.filter((line) => {
    const colon = line.indexOf(":");
    return colon > 1 && colon < 42;
  }).length;

  if (lines.length >= 2 && kvCount >= 2) {
    const rows = lines
      .map((line, idx) => {
        const colon = line.indexOf(":");
        const borderTop = idx > 0 ? `border-top:1px solid ${C.rule};` : "";
        if (colon > 1 && colon < 42) {
          const key = line.slice(0, colon).trim();
          const val = line.slice(colon + 1).trim();
          return `
            <tr>
              <td width="38%" style="padding:10px 14px;${borderTop}font-family:'Courier New',Courier,monospace;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:${C.muted};vertical-align:top;background-color:${C.paper};">
                ${escapeHtml(key)}
              </td>
              <td style="padding:10px 14px;${borderTop}font-size:14px;font-weight:700;color:${C.ink};vertical-align:top;background-color:${C.card};">
                ${escapeHtml(val)}
              </td>
            </tr>`;
        }
        return `
          <tr>
            <td colspan="2" style="padding:10px 14px;${borderTop}font-size:13px;line-height:1.55;color:${C.inkSoft};background-color:${C.card};">
              ${escapeHtml(line)}
            </td>
          </tr>`;
      })
      .join("");

    return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1.5px solid ${C.ink};margin:18px 0;">
        ${rows}
      </table>`;
  }

  return `<p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:${C.inkSoft};">${asHtml(block)}</p>`;
}

/**
 * Contract & legal confirmation mails (order confirmation, cancellation receipt,
 * withdrawal receipt) rendered in the structured "Amtlicher Beleg" layout.
 */
export function renderBillingMail({ subject, blocks, appendix, signature, footer, lang }: BillingMailParts): RenderedMail {
  const C = MAIL_COLORS;
  const isTr = lang === "tr";

  const text = [
    "BELOWMARK — VERTRAGS- & EINGANGSBELEG",
    "═".repeat(48),
    "",
    ...blocks.flatMap((block) => [block, ""]),
    signature,
    ...(appendix ? ["", "—".repeat(48), "", appendix] : []),
    "",
    "—",
    footer,
  ].join("\n");

  const bodyBlocks = blocks.map(renderBlockHtml).join("");
  const appendixLabel = isTr
    ? "Kalıcı Veri Taşıyıcısında Sözleşme Belgeleri (AGB & Cayma Bilgilendirmesi)"
    : "Vertragsunterlagen auf dauerhaftem Datenträger (§ 312f Abs. 2 BGB)";

  const extra = appendix
    ? `
      <tr>
        <td style="padding:0 32px 28px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.paper};border:1px solid ${C.ink};border-top:3px solid ${C.signal};">
            <tr>
              <td style="padding:12px 16px;border-bottom:1px solid ${C.rule};font-family:'Courier New',Courier,monospace;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${C.ink};">
                &sect; ${escapeHtml(appendixLabel)}
              </td>
            </tr>
            <tr>
              <td style="padding:16px;font-family:'Courier New',Courier,monospace;font-size:11.5px;line-height:1.6;color:${C.inkSoft};">
                ${asHtml(appendix)}
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    : "";

  const bodyHtml = `
    <tr>
      <td style="padding:4px 32px 20px;">
        ${bodyBlocks}
      </td>
    </tr>
    ${extra}`;

  const html = renderMailFrame({
    lang,
    docCode: isTr ? "BM-BELGE · SÖZLEŞME" : "BM-BELEG · VERTRAG",
    eyebrow: isTr ? "Sözleşme ve İşlem Onayı" : "Vertrags- & Eingangsbestätigung",
    subject,
    preheader: subject,
    bodyHtml,
    signature,
    footer,
    manageLabel: isTr ? "Hesap ve Abonelik" : "Konto & Tarif öffnen",
    manageUrl: "https://belowmark.com/konto",
  });

  return { subject, text, html };
}
