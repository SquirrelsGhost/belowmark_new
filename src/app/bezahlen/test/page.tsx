import { Metadata } from "next";
import { notFound } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthTextLink from "@/components/auth/AuthTextLink";
import BillingNotice from "@/components/billing/BillingNotice";
import OrderIntro from "@/components/billing/OrderIntro";
import TestCheckoutCard from "@/components/billing/TestCheckoutCard";
import PageStack from "@/components/ui/PageStack";
import { BILLING_ROUTES, isOfferId, toBillingCurrency } from "@/lib/billing/billingConfig";
import { formatPrice } from "@/lib/billing/billingFormat";
import { env } from "@/lib/env";
import { getLegalPageContext, legalMetadata } from "@/lib/legal/legalPage";
import { AppSessionService } from "@/services/AppSessionService";
import { BillingService } from "@/services/billing/BillingService";

// Reads the session on every request.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return legalMetadata((t) => t.Meta.TestCheckout, true);
}

export default async function TestCheckoutPage({ searchParams }: PageProps<"/bezahlen/test">) {
  // Never part of a production build's surface
  if (!env.billingTestCheckout) notFound();
  const orderId = String((await searchParams).bestellung ?? "");
  const viewer = await AppSessionService.requireViewer(`${BILLING_ROUTES.testCheckout}?bestellung=${orderId}`);
  const { t, layout, lang } = await getLegalPageContext();
  const order = await BillingService.openTestOrder(orderId, viewer.id);
  const { TestCheckout } = t;

  return (
    <AuthLayout lang={lang} layout={layout}>
      <OrderIntro eyebrow={TestCheckout.Eyebrow} title={TestCheckout.Title} lead={t.Order.TestBanner} lineLabel={layout.LineLabel} points={[]} />
      <AuthCard label={TestCheckout.Eyebrow} formNumber="BM-11" title={t.Order.SummaryTitle}>
        {order && isOfferId(order.offer) ? (
          <TestCheckoutCard
            orderId={order.id}
            offerName={t.Order.Offers[order.offer].Name}
            price={formatPrice({ amount: order.amount, currency: toBillingCurrency(order.currency) }, lang)}
            labels={TestCheckout}
          />
        ) : (
          <PageStack variant="grid4">
            <BillingNotice message={TestCheckout.Missing} />
            <AuthTextLink href={BILLING_ROUTES.order} label={t.Order.Back} />
          </PageStack>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
