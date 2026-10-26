import { MarketCode } from "@/lib/constants";
import { FindingStance, RiskKey, RiskLevel } from "@/types/report.types";
import { HearingState } from "@/types/listing.types";

/**
 * The verdict "bid or leave it" for one proceeding.
 *
 * It is built only from what a source states — the official notice, the
 * uploaded Gutachten, statute — and from what the bidder entered or answered.
 * What none of them states stays open and keeps the verdict from saying "bid".
 */

/** go: bid up to the limit · open: not ready, points missing · stop: do not bid · none: nothing to judge */
export type VerdictState = "go" | "open" | "stop" | "none";

/** Where a reason comes from. Every reason carries at least one. */
export type VerdictSource =
  | { kind: "notice"; url: string }
  | { kind: "report"; page: number }
  | { kind: "input" }
  | { kind: "answer" }
  | { kind: "law"; ref: string; url: string }
  | { kind: "rule" };

export type VerdictReasonCode =
  // none
  | "noValue"
  | "cancelled"
  | "past"
  // stop
  | "unreachable"
  | "belowStart"
  | "belowHalf"
  | "rightStays"
  // gap — must be closed before the verdict can say "bid"
  | "noTargets"
  | "noReport"
  | "noRenovation"
  | "noClearance"
  | "askInspection"
  | "askOccupancy"
  | "askRights"
  | "rightsOpen"
  | "askCostBasis"
  | "costsIncomplete"
  | "contamination"
  // caution — stays visible next to "bid"
  | "rightPriced"
  | "notInside"
  | "reportOutsideOnly"
  | "estimateOnly"
  | "defects"
  | "tenant"
  | "heritage"
  | "easement"
  | "contaminationUnclear"
  | "oldValuation"
  | "valueMismatch"
  | "sevenTenths"
  | "atCeiling"
  | "conflicting"
  // ok — why the verdict can say "bid"
  | "limitBy"
  | "legalClear"
  | "limitsWaived"
  | "rightsClear";

export type VerdictSeverity = "none" | "stop" | "gap" | "caution" | "ok";

export interface VerdictReason {
  code: VerdictReasonCode;
  severity: VerdictSeverity;
  /** The risk a rights reason is about */
  risk?: RiskKey;
  /** Amount in the market's currency (limit, retained right, value) */
  amount?: number;
  /** Second amount (e.g. the value of the notice next to the Gutachten's) */
  other?: number;
  /** Whole years (age of the valuation) */
  years?: number;
  /** Bid-limit criterion that decides */
  criterion?: "yield" | "cashflow" | "resale";
  /** Where the point is closed, when it depends on the bidder's answers */
  action?: "limit" | "report" | "questions";
  /** Verbatim text of the source */
  quote?: string;
  sources: VerdictSource[];
}

/** A passage of the Gutachten: verbatim text and its page. */
export interface VerdictQuote {
  quote: string;
  page: number;
  stance: FindingStance;
}

/** One row of the risk check, reduced to what the verdict needs. */
export interface VerdictRisk {
  key: RiskKey;
  level: RiskLevel;
  conflicting: boolean;
  /** The source that carries the level — null when no source says anything */
  quote: string | null;
  source: VerdictSource | null;
}

/**
 * Everything the server knows about a proceeding for the verdict: notice,
 * Gutachten and risk check. Plain data, so it can go to the browser where the
 * bidder's own figures live.
 */
export interface VerdictEvidence {
  market: MarketCode;
  hearing: HearingState;
  hasValue: boolean;
  noticeUrl: string;
  hasReport: boolean;
  risks: VerdictRisk[];
  defects: VerdictQuote | null;
  contamination: VerdictQuote | null;
  /** The Gutachten says the appraiser could not go inside */
  reportOutsideOnly: VerdictQuote | null;
  easement: VerdictQuote | null;
  /** Full years between the valuation date and the hearing (or today) */
  valuationAgeYears: number | null;
  valuationQuote: VerdictQuote | null;
  /** Market value as printed in the Gutachten, when it reads as a number */
  reportValue: number | null;
  reportValueQuote: VerdictQuote | null;
  /** Appraised value of the notice */
  noticeValue: number | null;
}

/** The bidder's own answers to what no document can tell. null = not answered yet. */
export interface VerdictAnswers {
  inspection: "inside" | "outside" | "none" | null;
  rights: "confirmed" | "open" | null;
  occupancy: "vacant" | "owner" | "tenant" | "unknown" | null;
  costBasis: "quote" | "estimate" | null;
}

export type VerdictAnswerKey = keyof VerdictAnswers;

/** What-if: renovation and clearance cost more than entered. */
export interface VerdictStressCase {
  pct: number;
  limit: number | "unreachable" | null;
  /** The stressed limit falls below the legal threshold of the hearing */
  belowThreshold: boolean;
}

export interface Verdict {
  state: VerdictState;
  /** Bid limit the verdict speaks of — for "open" it is provisional */
  limit: number | null;
  reasons: VerdictReason[];
  stress: VerdictStressCase[];
  /** Renovation figure rests on neither an inspection inside nor a quote */
  costsUnverified: boolean;
}
