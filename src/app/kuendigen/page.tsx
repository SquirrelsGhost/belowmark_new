import { Metadata } from "next";
import { connection } from "next/server";
import AuthCard from "@/components/auth/AuthCard";
import AuthLayout from "@/components/auth/AuthLayout";
import BillingNotice from "@/components/billing/BillingNotice";
import OrderIntro from "@/components/billing/OrderIntro";
import CancelForm from "@/components/consumer/CancelForm";
import DeclarationReceipt from "@/components/consumer/DeclarationReceipt";
import { fill, formatContractDate } from "@/lib/billing/billingFormat";
import { loadDeclarationReceipt } from "@/lib/billing/declarationView";
import { getLegalPageContext, legalMetadata } from "@/lib/legal/legalPage";
import { BillingService } from "@/services/billing/BillingService";
import { SessionService } from "@/services/SessionService";

// Reads the locale cookie, the session (to prefill the address & check subscription state) and the receipt on every request.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return legalMetadata((t) => t.Meta.Cancel, true);
}

/**
 * "Verträge hier kündigen" (§ 312k BGB): reachable with or without sign-in.
 * When signed in without a paid auto-renewing subscription, shows a clear reassuring
 * notice ("no paid subscription active — ends automatically without cost") while keeping
 * the statutory cancellation form accessible.
 */
export default async function CancelPage({ searchParams }: PageProps<"/kuendigen">) {
  await connection();
  const { t, layout, lang } = await getLegalPageContext();
  const receipt = await loadDeclarationReceipt(await searchParams, "cancellation", t, lang);
  const user = receipt ? null : await SessionService.getCurrentUser();
  const access = user ? await BillingService.access(user.id) : null;

  const reassuranceNotice =
    user && access
      ? !access.isActive
        ? fill(t.Cancel.NoActivePlanNotice, { email: user.email })
        : !access.renews && access.endsAt
          ? fill(t.Cancel.FixedTermNotice, { email: user.email, date: formatContractDate(access.endsAt, lang) })
          : undefined
      : undefined;

  return (
    <AuthLayout lang={lang} layout={layout}>
      <OrderIntro eyebrow={t.Cancel.Eyebrow} title={t.Cancel.Title} lead={t.Cancel.Lead} lineLabel={layout.LineLabel} />
      <AuthCard label={t.Cancel.Eyebrow} formNumber="BM-12" title={t.Footer.Cancel}>
        {receipt ? (
          <DeclarationReceipt {...receipt} />
        ) : (
          <div className="grid gap-6">
            {reassuranceNotice && <BillingNotice tone="verdict" message={reassuranceNotice} />}
            <CancelForm t={t.Cancel} errorTitle={t.Order.ErrorTitle} pendingLabel={t.Legal.Sending} email={user?.email} />
          </div>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
