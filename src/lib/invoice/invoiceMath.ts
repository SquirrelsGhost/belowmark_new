import { addCalendarMonths } from "@/lib/billing/billingDates";
import { BILLING_TIME_ZONE } from "@/lib/billing/billingFormat";
import { INVOICE_NUMBER_DIGITS, INVOICE_NUMBER_PREFIX } from "@/lib/invoice/invoiceConfig";

export interface VatSplit {
  net: number;
  vat: number;
}

/** Net and VAT contained in a gross amount (all in cent). The VAT is the rest, so net + VAT is always the gross. */
export function splitGross(gross: number, rateBp: number): VatSplit {
  const net = Math.round((gross * 10_000) / (10_000 + rateBp));
  return { net, vat: gross - net };
}

/** "BM-2026-00042" — the year is the Berlin calendar year of issue. */
export function invoiceNumber(seq: number, issuedAt: Date): string {
  const year = new Intl.DateTimeFormat("de-DE", { year: "numeric", timeZone: BILLING_TIME_ZONE }).format(issuedAt);
  return `${INVOICE_NUMBER_PREFIX}-${year}-${String(seq).padStart(INVOICE_NUMBER_DIGITS, "0")}`;
}

/** Period an order paid for: the months before the access end it set (an extension starts where the old term ended). */
export function orderServicePeriod(paidAt: Date, accessEndsAt: Date | null, months: number): { from: Date; to: Date } {
  const to = accessEndsAt ?? addCalendarMonths(paidAt, months);
  return { from: addCalendarMonths(to, -months), to };
}
