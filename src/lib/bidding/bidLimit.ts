import { LIMIT_ROUNDING, MAX_BID_SHARE } from "@/lib/bidding/biddingConstants";
import { getPurchaseCosts, getTotalCost } from "@/lib/bidding/purchaseCosts";
import { getIcraFigures, getZvgFigures } from "@/lib/listingMath";
import {
  BidContext,
  BidInputs,
  BidLimitResult,
  BidReturns,
  CriterionLimit,
  LimitCriterion,
  LimitVerdict,
} from "@/types/bidding.types";

/**
 * The highest bid at which the object still pays off by the bidder's own
 * yardsticks. Each yardstick is solved on its own; the lowest one decides.
 * Every cost depends monotonically on the bid, so a bisection is exact to the euro.
 */

const has = (value: number | null): value is number => value !== null;

/** Net operating income per year: rent minus vacancy minus non-recoverable costs. null without a rent. */
export function getNetIncome(inputs: BidInputs): number | null {
  if (!has(inputs.rentMonthly)) return null;
  const vacancy = (inputs.vacancyPct ?? 0) / 100;
  return inputs.rentMonthly * 12 * (1 - vacancy) - (inputs.nonAllocableMonthly ?? 0) * 12;
}

/** Annual interest and repayment on what equity does not cover. null without an interest rate. */
function getDebtService(inputs: BidInputs, totalCost: number): number | null {
  if (!has(inputs.interestPct)) return null;
  const loan = Math.max(0, totalCost - (inputs.equity ?? 0));
  return (loan * (inputs.interestPct + (inputs.repaymentPct ?? 0))) / 100;
}

/** Each yardstick as "does this bid still work?" — or null when its inputs are missing. */
function getTests(context: BidContext, inputs: BidInputs): Record<LimitCriterion, ((bid: number) => boolean) | null> {
  const income = getNetIncome(inputs);
  const total = (bid: number) => getTotalCost(context, inputs, bid);
  return {
    yield: has(income) && has(inputs.targetYieldPct) && inputs.targetYieldPct > 0 ? (bid) => income / total(bid) >= inputs.targetYieldPct! / 100 : null,
    cashflow:
      has(income) && has(inputs.minCashflowMonthly) && has(inputs.interestPct)
        ? (bid) => (income - (getDebtService(inputs, total(bid)) ?? 0)) / 12 >= inputs.minCashflowMonthly!
        : null,
    resale: has(inputs.resaleValue) ? (bid) => total(bid) <= inputs.resaleValue! * (1 - (inputs.marginPct ?? 0) / 100) : null,
  };
}

function solve(test: ((bid: number) => boolean) | null, ceiling: number): CriterionLimit {
  if (!test) return null;
  if (!test(0)) return "unreachable";
  if (test(ceiling)) return ceiling;
  let low = 0;
  let high = ceiling;
  while (high - low > 1) {
    const mid = (low + high) / 2;
    if (test(mid)) low = mid;
    else high = mid;
  }
  return Math.floor(low / LIMIT_ROUNDING) * LIMIT_ROUNDING;
}

/** Starting bid of a Turkish sale: the notice's figure where it states one, else half the value (İİK m.129). */
export function getStartingBid(context: BidContext): number {
  return context.startingBid ?? getIcraFigures(context.value, context.vatRate).startingBid;
}

/**
 * Where a bid stands against 5/10, 7/10 (DE, first hearing) or the starting bid (TR).
 * §§ 74a Abs. 1, 85a Abs. 1 ZVG measure the bid together with the rights that stay on the land.
 */
export function getVerdict(context: BidContext, bid: number, retainedRights = 0): LimitVerdict {
  if (context.market === "TR") return bid < getStartingBid(context) ? "belowStart" : "clear";
  if (context.limitsWaived) return "waived";
  const figures = getZvgFigures(context.value, context.transferTaxPct);
  const measured = bid + retainedRights;
  if (measured < figures.half) return "belowHalf";
  if (measured < figures.sevenTenths) return "belowSevenTenths";
  return "clear";
}

/** Yields and cash flow if the bid is `bid`. */
export function getReturns(context: BidContext, inputs: BidInputs, bid: number): BidReturns {
  const totalCost = getTotalCost(context, inputs, bid);
  const income = getNetIncome(inputs);
  const debt = getDebtService(inputs, totalCost);
  const cashflow = has(income) && has(debt) ? (income - debt) / 12 : null;
  return {
    totalCost,
    loan: Math.max(0, totalCost - (inputs.equity ?? 0)),
    grossYieldPct: has(inputs.rentMonthly) && bid > 0 ? ((inputs.rentMonthly * 12) / bid) * 100 : null,
    netYieldPct: has(income) && totalCost > 0 ? (income / totalCost) * 100 : null,
    cashflowMonthly: cashflow,
    cashOnCashPct: has(cashflow) && has(inputs.equity) && inputs.equity > 0 ? ((cashflow * 12) / inputs.equity) * 100 : null,
    pricePerM2: has(inputs.areaM2) && inputs.areaM2 > 0 ? totalCost / inputs.areaM2 : null,
  };
}

export function getBidLimit(context: BidContext, inputs: BidInputs): BidLimitResult {
  const tests = getTests(context, inputs);
  const ceiling = context.value * MAX_BID_SHARE;
  const limits: Record<LimitCriterion, CriterionLimit> = {
    yield: solve(tests.yield, ceiling),
    cashflow: solve(tests.cashflow, ceiling),
    resale: solve(tests.resale, ceiling),
  };

  let limit: CriterionLimit = null;
  let decidingCriterion: LimitCriterion | null = null;
  for (const criterion of Object.keys(limits) as LimitCriterion[]) {
    const value = limits[criterion];
    if (value === null) continue;
    const isLower = limit === null || value === "unreachable" || (limit !== "unreachable" && value < limit);
    if (isLower && limit !== "unreachable") {
      limit = value;
      decidingCriterion = criterion;
    }
  }

  const bid = typeof limit === "number" ? limit : null;
  const costs = getPurchaseCosts(context, inputs, bid ?? 0);
  const deposit = context.market === "TR" ? getIcraFigures(context.value, context.vatRate).deposit : getZvgFigures(context.value, null).deposit;
  return {
    limits,
    limit,
    decidingCriterion,
    verdict: bid === null ? null : getVerdict(context, bid, inputs.retainedRights ?? 0),
    costs,
    returns: bid === null ? null : getReturns(context, inputs, bid),
    isIncomplete: costs.some((line) => line.isUnknown),
    deposit,
  };
}
