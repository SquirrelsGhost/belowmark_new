import { InvoiceDocument } from "@/lib/invoice/invoiceDocument";
import { INVOICE_TEXT } from "@/lib/invoice/invoiceText";
import { PdfCanvas, TextStyle } from "@/lib/invoice/pdf/pdfCanvas";
import { PDF_COLORS, PDF_PAGE } from "@/lib/invoice/pdf/invoicePdfTheme";

const LEFT = PDF_PAGE.margin;
const RIGHT = PDF_PAGE.width - PDF_PAGE.margin;
const FOOT_TOP = PDF_PAGE.height - 112;
const LABEL: TextStyle = { font: "mono", size: 6, color: PDF_COLORS.muted, tracking: 1 };

/** Provider, contact and tax details in three columns under an ink rule, like the foot of a notice. */
export function drawInvoiceFoot(canvas: PdfCanvas, doc: InvoiceDocument): void {
  canvas.rule(LEFT, RIGHT, FOOT_TOP, 1, PDF_COLORS.ink);
  const columnWidth = (RIGHT - LEFT) / doc.footer.length;
  doc.footer.forEach((column, index) => {
    const x = LEFT + index * columnWidth;
    canvas.text(column.title.toUpperCase(), x, FOOT_TOP + 16, LABEL);
    let top = FOOT_TOP + 30;
    for (const part of column.lines) {
      const style: TextStyle = part.gap
        ? { font: "narrow", size: 7.5, color: PDF_COLORS.signal }
        : { font: "sans", size: 7.5, color: PDF_COLORS.inkSoft };
      top = canvas.paragraph(part.text, x, top, columnWidth - 14, style, 10.5);
    }
  });
  const page = INVOICE_TEXT.Page.replace("{page}", "1").replace("{pages}", "1");
  canvas.text(doc.number, LEFT, PDF_PAGE.height - 28, { ...LABEL, color: PDF_COLORS.muted });
  canvas.textRight(page.toUpperCase(), RIGHT, PDF_PAGE.height - 28, LABEL);
  canvas.rect(RIGHT - 22, PDF_PAGE.height - 42, 22, 1.4, { fill: PDF_COLORS.signal });
}
