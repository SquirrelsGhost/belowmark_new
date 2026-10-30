import { rgb } from "pdf-lib";

/** Font files embedded in the invoice PDF (OFL, licences next to them). Subset on embed, so only used glyphs ship. */
export const INVOICE_FONT_FILES = {
  display: "ArchivoExtraCondensed-ExtraBold.ttf",
  narrow: "ArchivoCondensed-SemiBold.ttf",
  sans: "Archivo-Regular.ttf",
  mono: "IBMPlexMono-Regular.ttf",
} as const;

export type InvoiceFontKey = keyof typeof INVOICE_FONT_FILES;

/** Folder of the font files, relative to the project root. */
export const INVOICE_FONT_DIR = ["src", "assets", "fonts", "invoice"] as const;

/** "Amtlicher Aushang" on A4: ink, one signal red, muted grey; white paper so it prints clean. */
export const PDF_COLORS = {
  ink: rgb(0x12 / 255, 0x11 / 255, 0x0f / 255),
  inkSoft: rgb(0x3b / 255, 0x39 / 255, 0x33 / 255),
  muted: rgb(0x6e / 255, 0x69 / 255, 0x5e / 255),
  rule: rgb(0.84, 0.83, 0.8),
  signal: rgb(0xc8 / 255, 0x36 / 255, 0x2b / 255),
  paper: rgb(0xf7 / 255, 0xf4 / 255, 0xee / 255),
  watermark: rgb(0.96, 0.86, 0.84),
};

/** A4 in PostScript points and the type area. */
export const PDF_PAGE = { width: 595.28, height: 841.89, margin: 56 } as const;

/** Left edge of the right-hand column (facts, totals). */
export const PDF_RIGHT_COLUMN = 300;
