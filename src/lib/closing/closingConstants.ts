import { HearingOutcome, ResultSource, ClosingDateField, ClosingCondition, ClosingPhase } from "@/types/closing.types";
import { MarketCode } from "@/lib/constants";

/**
 * Constants of the after-Zuschlag task list and the hearing results. Kept apart
 * from appConstants.ts so this feature can change on its own.
 */

export const CLOSING_ROUTES = {
  /** Task list of one proceeding */
  tasks: "/app/zuschlag",
  /** Statistics of reported hearing results */
  results: "/app/ergebnisse",
} as const;

export const closingHref = (key: string): string => `${CLOSING_ROUTES.tasks}/${encodeURIComponent(key)}`;

export const HEARING_OUTCOMES: HearingOutcome[] = ["awarded", "refused", "pending", "noBids", "cancelled"];

export const RESULT_SOURCES: ResultSource[] = ["attended", "protocol", "court"];

export const CLOSING_PHASES: ClosingPhase[] = ["first", "payment", "register", "possession", "works"];

/** Case dates the user can enter, per market. TR has no Verteilungstermin and no separate tax notice. */
export const CLOSING_DATE_FIELDS: Record<MarketCode, ClosingDateField[]> = {
  DE: ["awardDate", "distributionDate", "taxNoticeDate", "handoverDate"],
  TR: ["awardDate", "handoverDate"],
};

export const CLOSING_CONDITIONS: ClosingCondition[] = ["tenant", "ownerOccupied", "condo", "house"];

/** localStorage key of the situation answers (tenant? owner lives there?) — a convenience, not a record. */
export const CLOSING_CONDITIONS_STORAGE = "belowmark:nachzuschlag-lage:";

/**
 * Smallest group the statistics show figures for. Below it a single entry
 * could be traced back to one proceeding — and five entries are no price level.
 */
export const PRICE_STATS_MIN_GROUP = 5;

/** Plausibility bounds of a reported bid against the appraised value (0,1 % … 1.000 %). */
export const RESULT_RATIO_BOUNDS = { min: 0.001, max: 10 } as const;

export const RESULT_LIMITS = {
  maxBidders: 500,
  /** Results can be reported from the day of the hearing up to this many days later */
  maxDaysAfter: 365 * 3,
} as const;

/** Tasks due within this many days count as "soon". */
export const CLOSING_SOON_DAYS = 7;

export const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
