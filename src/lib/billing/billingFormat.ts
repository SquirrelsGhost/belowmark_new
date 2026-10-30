import { LocaleOption } from "@/lib/constants";
import { OfferPrice } from "@/lib/billing/billingConfig";

const INTL_LOCALES: Record<LocaleOption, string> = { de: "de-DE", tr: "tr-TR" };

/** Contract dates are Berlin calendar dates — the provider sits in Germany. */
export const BILLING_TIME_ZONE = "Europe/Berlin";

/** Price with cents, as the contract states it: "39,00 €", "599,00 ₺". */
export function formatPrice(price: OfferPrice, locale: LocaleOption): string {
  return new Intl.NumberFormat(INTL_LOCALES[locale], {
    style: "currency",
    currency: price.currency.toUpperCase(),
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
  }).format(price.amount / 100);
}

/** Compact price for selection cards: omits ",00" when whole ("39 €", "1.490 ₺"). */
export function formatCardPrice(price: OfferPrice, locale: LocaleOption): string {
  const isWhole = price.amount % 100 === 0;
  return new Intl.NumberFormat(INTL_LOCALES[locale], {
    style: "currency",
    currency: price.currency.toUpperCase(),
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: isWhole ? 0 : 2,
  }).format(price.amount / 100);
}

/** "26.10.2026" in Berlin time. */
export function formatContractDate(date: Date, locale: LocaleOption): string {
  return new Intl.DateTimeFormat(INTL_LOCALES[locale], { day: "2-digit", month: "2-digit", year: "numeric", timeZone: BILLING_TIME_ZONE }).format(date);
}

/** "26.10.2026, 14:03:12 (MEZ)" — date and time of receipt for confirmations. */
export function formatReceiptTime(date: Date, locale: LocaleOption): string {
  return new Intl.DateTimeFormat(INTL_LOCALES[locale], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: BILLING_TIME_ZONE,
    timeZoneName: "short",
  }).format(date);
}

/** Replaces {name} placeholders. */
export const fill = (template: string, values: Record<string, string>): string =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
