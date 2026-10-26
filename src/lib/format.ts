import { LocaleOption } from "@/lib/constants";

const INTL_LOCALES: Record<LocaleOption, string> = { de: "de-DE", tr: "tr-TR" };

/** Whole-euro amount, e.g. "240.000 €". */
export function formatEuro(value: number, locale: LocaleOption): string {
  return new Intl.NumberFormat(INTL_LOCALES[locale], {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Plain grouped number, e.g. "3.519". */
export function formatNumber(value: number, locale: LocaleOption): string {
  return new Intl.NumberFormat(INTL_LOCALES[locale]).format(value);
}

/** Percent with up to one decimal, e.g. "6,5 %". */
export function formatPercent(value: number, locale: LocaleOption): string {
  return new Intl.NumberFormat(INTL_LOCALES[locale], { style: "percent", maximumFractionDigits: 1 }).format(value / 100);
}

/** Short date, e.g. "15.10." */
export function formatShortDate(iso: string, locale: LocaleOption): string {
  return new Intl.DateTimeFormat(INTL_LOCALES[locale], { day: "2-digit", month: "2-digit", timeZone: "UTC" }).format(new Date(iso));
}

/** Long date, e.g. "05.09.2026". */
export function formatDate(iso: string, locale: LocaleOption): string {
  return new Intl.DateTimeFormat(INTL_LOCALES[locale], { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }).format(new Date(iso));
}

/** Compact large amounts, e.g. "1,1 Mrd. €". */
export function formatCompactEuro(value: number, locale: LocaleOption): string {
  return new Intl.NumberFormat(INTL_LOCALES[locale], {
    style: "currency",
    currency: "EUR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
