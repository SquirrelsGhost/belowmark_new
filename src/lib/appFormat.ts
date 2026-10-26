import { MARKET_TIME_ZONES } from "@/lib/appConstants";
import { LocaleOption, MarketCode } from "@/lib/constants";

/**
 * Formatting for the app area. Amounts follow the market (€ / ₺), dates the
 * time zone of the court — a hearing at 9:00 in Dortmund is 9:00 for everyone.
 */

const INTL_LOCALES: Record<LocaleOption, string> = { de: "de-DE", tr: "tr-TR" };
const CURRENCY: Record<MarketCode, string> = { DE: "EUR", TR: "TRY" };
const TIME_ZONE: Record<MarketCode, string> = MARKET_TIME_ZONES;

export function formatMoney(value: number, market: MarketCode, locale: LocaleOption): string {
  return new Intl.NumberFormat(INTL_LOCALES[locale], {
    style: "currency",
    currency: CURRENCY[market],
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactMoney(value: number, market: MarketCode, locale: LocaleOption): string {
  return new Intl.NumberFormat(INTL_LOCALES[locale], {
    style: "currency",
    currency: CURRENCY[market],
    currencyDisplay: "narrowSymbol",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatArea(value: number, locale: LocaleOption): string {
  return `${new Intl.NumberFormat(INTL_LOCALES[locale], { maximumFractionDigits: 0 }).format(value)} m²`;
}

interface DateParts {
  day: string;
  month: string;
  weekday: string;
  year: string;
  time: string;
}

/** Pieces of a hearing date for the calendar-sheet block of a list row. */
export function getDateParts(iso: string, market: MarketCode, locale: LocaleOption): DateParts {
  const date = new Date(iso);
  const part = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(INTL_LOCALES[locale], { ...options, timeZone: TIME_ZONE[market] }).format(date);
  return {
    day: part({ day: "2-digit" }),
    month: part({ month: "short" }).replace(".", ""),
    weekday: part({ weekday: "short" }).replace(".", ""),
    year: part({ year: "numeric" }),
    time: part({ hour: "2-digit", minute: "2-digit" }),
  };
}

/** e.g. "Di, 24.11.2026, 09:00" */
export function formatHearing(iso: string, market: MarketCode, locale: LocaleOption): string {
  return new Intl.DateTimeFormat(INTL_LOCALES[locale], {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIME_ZONE[market],
  }).format(new Date(iso));
}

/** e.g. "24.11." — for calendar weeks (dates are plain yyyy-mm-dd). */
export function formatDayMonth(isoDate: string, locale: LocaleOption): string {
  return new Intl.DateTimeFormat(INTL_LOCALES[locale], { day: "2-digit", month: "2-digit", timeZone: "UTC" }).format(new Date(isoDate));
}

/** Replaces {name} placeholders in a translation string. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in values ? String(values[name]) : match));
}

/** ISO 8601 calendar week of a yyyy-mm-dd date. */
export function isoWeek(isoDate: string): number {
  const date = new Date(`${isoDate}T00:00:00Z`);
  const thursday = new Date(date);
  thursday.setUTCDate(date.getUTCDate() + 3 - ((date.getUTCDay() + 6) % 7));
  const firstThursday = new Date(Date.UTC(thursday.getUTCFullYear(), 0, 4));
  return 1 + Math.round(((thursday.getTime() - firstThursday.getTime()) / 86_400_000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
}
