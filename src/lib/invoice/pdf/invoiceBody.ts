import { InvoiceDocument } from "@/lib/invoice/invoiceDocument";
import { INVOICE_TEXT } from "@/lib/invoice/invoiceText";
import { PdfCanvas, TextStyle } from "@/lib/invoice/pdf/pdfCanvas";
import { PDF_COLORS, PDF_PAGE, PDF_RIGHT_COLUMN } from "@/lib/invoice/pdf/invoicePdfTheme";

const LEFT = PDF_PAGE.margin;
const RIGHT = PDF_PAGE.width - PDF_PAGE.margin;
const LABEL: TextStyle = { font: "mono", size: 6.5, color: PDF_COLORS.muted, tracking: 1.1 };
const COLUMNS = { position: LEFT, service: LEFT + 34, quantity: RIGHT - 118 } as const;

/** One position: what was bought, for which period, at which price. */
function itemTable(canvas: PdfCanvas, doc: InvoiceDocument, top: number): number {
  canvas.rule(LEFT, RIGHT, top, 1.4, PDF_COLORS.ink);
  canvas.text(INVOICE_TEXT.Columns.Position.toUpperCase(), COLUMNS.position, top + 14, LABEL);
  canvas.text(INVOICE_TEXT.Columns.Service.toUpperCase(), COLUMNS.service, top + 14, LABEL);
  canvas.text(INVOICE_TEXT.Columns.Quantity.toUpperCase(), COLUMNS.quantity, top + 14, LABEL);
  canvas.textRight(INVOICE_TEXT.Columns.Amount.toUpperCase(), RIGHT, top + 14, LABEL);
  canvas.rule(LEFT, RIGHT, top + 22);

  const rowTop = top + 42;
  const serviceWidth = COLUMNS.quantity - COLUMNS.service - 24;
  canvas.text("01", COLUMNS.position, rowTop, { font: "mono", size: 9, color: PDF_COLORS.signal });
  canvas.text(doc.item.title, COLUMNS.service, rowTop, { font: "narrow", size: 13 });
  let next = canvas.paragraph(doc.item.detail, COLUMNS.service, rowTop + 16, serviceWidth, { font: "sans", size: 8.5, color: PDF_COLORS.inkSoft }, 12);
  canvas.text(doc.item.period, COLUMNS.service, next + 4, { font: "mono", size: 7.5, color: PDF_COLORS.muted });
  next += 4;
  canvas.text("1", COLUMNS.quantity, rowTop, { font: "mono", size: 9 });
  canvas.textRight(doc.item.amount, RIGHT, rowTop, { font: "mono", size: 10 });
  canvas.rule(LEFT, RIGHT, next + 14);
  return next + 14;
}

/** Net and VAT rows, the heavy rule, the total in display type and the VAT note. */
function totals(canvas: PdfCanvas, doc: InvoiceDocument, top: number): number {
  let rowTop = top + 22;
  for (const row of doc.totals) {
    canvas.text(row.label.toUpperCase(), PDF_RIGHT_COLUMN, rowTop, LABEL);
    canvas.textRight(row.value.text, RIGHT, rowTop, { font: "mono", size: 9 });
    rowTop += 18;
  }
  canvas.rule(PDF_RIGHT_COLUMN, RIGHT, rowTop - 6, 1.4, PDF_COLORS.ink);
  canvas.text(doc.total.label.toUpperCase(), PDF_RIGHT_COLUMN, rowTop + 20, { font: "narrow", size: 10, tracking: 0.8 });
  canvas.textRight(doc.total.value.text, RIGHT, rowTop + 22, { font: "display", size: 26 });
  const noteStyle: TextStyle = doc.vatNote.gap
    ? { font: "narrow", size: 8.5, color: PDF_COLORS.signal }
    : { font: "sans", size: 8, color: PDF_COLORS.inkSoft };
  return canvas.paragraph(doc.vatNote.text, PDF_RIGHT_COLUMN, rowTop + 42, RIGHT - PDF_RIGHT_COLUMN, noteStyle, 11);
}

/** Rubber stamp "BEZAHLT · date" with a double border, tilted like the stamps on the site. */
function paidStamp(canvas: PdfCanvas, doc: InvoiceDocument, top: number): number {
  const style: TextStyle = { font: "mono", size: 10, color: PDF_COLORS.signal, tracking: 2 };
  const label = doc.paidStamp.toUpperCase();
  const width = canvas.width(label, style) + 24;
  const tilt = 4;
  // Both frames and the text turn around one pivot (bottom left of the inner frame), so they stay concentric
  const pivot = { x: LEFT + 8, top: top + 66 };
  const turn = (dx: number, dy: number) => {
    const rad = (tilt * Math.PI) / 180;
    return { x: pivot.x + dx * Math.cos(rad) - dy * Math.sin(rad), top: pivot.top - (dx * Math.sin(rad) + dy * Math.cos(rad)) };
  };
  const inner = turn(0, 0);
  const outer = turn(-3.5, -3.5);
  const text = turn(12, 9.5);
  canvas.rect(inner.x, inner.top - 28, width, 28, { border: PDF_COLORS.signal, borderWidth: 1.6, rotate: tilt });
  canvas.rect(outer.x, outer.top - 35, width + 7, 35, { border: PDF_COLORS.signal, borderWidth: 0.5, rotate: tilt });
  canvas.text(label, text.x, text.top, style, tilt);
  return canvas.paragraph(doc.paidNote, LEFT, top + 96, PDF_RIGHT_COLUMN - LEFT - 40, { font: "sans", size: 8.5, color: PDF_COLORS.inkSoft }, 12);
}

/** Position, totals, stamp. */
export function drawInvoiceBody(canvas: PdfCanvas, doc: InvoiceDocument, top: number): number {
  const tableEnd = itemTable(canvas, doc, top);
  const totalsEnd = totals(canvas, doc, tableEnd);
  const stampEnd = paidStamp(canvas, doc, tableEnd);
  const end = Math.max(totalsEnd, stampEnd) + 26;
  canvas.text(INVOICE_TEXT.Thanks, LEFT, end, { font: "narrow", size: 10, color: PDF_COLORS.ink });
  return end;
}
