import { MarketCode } from "@/lib/constants";

/**
 * Everything that can be booked, in one place. The visible price on the order
 * page, the amount checked against Stripe and the row in billing_orders all
 * come from this table — a price in the browser or in a request is never
 * trusted.
 *
 * - "investor-monat" and "pro-monat" renew: a Stripe subscription,
 *   monthly, cancellable at any time to the end of the paid month.
 * - "investor-quartal" and "pro-quartal" are one-time payments for three
 *   calendar months. They do not renew, so nothing has to be cancelled.
 * - Larger team packages ("ab 299 €") are agreed individually.
 */
export const BILLING_OFFERS = ["investor-monat", "investor-quartal", "pro-monat", "pro-quartal"] as const;
export type BillingOfferId = (typeof BILLING_OFFERS)[number];

export type BillingKind = "subscription" | "one_time";

export interface OfferPrice {
  /** Gross amount in the smallest unit (cent / kuruş) */
  amount: number;
  /** ISO code in lower case, as Stripe writes it */
  currency: "eur" | "try";
}

export interface BillingOffer {
  id: BillingOfferId;
  plan: "investor" | "pro";
  kind: BillingKind;
  /** Calendar months of access per payment */
  months: number;
  prices: Record<MarketCode, OfferPrice>;
  /** Environment variable holding the Stripe price id, per market */
  priceEnv: Record<MarketCode, string>;
}

export const OFFERS: Record<BillingOfferId, BillingOffer> = {
  "investor-monat": {
    id: "investor-monat",
    plan: "investor",
    kind: "subscription",
    months: 1,
    prices: { DE: { amount: 3_900, currency: "eur" }, TR: { amount: 59_900, currency: "try" } },
    priceEnv: { DE: "STRIPE_PRICE_DE_INVESTOR_MONAT", TR: "STRIPE_PRICE_TR_INVESTOR_MONAT" },
  },
  "investor-quartal": {
    id: "investor-quartal",
    plan: "investor",
    kind: "one_time",
    months: 3,
    prices: { DE: { amount: 9_900, currency: "eur" }, TR: { amount: 149_000, currency: "try" } },
    priceEnv: { DE: "STRIPE_PRICE_DE_INVESTOR_QUARTAL", TR: "STRIPE_PRICE_TR_INVESTOR_QUARTAL" },
  },
  "pro-monat": {
    id: "pro-monat",
    plan: "pro",
    kind: "subscription",
    months: 1,
    prices: { DE: { amount: 12_900, currency: "eur" }, TR: { amount: 199_000, currency: "try" } },
    priceEnv: { DE: "STRIPE_PRICE_DE_PRO_MONAT", TR: "STRIPE_PRICE_TR_PRO_MONAT" },
  },
  "pro-quartal": {
    id: "pro-quartal",
    plan: "pro",
    kind: "one_time",
    months: 3,
    prices: { DE: { amount: 32_900, currency: "eur" }, TR: { amount: 499_000, currency: "try" } },
    priceEnv: { DE: "STRIPE_PRICE_DE_PRO_QUARTAL", TR: "STRIPE_PRICE_TR_PRO_QUARTAL" },
  },
};

export const DEFAULT_OFFER: BillingOfferId = "investor-monat";

export const isOfferId = (value: unknown): value is BillingOfferId =>
  typeof value === "string" && (BILLING_OFFERS as readonly string[]).includes(value);

/**
 * Version of AGB + Widerrufsbelehrung the order is placed under. Bump it
 * whenever /agb or /widerruf change in substance; every order stores it.
 */
export const TERMS_VERSION = "2026-10-26";

/** Query parameter of /buchen that preselects an offer. */
export const OFFER_PARAM = "tarif";

/** How VAT is shown: German VAT included, or the small-business note (§ 19 UStG). */
export type VatMode = "inclusive" | "kleinunternehmer";

/**
 * "stripe" = real checkout, "test" = local test checkout without Stripe
 * (development only), "off" = booking not possible (configuration missing).
 */
export type BillingMode = "stripe" | "test" | "off";

/** Reasons the order button is not offered, shown honestly on the order page. */
export type BillingBlocker = "not_configured" | "legal_not_approved" | "market_closed" | "price_missing";

export const BILLING_ROUTES = {
  order: "/buchen",
  testCheckout: "/bezahlen/test",
  confirm: "/api/billing/bestaetigen",
  webhook: "/api/billing/webhook",
  portal: "/api/billing/portal",
  export: "/konto/export",
  cancel: "/kuendigen",
  withdraw: "/widerruf/erklaeren",
} as const;

/** Status values on /konto after returning from the checkout. */
export const BILLING_STATUS = {
  paid: "bezahlt",
  cancelled: "abgebrochen",
  pending: "ausstehend",
} as const;
