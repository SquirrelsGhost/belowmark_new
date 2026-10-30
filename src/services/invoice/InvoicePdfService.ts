import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, PDFFont } from "pdf-lib";
import { BillingInvoice } from "@/db/schema";
import { buildInvoiceDocument } from "@/lib/invoice/invoiceDocument";
import { INVOICE_TEXT } from "@/lib/invoice/invoiceText";
import { drawInvoiceBody } from "@/lib/invoice/pdf/invoiceBody";
import { drawInvoiceFoot } from "@/lib/invoice/pdf/invoiceFoot";
import { drawInvoiceHead, drawTestWatermark } from "@/lib/invoice/pdf/invoiceHead";
import { INVOICE_FONT_FILES, InvoiceFontKey, PDF_PAGE } from "@/lib/invoice/pdf/invoicePdfTheme";
import { PdfCanvas } from "@/lib/invoice/pdf/pdfCanvas";
import { LEGAL_OPERATOR } from "@/lib/legal/legalOperator";

const FONT_KEYS = Object.keys(INVOICE_FONT_FILES) as InvoiceFontKey[];

/** Font bytes are read once per server process. */
let fontBytes: Promise<Record<InvoiceFontKey, Uint8Array>> | null = null;

function loadFontBytes(): Promise<Record<InvoiceFontKey, Uint8Array>> {
  fontBytes ??= Promise.all(
    FONT_KEYS.map((key) => readFile(join(process.cwd(), "src", "assets", "fonts", "invoice", INVOICE_FONT_FILES[key]))),
  ).then(
    (files) => Object.fromEntries(FONT_KEYS.map((key, index) => [key, new Uint8Array(files[index])])) as Record<InvoiceFontKey, Uint8Array>,
  );
  return fontBytes;
}

/**
 * InvoicePdfService
 *
 * Renders an issued invoice as a one-page A4 PDF in the site's look:
 * wordmark, red market line, ledger rows, stamp. Rendered on request from
 * the frozen row, so the same invoice always prints the same content.
 */
export class InvoicePdfService {
  static render = async (invoice: BillingInvoice): Promise<Uint8Array> => {
    const doc = buildInvoiceDocument(invoice);
    const pdf = await PDFDocument.create();
    pdf.registerFontkit(fontkit);
    const bytes = await loadFontBytes();
    const embedded = await Promise.all(FONT_KEYS.map((key) => pdf.embedFont(bytes[key], { subset: true })));
    const fonts = Object.fromEntries(FONT_KEYS.map((key, index) => [key, embedded[index]])) as Record<InvoiceFontKey, PDFFont>;

    const title = `${doc.isTest ? INVOICE_TEXT.TestTitle : INVOICE_TEXT.Title} ${doc.number}`;
    pdf.setTitle(title);
    pdf.setAuthor(LEGAL_OPERATOR.business);
    pdf.setSubject(doc.item.title);
    pdf.setCreator("Belowmark");
    pdf.setProducer("Belowmark");
    pdf.setLanguage("de-DE");
    pdf.setCreationDate(invoice.issuedAt);
    pdf.setModificationDate(invoice.issuedAt);

    const canvas = new PdfCanvas(pdf.addPage([PDF_PAGE.width, PDF_PAGE.height]), fonts);
    if (doc.isTest) drawTestWatermark(canvas);
    const bodyTop = drawInvoiceHead(canvas, doc);
    drawInvoiceBody(canvas, doc, bodyTop);
    drawInvoiceFoot(canvas, doc);
    return pdf.save();
  };

  /** "belowmark-rechnung-BM-2026-00001.pdf" */
  static fileName = (invoice: BillingInvoice): string => INVOICE_TEXT.FileName.replace("{number}", invoice.number);
}
