import { TufeSeries, ValueAge } from "@/types/trIndicators.types";

/**
 * How old is the appraised value really? (Port of src/lib/inflation.mjs of the
 * old immo app.) The muhammen bedel is a nominal amount from the year the
 * proceeding began; with Turkish inflation that matters for old files.
 *
 * The anchor is December of the file year: the file number only names the
 * year, December is the latest plausible valuation date and gives the smallest
 * factor. In doubt the number is understated, never inflated.
 */

/** Months a monthly index may lag before it counts as discontinued. */
export const TUFE_MAX_LAG_MONTHS = 3;

const latestMonth = (months: Record<string, number>): string | null => Object.keys(months).sort().at(-1) ?? null;

/** Index of a month — or of the last month before it. Never a later one: that would flatter the factor. */
function indexAt(months: Record<string, number>, month: string): number | null {
  if (months[month] != null) return months[month];
  const before = Object.keys(months).filter((key) => key <= month).sort();
  return before.length ? months[before[before.length - 1]] : null;
}

export function valueAge(series: TufeSeries, fileYear: number | null): ValueAge | null {
  if (fileYear === null || !Number.isFinite(fileYear)) return null;
  const to = latestMonth(series.months);
  if (!to) return null;
  const from = `${fileYear}-12`;
  if (from >= to) return null;
  const then = indexAt(series.months, from);
  const now = series.months[to];
  if (then === null || !Number.isFinite(then) || then <= 0 || !Number.isFinite(now)) return null;
  const factor = now / then;
  return {
    year: fileYear,
    fromMonth: from,
    toMonth: to,
    factor: Math.round(factor * 100) / 100,
    // Lost purchasing power, not the price rise: factor 2 means the amount is worth half — 50 %, not 100 %
    lostPct: Math.round((1 - 1 / factor) * 1000) / 10,
  };
}

/** A discontinued series keeps answering and simply stops — check its age wherever it is used. */
export function isTufeStale(series: TufeSeries, now: number): boolean {
  const [year, month] = String(series.meta.to).split("-").map(Number);
  if (!Number.isFinite(year) || !Number.isFinite(month)) return true;
  const date = new Date(now);
  return (date.getUTCFullYear() - year) * 12 + (date.getUTCMonth() + 1 - month) > TUFE_MAX_LAG_MONTHS;
}
