import { BILLING_OFFERS, BILLING_ROUTES, BillingOfferId, MARKET_PARAM, OFFER_PARAM, OFFERS, UPGRADES } from "@/lib/billing/billingConfig";
import { fill, formatCardPrice, formatContractDate } from "@/lib/billing/billingFormat";
import { LocaleOption, MarketCode, PricingCountryCode, pricingCountryToMarket } from "@/lib/constants";
import { BillingAccess, OrderBlocker } from "@/types/billing.types";
import { IBillingTranslation } from "@/translations/billing/IBillingTranslation";

type PlanKey = "investor" | "pro";

/** One price line inside a plan card: cadence, price, what happens at the end, and the one click. */
export interface AccountOfferRowView {
  id: BillingOfferId;
  cadence: string;
  price: string;
  /** Term rule, or the honest reason this line cannot be ordered right now */
  note: string;
  isCurrent: boolean;
  /** Absent when the line cannot be ordered (reason in note) */
  action?: { href: string; label: string; isPrimary: boolean };
}

export interface AccountPlanCardView {
  plan: PlanKey;
  name: string;
  summary: string;
  isCurrent: boolean;
  rows: AccountOfferRowView[];
}

type OrderBlockerFn = (access: BillingAccess, offer: BillingOfferId, currentMarket?: MarketCode, targetMarket?: MarketCode) => OrderBlocker | null;

const PLANS: PlanKey[] = ["investor", "pro"];

/**
 * The bookable packages on /konto as two cards (Investor, Pro), each with a
 * monthly and a three-month line. Prices come from OFFERS; whether a line can
 * be ordered follows the same orderBlocker as /buchen, so the card never
 * offers what the order page would refuse. One click leads to the order
 * summary with offer and country preselected, or to the prorated upgrade.
 */
export function buildAccountOfferCards(
  t: IBillingTranslation,
  access: BillingAccess,
  lang: LocaleOption,
  country: PricingCountryCode,
  currentMarket: MarketCode,
  blockerFor: OrderBlockerFn,
  marketOpen: boolean,
): AccountPlanCardView[] {
  const { Account, Order } = t;
  const targetMarket = pricingCountryToMarket(country);
  const date = access.endsAt ? formatContractDate(access.endsAt, lang) : "";
  const upgradeTarget = access.isActive && access.offer ? UPGRADES[access.offer] : undefined;

  const row = (id: BillingOfferId): AccountOfferRowView => {
    const offer = OFFERS[id];
    const text = Order.Offers[id];
    const blocker = blockerFor(access, id, currentMarket, targetMarket);
    const isCurrent = access.isActive && access.offer === id;
    const base = {
      id,
      // "Monatlich" already says the period; the three-month line adds "einmalig"
      cadence: offer.kind === "subscription" ? Account.Pick.Cadence.monthly : `${Account.Pick.Cadence.quarter} · ${text.Period}`,
      price: formatCardPrice(offer.prices[country], lang),
      isCurrent,
    };
    if (blocker === "use_upgrade" && upgradeTarget === id) {
      return { ...base, note: fill(Order.OrderBlockers.use_upgrade, { date }), action: { href: BILLING_ROUTES.upgrade, label: Account.Upgrade, isPrimary: true } };
    }
    if (blocker) return { ...base, note: fill(Order.OrderBlockers[blocker], { date }) };
    if (!marketOpen) return { ...base, note: text.Term };
    const href = `${BILLING_ROUTES.order}?${OFFER_PARAM}=${id}&${MARKET_PARAM}=${country}`;
    const label = isCurrent ? Account.Extend : Account.Pick.Choose;
    return { ...base, note: text.Term, action: { href, label, isPrimary: id === "investor-monat" || isCurrent } };
  };

  return PLANS.map((plan) => {
    const rows = BILLING_OFFERS.filter((id) => OFFERS[id].plan === plan).map(row);
    return {
      plan,
      name: Account.Pick.Plans[plan].Name,
      summary: Account.Pick.Plans[plan].Summary,
      isCurrent: access.isActive && access.plan === plan,
      rows,
    };
  });
}
