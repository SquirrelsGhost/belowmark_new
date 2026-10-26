import { LegalDocument, LEGAL_GAP } from "../../types/legal.types";
import { IMPRINT_DE } from "./de/imprintDe";
import { PRIVACY_DE } from "./de/privacyDe";
import { termsDe } from "./de/termsDe";
import { WITHDRAWAL_DE } from "./de/withdrawalDe";

export type LegalDocumentKey = "imprint" | "terms" | "withdrawal" | "privacy";

/**
 * The legal pages exist in German only: that is the binding version for the
 * German market. Turkish visitors get a short note in Turkish on top
 * (see ILegalTranslation.TurkishNote) instead of an unchecked translation.
 */
export function legalDocument(key: LegalDocumentKey, vatMode: "inclusive" | "kleinunternehmer" | null): LegalDocument {
  switch (key) {
    case "imprint":
      return IMPRINT_DE;
    case "terms":
      return termsDe(vatMode);
    case "withdrawal":
      return WITHDRAWAL_DE;
    case "privacy":
      return PRIVACY_DE;
  }
}

/** Every gap ⟨…⟩ still open in the documents — listed on the order page for the operator in test mode. */
export function openLegalGaps(vatMode: "inclusive" | "kleinunternehmer" | null): string[] {
  const keys: LegalDocumentKey[] = ["imprint", "terms", "withdrawal", "privacy"];
  return keys.flatMap((key) => {
    const doc = legalDocument(key, vatMode);
    return doc.sections.flatMap((section) =>
      [...section.paragraphs, ...(section.facts ?? []).map((fact) => fact.value)]
        .filter((text) => LEGAL_GAP.test(text))
        .map(() => `${doc.title} · ${section.heading}`),
    );
  });
}

/** Plain-text version for e-mails (durable medium for AGB and Widerrufsbelehrung). */
export function legalDocumentText(doc: LegalDocument): string {
  const lines = [doc.title.toUpperCase(), doc.asOf, ""];
  for (const section of doc.sections) {
    lines.push(section.heading, "");
    for (const fact of section.facts ?? []) lines.push(`${fact.label}: ${fact.value}`);
    for (const paragraph of section.paragraphs) lines.push(paragraph, "");
  }
  return lines.join("\n");
}
