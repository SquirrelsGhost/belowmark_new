import { Metadata } from "next";
import AuthCard from "@/components/auth/AuthCard";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthTextLink from "@/components/auth/AuthTextLink";
import BillingNotice from "@/components/billing/BillingNotice";
import OrderForm from "@/components/billing/OrderForm";
import OrderIntro from "@/components/billing/OrderIntro";
import OrderProNote from "@/components/billing/OrderProNote";
import { BILLING_ROUTES, BILLING_STATUS, OFFER_PARAM } from "@/lib/billing/billingConfig";
import { buildOrderOffers, pickInitialOffer, vatNote } from "@/lib/billing/orderView";
import { ROUTES } from "@/lib/constants";
import { env } from "@/lib/env";
import { getLegalPageContext, legalMetadata } from "@/lib/legal/legalPage";
import { AppSessionService } from "@/services/AppSessionService";
import { BillingService } from "@/services/billing/BillingService";
import { AuthTranslations } from "@/translations/auth/AuthTranslations";
import { openLegalGaps } from "@/translations/legal/LegalDocuments";
import { TranslationService } from "@/services/TranslationService";

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
  const viewer = await AppSessionService.requireViewer(`${BILLING_ROUTES.order}${wanted ? `?${OFFER_PARAM}=${wanted}` : ""}`);
  const { t, layout, lang } = await getLegalPageContext();
  const { Fields } = AuthTranslations[await TranslationService.GetUserLocale()];
  const { Order } = t;

  const availability = BillingService.availability(viewer.market);
  const access = await BillingService.access(viewer.id);
  const offers = buildOrderOffers(t, viewer.market, lang, access, BillingService.orderBlocker);
  const allBlocked = offers.every((offer) => offer.blockedReason);
  const gaps = availability.isTest && !env.billingLegalApproved ? openLegalGaps(availability.vatMode) : [];

  const notices = (
    <>
      {params.status === BILLING_STATUS.cancelled && <BillingNotice tone="signal" message={Order.Cancelled} />}
      {availability.isTest && !availability.blocker && <BillingNotice tone="signal" message={Order.TestBanner} items={gaps.length ? [Order.GapsTitle, ...gaps] : undefined} />}
    </>
  );

  return (
    <AuthLayout lang={lang} layout={layout}>
      <OrderIntro eyebrow={Order.Eyebrow} title={Order.Title} lead={Order.Lead} lineLabel={layout.LineLabel} points={Order.Points} notices={notices}>
        <OrderProNote title={Order.ProTitle} body={Order.ProBody} cta={Order.ProCta} href={ROUTES.contact} />
      </OrderIntro>
      <AuthCard label={Order.Eyebrow} formNumber="BM-10" title={Order.SummaryTitle}>
        {availability.blocker ? (
          <div className="grid gap-4">
            <BillingNotice message={Order.Blockers[availability.blocker]} />
            <AuthTextLink href={ROUTES.contact} label={Order.Contact} />
          </div>
        ) : allBlocked ? (
          <div className="grid gap-4">
            <BillingNotice message={offers[0].blockedReason ?? ""} />
            <AuthTextLink href="/konto#tarif" label={Order.ManageCta} />
          </div>
        ) : (
          <OrderForm
            offers={offers}
            initialOffer={pickInitialOffer(offers, wanted)}
            email={viewer.email}
            market={viewer.market === "TR" ? Fields.MarketTr : Fields.MarketDe}
            vatNote={vatNote(t, availability.vatMode)}
            labels={Order}
          />
        )}
      </AuthCard>
    </AuthLayout>
  );
}
