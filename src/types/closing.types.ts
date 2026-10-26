import { MarketCode } from "@/lib/constants";
import { SegmentKey } from "@/lib/snapshot";

/**
 * What happened at a hearing, as a participant reports it. The portals publish
 * no results, so every field is the user's own entry.
 * awarded: Zuschlag erteilt / ihale yapıldı · refused: Zuschlag versagt (e.g. § 85a ZVG) ·
 * pending: decision put off to a later Verkündungstermin · noBids: nobody bid · cancelled: hearing did not take place
 */
export type HearingOutcome = "awarded" | "refused" | "pending" | "noBids" | "cancelled";

/** Where the user has the figures from. */
export type ResultSource = "attended" | "protocol" | "court";

/** One reported hearing result — anonymous: no names of bidders, buyers or owners. */
export interface HearingResult {
  listingKey: string;
  market: MarketCode;
  /** yyyy-mm-dd */
  hearingDate: string;
  outcome: HearingOutcome;
  /** Meistgebot (Bargebot) / ihale bedeli */
  highestBid: number | null;
  /** DE: bestehen bleibende Rechte that come on top of the cash bid */
  retainedRights: number | null;
  bidderCount: number | null;
  source: ResultSource;
  /** The user received the Zuschlag themselves — private, never part of the statistics */
  isBuyer: boolean;
  /** May the result count in the anonymous statistics */
  shared: boolean;
}

/** The fields of a result that come from the notice, frozen at the time of the entry. */
export interface HearingResultListingFacts {
  regionCode: string | null;
  segment: SegmentKey;
  appraisedValue: number | null;
}

/** Dates of the buyer's own case that the task list counts from. All yyyy-mm-dd or null. */
export interface ClosingDates {
  /** DE: Verkündung des Zuschlags · TR: ilan of the artırma sonuç tutanağı */
  awardDate: string | null;
  /** DE: Verteilungstermin · TR: not used */
  distributionDate: string | null;
  /** DE: Bekanntgabe des Grunderwerbsteuerbescheids · TR: not used */
  taxNoticeDate: string | null;
  /** Day the keys were handed over / the property was vacated */
  handoverDate: string | null;
}

export type ClosingDateField = keyof ClosingDates;

/** The buyer's case after the Zuschlag: dates and ticked tasks. */
export interface ClosingCase {
  listingKey: string;
  market: MarketCode;
  dates: ClosingDates;
  done: string[];
  updatedAt: Date;
}

export type ClosingPhase = "first" | "payment" | "register" | "possession" | "works";

/** How far a statement is backed: the law itself, the official procedure, or a belowmark rule of thumb. */
export type ClosingBasis = "law" | "practice" | "rule";

export interface ClosingLawRef {
  label: string;
  href: string;
}

/** When a task's date is due: a number of days or months after one of the case dates. */
export interface ClosingDueRule {
  from: ClosingDateField;
  days?: number;
  months?: number;
  /** Then the first 3rd working day (Mon–Sat) of a month on or after that date — § 573c Abs. 1 BGB */
  thirdWorkday?: boolean;
  /** Shown as "spätestens" (deadline) or "frühestens" (earliest point, e.g. Rechtskraft) */
  kind: "deadline" | "earliest" | "on";
}

/** Situations a task only applies to — asked once at the top of the list. */
export type ClosingCondition = "tenant" | "ownerOccupied" | "condo" | "house";

export interface ClosingTaskDef {
  id: string;
  phase: ClosingPhase;
  basis: ClosingBasis;
  laws: ClosingLawRef[];
  due: ClosingDueRule | null;
  /** Shown only when the user said this applies */
  onlyIf?: ClosingCondition;
  /** The rule changed recently or is not settled — the text says what to check */
  check?: boolean;
  /** Days before the due date a reminder makes sense (Termin-Begleiter) */
  remindDays?: number[];
}

export type ClosingTaskState = "done" | "overdue" | "soon" | "open" | "undated";

export interface ScheduledClosingTask {
  def: ClosingTaskDef;
  /** yyyy-mm-dd, null if the date it counts from is not known yet */
  due: string | null;
  /** The case date that is missing for `due` */
  missing: ClosingDateField | null;
  state: ClosingTaskState;
}

/** One cell of the price statistics: region × segment. */
export interface PriceStatRow {
  regionCode: string | null;
  regionName: string;
  segment: SegmentKey | "all";
  /** Distinct hearings with an award and an appraised value */
  awarded: number;
  /** Distinct reported hearings of any outcome */
  reported: number;
  /** Quantiles of (bid + retained rights) / appraised value, in percent; null below the minimum group size */
  medianPct: number | null;
  p25Pct: number | null;
  p75Pct: number | null;
  /** Median number of bidders, null if too few gave it */
  medianBidders: number | null;
}

export interface PriceStats {
  market: MarketCode;
  rows: PriceStatRow[];
  total: PriceStatRow;
  minGroup: number;
}
