import { escapeHtml, MAIL_COLORS, renderMailFrame } from "@/lib/mail/mailLayout";
import { RenderedMail } from "@/lib/mail/renderAuthMail";

export interface AlertMailItem {
  kind: string;
  title: string;
  /** Court / İcra dairesi and file number */
  reference: string;
  dateLine: string | null;
  valueLine: string | null;
  url: string;
}

export interface AlertMailSection {
  name: string;
  summary: string;
  items: AlertMailItem[];
  /** "+ 4 weitere" when the list was cut */
  more: string | null;
  searchUrl: string;
}

interface AlertMailParts {
  lang: string;
  subject: string;
  preheader: string;
  greeting: string;
  intro: string;
  sections: AlertMailSection[];
  openSearch: string;
  note: string | null;
  source: string;
  manage: string;
  manageUrl: string;
  signature: string;
  footer: string;
}

function badgeColor(kind: string): { bg: string; fg: string; border: string } {
  const C = MAIL_COLORS;
  const k = kind.toLowerCase();
  if (k.includes("neu") || k.includes("yeni")) {
    return { bg: C.verdict, fg: C.bright, border: C.verdict };
  }
  if (k.includes("aufgehoben") || k.includes("iptal")) {
    return { bg: C.signal, fg: C.bright, border: C.signal };
  }
  return { bg: C.bright, fg: C.caution, border: C.caution };
}

function itemHtml(item: AlertMailItem, idx: number, isTr: boolean): string {
  const C = MAIL_COLORS;
  const badge = badgeColor(item.kind);
  const borderTop = idx > 0 ? `border-top:1px solid ${C.rule};` : "";
  const openLabel = isTr ? "Dosyayı aç" : "Aktenblatt";

  return `
    <tr>
      <td style="padding:14px 18px;${borderTop}">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="left" style="vertical-align:middle;">
              <span style="display:inline-block;font-family:'Courier New',Courier,monospace;font-size:10px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;background-color:${badge.bg};color:${badge.fg};border:1px solid ${badge.border};padding:2px 7px;">
                ${escapeHtml(item.kind)}
              </span>
            </td>
            <td align="right" style="vertical-align:middle;">
              <a href="${escapeHtml(item.url)}" style="font-family:'Courier New',Courier,monospace;font-size:11px;font-weight:700;color:${C.signal};text-decoration:none;text-transform:uppercase;letter-spacing:0.8px;">
                ${openLabel} &rarr;
              </a>
            </td>
          </tr>
        </table>
        <div style="margin-top:7px;font-size:16px;font-weight:800;line-height:1.3;">
          <a href="${escapeHtml(item.url)}" style="color:${C.ink};text-decoration:none;">${escapeHtml(item.title)}</a>
        </div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;background-color:${C.paper};border:1px solid ${C.rule};">
          <tr>
            <td style="padding:8px 12px;font-family:'Courier New',Courier,monospace;font-size:12px;line-height:1.55;color:${C.inkSoft};">
              <div><strong>${escapeHtml(item.reference)}</strong></div>
              ${item.dateLine ? `<div>&#128197; ${escapeHtml(item.dateLine)}</div>` : ""}
              ${item.valueLine ? `<div style="color:${C.ink};font-weight:700;">&#9632; ${escapeHtml(item.valueLine)}</div>` : ""}
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

function sectionHtml(section: AlertMailSection, openSearch: string, isTr: boolean): string {
  const C = MAIL_COLORS;
  const moreRow = section.more
    ? `<tr><td style="padding:10px 18px;border-top:1px solid ${C.rule};font-family:'Courier New',Courier,monospace;font-size:12px;color:${C.muted};">${escapeHtml(section.more)}</td></tr>`
    : "";

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.card};border:1.5px solid ${C.ink};margin-bottom:20px;">
      <tr>
        <td style="padding:14px 18px;background-color:${C.paper};border-bottom:1px solid ${C.rule};">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="left" style="vertical-align:top;padding-right:12px;">
                <div style="font-size:16px;font-weight:800;text-transform:uppercase;letter-spacing:0.6px;color:${C.ink};">${escapeHtml(section.name)}</div>
                ${section.summary ? `<div style="font-family:'Courier New',Courier,monospace;font-size:11px;color:${C.muted};margin-top:3px;">${escapeHtml(section.summary)}</div>` : ""}
              </td>
              <td align="right" style="vertical-align:middle;white-space:nowrap;">
                <a href="${escapeHtml(section.searchUrl)}" style="display:inline-block;background-color:${C.ink};color:${C.bright};font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:8px 12px;border-bottom:3px solid ${C.signal};text-decoration:none;">
                  ${escapeHtml(openSearch)} &rarr;
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      ${section.items.map((item, idx) => itemHtml(item, idx, isTr)).join("")}
      ${moreRow}
    </table>`;
}

function sectionText(section: AlertMailSection, openSearch: string): string[] {
  const lines = [section.summary ? `┌─ ${section.name} (${section.summary})` : `┌─ ${section.name}`, "├" + "─".repeat(46)];
  for (const item of section.items) {
    lines.push(`│  [${item.kind.toUpperCase()}] ${item.title}`);
    for (const detail of [item.reference, item.dateLine, item.valueLine].filter((l): l is string => Boolean(l))) {
      lines.push(`│    ${detail}`);
    }
    lines.push(`│    ${item.url}`, "│");
  }
  if (section.more) lines.push(`│  ${section.more}`, "│");
  lines.push(`└─ ${openSearch}: ${section.searchUrl}`, "");
  return lines;
}

/** Structured saved-search alert digest with plain-text twin. */
export function renderAlertMail(parts: AlertMailParts): RenderedMail {
  const C = MAIL_COLORS;
  const isTr = parts.lang === "tr";

  const text = [
    "BELOWMARK — SUCH-ALERTS",
    "═".repeat(48),
    "",
    parts.greeting,
    "",
    parts.intro,
    "",
    ...parts.sections.flatMap((section) => sectionText(section, parts.openSearch)),
    ...(parts.note ? [parts.note, ""] : []),
    parts.source,
    "",
    `▸ ${parts.manage}: ${parts.manageUrl}`,
    "",
    "—",
    parts.signature,
    parts.footer,
  ].join("\n");

  const bodyHtml = `
    <tr>
      <td style="padding:4px 32px 24px;">
        <p style="margin:0 0 8px;font-size:16px;font-weight:700;color:${C.ink};">${escapeHtml(parts.greeting)}</p>
        <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:${C.inkSoft};">${escapeHtml(parts.intro)}</p>
        ${parts.sections.map((section) => sectionHtml(section, parts.openSearch, isTr)).join("\n")}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.paper};border:1px solid ${C.rule};padding:10px 14px;">
          <tr>
            <td style="font-family:'Courier New',Courier,monospace;font-size:11px;line-height:1.6;color:${C.muted};">
              ${parts.note ? `<div style="color:${C.inkSoft};margin-bottom:4px;">&#9632; ${escapeHtml(parts.note)}</div>` : ""}
              <div>${escapeHtml(parts.source)}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;

  const html = renderMailFrame({
    lang: parts.lang,
    docCode: isTr ? "BM-ALARM · BİLDİRİM" : "BM-ALERT · SUCHAUFTRAG",
    eyebrow: isTr ? "Kayıtlı Arama Bildirimi" : "Benachrichtigung zu Ihren Such-Alerts",
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
