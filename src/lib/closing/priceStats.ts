import { PRICE_STATS_MIN_GROUP } from "@/lib/closing/closingConstants";
import { MarketCode } from "@/lib/constants";
import { SegmentKey } from "@/lib/snapshot";
import { HearingOutcome, PriceStatRow, PriceStats } from "@/types/closing.types";

/**
 * Pure aggregation of reported hearing results. One hearing can be reported by
 * several users: it counts once, with the median of their figures. Below the
 * minimum group size no figure is shown — only how many results there are.
 */

/** A shared result row as the statistics read it (no user id, no listing key leaves the service). */
export interface ResultSample {
  /** listing key + hearing date — identifies the hearing, never shown */
  hearingId: string;
  regionCode: string | null;
  segment: SegmentKey;
  outcome: HearingOutcome;
  appraisedValue: number | null;
  highestBid: number | null;
  retainedRights: number | null;
  bidderCount: number | null;
}

interface HearingFigure {
  regionCode: string | null;
  segment: SegmentKey;
  awarded: boolean;
  ratioPct: number | null;
  bidders: number | null;
}

export function quantile(sorted: number[], q: number): number {
  if (sorted.length === 0) return Number.NaN;
  const position = (sorted.length - 1) * q;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower);
}

const median = (values: number[]): number | null => (values.length ? quantile([...values].sort((a, b) => a - b), 0.5) : null);

/** Collapses several reports of the same hearing into one figure; the majority outcome wins, ties go to "awarded" only if a bid was given. */
function collapse(samples: ResultSample[]): HearingFigure[] {
  const byHearing = new Map<string, ResultSample[]>();
  for (const sample of samples) byHearing.set(sample.hearingId, [...(byHearing.get(sample.hearingId) ?? []), sample]);
  return [...byHearing.values()].map((reports) => {
    const awardedReports = reports.filter((r) => r.outcome === "awarded");
    const awarded = awardedReports.length * 2 > reports.length || (awardedReports.length * 2 === reports.length && awardedReports.some((r) => r.highestBid));
    const ratios = awardedReports
      .filter((r) => r.highestBid && r.appraisedValue)
      .map((r) => (((r.highestBid ?? 0) + (r.retainedRights ?? 0)) / (r.appraisedValue ?? 1)) * 100);
    const bidders = reports.map((r) => r.bidderCount).filter((n): n is number => n !== null);
    const first = reports[0];
    return { regionCode: first.regionCode, segment: first.segment, awarded, ratioPct: awarded ? median(ratios) : null, bidders: median(bidders) };
  });
}

function summarise(figures: HearingFigure[], regionCode: string | null, regionName: string, segment: SegmentKey | "all", minGroup: number): PriceStatRow {
  const ratios = figures.filter((f) => f.awarded && f.ratioPct !== null).map((f) => f.ratioPct as number).sort((a, b) => a - b);
  const bidders = figures.map((f) => f.bidders).filter((n): n is number => n !== null);
  const enough = ratios.length >= minGroup;
  return {
    regionCode,
    regionName,
    segment,
    awarded: ratios.length,
    reported: figures.length,
    medianPct: enough ? quantile(ratios, 0.5) : null,
    p25Pct: enough ? quantile(ratios, 0.25) : null,
    p75Pct: enough ? quantile(ratios, 0.75) : null,
    medianBidders: bidders.length >= minGroup ? median(bidders) : null,
  };
}

/** Rows per region (all segments) and per region × segment, plus the market total. */
export function buildPriceStats(market: MarketCode, samples: ResultSample[], regionNames: Map<string, string>, otherRegion: string, minGroup = PRICE_STATS_MIN_GROUP): PriceStats {
  const figures = collapse(samples);
  const regions = [...new Set(figures.map((f) => f.regionCode))];
  const rows: PriceStatRow[] = [];
  for (const code of regions) {
    const inRegion = figures.filter((f) => f.regionCode === code);
    const name = (code && regionNames.get(code)) || otherRegion;
    rows.push(summarise(inRegion, code, name, "all", minGroup));
    const segments = [...new Set(inRegion.map((f) => f.segment))].sort();
    if (segments.length > 1) for (const segment of segments) rows.push(summarise(inRegion.filter((f) => f.segment === segment), code, name, segment, minGroup));
  }
  rows.sort((a, b) => a.regionName.localeCompare(b.regionName) || (a.segment === "all" ? -1 : b.segment === "all" ? 1 : a.segment.localeCompare(b.segment)));
  return { market, rows, total: summarise(figures, null, "", "all", minGroup), minGroup };
}
