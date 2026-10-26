import { buildRiskCheck } from "@/lib/report/riskCheck";
import { getHearingStatus } from "@/lib/listingMath";
import { Listing } from "@/types/listing.types";
import { GutachtenReport, ReportFact, ReportKind, RiskItem } from "@/types/report.types";
import { VerdictEvidence, VerdictQuote, VerdictRisk } from "@/types/verdict.types";

/**
 * Gathers, on the server, what the notice and the uploaded Gutachten say for
 * the verdict. Nothing is estimated here: a figure that does not read cleanly
 * stays null.
 */

/** "245.000,00 €" / "1.250.000 TL" → 245000 / 1250000; null when it does not read as a number. */
export function parseReportAmount(printed: string): number | null {
  const digits = printed.replace(/[^\d.,]/g, "");
  if (!/\d/.test(digits)) return null;
  const value = Number(digits.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(value) && value > 0 ? value : null;
}

/** "12.03.2024" / "1. 3. 24" → Date (UTC); null when it is no real date. */
export function parseReportDate(printed: string): Date | null {
  const match = /(\d{1,2})\.\s?(\d{1,2})\.\s?(\d{2,4})/.exec(printed);
  if (!match) return null;
  const [day, month] = [Number(match[1]), Number(match[2])];
  const year = match[3].length === 2 ? 2000 + Number(match[3]) : Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? date : null;
}

/** Whole years from `from` to `to`, counted like a birthday. */
export function fullYearsBetween(from: Date, to: Date): number {
  let years = to.getUTCFullYear() - from.getUTCFullYear();
  const beforeAnniversary = to.getUTCMonth() < from.getUTCMonth() || (to.getUTCMonth() === from.getUTCMonth() && to.getUTCDate() < from.getUTCDate());
  if (beforeAnniversary) years -= 1;
  return Math.max(0, years);
}

/** First finding of a kind with the given stance, as a quote with its page. */
function findQuote(report: GutachtenReport | null, kind: ReportKind, stances: VerdictQuote["stance"][]): VerdictQuote | null {
  if (!report) return null;
  for (const stance of stances) {
    const finding = report.findings.find((item) => item.kind === kind && item.stance === stance);
    if (finding) return { quote: finding.quote, page: finding.page, stance };
  }
  return null;
}

function factQuote(fact: ReportFact | undefined): VerdictQuote | null {
  return fact ? { quote: fact.quote, page: fact.page, stance: "present" } : null;
}

/** The risk row reduced to the one source that carries its level. */
function toVerdictRisk(item: RiskItem, noticeUrl: string): VerdictRisk {
  const pick = (stance: VerdictQuote["stance"]) => item.evidence.find((evidence) => evidence.stance === stance);
  const carrier = item.level === "green" ? pick("absent") : (pick("present") ?? pick("unclear") ?? item.evidence[0]);
  return {
    key: item.key,
    level: item.level,
    conflicting: item.conflicting,
    quote: carrier?.quote ?? null,
    source: !carrier ? null : carrier.source === "report" ? { kind: "report", page: carrier.page ?? 0 } : { kind: "notice", url: carrier.url ?? noticeUrl },
  };
}

export function buildVerdictEvidence(listing: Listing, report: GutachtenReport | null, now: number): VerdictEvidence {
  const status = getHearingStatus(listing, now);
  const check = buildRiskCheck(listing, report);
  const valuation = report?.facts.find((fact) => fact.key === "valuationDate");
  const valuationDate = valuation ? parseReportDate(valuation.value) : null;
  const hearingIso = status.round?.start ?? listing.hearingAt;
  const reference = hearingIso ? new Date(hearingIso) : new Date(now);
  const marketValue = report?.facts.find((fact) => fact.key === "marketValue");

  return {
    market: listing.market,
    hearing: status.state,
    hasValue: listing.appraisedValue !== null,
    noticeUrl: listing.officialUrl,
    hasReport: report !== null,
    risks: check.items.map((item) => toVerdictRisk(item, listing.officialUrl)),
    defects: findQuote(report, "defects", ["present"]),
    contamination: findQuote(report, "contamination", ["present", "unclear"]),
    reportOutsideOnly: findQuote(report, "inspection", ["unclear"]),
    easement: findQuote(report, "easement", ["present"]),
    valuationAgeYears: valuationDate ? fullYearsBetween(valuationDate, reference) : null,
    valuationQuote: valuationDate ? factQuote(valuation) : null,
    reportValue: marketValue ? parseReportAmount(marketValue.value) : null,
    reportValueQuote: factQuote(marketValue),
    noticeValue: listing.appraisedValue,
  };
}
