import type { BillingBlocker, BillingMode, BillingOfferId, VatMode } from "@/lib/billing/billingConfig";

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
export type OrderBlocker = "subscription_running" | "term_running";

export interface OrderResult {
  /** Where the browser goes next: Stripe Checkout or the local test checkout */
  redirectUrl: string;
}
