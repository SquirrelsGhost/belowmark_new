import { LocaleOption } from "@/lib/constants";
import { LegalDocument, LEGAL_GAP } from "../../types/legal.types";
import { IMPRINT_DE } from "./de/imprintDe";
import { PRIVACY_DE } from "./de/privacyDe";
import { termsDe } from "./de/termsDe";
import { WITHDRAWAL_DE } from "./de/withdrawalDe";
import { IMPRINT_EN } from "./en/imprintEn";
import { PRIVACY_EN } from "./en/privacyEn";
import { termsEn } from "./en/termsEn";
import { WITHDRAWAL_EN } from "./en/withdrawalEn";
import { IMPRINT_ES } from "./es/imprintEs";
import { PRIVACY_ES } from "./es/privacyEs";
import { termsEs } from "./es/termsEs";
import { WITHDRAWAL_ES } from "./es/withdrawalEs";
import { IMPRINT_FR } from "./fr/imprintFr";
import { PRIVACY_FR } from "./fr/privacyFr";
import { termsFr } from "./fr/termsFr";
import { WITHDRAWAL_FR } from "./fr/withdrawalFr";
import { IMPRINT_IT } from "./it/imprintIt";
import { PRIVACY_IT } from "./it/privacyIt";
import { termsIt } from "./it/termsIt";
import { WITHDRAWAL_IT } from "./it/withdrawalIt";
import { IMPRINT_TR } from "./tr/imprintTr";
import { PRIVACY_TR } from "./tr/privacyTr";
import { termsTr } from "./tr/termsTr";
import { WITHDRAWAL_TR } from "./tr/withdrawalTr";

export type LegalDocumentKey = "imprint" | "terms" | "withdrawal" | "privacy";

/** Returns the localized legal document for DE, TR, EN, IT, ES or FR. */
export function legalDocument(
  key: LegalDocumentKey,
  vatMode: "inclusive" | "kleinunternehmer" | null,
  lang: LocaleOption = "de",
): LegalDocument {
  switch (key) {
    case "imprint":
      if (lang === "tr") return IMPRINT_TR;
      if (lang === "en") return IMPRINT_EN;
      if (lang === "it") return IMPRINT_IT;
      if (lang === "es") return IMPRINT_ES;
      if (lang === "fr") return IMPRINT_FR;
      return IMPRINT_DE;
    case "terms":
      if (lang === "tr") return termsTr(vatMode);
      if (lang === "en") return termsEn(vatMode);
      if (lang === "it") return termsIt(vatMode);
      if (lang === "es") return termsEs(vatMode);
      if (lang === "fr") return termsFr(vatMode);
      return termsDe(vatMode);
    case "withdrawal":
      if (lang === "tr") return WITHDRAWAL_TR;
      if (lang === "en") return WITHDRAWAL_EN;
      if (lang === "it") return WITHDRAWAL_IT;
      if (lang === "es") return WITHDRAWAL_ES;
      if (lang === "fr") return WITHDRAWAL_FR;
      return WITHDRAWAL_DE;
    case "privacy":
      if (lang === "tr") return PRIVACY_TR;
      if (lang === "en") return PRIVACY_EN;
      if (lang === "it") return PRIVACY_IT;
      if (lang === "es") return PRIVACY_ES;
      if (lang === "fr") return PRIVACY_FR;
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
