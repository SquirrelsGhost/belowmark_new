import { MarketCode } from "@/lib/constants";
import { BidContext, BidInputs, BidReturns, CriterionLimit } from "@/types/bidding.types";
import { HearingState } from "@/types/listing.types";
import { VerdictEvidence, VerdictState } from "@/types/verdict.types";

/**
 * Where a saved proceeding stands for the investor. Only the bidder can say it —
 * the portals publish no result — so every status but "watching" is their own entry.
 * watching: on the list · bid: took part, result not yet known · won: Zuschlag received · lost: someone else got it
 */
export type HoldingStatus = "watching" | "bid" | "won" | "lost";

/**
 * The bidder's own record of the outcome, kept in this browser like the bid limit.
 * Shared with the after-Zuschlag task list and the Exposé — the single place that says "ersteigert".
 */
export interface Holding {
  status: HoldingStatus;
  /** Highest bid in the Zuschlag ruling / ihale tutanağı, as the bidder typed it */
  price: number | null;
  /** Date of the Zuschlag (YYYY-MM-DD) */
  date: string | null;
}

/** What the server knows about one saved proceeding — plain data for the browser, where the bidder's figures live. */
export interface PortfolioSource {
  key: string;
  market: MarketCode;
  title: string;
  subtitle: string;
  href: string;
  segment: string;
  hearingState: HearingState;
  /** "in 12 Tagen", "Termin vorbei" … as the app words it */
  statusLabel: string;
  /** ISO date of the next (or last) hearing / auction round */
  hearingAt: string | null;
  appraisedValue: number | null;
  /** null without an appraised value — then nothing can be computed */
  context: BidContext | null;
  evidence: VerdictEvidence;
  note: string | null;
}

/** One row of the portfolio after the bidder's own figures are applied. */
export interface PortfolioRow {
  source: PortfolioSource;
  holding: Holding;
  inputs: BidInputs;
  limit: CriterionLimit;
  verdict: VerdictState;
  /** Bid the figures are computed for: the Zuschlag price when won, else the bid limit */
  basisBid: number | null;
  basis: "price" | "limit" | null;
  returns: BidReturns | null;
  /** Loan at the basis; null unless the bidder entered equity */
  loan: number | null;
  /** Net operating income per year at the basis */
  netIncomeYearly: number | null;
  /** Some statutory cost could not be computed (e.g. no tax rate in the notice) */
  isIncomplete: boolean;
  /** Sicherheitsleistung / teminat for the hearing */
  deposit: number | null;
}

/** A sum over rows, with how many rows had the figure — never padded with estimates. */
export interface PortfolioSum {
  value: number;
  count: number;
  of: number;
}

export interface PortfolioTotals {
  rows: number;
  value: PortfolioSum;
  basisBid: PortfolioSum;
  totalCost: PortfolioSum;
  equity: PortfolioSum;
  loan: PortfolioSum;
  netIncomeYearly: PortfolioSum;
  cashflowMonthly: PortfolioSum;
  deposit: PortfolioSum;
  /** Σ net income / Σ total cost over rows that have both; null when none has */
  netYieldPct: number | null;
  netYieldCount: number;
}
