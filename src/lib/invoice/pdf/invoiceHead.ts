import { InvoiceDocument, InvoiceText } from "@/lib/invoice/invoiceDocument";
import { INVOICE_TEXT } from "@/lib/invoice/invoiceText";
import { PdfCanvas, TextStyle } from "@/lib/invoice/pdf/pdfCanvas";
import { PDF_COLORS, PDF_PAGE, PDF_RIGHT_COLUMN } from "@/lib/invoice/pdf/invoicePdfTheme";

const LEFT = PDF_PAGE.margin;
const RIGHT = PDF_PAGE.width - PDF_PAGE.margin;
const LABEL: TextStyle = { font: "mono", size: 6.5, color: PDF_COLORS.muted, tracking: 1.1 };
/** Top of the red market line — everything that matters sits below it. */
export const MARKET_LINE_TOP = 168;

/** Wordmark with the red market line above it, as in the site's masthead. */
function brand(canvas: PdfCanvas): void {
  const wordmark: TextStyle = { font: "display", size: 19, tracking: 2.2 };
  const width = canvas.width("BELOWMARK", wordmark);
  canvas.rect(LEFT, 50, width, 1.8, { fill: PDF_COLORS.signal });
  canvas.text("BELOWMARK", LEFT, 70, wordmark);
  canvas.textRight(INVOICE_TEXT.Footer.Web.toUpperCase(), RIGHT, 68, LABEL);
}

/** "RECHNUNG" above the line, the number beside it, the line itself with its label and the object dot below. */
function title(canvas: PdfCanvas, doc: InvoiceDocument): void {
  canvas.text((doc.isTest ? INVOICE_TEXT.TestTitle : INVOICE_TEXT.Title).toUpperCase(), LEFT - 2, 150, { font: "display", size: 58 });
  canvas.textRight(INVOICE_TEXT.Facts.Number.toUpperCase(), RIGHT, 128, LABEL);
  canvas.textRight(doc.number, RIGHT, 147, { font: "mono", size: 13 });
  canvas.rect(LEFT, MARKET_LINE_TOP, RIGHT - LEFT, 2.6, { fill: PDF_COLORS.signal });
  canvas.textRight(INVOICE_TEXT.MarketLine.toUpperCase(), RIGHT, MARKET_LINE_TOP - 5, { ...LABEL, color: PDF_COLORS.signal });
  canvas.dot(RIGHT - 4, MARKET_LINE_TOP + 12, 3.2);
}

function line(canvas: PdfCanvas, part: InvoiceText, top: number, maxWidth: number): number {
  const style: TextStyle = { font: part.gap ? "narrow" : "sans", size: part.gap ? 9.5 : 10.5, color: part.gap ? PDF_COLORS.signal : PDF_COLORS.ink };
  return canvas.paragraph(part.text, LEFT, top, maxWidth, style, 14.5);
}

/** Sender line, recipient on the left; ledger of invoice facts on the right. */
function parties(canvas: PdfCanvas, doc: InvoiceDocument): number {
  const columnWidth = PDF_RIGHT_COLUMN - LEFT - 28;
  canvas.paragraph(doc.senderLine, LEFT, 200, columnWidth, { font: "mono", size: 6.5, color: PDF_COLORS.muted }, 9);
  canvas.rule(LEFT, LEFT + columnWidth, 214);
  canvas.text(INVOICE_TEXT.RecipientLabel.toUpperCase(), LEFT, 230, LABEL);
  let top = 248;
  for (const part of doc.recipient) top = line(canvas, part, top, columnWidth);

  let factTop = 200;
  canvas.rule(PDF_RIGHT_COLUMN, RIGHT, factTop - 10, 0.5);
  for (const fact of doc.facts) {
    canvas.text(fact.label.toUpperCase(), PDF_RIGHT_COLUMN, factTop + 4, LABEL);
    canvas.textRight(fact.value.text, RIGHT, factTop + 4, {
      font: fact.value.gap ? "narrow" : "mono",
      size: 8.5,
      color: fact.value.gap ? PDF_COLORS.signal : PDF_COLORS.ink,
    });
    canvas.rule(PDF_RIGHT_COLUMN, RIGHT, factTop + 12);
    factTop += 22;
  }
  return Math.max(top, factTop) + 18;
}

/** Diagonal watermark across a test document, so it can never pass as an invoice. Drawn first, everything prints over it. */
export function drawTestWatermark(canvas: PdfCanvas): void {
  canvas.text(INVOICE_TEXT.TestWatermark, 96, 700, { font: "display", size: 46, color: PDF_COLORS.watermark, tracking: 1 }, 38);
}

/** Banner under the parties that says what this document is. */
function testBanner(canvas: PdfCanvas, top: number): number {
  canvas.rect(LEFT, top, RIGHT - LEFT, 26, { fill: PDF_COLORS.paper, border: PDF_COLORS.signal, borderWidth: 0.8 });
  canvas.text(INVOICE_TEXT.TestBanner, LEFT + 10, top + 16, { font: "narrow", size: 8.5, color: PDF_COLORS.signal });
  return top + 42;
}

/** Brand, title, market line and both parties. Returns the top where the item table starts. */
export function drawInvoiceHead(canvas: PdfCanvas, doc: InvoiceDocument): number {
  brand(canvas);
  title(canvas, doc);
  const top = parties(canvas, doc);
  return doc.isTest ? testBanner(canvas, top) : top;
}
