import { VerdictAnswerKey, VerdictAnswers } from "@/types/verdict.types";

/**
 * Constants of the verdict "bid or leave it". Kept apart from the bidding
 * constants so this feature can change on its own.
 */

/** localStorage key prefix of the bidder's answers, one entry per proceeding. */
export const VERDICT_STORAGE = "belowmark:urteil:";

export const verdictAnswersKey = (listingId: string) => `${VERDICT_STORAGE}${listingId}`;

/** Every answer starts open — the app never answers for the bidder. */
export const EMPTY_VERDICT_ANSWERS: VerdictAnswers = {
  inspection: null,
  rights: null,
  occupancy: null,
  costBasis: null,
};

/** Allowed answers per question, in display order. */
export const VERDICT_OPTIONS: { [K in VerdictAnswerKey]: NonNullable<VerdictAnswers[K]>[] } = {
  inspection: ["inside", "outside", "none"],
  rights: ["confirmed", "open"],
  occupancy: ["vacant", "owner", "tenant", "unknown"],
  costBasis: ["quote", "estimate"],
};

/**
 * belowmark rule, not statute: a valuation older than this is flagged, because
 * prices and condition may have moved since the valuation date.
 */
export const VALUATION_MAX_AGE_YEARS = 2;

/** Gutachten and notice value count as different above this share (rounding in the PDF). */
export const VALUE_MISMATCH_SHARE = 0.005;

/**
 * Stress test: the entered renovation and clearance costs raised by these
 * percentages. A what-if calculation, not an estimate of the real costs.
 */
export const STRESS_PCTS = [25, 50] as const;

/** Risks that can stay with the property after the Zuschlag and take use or value away. */
export const STAYING_RIGHTS = ["residence", "usufruct", "leasehold"] as const;

/** Statute the reasons point to. */
export const VERDICT_LAW = {
  zvg85a: { ref: "§ 85a ZVG", url: "https://www.gesetze-im-internet.de/zvg/__85a.html" },
  zvg74a: { ref: "§ 74a ZVG", url: "https://www.gesetze-im-internet.de/zvg/__74a.html" },
  zvg52: { ref: "§ 52 ZVG", url: "https://www.gesetze-im-internet.de/zvg/__52.html" },
  zvg57: { ref: "§ 57 ZVG", url: "https://www.gesetze-im-internet.de/zvg/__57.html" },
  iik129: { ref: "İİK m.129", url: "https://www.mevzuat.gov.tr/mevzuatmetin/1.3.2004.pdf" },
} as const;

/** Section anchors on the Aktenblatt that the open points link to. */
export const VERDICT_ANCHORS = {
  limit: "bietlimit",
  report: "gutachten",
  questions: "urteil-fragen",
} as const;
