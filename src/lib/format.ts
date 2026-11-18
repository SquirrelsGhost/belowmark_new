import { LocaleOption } from "@/lib/constants";

export type HomeCurrencyCode = "EUR" | "TRY" | "GBP" | "CHF" | "PLN" | "CZK" | "SEK";

const INTL_LOCALES: Record<LocaleOption, string> = {
  de: "de-DE",
  tr: "tr-TR",
  en: "en-GB",
  it: "it-IT",
  es: "es-ES",
  fr: "fr-FR",
};

/** Whole-unit currency amount in any supported market currency (EUR, TRY, GBP, CHF, PLN, CZK, SEK). */
export function formatMoney(value: number, currency: HomeCurrencyCode, locale: LocaleOption): string {
  return new Intl.NumberFormat(INTL_LOCALES[locale], {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

/** Compact large currency amounts, e.g. "140,0 Mrd. ₺" or "£159.1M". */
export function formatCompactMoney(value: number, currency: HomeCurrencyCode, locale: LocaleOption): string {
  return new Intl.NumberFormat(INTL_LOCALES[locale], {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/** Whole-euro amount, e.g. "240.000 €". */
export function formatEuro(value: number, locale: LocaleOption): string {
  return formatMoney(value, "EUR", locale);
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

/** Compact large amounts in EUR, e.g. "1,1 Mrd. €". */
export function formatCompactEuro(value: number, locale: LocaleOption): string {
  return formatCompactMoney(value, "EUR", locale);
}
