import type { PricingCountryCode } from "@/lib/constants";

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
export const BILLING_OFFERS = ["investor-monat", "investor-pass", "investor-quartal", "pro-monat", "pro-quartal"] as const;
export type BillingOfferId = (typeof BILLING_OFFERS)[number];

export type BillingKind = "subscription" | "one_time";

export type BillingCurrency = "eur" | "chf" | "gbp" | "try" | "pln" | "czk" | "sek";

export const toBillingCurrency = (value: string | null | undefined): BillingCurrency => {
  const lower = value?.toLowerCase();
  if (lower === "try" || lower === "chf" || lower === "gbp" || lower === "pln" || lower === "czk" || lower === "sek") return lower;
  return "eur";
};

export interface OfferPrice {
  /** Gross amount in the smallest unit (cent / Rappen / pence / kuruş) */
  amount: number;
  /** ISO code in lower case, as Stripe writes it */
  currency: BillingCurrency;
}

export interface BillingOffer {
  id: BillingOfferId;
  plan: "investor" | "pro";
  kind: BillingKind;
  /** Calendar months of access per payment (0 when `days` is used instead) */
  months: number;
  /** Fixed days of access per payment (e.g. 14-day one-time pass) */
  days?: number;
  prices: Record<PricingCountryCode, OfferPrice>;
  /** Environment variable holding the Stripe price id, per country */
  priceEnv: Record<PricingCountryCode, string>;
}

export const OFFERS: Record<BillingOfferId, BillingOffer> = {
  "investor-monat": {
    id: "investor-monat",
    plan: "investor",
    kind: "subscription",
    months: 1,
    prices: {
      DE: { amount: 3_900, currency: "eur" },
      AT: { amount: 3_900, currency: "eur" },
      FR: { amount: 3_900, currency: "eur" },
      IT: { amount: 2_900, currency: "eur" },
      ES: { amount: 2_900, currency: "eur" },
      CH: { amount: 4_900, currency: "chf" },
      GB: { amount: 3_500, currency: "gbp" },
      NL: { amount: 3_900, currency: "eur" },
      PL: { amount: 12_900, currency: "pln" },
      CZ: { amount: 79_000, currency: "czk" },
      SE: { amount: 42_900, currency: "sek" },
      TR: { amount: 59_900, currency: "try" },
    },
    priceEnv: {
      DE: "STRIPE_PRICE_DE_INVESTOR_MONAT",
      AT: "STRIPE_PRICE_AT_INVESTOR_MONAT",
      FR: "STRIPE_PRICE_FR_INVESTOR_MONAT",
      IT: "STRIPE_PRICE_IT_INVESTOR_MONAT",
      ES: "STRIPE_PRICE_ES_INVESTOR_MONAT",
      CH: "STRIPE_PRICE_CH_INVESTOR_MONAT",
      GB: "STRIPE_PRICE_GB_INVESTOR_MONAT",
      NL: "STRIPE_PRICE_NL_INVESTOR_MONAT",
      PL: "STRIPE_PRICE_PL_INVESTOR_MONAT",
      CZ: "STRIPE_PRICE_CZ_INVESTOR_MONAT",
      SE: "STRIPE_PRICE_SE_INVESTOR_MONAT",
      TR: "STRIPE_PRICE_TR_INVESTOR_MONAT",
    },
  },
  "investor-pass": {
    id: "investor-pass",
    plan: "investor",
    kind: "one_time",
    months: 0,
    days: 14,
    prices: {
      DE: { amount: 1_490, currency: "eur" },
      AT: { amount: 1_490, currency: "eur" },
      FR: { amount: 1_490, currency: "eur" },
      IT: { amount: 1_290, currency: "eur" },
      ES: { amount: 1_290, currency: "eur" },
      CH: { amount: 1_900, currency: "chf" },
      GB: { amount: 1_290, currency: "gbp" },
      NL: { amount: 1_490, currency: "eur" },
      PL: { amount: 5_900, currency: "pln" },
      CZ: { amount: 34_900, currency: "czk" },
      SE: { amount: 16_900, currency: "sek" },
      TR: { amount: 24_900, currency: "try" },
    },
    priceEnv: {
      DE: "STRIPE_PRICE_DE_INVESTOR_PASS",
      AT: "STRIPE_PRICE_AT_INVESTOR_PASS",
      FR: "STRIPE_PRICE_FR_INVESTOR_PASS",
      IT: "STRIPE_PRICE_IT_INVESTOR_PASS",
      ES: "STRIPE_PRICE_ES_INVESTOR_PASS",
      CH: "STRIPE_PRICE_CH_INVESTOR_PASS",
      GB: "STRIPE_PRICE_GB_INVESTOR_PASS",
      NL: "STRIPE_PRICE_NL_INVESTOR_PASS",
      PL: "STRIPE_PRICE_PL_INVESTOR_PASS",
      CZ: "STRIPE_PRICE_CZ_INVESTOR_PASS",
      SE: "STRIPE_PRICE_SE_INVESTOR_PASS",
      TR: "STRIPE_PRICE_TR_INVESTOR_PASS",
    },
  },
  "investor-quartal": {
    id: "investor-quartal",
    plan: "investor",
    kind: "one_time",
    months: 3,
    prices: {
      DE: { amount: 9_900, currency: "eur" },
      AT: { amount: 9_900, currency: "eur" },
      FR: { amount: 9_900, currency: "eur" },
      IT: { amount: 7_900, currency: "eur" },
      ES: { amount: 7_900, currency: "eur" },
      CH: { amount: 12_900, currency: "chf" },
      GB: { amount: 8_900, currency: "gbp" },
      NL: { amount: 9_900, currency: "eur" },
      PL: { amount: 32_900, currency: "pln" },
      CZ: { amount: 199_000, currency: "czk" },
      SE: { amount: 109_000, currency: "sek" },
      TR: { amount: 149_000, currency: "try" },
    },
    priceEnv: {
      DE: "STRIPE_PRICE_DE_INVESTOR_QUARTAL",
      AT: "STRIPE_PRICE_AT_INVESTOR_QUARTAL",
      FR: "STRIPE_PRICE_FR_INVESTOR_QUARTAL",
      IT: "STRIPE_PRICE_IT_INVESTOR_QUARTAL",
      ES: "STRIPE_PRICE_ES_INVESTOR_QUARTAL",
      CH: "STRIPE_PRICE_CH_INVESTOR_QUARTAL",
      GB: "STRIPE_PRICE_GB_INVESTOR_QUARTAL",
      NL: "STRIPE_PRICE_NL_INVESTOR_QUARTAL",
      PL: "STRIPE_PRICE_PL_INVESTOR_QUARTAL",
      CZ: "STRIPE_PRICE_CZ_INVESTOR_QUARTAL",
      SE: "STRIPE_PRICE_SE_INVESTOR_QUARTAL",
      TR: "STRIPE_PRICE_TR_INVESTOR_QUARTAL",
    },
  },
  "pro-monat": {
    id: "pro-monat",
    plan: "pro",
    kind: "subscription",
    months: 1,
    prices: {
      DE: { amount: 12_900, currency: "eur" },
      AT: { amount: 12_900, currency: "eur" },
      FR: { amount: 12_900, currency: "eur" },
      IT: { amount: 9_900, currency: "eur" },
      ES: { amount: 9_900, currency: "eur" },
      CH: { amount: 15_900, currency: "chf" },
      GB: { amount: 11_900, currency: "gbp" },
      NL: { amount: 12_900, currency: "eur" },
      PL: { amount: 39_900, currency: "pln" },
      CZ: { amount: 249_000, currency: "czk" },
      SE: { amount: 139_000, currency: "sek" },
      TR: { amount: 199_000, currency: "try" },
    },
    priceEnv: {
      DE: "STRIPE_PRICE_DE_PRO_MONAT",
      AT: "STRIPE_PRICE_AT_PRO_MONAT",
      FR: "STRIPE_PRICE_FR_PRO_MONAT",
      IT: "STRIPE_PRICE_IT_PRO_MONAT",
      ES: "STRIPE_PRICE_ES_PRO_MONAT",
      CH: "STRIPE_PRICE_CH_PRO_MONAT",
      GB: "STRIPE_PRICE_GB_PRO_MONAT",
      NL: "STRIPE_PRICE_NL_PRO_MONAT",
      PL: "STRIPE_PRICE_PL_PRO_MONAT",
      CZ: "STRIPE_PRICE_CZ_PRO_MONAT",
      SE: "STRIPE_PRICE_SE_PRO_MONAT",
      TR: "STRIPE_PRICE_TR_PRO_MONAT",
    },
  },
  "pro-quartal": {
    id: "pro-quartal",
    plan: "pro",
    kind: "one_time",
    months: 3,
    prices: {
      DE: { amount: 32_900, currency: "eur" },
      AT: { amount: 32_900, currency: "eur" },
      FR: { amount: 32_900, currency: "eur" },
      IT: { amount: 24_900, currency: "eur" },
      ES: { amount: 24_900, currency: "eur" },
      CH: { amount: 39_900, currency: "chf" },
      GB: { amount: 29_900, currency: "gbp" },
      NL: { amount: 32_900, currency: "eur" },
      PL: { amount: 99_000, currency: "pln" },
      CZ: { amount: 649_000, currency: "czk" },
      SE: { amount: 359_000, currency: "sek" },
      TR: { amount: 499_000, currency: "try" },
    },
    priceEnv: {
      DE: "STRIPE_PRICE_DE_PRO_QUARTAL",
      AT: "STRIPE_PRICE_AT_PRO_QUARTAL",
      FR: "STRIPE_PRICE_FR_PRO_QUARTAL",
      IT: "STRIPE_PRICE_IT_PRO_QUARTAL",
      ES: "STRIPE_PRICE_ES_PRO_QUARTAL",
      CH: "STRIPE_PRICE_CH_PRO_QUARTAL",
      GB: "STRIPE_PRICE_GB_PRO_QUARTAL",
      NL: "STRIPE_PRICE_NL_PRO_QUARTAL",
      PL: "STRIPE_PRICE_PL_PRO_QUARTAL",
      CZ: "STRIPE_PRICE_CZ_PRO_QUARTAL",
      SE: "STRIPE_PRICE_SE_PRO_QUARTAL",
      TR: "STRIPE_PRICE_TR_PRO_QUARTAL",
    },
  },
};

export const DEFAULT_OFFER: BillingOfferId = "investor-monat";

/**
 * Upgrade path Investor → Pro, keeping the cadence: a monthly subscription
 * becomes the Pro subscription, a three-month term becomes a Pro term with
 * the same end date. The rule for the price is in upgradeMath.ts.
 */
export const UPGRADES: Partial<Record<BillingOfferId, BillingOfferId>> = {
  "investor-monat": "pro-monat",
  "investor-quartal": "pro-quartal",
};

/**
 * Below this an upgrade is not charged (Stripe refuses charges under about
 * 0,50 € after conversion; for TRY a round amount safely above that).
 */
export const MIN_UPGRADE_CHARGE: Record<BillingCurrency, number> = {
  eur: 50,
  chf: 50,
  gbp: 50,
  pln: 250,
  czk: 1_500,
  sek: 600,
  try: 5_000,
};

export const isOfferId = (value: unknown): value is BillingOfferId =>
  typeof value === "string" && (BILLING_OFFERS as readonly string[]).includes(value);

/**
 * Version of AGB + Widerrufsbelehrung the order is placed under. Bump it
 * whenever /agb or /widerruf change in substance; every order stores it.
 */
export const TERMS_VERSION = "2026-10-30";

/** Query parameter of /buchen that preselects an offer. */
export const OFFER_PARAM = "tarif";

/** Query parameter of /buchen that preselects a market (DE or TR). */
export const MARKET_PARAM = "markt";

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
  upgrade: "/buchen/upgrade",
  testCheckout: "/bezahlen/test",
  confirm: "/api/billing/bestaetigen",
  webhook: "/api/billing/webhook",
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
