import { BILLING_OFFERS, BillingOfferId, OFFERS, VatMode } from "@/lib/billing/billingConfig";
import { fill, formatCardPrice, formatContractDate, formatPrice } from "@/lib/billing/billingFormat";
import { LocaleOption, MarketCode, PRICING_COUNTRIES, PricingCountryCode, pricingCountryToMarket } from "@/lib/constants";
import { BillingAccess, OrderBlocker } from "@/types/billing.types";
import { IBillingTranslation } from "@/translations/billing/IBillingTranslation";
import type { OrderOfferView } from "@/components/billing/OrderForm";

type OrderBlockerFn = (
  access: BillingAccess,
  offer: BillingOfferId,
  currentMarket?: MarketCode,
  targetMarket?: MarketCode,
) => OrderBlocker | null;

/** The offers for one country/market as the order form shows them, with honest reasons where one cannot be ordered. */
export function buildOrderOffers(
  t: IBillingTranslation,
  country: PricingCountryCode,
  lang: LocaleOption,
  access: BillingAccess,
  blockerFor: OrderBlockerFn,
  currentMarket: MarketCode = pricingCountryToMarket(country),
): OrderOfferView[] {
  const targetMarket = pricingCountryToMarket(country);
  return BILLING_OFFERS.map((id) => {
    const text = t.Order.Offers[id];
    const blocker = blockerFor(access, id, currentMarket, targetMarket);
    const date = access.endsAt ? formatContractDate(access.endsAt, lang) : "";
    const rawPrice = OFFERS[id].prices[country];
    return {
      id,
      name: text.Name,
      price: formatCardPrice(rawPrice, lang),
      totalPrice: formatPrice(rawPrice, lang),
      period: text.Period,
      term: text.Term,
      summary: text.Summary,
      badge: id === "investor-monat" ? t.Order.Recommended : undefined,
      blockedReason: blocker ? fill(t.Order.OrderBlockers[blocker], { date }) : undefined,
    };
  });
}

/** Offers for all 8 countries so the country switch on /buchen updates prices immediately. */
export function buildOrderOffersByMarket(
  t: IBillingTranslation,
  currentMarket: MarketCode,
  lang: LocaleOption,
  access: BillingAccess,
  blockerFor: OrderBlockerFn,
): Record<PricingCountryCode, OrderOfferView[]> {
  return Object.fromEntries(
    PRICING_COUNTRIES.map((code) => [code, buildOrderOffers(t, code, lang, access, blockerFor, currentMarket)]),
  ) as Record<PricingCountryCode, OrderOfferView[]>;
}

/** VAT line under the total, following BILLING_VAT_MODE (Europe) or BILLING_TR_KDV (Türkiye). */
export function vatNote(t: IBillingTranslation, vatMode: VatMode | null, country: PricingCountryCode = "DE", trKdvIncluded = false): string {
  if (country === "TR") return trKdvIncluded ? t.Order.VatTrKdv : t.Order.VatTr;
  if (vatMode === "inclusive") return t.Order.VatInclusive;
  if (vatMode === "kleinunternehmer") return t.Order.VatSmallBusiness;
  return t.Order.VatOpen;
}

/** First offer that can be ordered, preferring the one in the URL. */
export function pickInitialOffer(offers: OrderOfferView[], wanted: string | undefined): string {
  const preferred = offers.find((offer) => offer.id === wanted && !offer.blockedReason);
  return (preferred ?? offers.find((offer) => !offer.blockedReason) ?? offers[0]).id;
}
