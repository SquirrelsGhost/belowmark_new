import { CostLine } from "@/types/bidding.types";

/**
 * The bank file: a financing request prepared from the notice, statute and the
 * bidder's own figures. It asks a bank — it never claims what a bank will do.
 */

/** How the deposit reaches the court. DE: § 69 ZVG; TR: in the e-Satış portal. */
export type DepositMethod = "cheque" | "guarantee" | "transfer" | "portal";

export type PropertyUse = "own" | "rent" | "resale";

/** What the bidder adds on the bank file itself. Equity and repayment live with the bid limit. */
export interface BankFileInputs {
  /** The bid to finance; empty means: take the bid limit, if there is one */
  plannedBid: number | null;
  /** Desired fixed-interest period in years */
  fixedYears: number | null;
  depositMethod: DepositMethod | null;
  use: PropertyUse | null;
  /** Name printed on the request — optional, stays in this browser */
  applicant: string;
}

export type BidSource = "own" | "limit";

export interface FinancingRequest {
  bid: number | null;
  bidSource: BidSource | null;
  costs: CostLine[];
  /** Bid plus every cost line; null without a bid */
  totalCost: number | null;
  /** A statutory cost could not be computed (e.g. no tax rate in the notice) */
  isIncomplete: boolean;
  equity: number | null;
  /** Total cost minus equity; null when one of them is missing */
  loan: number | null;
  /** Loan in percent of the appraised value — not of the bank's lending value */
  loanToValuePct: number | null;
  equitySharePct: number | null;
  /** Monthly instalment at the bidder's own assumed rate and repayment */
  monthlyRate: number | null;
  deposit: number;
  /** Deposit amount the bank is asked to guarantee (§ 69 Abs. 3 ZVG) */
  guaranteeAmount: number | null;
  /** Equity is known and smaller than a deposit that has to be paid in money */
  equityShortForDeposit: boolean;
}

export type PaymentStepId = "deposit" | "balance" | "bidInterest" | "transferTax" | "courtFee" | "registryFee" | "fees" | "own";

/** One payment on the way from the hearing to the land register. */
export interface PaymentStep {
  id: PaymentStepId;
  /** null: the amount cannot be computed from what is known */
  amount: number | null;
}
