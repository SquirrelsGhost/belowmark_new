import { Metadata } from "next";
import { connection } from "next/server";
import AuthCard from "@/components/auth/AuthCard";
import AuthLayout from "@/components/auth/AuthLayout";
import OrderIntro from "@/components/billing/OrderIntro";
import WithdrawForm from "@/components/consumer/WithdrawForm";
import DeclarationReceipt from "@/components/consumer/DeclarationReceipt";
import { loadDeclarationReceipt } from "@/lib/billing/declarationView";
import { getLegalPageContext, legalMetadata } from "@/lib/legal/legalPage";
import { SessionService } from "@/services/SessionService";

// Reads the locale cookie, the session (to prefill the address) and the receipt on every request.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return legalMetadata((t) => t.Meta.Withdraw, true);
}

/** "Vertrag widerrufen" (§ 356a BGB): reachable without sign-in, receipt right after sending. */
export default async function WithdrawPage({ searchParams }: PageProps<"/widerruf/erklaeren">) {
  await connection();
  const { t, layout, lang } = await getLegalPageContext();
  const receipt = await loadDeclarationReceipt(await searchParams, "withdrawal", t, lang);
  const user = receipt ? null : await SessionService.getCurrentUser();

  return (
    <AuthLayout lang={lang} layout={layout}>
      <OrderIntro eyebrow={t.Withdraw.Eyebrow} title={t.Withdraw.Title} lead={t.Withdraw.Lead} lineLabel={layout.LineLabel} />
      <AuthCard label={t.Withdraw.Eyebrow} formNumber="BM-13" title={t.Footer.Withdraw}>
        {receipt ? (
          <DeclarationReceipt {...receipt} />
        ) : (
          <WithdrawForm t={t.Withdraw} errorTitle={t.Order.ErrorTitle} pendingLabel={t.Legal.Sending} email={user?.email} />
        )}
      </AuthCard>
    </AuthLayout>
  );
}
