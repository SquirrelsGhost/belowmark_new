import { MARKET_TIME_ZONES } from "@/lib/appConstants";
import { fill, formatHearing } from "@/lib/appFormat";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { dayIn, daysBetween } from "@/lib/deadlines/deadlineDates";
import { DeadlineItem } from "@/types/deadline.types";

const INTL = { de: "de-DE", tr: "tr-TR" } as const;

/** "Mo, 26.10.2026" for a day, "Mo, 26.10.2026, 09:00" when the entry has a time. */
export function formatDeadlineWhen(item: DeadlineItem, market: MarketCode, locale: LocaleOption): string {
  if (item.time) return formatHearing(item.time, market, locale);
  return new Intl.DateTimeFormat(INTL[locale], { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }).format(new Date(`${item.date}T00:00:00Z`));
}

interface RelativeLabels {
  Past: string;
  Today: string;
  Tomorrow: string;
  InDays: string;
}

/** "heute", "morgen", "in 5 Tagen" or "vorbei" — counted in the court's calendar days. */
export function formatDeadlineDistance(item: DeadlineItem, today: string, now: number, labels: RelativeLabels): string {
  const days = daysBetween(today, item.date);
  if (isDeadlinePast(item, today, now)) return labels.Past;
  if (days === 0) return labels.Today;
  if (days === 1) return labels.Tomorrow;
  return fill(labels.InDays, { days });
}

export const isDeadlinePast = (item: DeadlineItem, today: string, now: number): boolean =>
  daysBetween(today, item.date) < 0 || (item.time !== undefined && Date.parse(item.time) < now && daysBetween(today, item.date) === 0);

/** Today in the court's time zone. */
export const marketToday = (market: MarketCode, now: number): string => dayIn(now, MARKET_TIME_ZONES[market]);
