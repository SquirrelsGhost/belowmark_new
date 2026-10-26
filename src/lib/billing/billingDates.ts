/**
 * Adds calendar months the way a contract counts them: 31 January + 1 month
 * is the last day of February, not 3 March. Time of day is kept.
 */
export function addCalendarMonths(start: Date, months: number): Date {
  const result = new Date(start.getTime());
  const day = result.getUTCDate();
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)).getUTCDate();
  result.setUTCDate(Math.min(day, lastDay));
  return result;
}

/** Later of two dates (null counts as "no date"). */
export function laterOf(a: Date | null, b: Date): Date {
  return a && a.getTime() > b.getTime() ? a : b;
}
