import { escapeHtml, MAIL_COLORS, renderMailFrame } from "@/lib/mail/mailLayout";
import { RenderedMail } from "@/lib/mail/renderAuthMail";

export interface DeadlineMailItem {
  /** "heute" / "in 3 Tagen" */
  when: string;
  date: string;
  title: string;
  detail: string;
  source: string | null;
}

export interface DeadlineMailSection {
  title: string;
  reference: string;
  url: string;
  items: DeadlineMailItem[];
}

interface DeadlineMailParts {
  lang: string;
  subject: string;
  preheader: string;
  greeting: string;
  intro: string;
  sections: DeadlineMailSection[];
  openListing: string;
  manage: string;
  manageUrl: string;
  signature: string;
  footer: string;
}

function itemHtml(item: DeadlineMailItem, idx: number): string {
  const C = MAIL_COLORS;
  const lower = item.when.toLowerCase();
  const isUrgent = lower === "heute" || lower === "morgen" || lower === "bugün" || lower === "yarın";
  const badgeStyle = isUrgent
    ? `background-color:${C.signal};color:${C.bright};border:1px solid ${C.signal};`
    : `background-color:${C.bright};color:${C.signal};border:1px solid ${C.signal};`;
  const borderTop = idx > 0 ? `border-top:1px solid ${C.rule};` : "";

  return `
    <tr>
      <td style="padding:14px 18px;${borderTop}">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="left" style="vertical-align:middle;">
              <span style="display:inline-block;font-family:'Courier New',Courier,monospace;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;padding:3px 8px;${badgeStyle}">
                &#9200; ${escapeHtml(item.when)}
              </span>
            </td>
            <td align="right" style="vertical-align:middle;font-family:'Courier New',Courier,monospace;font-size:12px;font-weight:700;color:${C.ink};">
              ${escapeHtml(item.date)}
            </td>
          </tr>
        </table>
        <div style="margin-top:8px;font-size:15px;font-weight:800;line-height:1.35;color:${C.ink};">
          ${escapeHtml(item.title)}
        </div>
        <div style="margin-top:5px;font-size:13px;line-height:1.6;color:${C.inkSoft};">
          ${escapeHtml(item.detail)}
        </div>
        ${
          item.source
            ? `<div style="margin-top:8px;">
                <span style="display:inline-block;font-family:'Courier New',Courier,monospace;font-size:11px;color:${C.muted};background-color:${C.paper};border:1px solid ${C.rule};padding:2px 8px;">
                  &sect; ${escapeHtml(item.source)}
                </span>
              </div>`
            : ""
        }
      </td>
    </tr>`;
}

function sectionHtml(section: DeadlineMailSection, openListing: string): string {
  const C = MAIL_COLORS;
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.card};border:1.5px solid ${C.ink};margin-bottom:20px;">
      <tr>
        <td style="padding:14px 18px;background-color:${C.paper};border-bottom:1px solid ${C.rule};">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="left" style="vertical-align:top;padding-right:12px;">
                <div style="font-size:16px;font-weight:800;line-height:1.3;color:${C.ink};">
                  ${escapeHtml(section.title)}
                </div>
                <div style="font-family:'Courier New',Courier,monospace;font-size:12px;color:${C.muted};margin-top:3px;">
                  ${escapeHtml(section.reference)}
                </div>
              </td>
              <td align="right" style="vertical-align:middle;white-space:nowrap;">
                <a href="${escapeHtml(section.url)}" style="display:inline-block;background-color:${C.ink};color:${C.bright};font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:8px 12px;border-bottom:3px solid ${C.signal};text-decoration:none;">
                  ${escapeHtml(openListing)} &rarr;
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      ${section.items.map((item, idx) => itemHtml(item, idx)).join("")}
    </table>`;
}

function sectionText(section: DeadlineMailSection, openListing: string): string[] {
  return [
    `┌─ ${section.title}`,
    `│  ${section.reference}`,
    "├" + "─".repeat(46),
    ...section.items.flatMap((item) => [
      `│  [${item.when.toUpperCase()} · ${item.date}] ${item.title}`,
      `│  ${item.detail}`,
      ...(item.source ? [`│  ${item.source}`] : []),
      "│",
    ]),
    `└─ ${openListing}: ${section.url}`,
    "",
  ];
}

/** Structured deadline & hearing reminder digest with plain-text twin. */
export function renderDeadlineMail(parts: DeadlineMailParts): RenderedMail {
  const C = MAIL_COLORS;
  const isTr = parts.lang === "tr";
  const totalItems = parts.sections.reduce((sum, s) => sum + s.items.length, 0);

  const text = [
    "BELOWMARK — TERMIN- & FRISTEN-BEGLEITER",
    "═".repeat(48),
    "",
    parts.greeting,
    "",
    parts.intro,
    "",
    ...parts.sections.flatMap((section) => sectionText(section, parts.openListing)),
    `▸ ${parts.manage}: ${parts.manageUrl}`,
    "",
    "—",
    parts.signature,
    parts.footer,
  ].join("\n");

  const summaryBar = isTr
    ? `${parts.sections.length} takip edilen dosya · ${totalItems} yaklaşan süre`
    : `${parts.sections.length} verfolgte Verfahren · ${totalItems} anstehende ${totalItems === 1 ? "Frist" : "Fristen"}`;

  const bodyHtml = `
    <tr>
      <td style="padding:4px 32px 24px;">
        <p style="margin:0 0 8px;font-size:16px;font-weight:700;color:${C.ink};">${escapeHtml(parts.greeting)}</p>
        <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:${C.inkSoft};">${escapeHtml(parts.intro)}</p>
        <div style="font-family:'Courier New',Courier,monospace;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${C.inkSoft};background-color:${C.paper};border:1px solid ${C.rule};border-left:4px solid ${C.signal};padding:9px 14px;margin-bottom:20px;">
          ${escapeHtml(summaryBar)}
        </div>
        ${parts.sections.map((section) => sectionHtml(section, parts.openListing)).join("\n")}
      </td>
    </tr>`;

  const html = renderMailFrame({
    lang: parts.lang,
    docCode: isTr ? "BM-SÜRE · HATIRLATICI" : "BM-FRIST · TERMINBEGLEITER",
    eyebrow: isTr ? "Süre ve İhale Hatırlatması" : "Fristen- & Termin-Erinnerung",
    subject: parts.subject,
    preheader: parts.preheader,
    bodyHtml,
    signature: parts.signature,
    footer: parts.footer,
    manageLabel: parts.manage,
    manageUrl: parts.manageUrl,
  });

  return { subject: parts.subject, text, html };
}
