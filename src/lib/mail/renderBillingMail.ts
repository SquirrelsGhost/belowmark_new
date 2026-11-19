import type { LocaleOption } from "@/lib/constants";
import { escapeHtml, MAIL_COLORS, renderMailFrame } from "@/lib/mail/mailLayout";
import { RenderedMail } from "@/lib/mail/renderAuthMail";
import { normalizeMailLang } from "@/lib/mail/verifyReminderMailCopy";

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

interface BillingMailChrome {
  headerLine: string;
  appendixLabel: string;
  docCode: string;
  eyebrow: string;
  manageLabel: string;
}

const BILLING_MAIL_CHROME: Record<LocaleOption, BillingMailChrome> = {
  de: {
    headerLine: "BELOWMARK — VERTRAGS- & EINGANGSBELEG",
    appendixLabel: "Vertragsunterlagen auf dauerhaftem Datenträger (§ 312f Abs. 2 BGB)",
    docCode: "BM-BELEG · VERTRAG",
    eyebrow: "Vertrags- & Eingangsbestätigung",
    manageLabel: "Konto & Tarif öffnen",
  },
  tr: {
    headerLine: "BELOWMARK — SÖZLEŞME VE İŞLEM BELGESİ",
    appendixLabel: "Kalıcı Veri Taşıyıcısında Sözleşme Belgeleri (AGB & Cayma Bilgilendirmesi)",
    docCode: "BM-BELGE · SÖZLEŞME",
    eyebrow: "Sözleşme ve İşlem Onayı",
    manageLabel: "Hesap ve Abonelik",
  },
  en: {
    headerLine: "BELOWMARK — CONTRACT & RECEIPT CONFIRMATION",
    appendixLabel: "Contract Documents on a Durable Medium (Terms & Withdrawal Notice)",
    docCode: "BM-RECEIPT · CONTRACT",
    eyebrow: "Contract & Receipt Confirmation",
    manageLabel: "Open Account & Plan",
  },
  fr: {
    headerLine: "BELOWMARK — CONFIRMATION DE CONTRAT & REÇU",
    appendixLabel: "Documents contractuels sur support durable (CGV & Droit de rétractation)",
    docCode: "BM-REÇU · CONTRAT",
    eyebrow: "Confirmation de Contrat & de Réception",
    manageLabel: "Ouvrir Compte & Formule",
  },
  es: {
    headerLine: "BELOWMARK — COMPROBANTE DE CONTRATO Y RECEPCIÓN",
    appendixLabel: "Documentación contractual en soporte duradero (CGC y Derecho de desistimiento)",
    docCode: "BM-RECIBO · CONTRATO",
    eyebrow: "Confirmación de Contrato y Recepción",
    manageLabel: "Abrir Cuenta y Plan",
  },
  it: {
    headerLine: "BELOWMARK — RICEVUTA CONTRATTUALE E DI CONFERMA",
    appendixLabel: "Documenti contrattuali su supporto durevole (CGV e Informativa sul recesso)",
    docCode: "BM-RICEVUTA · CONTRATTO",
    eyebrow: "Conferma di Contratto e Ricezione",
    manageLabel: "Apri Account e Piano",
  },
  pl: {
    headerLine: "BELOWMARK — POTWIERDZENIE UMOWY I WPŁYWU",
    appendixLabel: "Dokumenty umowne na trwałym nośniku (Regulamin i Pouczenie o odstąpieniu)",
    docCode: "BM-DOKUMENT · UMOWA",
    eyebrow: "Potwierdzenie Umowy i Przyjęcia Zgłoszenia",
    manageLabel: "Otwórz Konto i Plan",
  },
  cs: {
    headerLine: "BELOWMARK — POTVRZENÍ SMLOUVY A PŘIJETÍ",
    appendixLabel: "Smluvní dokumentace na trvalém nosiči dat (VOP a Poučení o odstoupení)",
    docCode: "BM-DOKLAD · SMLOUVA",
    eyebrow: "Potvrzení Smlouvy a Přijetí Podání",
    manageLabel: "Otevřít Účet a Tarif",
  },
  nl: {
    headerLine: "BELOWMARK — CONTRACT- & ONTVANGSTBEVESTIGING",
    appendixLabel: "Contractdocumenten op een duurzame gegevensdrager (AV & Herroepingsrecht)",
    docCode: "BM-BEWIJS · CONTRACT",
    eyebrow: "Contract- & Ontvangstbevestiging",
    manageLabel: "Account & Pakket openen",
  },
  sv: {
    headerLine: "BELOWMARK — AVTALS- & MOTTAGNINGSBEKRÄFTELSE",
    appendixLabel: "Avtalshandlingar på varaktigt medium (Allmänna villkor & Ångerrätt)",
    docCode: "BM-UNDERLAG · AVTAL",
    eyebrow: "Avtals- & Mottagningsbekräftelse",
    manageLabel: "Öppna Konto & Paket",
  },
};

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
  const langKey = normalizeMailLang(lang);
  const chrome = BILLING_MAIL_CHROME[langKey];

  const text = [
    chrome.headerLine,
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
  const appendixLabel = chrome.appendixLabel;

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
    lang: langKey,
    docCode: chrome.docCode,
    eyebrow: chrome.eyebrow,
    subject,
    preheader: subject,
    bodyHtml,
    signature,
    footer,
    manageLabel: chrome.manageLabel,
    manageUrl: "https://belowmark.com/konto",
  });

  return { subject, text, html };
}
