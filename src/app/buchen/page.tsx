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
import { buildOrderOffersByMarket, pickInitialOffer, vatNote } from "@/lib/billing/orderView";
import { MarketCode, ROUTES } from "@/lib/constants";
import { env } from "@/lib/env";
import { getLegalPageContext, legalMetadata } from "@/lib/legal/legalPage";
import { AppSessionService } from "@/services/AppSessionService";
import { BillingService } from "@/services/billing/BillingService";
import { RegionService } from "@/services/RegionService";
import { TranslationService } from "@/services/TranslationService";
import { AuthTranslations } from "@/translations/auth/AuthTranslations";
import { openLegalGaps } from "@/translations/legal/LegalDocuments";

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
  const returnQuery = [wanted && `${OFFER_PARAM}=${wanted}`, (rawMarket === "DE" || rawMarket === "TR") && `${MARKET_PARAM}=${rawMarket}`]
    .filter(Boolean)
    .join("&");
  const viewer = await AppSessionService.requireViewer(`${BILLING_ROUTES.order}${returnQuery ? `?${returnQuery}` : ""}`);
  const [{ t, layout, lang }, region, userLocale] = await Promise.all([
    getLegalPageContext(),
    RegionService.GetRegion(),
    TranslationService.GetUserLocale(),
  ]);
  const { Fields } = AuthTranslations[userLocale];
  const { Order } = t;

  const initialMarket: MarketCode =
    rawMarket === "TR" || rawMarket === "DE" ? rawMarket : region.isMarketChosen ? region.market : viewer.market;

  const availabilityDe = BillingService.availability("DE");
  const availabilityTr = BillingService.availability("TR");
  const availability = initialMarket === "TR" ? availabilityTr : availabilityDe;
  const access = await BillingService.access(viewer.id);
  const offersByMarket = buildOrderOffersByMarket(t, viewer.market, lang, access, BillingService.orderBlocker);
  const allBlocked = offersByMarket.DE.every((offer) => offer.blockedReason) && offersByMarket.TR.every((offer) => offer.blockedReason);
  const bothMarketsClosed = Boolean(availabilityDe.blocker && availabilityTr.blocker);
  const canUpgrade = access.isActive && access.plan === "investor" && Boolean(access.offer && UPGRADES[access.offer]);
  const upgrade = canUpgrade ? { href: BILLING_ROUTES.upgrade, label: Order.UpgradeCta } : undefined;
  const gaps = availability.isTest && !env.billingLegalApproved ? openLegalGaps(availability.vatMode) : [];

  const markets = {
    DE: {
      code: "DE" as const,
      label: Fields.MarketDe,
      hint: Fields.MarketDeHint,
      blocker: availabilityDe.blocker ? Order.Blockers[availabilityDe.blocker] : undefined,
    },
    TR: {
      code: "TR" as const,
      label: Fields.MarketTr,
      hint: Fields.MarketTrHint,
      blocker: availabilityTr.blocker ? Order.Blockers[availabilityTr.blocker] : undefined,
    },
  };

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
            email={viewer.email}
            upgrade={upgrade}
            vatNotes={{ DE: vatNote(t, availabilityDe.vatMode, "DE"), TR: vatNote(t, availabilityTr.vatMode, "TR", env.billingTrKdvIncluded) }}
            labels={{ ...Order, MarketNote: Fields.MarketNote }}
          />
        )}
      </AuthCard>
    </AuthLayout>
  );
}
