import { fill, formatMoney } from "@/lib/appFormat";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { VERDICT_ANCHORS } from "@/lib/verdict/verdictConstants";
import { IVerdictTranslation } from "@/translations/verdict/IVerdictTranslation";
import { LimitCriterion } from "@/types/bidding.types";
import { RiskKey } from "@/types/report.types";
import { VerdictReason, VerdictReasonCode, VerdictSeverity, VerdictSource } from "@/types/verdict.types";

/** Names the reason texts fill in: risks (from the risk check) and bid-limit criteria. */
export interface VerdictNames {
  risks: Record<RiskKey, string>;
  criteria: Record<LimitCriterion, string>;
}

/** Severities in reading order, each one a group of the dossier. */
export const VERDICT_GROUPS: VerdictSeverity[] = ["none", "stop", "gap", "caution", "ok"];

/** Where each open point is closed on the Aktenblatt. */
export const REASON_ACTIONS: Partial<Record<VerdictReasonCode, keyof typeof VERDICT_ANCHORS>> = {
  noTargets: "limit",
  noRenovation: "limit",
  noClearance: "limit",
  costsIncomplete: "limit",
  noReport: "report",
  askInspection: "questions",
  askOccupancy: "questions",
  askRights: "questions",
  rightsOpen: "questions",
  askCostBasis: "questions",
  contamination: "questions",
};

export function reasonText(reason: VerdictReason, labels: IVerdictTranslation, market: MarketCode, locale: LocaleOption, names: VerdictNames): string {
  const template = labels.MarketReasons[reason.code]?.[market] ?? labels.Reasons[reason.code];
  const money = (value: number | undefined) => (value === undefined ? "—" : formatMoney(value, market, locale));
  return fill(template, {
    amount: money(reason.amount),
    other: money(reason.other),
    years: reason.years ?? "—",
    risk: reason.risk ? names.risks[reason.risk] : "",
    criterion: reason.criterion ? names.criteria[reason.criterion] : "",
  });
}

export function sourceText(source: VerdictSource, labels: IVerdictTranslation["Sources"]): string {
  if (source.kind === "law") return source.ref;
  if (source.kind === "report") return fill(labels.report, { page: source.page });
  return labels[source.kind];
}

export const sourceUrl = (source: VerdictSource): string | null => (source.kind === "notice" || source.kind === "law" ? source.url : null);
