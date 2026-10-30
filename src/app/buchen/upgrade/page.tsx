import { Metadata } from "next";
import AuthCard from "@/components/auth/AuthCard";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthTextLink from "@/components/auth/AuthTextLink";
import BillingNotice from "@/components/billing/BillingNotice";
import OrderIntro from "@/components/billing/OrderIntro";
import UpgradeForm from "@/components/billing/UpgradeForm";
import PageStack from "@/components/ui/PageStack";
import { BILLING_ROUTES, BILLING_STATUS } from "@/lib/billing/billingConfig";
import { vatNote } from "@/lib/billing/orderView";
import { buildUpgradeView } from "@/lib/billing/upgradeView";
import { env } from "@/lib/env";
import { getLegalPageContext, legalMetadata } from "@/lib/legal/legalPage";
import { AppSessionService } from "@/services/AppSessionService";
import { BillingService } from "@/services/billing/BillingService";
import { BillingUpgradeService } from "@/services/billing/BillingUpgradeService";

// Reads the session and the running plan on every request.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return legalMetadata((t) => t.Meta.Upgrade, true);
}

export default async function UpgradePage({ searchParams }: PageProps<"/buchen/upgrade">) {
  const params = await searchParams;
  const viewer = await AppSessionService.requireViewer(BILLING_ROUTES.upgrade);
  const { t, layout, lang } = await getLegalPageContext();
  const { Upgrade, Order } = t;
  const availability = BillingService.availability(viewer.market);
  const quote = availability.blocker ? null : await BillingUpgradeService.quote(viewer.id, viewer.market);
  const note = vatNote(t, availability.vatMode, viewer.market, env.billingTrKdvIncluded);

  const notices = (
    <>
      {params.status === BILLING_STATUS.cancelled && <BillingNotice tone="signal" message={Upgrade.Cancelled} />}
      {availability.isTest && <BillingNotice tone="signal" message={Order.TestBanner} />}
    </>
  );

  return (
    <AuthLayout lang={lang} layout={layout}>
      <OrderIntro eyebrow={Upgrade.Eyebrow} title={Upgrade.Title} lead={Upgrade.Lead} lineLabel={layout.LineLabel} points={Upgrade.Points} notices={notices} />
      <AuthCard label={Upgrade.Eyebrow} formNumber="BM-11" title={Upgrade.SummaryTitle}>
        {quote ? (
          <UpgradeForm view={buildUpgradeView(quote, t, lang, note)} labels={{ ...Order, Today: Upgrade.Today, Submit: Upgrade.Submit, Pending: Upgrade.Pending, Failed: Upgrade.Failed }} />
        ) : (
          <PageStack variant="grid4">
            <BillingNotice message={availability.blocker ? Order.Blockers[availability.blocker] : Upgrade.Unavailable} />
            <AuthTextLink href={availability.blocker ? "/konto?bereich=tarif" : BILLING_ROUTES.order} label={availability.blocker ? Order.ManageCta : Order.Offers["pro-monat"].Name} />
          </PageStack>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
