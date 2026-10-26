import { CASH_DEPOSIT_METHODS } from "@/lib/bankFile/bankFileConstants";
import { getPurchaseCosts } from "@/lib/bidding/purchaseCosts";
import { BankFileInputs, FinancingRequest, PaymentStep } from "@/types/bankFile.types";
import { BidContext, BidInputs, BidLimitResult, CostCode, CostLine } from "@/types/bidding.types";

/**
 * The financing request in numbers: what the purchase costs, what the bidder
 * brings, what is left for the bank — and when each payment falls due.
 * Every amount comes from the notice, statute or the bidder's own inputs.
 */

const sum = (lines: CostLine[], codes: CostCode[]): number | null => {
  const picked = lines.filter((line) => codes.includes(line.code));
  if (picked.length === 0) return null;
  if (picked.some((line) => line.isUnknown)) return null;
  return picked.reduce((total, line) => total + line.amount, 0);
};

/** Annuity per month: (interest + initial repayment) × loan / 12. */
const monthlyRate = (loan: number | null, inputs: BidInputs): number | null =>
  loan === null || inputs.interestPct === null || inputs.repaymentPct === null ? null : (loan * (inputs.interestPct + inputs.repaymentPct)) / 100 / 12;

export function getFinancingRequest(context: BidContext, bidInputs: BidInputs, bank: BankFileInputs, limit: BidLimitResult): FinancingRequest {
  const fromLimit = typeof limit.limit === "number" ? limit.limit : null;
  const bid = bank.plannedBid ?? fromLimit;
  const bidSource = bank.plannedBid !== null ? "own" : fromLimit !== null ? "limit" : null;
  const costs = bid === null ? [] : getPurchaseCosts(context, bidInputs, bid);
  const totalCost = bid === null ? null : costs.reduce((total, line) => total + line.amount, bid);
  const equity = bidInputs.equity;
  const loan = totalCost === null || equity === null ? null : Math.max(0, totalCost - equity);
  const isCashDeposit = bank.depositMethod !== null && CASH_DEPOSIT_METHODS.includes(bank.depositMethod);

  return {
    bid,
    bidSource,
    costs,
    totalCost,
    isIncomplete: costs.some((line) => line.isUnknown),
    equity,
    loan,
    loanToValuePct: loan === null ? null : (loan / context.value) * 100,
    equitySharePct: equity === null || !totalCost ? null : Math.min(100, (equity / totalCost) * 100),
    monthlyRate: monthlyRate(loan, bidInputs),
    deposit: limit.deposit,
    guaranteeAmount: bank.depositMethod === "guarantee" ? limit.deposit : null,
    equityShortForDeposit: isCashDeposit && equity !== null && equity < limit.deposit,
  };
}

/**
 * Payments in the order they fall due. A deposit held by the court counts as
 * paid towards the bid (DE: § 107 Abs. 3 ZVG; TR: offset against the price).
 */
export function getPaymentSteps(context: BidContext, request: FinancingRequest, bank: BankFileInputs): PaymentStep[] {
  const { bid, costs, deposit } = request;
  const isCashDeposit = bank.depositMethod !== null && CASH_DEPOSIT_METHODS.includes(bank.depositMethod);
  const offset = context.market === "TR" || isCashDeposit ? deposit : 0;
  const balance = bid === null ? null : Math.max(0, bid - offset);
  const own = sum(costs, ["renovation", "clearance", "otherCosts"]);
  const steps: PaymentStep[] = [{ id: "deposit", amount: deposit }, { id: "balance", amount: balance }];

  if (context.market === "TR") {
    steps.push({ id: "fees", amount: bid === null ? null : sum(costs, ["kdv", "tapuHarci", "damgaVergisi", "donerSermaye"]) });
  } else {
    steps.push(
      { id: "bidInterest", amount: bid === null ? null : sum(costs, ["bidInterest"]) },
      { id: "transferTax", amount: bid === null ? null : sum(costs, ["transferTax"]) },
      { id: "courtFee", amount: bid === null ? null : sum(costs, ["courtFee"]) },
      { id: "registryFee", amount: bid === null ? null : sum(costs, ["registryFee"]) },
    );
  }
  if (own !== null) steps.push({ id: "own", amount: own });
  return steps;
}
