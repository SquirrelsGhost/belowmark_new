import { CLOSING_SOON_DAYS, ISO_DATE } from "@/lib/closing/closingConstants";
import { CLOSING_TASKS } from "@/lib/closing/closingTasks";
import { DAY_MS } from "@/lib/appConstants";
import { MarketCode } from "@/lib/constants";
import { ClosingCondition, ClosingDates, ClosingDueRule, ClosingTaskDef, ScheduledClosingTask } from "@/types/closing.types";

/**
 * Pure date arithmetic of the task list. Every date is a plain yyyy-mm-dd in
 * court time, counted in UTC so no time zone shifts a day.
 */

const toUtc = (isoDate: string): Date => new Date(`${isoDate}T00:00:00Z`);
const toIso = (date: Date): string => date.toISOString().slice(0, 10);

export const isIsoDate = (value: unknown): value is string => typeof value === "string" && ISO_DATE.test(value) && !Number.isNaN(toUtc(value).getTime());

export function addDays(isoDate: string, days: number): string {
  return toIso(new Date(toUtc(isoDate).getTime() + days * DAY_MS));
}

/** Calendar months, clamped to the month end (31.01. + 1 month = 28./29.02.) — as § 188 Abs. 3 BGB counts. */
export function addMonths(isoDate: string, months: number): string {
  const date = toUtc(isoDate);
  const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(date.getUTCDate(), lastDay));
  return toIso(target);
}

/**
 * 3rd working day of the month of `isoDate`, Saturdays counted (BGH, 27.04.2005 – VIII ZR 206/04).
 * Sundays are skipped, public holidays are not — both can only make the real date later, so this is the cautious one.
 */
function thirdWorkdayOfMonth(isoDate: string): string {
  const date = toUtc(isoDate);
  const day = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
  let count = 0;
  while (true) {
    const weekday = day.getUTCDay();
    if (weekday !== 0) count += 1;
    if (count === 3) return toIso(day);
    day.setUTCDate(day.getUTCDate() + 1);
  }
}

/** First 3rd working day of a month that is not before `isoDate`. */
export function nextThirdWorkday(isoDate: string): string {
  const inMonth = thirdWorkdayOfMonth(isoDate);
  if (inMonth >= isoDate) return inMonth;
  return thirdWorkdayOfMonth(addMonths(`${isoDate.slice(0, 8)}01`, 1));
}

export function dueDate(rule: ClosingDueRule, dates: ClosingDates): string | null {
  const start = dates[rule.from];
  if (!start) return null;
  let due = start;
  if (rule.months) due = addMonths(due, rule.months);
  if (rule.days) due = addDays(due, rule.days);
  if (rule.thirdWorkday) due = nextThirdWorkday(due);
  return due;
}

const applies = (task: ClosingTaskDef, conditions: ReadonlySet<ClosingCondition>): boolean => !task.onlyIf || conditions.has(task.onlyIf);

/** The market's tasks with their dates and state, in list order. */
export function scheduleClosingTasks(
  market: MarketCode,
  dates: ClosingDates,
  done: ReadonlySet<string>,
  conditions: ReadonlySet<ClosingCondition>,
  todayIso: string,
): ScheduledClosingTask[] {
  const soonLimit = addDays(todayIso, CLOSING_SOON_DAYS);
  return CLOSING_TASKS[market]
    .filter((task) => applies(task, conditions))
    .map((def) => {
      const due = def.due ? dueDate(def.due, dates) : null;
      const missing = def.due && !due ? def.due.from : null;
      const isDeadline = def.due?.kind === "deadline";
      const state = done.has(def.id)
        ? "done"
        : !due
          ? "undated"
          : isDeadline && due < todayIso
            ? "overdue"
            : due <= soonLimit
              ? "soon"
              : "open";
      return { def, due, missing, state };
    });
}

/** Today in the court's calendar, yyyy-mm-dd. */
export function todayIn(market: MarketCode, now: number): string {
  const zone = market === "TR" ? "Europe/Istanbul" : "Europe/Berlin";
  return new Intl.DateTimeFormat("en-CA", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(now));
}
