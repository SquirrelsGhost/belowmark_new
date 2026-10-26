import { BidInputKey, BidInputs } from "@/types/bidding.types";

/**
 * Constants of the bid limit, the comparison values and the bidder file.
 * Kept apart from appConstants.ts so this feature can change on its own.
 */

/** Statutory rates of the German purchase bill. */
export const ZVG_COSTS = {
  /** KV 2214 GKG — Zuschlag fee, from the highest bid plus retained rights (§ 54 Abs. 2 GKG) */
  courtFeeRate: 0.5,
  /** KV 14110 GNotKG, Tabelle B — entering the buyer in the land register */
  registryFeeRate: 1,
  /** § 49 Abs. 2 ZVG — the cash bid bears 4 % interest from the Zuschlag to the Verteilungstermin */
  bidInterestPct: 4,
  /** Fee tables in force since */
  feesAsOf: "2025-06-01",
} as const;

/** Every input starts empty — the calculator never puts a rent, a budget or a rate in the bidder's mouth. */
export const EMPTY_BID_INPUTS: BidInputs = {
  areaM2: null,
  renovation: null,
  clearance: null,
  otherCosts: null,
  retainedRights: null,
  interestDays: null,
  rentMonthly: null,
  nonAllocableMonthly: null,
  vacancyPct: null,
  equity: null,
  interestPct: null,
  repaymentPct: null,
  targetYieldPct: null,
  minCashflowMonthly: null,
  resaleValue: null,
  marginPct: null,
};

/** The search never looks above this share of the appraised value. */
export const MAX_BID_SHARE = 3;

/** Limits are rounded down to whole hundreds (€ / ₺) — nobody bids 143.287 €. */
export const LIMIT_ROUNDING = 100;

/** localStorage keys, one per proceeding. */
export const BIDDING_STORAGE = {
  inputs: "belowmark:bietlimit:",
  comparables: "belowmark:vergleich:",
} as const;

/** Official places to look up comparison values in Germany — the app has no licensed data for them. */
export const DE_COMPARISON_SOURCES = {
  boris: { url: "https://www.bodenrichtwerte-boris.de/", host: "bodenrichtwerte-boris.de" },
  zensus: { url: "https://www.zensus2022.de/", host: "zensus2022.de" },
} as const;

/** Statute pages linked from the cost lines. */
export const COST_SOURCES = {
  gkg: "https://www.gesetze-im-internet.de/gkg_2004/",
  gnotkg: "https://www.gesetze-im-internet.de/gnotkg/",
  zvg: "https://www.gesetze-im-internet.de/zvg/",
  grestg: "https://www.gesetze-im-internet.de/grestg_1983/",
} as const;

/** UYAP e-Satış — where Turkish e-auctions are held and the deposit is paid. */
export const TR_AUCTION_PORTAL = { url: "https://esatis.uyap.gov.tr/", host: "esatis.uyap.gov.tr" } as const;

/** Segments the TCMB housing unit price series covers (it is built from housing loan appraisals). */
export const TCMB_SEGMENTS = ["apartment", "house"] as const;

/** Max length of the source text of an own comparison value. */
export const COMPARABLE_SOURCE_MAX = 200;

export type FieldUnit = "money" | "pct" | "m2" | "days";

export const FIELD_UNITS: Record<BidInputKey, FieldUnit> = {
  areaM2: "m2",
  renovation: "money",
  clearance: "money",
  otherCosts: "money",
  retainedRights: "money",
  interestDays: "days",
  rentMonthly: "money",
  nonAllocableMonthly: "money",
  vacancyPct: "pct",
  equity: "money",
  interestPct: "pct",
  repaymentPct: "pct",
  targetYieldPct: "pct",
  minCashflowMonthly: "money",
  resaleValue: "money",
  marginPct: "pct",
};

export type FieldGroup = "object" | "costs" | "income" | "financing" | "targets";

/** Input groups in reading order. ZVG-only fields are dropped for Turkish proceedings. */
export const FIELD_GROUPS: { group: FieldGroup; fields: BidInputKey[] }[] = [
  { group: "targets", fields: ["targetYieldPct", "minCashflowMonthly", "resaleValue", "marginPct"] },
  { group: "income", fields: ["rentMonthly", "nonAllocableMonthly", "vacancyPct"] },
  { group: "costs", fields: ["renovation", "clearance", "otherCosts", "retainedRights", "interestDays"] },
  { group: "financing", fields: ["equity", "interestPct", "repaymentPct"] },
  { group: "object", fields: ["areaM2"] },
];

export const ZVG_ONLY_FIELDS: BidInputKey[] = ["retainedRights", "interestDays"];
