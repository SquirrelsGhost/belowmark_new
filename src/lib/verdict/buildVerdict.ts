import { MAX_BID_SHARE } from "@/lib/bidding/biddingConstants";
import { getBidLimit, getStartingBid } from "@/lib/bidding/bidLimit";
import { getZvgFigures } from "@/lib/listingMath";
import { STAYING_RIGHTS, STRESS_PCTS, VALUATION_MAX_AGE_YEARS, VALUE_MISMATCH_SHARE, VERDICT_LAW } from "@/lib/verdict/verdictConstants";
import { BidContext, BidInputs, BidLimitResult } from "@/types/bidding.types";
import { RiskKey } from "@/types/report.types";
import {
  Verdict,
  VerdictAnswers,
  VerdictEvidence,
  VerdictQuote,
  VerdictReason,
  VerdictRisk,
  VerdictSeverity,
  VerdictSource,
  VerdictStressCase,
} from "@/types/verdict.types";

/**
 * "Bid up to X" or "do not bid, because Y" — from the notice, the Gutachten,
 * statute and the bidder's own figures and answers. The verdict only says
 * "bid" when nothing it needs is missing; every open point is named instead
 * of being filled with an assumption.
 */

const SEVERITY_ORDER: VerdictSeverity[] = ["none", "stop", "gap", "caution", "ok"];

const INPUT: VerdictSource = { kind: "input" };
const ANSWER: VerdictSource = { kind: "answer" };
const RULE: VerdictSource = { kind: "rule" };
const law = (key: keyof typeof VERDICT_LAW): VerdictSource => ({ kind: "law", ...VERDICT_LAW[key] });
const fromReport = (quote: VerdictQuote): Pick<VerdictReason, "quote" | "sources"> => ({ quote: quote.quote, sources: [{ kind: "report", page: quote.page }] });
const fromRisk = (risk: VerdictRisk): VerdictSource[] => (risk.source ? [risk.source] : []);

function riskOf(evidence: VerdictEvidence, key: RiskKey): VerdictRisk | undefined {
  return evidence.risks.find((risk) => risk.key === key);
}

/** The proceeding is not open for a bid — nothing to judge. */
function closedReason(evidence: VerdictEvidence, context: BidContext | null): VerdictReason | null {
  const notice: VerdictSource[] = [{ kind: "notice", url: evidence.noticeUrl }];
  if (!evidence.hasValue || !context) return { code: "noValue", severity: "none", sources: notice };
  if (evidence.hearing === "cancelled") return { code: "cancelled", severity: "none", sources: notice };
  if (evidence.hearing === "past") return { code: "past", severity: "none", sources: notice };
  return null;
}

/** Lowest amount that is a valid bid in this hearing (5/10 resp. the starting bid); null when the limits fell away. */
function legalFloor(context: BidContext): number | null {
  if (context.market === "TR") return getStartingBid(context);
  return context.limitsWaived ? null : getZvgFigures(context.value, null).half;
}

function stopReasons(evidence: VerdictEvidence, context: BidContext, inputs: BidInputs, answers: VerdictAnswers, result: BidLimitResult): VerdictReason[] {
  const reasons: VerdictReason[] = [];
  const limit = typeof result.limit === "number" ? result.limit : undefined;
  // §§ 74a, 85a ZVG weigh the bid together with the rights that stay on the land
  const measured = limit === undefined ? undefined : limit + (inputs.retainedRights ?? 0);
  const floor = legalFloor(context) ?? undefined;
  if (result.limit === "unreachable") reasons.push({ code: "unreachable", severity: "stop", sources: [INPUT] });
  if (result.verdict === "belowStart") reasons.push({ code: "belowStart", severity: "stop", amount: limit, other: floor, sources: [INPUT, law("iik129")] });
  if (result.verdict === "belowHalf") reasons.push({ code: "belowHalf", severity: "stop", amount: measured, other: floor, sources: [INPUT, law("zvg85a")] });

  for (const key of STAYING_RIGHTS) {
    const risk = riskOf(evidence, key);
    if (risk?.level !== "red") continue;
    const priced = answers.rights === "confirmed" && (context.market === "TR" || inputs.retainedRights !== null);
    const base = { risk: key, quote: risk.quote ?? undefined };
    if (priced) {
      reasons.push({ ...base, code: "rightPriced", severity: "caution", amount: inputs.retainedRights ?? undefined, sources: [...fromRisk(risk), ANSWER, INPUT] });
    } else {
      reasons.push({ ...base, code: "rightStays", severity: "stop", action: answers.rights === "confirmed" ? "limit" : "questions", sources: [...fromRisk(risk), ...(context.market === "DE" ? [law("zvg52")] : [])] });
    }
  }
  return reasons;
}

function gapReasons(evidence: VerdictEvidence, inputs: BidInputs, answers: VerdictAnswers, result: BidLimitResult, hasRightStop: boolean): VerdictReason[] {
  const reasons: VerdictReason[] = [];
  const gap = (code: VerdictReason["code"], sources: VerdictSource[], extra: Partial<VerdictReason> = {}) => reasons.push({ code, severity: "gap", sources, ...extra });
  const tenancy = riskOf(evidence, "tenancy");
  const tenancySignal = tenancy?.level === "yellow" || answers.occupancy === "tenant" || answers.occupancy === "unknown";
  const ownCosts = (inputs.renovation ?? 0) + (inputs.clearance ?? 0);

  if (result.limit === null) gap("noTargets", [INPUT]);
  if (!evidence.hasReport) gap("noReport", [RULE]);
  if (inputs.renovation === null) gap("noRenovation", [INPUT]);
  if (answers.inspection === null) gap("askInspection", [ANSWER]);
  if (answers.occupancy === null) gap("askOccupancy", [ANSWER]);
  if (tenancySignal && inputs.clearance === null) gap("noClearance", tenancy?.level === "yellow" ? [...fromRisk(tenancy), INPUT] : [ANSWER, INPUT], { quote: tenancy?.level === "yellow" ? (tenancy.quote ?? undefined) : undefined });
  if (answers.rights === null && !hasRightStop) gap("askRights", [ANSWER]);
  if (answers.rights === "open" && !hasRightStop) gap("rightsOpen", [ANSWER]);
  if (ownCosts > 0 && answers.costBasis === null) gap("askCostBasis", [ANSWER]);
  if (result.isIncomplete) gap("costsIncomplete", [{ kind: "notice", url: evidence.noticeUrl }]);
  if (evidence.contamination?.stance === "present" && answers.costBasis !== "quote") gap("contamination", fromReport(evidence.contamination).sources, { quote: evidence.contamination.quote });
  return reasons;
}

function cautionReasons(evidence: VerdictEvidence, context: BidContext, inputs: BidInputs, answers: VerdictAnswers, result: BidLimitResult): VerdictReason[] {
  const reasons: VerdictReason[] = [];
  const caution = (code: VerdictReason["code"], extra: Partial<VerdictReason> & Pick<VerdictReason, "sources">) => reasons.push({ code, severity: "caution", ...extra });
  const tenancy = riskOf(evidence, "tenancy");
  const heritage = riskOf(evidence, "heritage");

  if (answers.inspection === "outside" || answers.inspection === "none") caution("notInside", { sources: [ANSWER] });
  if (evidence.reportOutsideOnly) caution("reportOutsideOnly", fromReport(evidence.reportOutsideOnly));
  if (answers.costBasis === "estimate") caution("estimateOnly", { sources: [ANSWER] });
  if (evidence.defects) caution("defects", fromReport(evidence.defects));
  if (answers.occupancy === "tenant" || (tenancy?.level === "yellow" && tenancy.quote)) {
    caution("tenant", { quote: tenancy?.quote ?? undefined, sources: [...(tenancy ? fromRisk(tenancy) : []), ...(context.market === "DE" ? [law("zvg57")] : [])] });
  }
  if (heritage?.level === "yellow") caution("heritage", { quote: heritage.quote ?? undefined, sources: fromRisk(heritage) });
  if (evidence.easement) caution("easement", fromReport(evidence.easement));
  if (evidence.contamination?.stance === "unclear") caution("contaminationUnclear", fromReport(evidence.contamination));
  if (evidence.valuationAgeYears !== null && evidence.valuationQuote && evidence.valuationAgeYears >= VALUATION_MAX_AGE_YEARS) {
    caution("oldValuation", { years: evidence.valuationAgeYears, quote: evidence.valuationQuote.quote, sources: [{ kind: "report", page: evidence.valuationQuote.page }, RULE] });
  }
  if (evidence.reportValue !== null && evidence.noticeValue !== null && evidence.reportValueQuote) {
    if (Math.abs(evidence.reportValue - evidence.noticeValue) / evidence.noticeValue > VALUE_MISMATCH_SHARE) {
      caution("valueMismatch", {
        amount: evidence.reportValue,
        other: evidence.noticeValue,
        quote: evidence.reportValueQuote.quote,
        sources: [{ kind: "report", page: evidence.reportValueQuote.page }, { kind: "notice", url: evidence.noticeUrl }],
      });
    }
  }
  if (result.verdict === "belowSevenTenths") caution("sevenTenths", { amount: typeof result.limit === "number" ? result.limit + (inputs.retainedRights ?? 0) : undefined, other: getZvgFigures(context.value, null).sevenTenths, sources: [law("zvg74a")] });
  if (typeof result.limit === "number" && result.limit >= context.value * MAX_BID_SHARE) caution("atCeiling", { sources: [INPUT] });
  for (const risk of evidence.risks) {
    if (risk.conflicting) caution("conflicting", { risk: risk.key, sources: fromRisk(risk) });
  }
  return reasons;
}

function okReasons(evidence: VerdictEvidence, context: BidContext, result: BidLimitResult): VerdictReason[] {
  if (typeof result.limit !== "number") return [];
  const reasons: VerdictReason[] = [];
  if (result.decidingCriterion) reasons.push({ code: "limitBy", severity: "ok", amount: result.limit, criterion: result.decidingCriterion, sources: [INPUT] });
  if (result.verdict === "clear") reasons.push({ code: "legalClear", severity: "ok", other: legalFloor(context) ?? undefined, sources: [law(context.market === "TR" ? "iik129" : "zvg74a")] });
  if (result.verdict === "waived") reasons.push({ code: "limitsWaived", severity: "ok", sources: [{ kind: "notice", url: evidence.noticeUrl }] });
  const rights = STAYING_RIGHTS.map((key) => riskOf(evidence, key));
  if (rights.every((risk) => risk?.level === "green")) reasons.push({ code: "rightsClear", severity: "ok", sources: rights.flatMap((risk) => (risk ? fromRisk(risk) : [])) });
  return reasons;
}

/** The limit again with renovation and clearance raised — what happens if the entered costs are too low. */
export function getStressCases(context: BidContext, inputs: BidInputs): VerdictStressCase[] {
  if ((inputs.renovation ?? 0) + (inputs.clearance ?? 0) <= 0) return [];
  return STRESS_PCTS.map((pct) => {
    const raise = (value: number | null) => (value === null ? null : value * (1 + pct / 100));
    const stressed = getBidLimit(context, { ...inputs, renovation: raise(inputs.renovation), clearance: raise(inputs.clearance) });
    return {
      pct,
      limit: stressed.limit,
      belowThreshold: stressed.limit === "unreachable" || stressed.verdict === "belowHalf" || stressed.verdict === "belowStart",
    };
  });
}

export function buildVerdict(evidence: VerdictEvidence, context: BidContext | null, inputs: BidInputs, answers: VerdictAnswers): Verdict {
  const closed = closedReason(evidence, context);
  if (closed || !context) return { state: "none", limit: null, reasons: closed ? [closed] : [], stress: [], costsUnverified: false };

  const result = getBidLimit(context, inputs);
  const stops = stopReasons(evidence, context, inputs, answers, result);
  const hasRightStop = stops.some((reason) => reason.code === "rightStays");
  const gaps = gapReasons(evidence, inputs, answers, result, hasRightStop);
  const reasons = [...stops, ...gaps, ...cautionReasons(evidence, context, inputs, answers, result), ...okReasons(evidence, context, result)];
  reasons.sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity));

  const limit = typeof result.limit === "number" ? result.limit : null;
  const isStop = reasons.some((reason) => reason.severity === "stop");
  const state = isStop ? "stop" : gaps.length > 0 || limit === null ? "open" : "go";
  return {
    state,
    limit: isStop ? null : limit,
    reasons,
    stress: limit === null || isStop ? [] : getStressCases(context, inputs),
    costsUnverified: answers.inspection !== "inside" && answers.costBasis !== "quote",
  };
}
