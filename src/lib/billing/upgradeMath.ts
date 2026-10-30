import { BillingCurrency, BillingOfferId, MIN_UPGRADE_CHARGE, OFFERS } from "@/lib/billing/billingConfig";
import { addCalendarMonths } from "@/lib/billing/billingDates";
import { PricingCountryCode } from "@/lib/constants";

/**
 * Price of switching to Pro for the rest of what is already paid:
 *
 *   (Pro price − Investor price) × remaining time ÷ length of one term
 *
 * The term is the calendar month (or three calendar months) ending at the
 * current access end, so a mid-month upgrade costs about half the difference.
 * The end date does not move; from the next renewal the full Pro price is due.
 * Stripe prorates a subscription the same way (by the second); for a running
 * subscription its own preview is the amount charged.
 */
export function proratedUpgradeAmount(from: BillingOfferId, to: BillingOfferId, market: PricingCountryCode, endsAt: Date, now: Date = new Date()): number {
  const fromPrice = OFFERS[from].prices[market];
  const toPrice = OFFERS[to].prices[market];
  const difference = toPrice.amount - fromPrice.amount;
  const months = OFFERS[from].months;
  const termMs = endsAt.getTime() - addCalendarMonths(endsAt, -months).getTime();
  const remainingMs = Math.max(0, endsAt.getTime() - now.getTime());
  if (difference <= 0 || termMs <= 0) return 0;
  return Math.round((difference * remainingMs) / termMs);
}

/** Tiny remainders are not charged at all (see MIN_UPGRADE_CHARGE). */
export const isChargeable = (amount: number, currency: BillingCurrency): boolean => amount >= MIN_UPGRADE_CHARGE[currency];
