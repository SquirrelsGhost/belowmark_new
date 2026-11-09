import { BILLING_OFFERS, BillingOfferId, OFFERS, VatMode } from "@/lib/billing/billingConfig";
import { fill, formatCardPrice, formatContractDate, formatPrice } from "@/lib/billing/billingFormat";
import { formatZeroTrialPrice, TRIAL_COPY } from "@/lib/billing/trialCopy";
import { LocaleOption, PRICING_COUNTRIES, PricingCountryCode } from "@/lib/constants";
import { BillingAccess, OrderBlocker } from "@/types/billing.types";
import { IBillingTranslation } from "@/translations/billing/IBillingTranslation";
import type { OrderOfferView } from "@/components/billing/OrderForm";

type OrderBlockerFn = (
  access: BillingAccess,
  offer: BillingOfferId,
  currentCountry?: PricingCountryCode,
  targetCountry?: PricingCountryCode,
) => OrderBlocker | null;

export interface BuildOrderOffersOptions {
  trialEligible?: boolean;
  vatLine?: string;
}

/** VAT line under the total, following BILLING_VAT_MODE (Europe) or BILLING_TR_KDV (Türkiye). */
export function vatNote(t: IBillingTranslation, vatMode: VatMode | null, country: PricingCountryCode = "DE", trKdvIncluded = false): string {
  if (country === "TR") return trKdvIncluded ? t.Order.VatTrKdv : t.Order.VatTr;
  if (vatMode === "inclusive") return t.Order.VatInclusive;
  if (vatMode === "kleinunternehmer") return t.Order.VatSmallBusiness;
  return t.Order.VatOpen;
}

/** The offers for one country/market as the order form shows them, with honest reasons where one cannot be ordered. */
export function buildOrderOffers(
  t: IBillingTranslation,
  country: PricingCountryCode,
  lang: LocaleOption,
  access: BillingAccess,
  blockerFor: OrderBlockerFn,
  currentCountry: PricingCountryCode = country,
  options: BuildOrderOffersOptions = {},
): OrderOfferView[] {
  const trialCopy = TRIAL_COPY[lang] ?? TRIAL_COPY.de;
  return BILLING_OFFERS.map((id) => {
    const offerCfg = OFFERS[id];
    const text = t.Order.Offers[id];
    const blocker = blockerFor(access, id, currentCountry, country);
    const date = access.endsAt ? formatContractDate(access.endsAt, lang) : "";
    const rawPrice = offerCfg.prices[country];
    const cardPrice = formatCardPrice(rawPrice, lang);
    const fullPrice = formatPrice(rawPrice, lang);
    const isTrial = Boolean(options.trialEligible && offerCfg.kind === "subscription" && !blocker);

    if (isTrial) {
      return {
        id,
        name: text.Name,
        price: formatZeroTrialPrice(rawPrice.currency, lang, true),
        totalPrice: fullPrice,
        period: trialCopy.orderTrialPeriod,
        term: trialCopy.orderTrialTerm(cardPrice, text.Period),
        summary: text.Summary,
        badge: trialCopy.orderBadge,
        isTrial: true,
        trialStartValue: trialCopy.summaryStartTrial,
        trialAfterLabel: trialCopy.summaryAfterTrialLabel,
        trialAfterValue: trialCopy.summaryAfterTrialValue(fullPrice, text.Period),
        trialDueTodayLabel: trialCopy.summaryDueTodayLabel,
        trialDueTodayPrice: formatZeroTrialPrice(rawPrice.currency, lang, false),
        trialDueTodayNote: trialCopy.summaryDueTodayNote(fullPrice, text.Period, options.vatLine ?? t.Order.VatOpen),
        trialSubmitLabel: trialCopy.submitTrial,
        trialPaymentNote: trialCopy.paymentNoteTrial,
      };
    }

    return {
      id,
      name: text.Name,
      price: cardPrice,
      totalPrice: fullPrice,
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
  currentCountry: PricingCountryCode,
  lang: LocaleOption,
  access: BillingAccess,
  blockerFor: OrderBlockerFn,
  options?: { trialEligible?: boolean; vatNotes?: Record<PricingCountryCode, string> },
): Record<PricingCountryCode, OrderOfferView[]> {
  return Object.fromEntries(
    PRICING_COUNTRIES.map((code) => [
      code,
      buildOrderOffers(t, code, lang, access, blockerFor, currentCountry, {
        trialEligible: options?.trialEligible,
        vatLine: options?.vatNotes?.[code],
      }),
    ]),
  ) as Record<PricingCountryCode, OrderOfferView[]>;
}

/** First offer that can be ordered, preferring the one in the URL. */
export function pickInitialOffer(offers: OrderOfferView[], wanted: string | undefined): string {
  const preferred = offers.find((offer) => offer.id === wanted && !offer.blockedReason);
  return (preferred ?? offers.find((offer) => !offer.blockedReason) ?? offers[0]).id;
}
