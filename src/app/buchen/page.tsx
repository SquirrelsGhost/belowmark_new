import { Metadata } from "next";
import AuthCard from "@/components/auth/AuthCard";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthTextLink from "@/components/auth/AuthTextLink";
import BillingNotice from "@/components/billing/BillingNotice";
import OrderForm from "@/components/billing/OrderForm";
import OrderIntro from "@/components/billing/OrderIntro";
import OrderProNote from "@/components/billing/OrderProNote";
import PageStack from "@/components/ui/PageStack";
import { BILLING_ROUTES, BILLING_STATUS, MARKET_PARAM, OFFER_PARAM, UPGRADES } from "@/lib/billing/billingConfig";
import { OrderMarketView } from "@/lib/billing/billingForm.types";
import { buildOrderOffersByMarket, pickInitialOffer, vatNote } from "@/lib/billing/orderView";
import { isPricingCountry, PRICING_COUNTRIES, PricingCountryCode, ROUTES } from "@/lib/constants";
import { env } from "@/lib/env";
import { getLegalPageContext, legalMetadata } from "@/lib/legal/legalPage";
import { BillingService } from "@/services/billing/BillingService";
import { CountryAccessService } from "@/services/CountryAccessService";
import { RegionService } from "@/services/RegionService";
import { SessionService } from "@/services/SessionService";
import { TranslationService } from "@/services/TranslationService";
import { AuthTranslations } from "@/translations/auth/AuthTranslations";
import { openLegalGaps } from "@/translations/legal/LegalDocuments";
import { BillingAccess } from "@/types/billing.types";

const GUEST_ACCESS: BillingAccess = {
  plan: null,
  offer: null,
  endsAt: null,
  cancelAt: null,
  renews: false,
  isActive: false,
  hasStripeCustomer: false,
};

// Reads the session and the locale cookie on every request.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return legalMetadata((t) => t.Meta.Order, true);
}

export default async function OrderPage({ searchParams }: PageProps<"/buchen">) {
  const params = await searchParams;
  const wanted = typeof params[OFFER_PARAM] === "string" ? params[OFFER_PARAM] : undefined;
  const rawMarket = typeof params[MARKET_PARAM] === "string" ? params[MARKET_PARAM].toUpperCase() : undefined;
  const initialGuestEmail = typeof params.email === "string" ? params.email.trim().slice(0, 254) : undefined;

  const [currentUser, { t, layout, lang }, userLocale, homeTranslations, region] = await Promise.all([
    SessionService.getCurrentUser(),
    getLegalPageContext(),
    TranslationService.GetUserLocale(),
    TranslationService.GetUserTranslations(),
    RegionService.GetRegion(),
  ]);
  const viewerCountry: PricingCountryCode = currentUser
    ? (await CountryAccessService.forUser(currentUser)).country
    : region.pricingCountry;

  const { Fields } = AuthTranslations[userLocale];
  const { Order } = t;
  const pricingMarkets = homeTranslations.HomePage.Pricing.Markets;

  const initialMarket: PricingCountryCode = isPricingCountry(rawMarket) ? rawMarket : viewerCountry;
  const availabilityDe = BillingService.availability("DE");
  const availabilityTr = BillingService.availability("TR");
  const availability = initialMarket === "TR" ? availabilityTr : availabilityDe;
  const [access, trialEligible] = currentUser
    ? await Promise.all([BillingService.access(currentUser.id), BillingService.isTrialEligible(currentUser.id)])
    : [GUEST_ACCESS, true];
  const vatNotes = Object.fromEntries(
    PRICING_COUNTRIES.map((code) => [
      code,
      vatNote(t, code === "TR" ? availabilityTr.vatMode : availabilityDe.vatMode, code, env.billingTrKdvIncluded),
    ]),
  ) as Record<PricingCountryCode, string>;
  const offersByMarket = buildOrderOffersByMarket(t, viewerCountry, lang, access, BillingService.orderBlocker, {
    trialEligible,
    vatNotes,
  });
  const allBlocked = PRICING_COUNTRIES.every((code) => offersByMarket[code].every((offer) => offer.blockedReason));
  const bothMarketsClosed = Boolean(availabilityDe.blocker && availabilityTr.blocker);
  const canUpgrade = access.isActive && access.plan === "investor" && Boolean(access.offer && UPGRADES[access.offer]);
  const upgrade = canUpgrade ? { href: BILLING_ROUTES.upgrade, label: Order.UpgradeCta } : undefined;
  const gaps = availability.isTest && !env.billingLegalApproved ? openLegalGaps(availability.vatMode) : [];

  const markets = Object.fromEntries(
    PRICING_COUNTRIES.map((code) => {
      const avail = code === "TR" ? availabilityTr : availabilityDe;
      const meta = pricingMarkets[code];
      const view: OrderMarketView = {
        code,
        label: meta.Label,
        hint: meta.Scope,
        blocker: avail.blocker ? Order.Blockers[avail.blocker] : undefined,
      };
      return [code, view];
    }),
  ) as Record<PricingCountryCode, OrderMarketView>;

  const notices = (
    <>
      {params.status === BILLING_STATUS.cancelled && <BillingNotice tone="signal" message={Order.Cancelled} />}
      {availability.isTest && !bothMarketsClosed && (
        <BillingNotice tone="signal" message={Order.TestBanner} items={gaps.length ? [Order.GapsTitle, ...gaps] : undefined} />
      )}
    </>
  );

  return (
    <AuthLayout lang={lang} layout={layout}>
      <OrderIntro eyebrow={Order.Eyebrow} title={Order.Title} lead={Order.Lead} lineLabel={layout.LineLabel} points={Order.Points} notices={notices}>
        <OrderProNote title={Order.ProTitle} body={Order.ProBody} cta={Order.ProCta} href={ROUTES.contact} />
      </OrderIntro>
      <AuthCard label={Order.Eyebrow} formNumber="BM-10" title={Order.SummaryTitle}>
        {bothMarketsClosed && availability.blocker ? (
          <PageStack variant="grid4">
            <BillingNotice message={Order.Blockers[availability.blocker]} />
            <AuthTextLink href={ROUTES.contact} label={Order.Contact} />
          </PageStack>
        ) : allBlocked ? (
          <PageStack variant="grid4">
            <BillingNotice message={offersByMarket[initialMarket][0].blockedReason ?? ""} />
            {upgrade && <AuthTextLink href={upgrade.href} label={upgrade.label} />}
            <AuthTextLink href="/konto?bereich=tarif" label={Order.ManageCta} />
          </PageStack>
        ) : (
          <OrderForm
            offersByMarket={offersByMarket}
            markets={markets}
            initialMarket={initialMarket}
            initialOffer={pickInitialOffer(offersByMarket[initialMarket], wanted)}
            email={currentUser?.email ?? null}
            initialGuestEmail={initialGuestEmail}
            locale={lang}
            upgrade={upgrade}
            vatNotes={vatNotes}
            labels={{ ...Order, MarketNote: homeTranslations.HomePage.Pricing.MarketHint || Fields.MarketNote }}
          />
        )}
      </AuthCard>
    </AuthLayout>
  );
}
