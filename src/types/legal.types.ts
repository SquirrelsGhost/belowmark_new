/** A legal page as data: rendered on the site and, as plain text, in the order confirmation mail. */
export interface LegalSection {
  id: string;
  heading: string;
  /** Paragraphs; "⟨…⟩" marks a gap the operator still has to fill */
  paragraphs: string[];
  /** Label/value pairs (Impressum) */
  facts?: { label: string; value: string }[];
}

export interface LegalDocument {
  title: string;
  /** "Stand 26. Oktober 2026" */
  asOf: string;
  basis: string;
  sections: LegalSection[];
}

/** Marker of an unfilled gap in a legal text. */
export const LEGAL_GAP = /⟨[^⟩]*⟩/;
