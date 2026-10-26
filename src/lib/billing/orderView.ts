import { BILLING_OFFERS, BillingOfferId, OFFERS, VatMode } from "@/lib/billing/billingConfig";
import { fill, formatContractDate, formatPrice } from "@/lib/billing/billingFormat";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { BillingAccess } from "@/types/billing.types";
import { IBillingTranslation } from "@/translations/billing/IBillingTranslation";
import type { OrderOfferView } from "@/components/billing/OrderForm";

type OrderBlockerFn = (access: BillingAccess, offer: BillingOfferId) => "subscription_running" | "term_running" | null;

/** The two durations as the order form shows them, with honest reasons where one cannot be ordered. */
export function buildOrderOffers(
  t: IBillingTranslation,
  market: MarketCode,
  lang: LocaleOption,
  access: BillingAccess,
  blockerFor: OrderBlockerFn,
): OrderOfferView[] {
  return BILLING_OFFERS.map((id) => {
    const text = t.Order.Offers[id];
    const blocker = blockerFor(access, id);
    const date = access.endsAt ? formatContractDate(access.endsAt, lang) : "";
    return {
      id,
      name: text.Name,
      price: formatPrice(OFFERS[id].prices[market], lang),
      period: text.Period,
      term: text.Term,
      summary: text.Summary,
      badge: id === "investor-monat" ? t.Order.Recommended : undefined,
      blockedReason: blocker ? fill(t.Order.OrderBlockers[blocker], { date }) : undefined,
    };
  });
}

/** VAT line under the total, following BILLING_VAT_MODE. */
export function vatNote(t: IBillingTranslation, vatMode: VatMode | null): string {
  if (vatMode === "inclusive") return t.Order.VatInclusive;
  if (vatMode === "kleinunternehmer") return t.Order.VatSmallBusiness;
  return t.Order.VatOpen;
}

/** First offer that can be ordered, preferring the one in the URL. */
export function pickInitialOffer(offers: OrderOfferView[], wanted: string | undefined): string {
  const preferred = offers.find((offer) => offer.id === wanted && !offer.blockedReason);
  return (preferred ?? offers.find((offer) => !offer.blockedReason) ?? offers[0]).id;
}
