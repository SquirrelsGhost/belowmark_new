import { ZVG_COSTS } from "@/lib/bidding/biddingConstants";
import { gkgFee, gnotkgFeeB } from "@/lib/bidding/courtFees";
import { getIcraFigures } from "@/lib/listingMath";
import { BidContext, BidInputs, CostLine } from "@/types/bidding.types";

/**
 * The full bill for winning at `bid`: statutory costs fixed by law, then the
 * bidder's own figures. Nothing is assumed — an empty input adds nothing, a
 * missing statutory rate is flagged instead of guessed.
 */

const statutory = (code: CostLine["code"], amount: number, pct: number | null, isUnknown = false): CostLine => ({
  code,
  amount,
  pct,
  isUnknown,
  isOwn: false,
});

const own = (code: CostLine["code"], amount: number | null): CostLine[] =>
  amount !== null && amount > 0 ? [{ code, amount, pct: null, isUnknown: false, isOwn: true }] : [];

/** DE: Grunderwerbsteuer, Zuschlag fee, land register fee, interest on the cash bid, retained rights. */
function zvgCosts(context: BidContext, inputs: BidInputs, bid: number): CostLine[] {
  const rights = inputs.retainedRights ?? 0;
  // § 9 Abs. 1 Nr. 4 GrEStG / § 54 Abs. 2 GKG: the highest bid plus the rights that stay on the land
  const base = bid + rights;
  const taxPct = context.transferTaxPct;
  const lines: CostLine[] = [
    statutory("transferTax", taxPct === null ? 0 : (base * taxPct) / 100, taxPct, taxPct === null),
    statutory("courtFee", gkgFee(base, ZVG_COSTS.courtFeeRate), null),
    // § 46 GNotKG: the land register values the property at its Verkehrswert, not at a lower bid
    statutory("registryFee", gnotkgFeeB(Math.max(base, context.value), ZVG_COSTS.registryFeeRate), null),
  ];
  if (inputs.interestDays !== null && inputs.interestDays > 0) {
    lines.push(statutory("bidInterest", (bid * ZVG_COSTS.bidInterestPct * inputs.interestDays) / (100 * 365), ZVG_COSTS.bidInterestPct));
  }
  if (rights > 0) lines.push({ code: "retainedRights", amount: rights, pct: null, isUnknown: false, isOwn: true });
  return lines;
}

/** TR: KDV, tapu harcı, damga vergisi, döner sermaye — the rates of the existing İcra calculator. */
function icraCosts(context: BidContext, bid: number): CostLine[] {
  const figures = getIcraFigures(context.value, context.vatRate, bid);
  const lines = figures.items.map((item) => statutory(item.code, item.amount, item.pct));
  if (!figures.vatKnown) lines.unshift(statutory("kdv", 0, null, true));
  return lines;
}

export function getPurchaseCosts(context: BidContext, inputs: BidInputs, bid: number): CostLine[] {
  const legal = context.market === "TR" ? icraCosts(context, bid) : zvgCosts(context, inputs, bid);
  return [...legal, ...own("renovation", inputs.renovation), ...own("clearance", inputs.clearance), ...own("otherCosts", inputs.otherCosts)];
}

/** Bid plus every cost line. */
export function getTotalCost(context: BidContext, inputs: BidInputs, bid: number): number {
  return getPurchaseCosts(context, inputs, bid).reduce((sum, line) => sum + line.amount, bid);
}
