import { MarketCode } from "@/lib/constants";

/**
 * What a proceeding fixes for the bid-limit calculation. Everything here comes
 * from the notice or from statute; null means the notice does not say.
 */
export interface BidContext {
  market: MarketCode;
  /** Verkehrswert / Muhammen bedel */
  value: number;
  /** Grunderwerbsteuer of the state (DE) */
  transferTaxPct: number | null;
  /** KDV rate of the notice (TR) */
  vatRate: number | null;
  /** DE: the 5/10 and 7/10 limits already fell away in an earlier hearing */
  limitsWaived: boolean;
  /** TR: starting bid the notice states (e.g. 100 % in an heirs-only first round), null when it states none */
  startingBid: number | null;
}

/**
 * The bidder's own figures. Every field starts empty unless the notice states it —
 * the calculator never fills in a rent, a renovation budget or an interest rate.
 */
export interface BidInputs {
  areaM2: number | null;
  renovation: number | null;
  clearance: number | null;
  otherCosts: number | null;
  /** DE: rights in Abteilung II that stay on the land (from the hearing notice / report) */
  retainedRights: number | null;
  /** DE: days from Zuschlag to the Verteilungstermin, for the 4 % interest of § 49 ZVG */
  interestDays: number | null;
  rentMonthly: number | null;
  nonAllocableMonthly: number | null;
  vacancyPct: number | null;
  equity: number | null;
  interestPct: number | null;
  repaymentPct: number | null;
  targetYieldPct: number | null;
  minCashflowMonthly: number | null;
  resaleValue: number | null;
  marginPct: number | null;
}

export type BidInputKey = keyof BidInputs;

export type CostCode =
  | "transferTax"
  | "courtFee"
  | "registryFee"
  | "bidInterest"
  | "retainedRights"
  | "kdv"
  | "tapuHarci"
  | "damgaVergisi"
  | "donerSermaye"
  | "renovation"
  | "clearance"
  | "otherCosts";

/** One line of the purchase bill on top of the bid. */
export interface CostLine {
  code: CostCode;
  amount: number;
  /** Statutory rate in percent, when the line is one */
  pct: number | null;
  /** The amount cannot be computed (e.g. no tax rate in the notice) — the total is then incomplete */
  isUnknown: boolean;
  /** Entered by the bidder, not fixed by law */
  isOwn: boolean;
}

export type LimitCriterion = "yield" | "cashflow" | "resale";

/** Max bid per criterion. null: criterion not usable (inputs missing); "unreachable": not even a bid of 0 works. */
export type CriterionLimit = number | "unreachable" | null;

/** Where a bid stands against the legal thresholds of the proceeding. */
export type LimitVerdict = "belowStart" | "belowHalf" | "belowSevenTenths" | "clear" | "waived";

export interface BidReturns {
  totalCost: number;
  loan: number;
  /** Rent × 12 / bid */
  grossYieldPct: number | null;
  /** Net operating income / total cost */
  netYieldPct: number | null;
  /** Monthly, after interest and repayment, before income tax */
  cashflowMonthly: number | null;
  /** Annual cash flow / equity */
  cashOnCashPct: number | null;
  pricePerM2: number | null;
}

export interface BidLimitResult {
  limits: Record<LimitCriterion, CriterionLimit>;
  /** Lowest of the usable criteria; null when none is usable */
  limit: CriterionLimit;
  decidingCriterion: LimitCriterion | null;
  verdict: LimitVerdict | null;
  costs: CostLine[];
  returns: BidReturns | null;
  /** Some statutory cost could not be computed */
  isIncomplete: boolean;
  deposit: number;
}

/** A comparison value the bidder looked up and typed in, always with its source. */
export interface OwnComparable {
  id: string;
  kind: "landValue" | "salePrice" | "rent" | "other";
  value: number;
  unit: "perM2" | "perMonthPerM2" | "total";
  source: string;
  asOf: string;
}

/** Why a comparison value is not shown — always said, never papered over with an estimate. */
export type ComparisonGap =
  | "noLicensedData"
  | "noComparableOffers"
  | "segmentNotCovered"
  | "provinceGap"
  | "noOfficialSeries";

/** One comparison value for the surroundings of a proceeding, with its source — or the reason it is missing. */
export interface ComparisonFigure {
  id: "offers" | "tcmb" | "landValue" | "rent";
  kind: "salePrice" | "landValue" | "rent";
  /** Median / official value per m²; null when missing */
  perM2: number | null;
  /** The appraised value per m² of this object, when the notice gives a matching area */
  objectPerM2: number | null;
  /** Area the object figure is based on */
  areaKind: string | null;
  /** "Bezirk Söke", "Provinz Aydın" — what the figure stands for */
  scope: string | null;
  sampleSize: number | null;
  /** Data quality as rated by the pipeline (offers only) */
  confidence: string | null;
  /** ISO date or quarter, e.g. "2026-Q2" */
  asOf: string | null;
  sourceName: string;
  sourceUrl: string;
  gap: ComparisonGap | null;
}

export interface ListingComparables {
  figures: ComparisonFigure[];
  /** Official portals where the bidder can look up what the app cannot show */
  lookups: { id: "boris" | "geoportal" | "zensus" | "tcmb"; url: string; host: string; name?: string }[];
}
