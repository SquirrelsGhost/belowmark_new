import { getBidLimit, getNetIncome, getReturns } from "@/lib/bidding/bidLimit";
import { getPurchaseCosts } from "@/lib/bidding/purchaseCosts";
import { buildVerdict } from "@/lib/verdict/buildVerdict";
import { BidInputs } from "@/types/bidding.types";
import { Holding, PortfolioRow, PortfolioSource } from "@/types/portfolio.types";
import { VerdictAnswers } from "@/types/verdict.types";

/**
 * One saved proceeding with the bidder's own figures applied. Won objects are
 * computed at the Zuschlag price, everything else at the bid limit. A figure the
 * bidder has not entered stays null — the portfolio never fills one in.
 */
export function buildPortfolioRow(source: PortfolioSource, inputs: BidInputs, answers: VerdictAnswers, holding: Holding): PortfolioRow {
  const { context } = source;
  const verdict = buildVerdict(source.evidence, context, inputs, answers).state;
  if (!context) {
    return { source, holding, inputs, limit: null, verdict, basisBid: null, basis: null, returns: null, loan: null, netIncomeYearly: null, isIncomplete: false, deposit: null };
  }

  const result = getBidLimit(context, inputs);
  const limit = typeof result.limit === "number" ? result.limit : null;
  const isWon = holding.status === "won";
  const basisBid = isWon ? holding.price : limit;
  const returns = basisBid === null ? null : getReturns(context, inputs, basisBid);
  return {
    source,
    holding,
    inputs,
    limit: result.limit,
    verdict,
    basisBid,
    basis: basisBid === null ? null : isWon ? "price" : "limit",
    returns,
    // Without entered equity the "loan" would just be the whole bill — not a figure anyone gave
    loan: returns && inputs.equity !== null ? returns.loan : null,
    netIncomeYearly: returns ? getNetIncome(inputs) : null,
    isIncomplete: basisBid !== null && getPurchaseCosts(context, inputs, basisBid).some((line) => line.isUnknown),
    deposit: isWon ? null : result.deposit,
  };
}
