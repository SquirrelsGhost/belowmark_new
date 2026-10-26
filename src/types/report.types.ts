/**
 * Gutachten reader and risk check.
 *
 * Every statement carries the place it was read from: a page of the uploaded
 * Gutachten or a field of the official notice. What no source states is not
 * guessed — it stays "unknown".
 */

/** What a passage of the Gutachten is about. */
export type ReportTopic = "defects" | "rights" | "charges" | "tenancy" | "contamination" | "heritage" | "leasehold" | "inspection";

/** Finer subject inside a topic — the risk check keys on these. */
export type ReportKind =
  | "residence"
  | "usufruct"
  | "easement"
  | "preemption"
  | "rightsGeneral"
  | "charges"
  | "tenancy"
  | "defects"
  | "contamination"
  | "heritage"
  | "leasehold"
  | "inspection";

/** Does the passage say the thing exists, does not exist, or leaves it open? */
export type FindingStance = "present" | "absent" | "unclear";

/** Who found the passage: the fixed rules, or Claude (quote checked against the page text). */
export type FindingOrigin = "rules" | "ai";

export interface ReportFinding {
  topic: ReportTopic;
  kind: ReportKind;
  stance: FindingStance;
  /** Verbatim text from the page (whitespace normalised, "…" marks a cut) */
  quote: string;
  /** 1-based page number in the PDF */
  page: number;
  origin: FindingOrigin;
  /** Claude's one-line reading of the quote; never shown without the quote */
  note?: string;
}

export type ReportFactKey = "marketValue" | "valuationDate" | "yearBuilt" | "livingArea" | "plotArea";

/** A key figure as printed in the Gutachten, never recalculated. */
export interface ReportFact {
  key: ReportFactKey;
  value: string;
  quote: string;
  page: number;
}

export type ReportLanguage = "de" | "tr";

export interface GutachtenReport {
  /** sha256 of the PDF, shortened — the same file is not analysed twice */
  id: string;
  listingKey: string;
  fileName: string;
  pageCount: number;
  /** Pages that carried readable text; scanned pages without OCR count as missing */
  textPageCount: number;
  analyzedAt: string;
  language: ReportLanguage;
  method: "rules" | "rules+ai";
  /** Quotes Claude returned that were not found on the cited page and were dropped */
  droppedAiQuotes: number;
  findings: ReportFinding[];
  facts: ReportFact[];
}

/** The five risks of the traffic light. */
export type RiskKey = "residence" | "usufruct" | "tenancy" | "heritage" | "leasehold";

export type RiskLevel = "red" | "yellow" | "green" | "unknown";

export interface RiskEvidence {
  source: "notice" | "report";
  stance: FindingStance;
  quote: string;
  /** Page of the Gutachten; null for the notice */
  page: number | null;
  /** Link to the official notice; null for the Gutachten (it lives only with the user) */
  url: string | null;
}

export interface RiskItem {
  key: RiskKey;
  level: RiskLevel;
  /** Sources contradict each other (one says present, another absent) */
  conflicting: boolean;
  evidence: RiskEvidence[];
}

export interface RiskCheck {
  items: RiskItem[];
  /** Whether a Gutachten was part of the check */
  withReport: boolean;
}
