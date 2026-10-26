import { LocaleOption } from "@/lib/constants";

const INTL_LOCALES: Record<LocaleOption, string> = { de: "de-DE", tr: "tr-TR" };

/** "2026-07" → "Juli 2026" / "Temmuz 2026" */
export function formatMonth(month: string, locale: LocaleOption): string {
  const [year, index] = month.split("-").map(Number);
  return new Intl.DateTimeFormat(INTL_LOCALES[locale], { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, index - 1, 1)));
}

/** Exchange rate with four decimals, as the TCMB publishes it: "47,1234 ₺" */
export function formatRate(rate: number, locale: LocaleOption): string {
  return new Intl.NumberFormat(INTL_LOCALES[locale], { style: "currency", currency: "TRY", currencyDisplay: "narrowSymbol", minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(rate);
}

/** "×1,84" */
export function formatFactor(factor: number, locale: LocaleOption): string {
  return `×${new Intl.NumberFormat(INTL_LOCALES[locale], { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(factor)}`;
}

/** Check-kit lines in the order e-Satış asks for them; field names stay Turkish, as typed there. */
export function checkKitText(fields: [string, string | null][], notStated: string): string {
  return fields.map(([label, value]) => `${label}: ${value ?? notStated}`).join("\n");
}
