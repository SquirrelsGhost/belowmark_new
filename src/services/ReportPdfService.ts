import "server-only";
import { extractText, getDocumentProxy } from "unpdf";
import { cleanPageText } from "@/lib/report/reportText";

export interface PdfPages {
  pageCount: number;
  /** Cleaned text per page, index 0 = page 1; "" for pages without a text layer */
  pages: string[];
}

/**
 * ReportPdfService
 *
 * Reads the text layer of a PDF page by page. Scanned Gutachten without a text
 * layer give empty pages — they are reported as unreadable, not guessed (no OCR).
 */
export class ReportPdfService {
  static readPages = async (bytes: Uint8Array): Promise<PdfPages> => {
    const pdf = await getDocumentProxy(bytes);
    const { totalPages, text } = await extractText(pdf, { mergePages: false });
    return { pageCount: totalPages, pages: text.map(cleanPageText) };
  };

  /** "%PDF-" at the start — the browser's MIME type alone is not trusted. */
  static looksLikePdf = (bytes: Uint8Array): boolean => {
    return bytes.length > 5 && String.fromCharCode(...bytes.slice(0, 5)) === "%PDF-";
  };
}
