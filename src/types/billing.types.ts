import type { BillingBlocker, BillingMode, BillingOfferId, VatMode } from "@/lib/billing/billingConfig";
import type { MarketCode } from "@/lib/constants";

/** Whether the order button can be offered in this market right now, and why not. */
export interface BillingAvailability {
  mode: BillingMode;
  /** null = bookable */
  blocker: BillingBlocker | null;
  vatMode: VatMode | null;
  /** Test checkout or Stripe test key: no real money moves */
  isTest: boolean;
}

/** Paid access of one account, as /konto and /buchen show it. */
export interface BillingAccess {
  plan: string | null;
  offer: BillingOfferId | null;
  endsAt: Date | null;
  /** Access ends at endsAt and nothing renews */
  cancelAt: Date | null;
  /** The monthly subscription renews at endsAt */
  renews: boolean;
  isActive: boolean;
  hasStripeCustomer: boolean;
}

/** Why an order for an offer is refused although billing is available. */
export type OrderBlocker = "subscription_running" | "term_running" | "use_upgrade" | "pro_running" | "other_market";

/** Investor → Pro for the rest of the paid period. */
export interface UpgradeQuote {
  from: BillingOfferId;
  to: BillingOfferId;
  market: MarketCode;
  currency: "eur" | "try";
  /** Prorated difference due now, smallest unit; 0 = switched without charge */
  amount: number;
  /** Unchanged end of the paid period */
  endsAt: Date;
  /** Monthly subscription that renews — from then on at the Pro price */
  renews: boolean;
  /** Swapped on the Stripe subscription (Stripe invoices the proration) */
  viaSubscription: boolean;
}

export interface OrderResult {
  /** Where the browser goes next: Stripe Checkout or the local test checkout */
  redirectUrl: string;
}
