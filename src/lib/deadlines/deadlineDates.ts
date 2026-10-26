import { DAY_MS } from "@/lib/appConstants";

/**
 * Calendar-day arithmetic for deadlines. Days are plain "yyyy-mm-dd" strings
 * in the court's time zone; the maths runs on UTC midnights, so summer time
 * never shifts a day.
 */

const formatters = new Map<string, Intl.DateTimeFormat>();

/** The calendar day an instant falls on in `timeZone`, as yyyy-mm-dd. */
export function dayIn(instant: string | number, timeZone: string): string {
  let formatter = formatters.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" });
    formatters.set(timeZone, formatter);
  }
  return formatter.format(typeof instant === "number" ? instant : Date.parse(instant));
}

const toTime = (day: string): number => Date.parse(`${day}T00:00:00Z`);
const toDay = (time: number): string => new Date(time).toISOString().slice(0, 10);

export const addDays = (day: string, days: number): string => toDay(toTime(day) + days * DAY_MS);

/** Whole days from `from` to `to` (negative when `to` lies before). */
export const daysBetween = (from: string, to: string): number => Math.round((toTime(to) - toTime(from)) / DAY_MS);

/** 0 = Sunday … 6 = Saturday */
const weekday = (day: string): number => new Date(toTime(day)).getUTCDay();

/**
 * The day that is `count` Werktage before `day`, counting Monday to Saturday
 * and not skipping public holidays. Both simplifications move the result
 * later, never earlier — a "frühestens" date computed this way is always safe.
 */
export function workdaysBeforeIncludingSaturday(day: string, count: number): string {
  let current = day;
  let left = count;
  while (left > 0) {
    current = addDays(current, -1);
    if (weekday(current) !== 0) left -= 1;
  }
  return current;
}

/** The last Monday-to-Friday day before `day` (holidays not known — say so next to the date). */
export function previousBusinessDay(day: string): string {
  let current = addDays(day, -1);
  while (weekday(current) === 0 || weekday(current) === 6) current = addDays(current, -1);
  return current;
}

/**
 * An instant for a local wall-clock time on `day` in `timeZone`, e.g. 23:30 in
 * Istanbul. Turkey has no summer time since 2016, Germany does — the offset is
 * read from Intl for that very day.
 */
export function instantAt(day: string, hhmm: string, timeZone: string): string {
  const guess = Date.parse(`${day}T${hhmm}:00Z`);
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "longOffset" }).formatToParts(guess);
  const name = parts.find((part) => part.type === "timeZoneName")?.value ?? "GMT";
  const match = /GMT([+-])(\d{2}):?(\d{2})?/.exec(name);
  const offsetMinutes = match ? (match[1] === "-" ? -1 : 1) * (Number(match[2]) * 60 + Number(match[3] ?? 0)) : 0;
  return new Date(guess - offsetMinutes * 60_000).toISOString();
}
