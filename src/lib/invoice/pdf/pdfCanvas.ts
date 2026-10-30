import { degrees, PDFFont, PDFPage, popGraphicsState, pushGraphicsState, RGB, setCharacterSpacing } from "pdf-lib";
import { InvoiceFontKey, PDF_COLORS, PDF_PAGE } from "@/lib/invoice/pdf/invoicePdfTheme";

export interface TextStyle {
  font: InvoiceFontKey;
  size: number;
  color?: RGB;
  /** Letter spacing in points (tracked capitals, like the labels on the site) */
  tracking?: number;
}

/**
 * Thin layer over a pdf-lib page that measures from the top edge (as a
 * designer reads a page) and knows the four invoice fonts.
 */
export class PdfCanvas {
  constructor(
    readonly page: PDFPage,
    private readonly fonts: Record<InvoiceFontKey, PDFFont>,
  ) {}

  /** Width of a string in this style, tracking included. */
  width(text: string, style: TextStyle): number {
    const tracking = (style.tracking ?? 0) * Math.max(0, [...text].length - 1);
    return this.fonts[style.font].widthOfTextAtSize(text, style.size) + tracking;
  }

  /** Text with its baseline `top` points below the page's top edge. */
  text(text: string, x: number, top: number, style: TextStyle, rotate = 0): void {
    const tracked = Boolean(style.tracking);
    if (tracked) this.page.pushOperators(pushGraphicsState(), setCharacterSpacing(style.tracking ?? 0));
    this.page.drawText(text, {
      x,
      y: PDF_PAGE.height - top,
      size: style.size,
      font: this.fonts[style.font],
      color: style.color ?? PDF_COLORS.ink,
      rotate: rotate ? degrees(rotate) : undefined,
    });
    if (tracked) this.page.pushOperators(popGraphicsState());
  }

  /** Text that ends at `right`. */
  textRight(text: string, right: number, top: number, style: TextStyle): void {
    this.text(text, right - this.width(text, style), top, style);
  }

  /** Splits text into lines no wider than `maxWidth`. */
  wrap(text: string, maxWidth: number, style: TextStyle): string[] {
    const lines: string[] = [];
    let current = "";
    for (const word of text.split(/\s+/).filter(Boolean)) {
      const next = current ? `${current} ${word}` : word;
      if (current && this.width(next, style) > maxWidth) {
        lines.push(current);
        current = word;
      } else {
        current = next;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  /** Wrapped paragraph; returns the top of the line after it. */
  paragraph(text: string, x: number, top: number, maxWidth: number, style: TextStyle, leading = style.size * 1.4): number {
    const lines = this.wrap(text, maxWidth, style);
    lines.forEach((line, index) => this.text(line, x, top + index * leading, style));
    return top + lines.length * leading;
  }

  /** Horizontal rule. */
  rule(x1: number, x2: number, top: number, thickness = 0.5, color: RGB = PDF_COLORS.rule): void {
    this.page.drawLine({ start: { x: x1, y: PDF_PAGE.height - top }, end: { x: x2, y: PDF_PAGE.height - top }, thickness, color });
  }

  /** Filled or outlined rectangle; `top` is its upper edge. */
  rect(x: number, top: number, width: number, height: number, options: { fill?: RGB; border?: RGB; borderWidth?: number; rotate?: number }): void {
    this.page.drawRectangle({
      x,
      y: PDF_PAGE.height - top - height,
      width,
      height,
      color: options.fill,
      borderColor: options.border,
      borderWidth: options.border ? (options.borderWidth ?? 1) : 0,
      rotate: options.rotate ? degrees(options.rotate) : undefined,
    });
  }

  /** Filled circle (the object dot of the mark). */
  dot(x: number, top: number, radius: number, color: RGB = PDF_COLORS.ink): void {
    this.page.drawCircle({ x, y: PDF_PAGE.height - top, size: radius, color });
  }
}
