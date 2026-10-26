import { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import AccountDetailRow from "@/components/account/AccountDetailRow";
import AccountDetails from "@/components/account/AccountDetails";
import AccountHeader from "@/components/account/AccountHeader";
import AccountDataPanel from "@/components/account/AccountDataPanel";
import AccountPanel from "@/components/account/AccountPanel";
import AccountPlanPanel from "@/components/account/AccountPlanPanel";
import AccountSheet from "@/components/account/AccountSheet";
import SignOutForms from "@/components/account/SignOutForms";
import AuthLayout from "@/components/auth/AuthLayout";
import ChangePasswordForm from "@/components/auth/ChangePasswordForm";
import { AUTH_PARAMS, AUTH_ROUTES } from "@/lib/auth/authConfig";
import { authMetadata, getAuthPageContext } from "@/lib/auth/authPage";
import { buildAccountPlanView } from "@/lib/billing/accountPlanView";
import { BILLING_ROUTES, BILLING_STATUS } from "@/lib/billing/billingConfig";
import { BILLING_ACCOUNT_PARAM } from "@/lib/billing/billingRoutes";
import { formatDate } from "@/lib/format";
import { getLegalPageContext } from "@/lib/legal/legalPage";
import { hasPermission } from "@/lib/permissions";
import { BillingService } from "@/services/billing/BillingService";
import { SessionService } from "@/services/SessionService";

/** ?zahlung=… value → notice key and tone */
const PAYMENT_NOTICES = {
  [BILLING_STATUS.paid]: { key: "paid", tone: "verdict" },
  [BILLING_STATUS.pending]: { key: "pending", tone: "signal" },
  portal_failed: { key: "portal_failed", tone: "signal" },
} as const;

// This page reads request-time data (cookies/headers) for locale and session.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return authMetadata((t) => t.Account.MetaTags);
}

export default async function AccountPage({ searchParams }: PageProps<"/konto">) {
  // Request-time only: the database driver reads the clock while fetching the session
  await connection();
  const user = await SessionService.getCurrentUser();
  if (!user) redirect(`${AUTH_ROUTES.login}?${AUTH_PARAMS.next}=${encodeURIComponent(AUTH_ROUTES.account)}`);

  const { t, lang } = await getAuthPageContext();
  const { Account } = t;
  const params = await searchParams;
  const status = params[AUTH_PARAMS.status];
  const notice = typeof status === "string" && status in Account.Notices ? Account.Notices[status as keyof typeof Account.Notices] : undefined;

  const { t: billing } = await getLegalPageContext();
  const access = await BillingService.access(user.id);
  const planView = buildAccountPlanView(access, billing, lang, !user.plan && user.hasFullAccess && !hasPermission(user.permissions, "*"));
  const payment = params[BILLING_ACCOUNT_PARAM];
  const paymentEntry = typeof payment === "string" && payment in PAYMENT_NOTICES ? PAYMENT_NOTICES[payment as keyof typeof PAYMENT_NOTICES] : undefined;
  const paymentNotice = paymentEntry && { message: billing.Account.Notices[paymentEntry.key], tone: paymentEntry.tone };

  const trialEnded = user.hasTrialEnded;
  const trialValue = user.trialEndsAt ? `${formatDate(user.trialEndsAt.toISOString(), lang)}${trialEnded ? ` · ${Account.Details.TrialEnded}` : ""}` : "—";
  const marketLabel = user.market === "TR" ? t.Fields.MarketTr : t.Fields.MarketDe;
  const isAdmin = hasPermission(user.permissions, "*");
  const accessValue = isAdmin
    ? Account.Details.AccessAdmin
    : user.plan
      ? Account.Details.AccessPlan.replace("{plan}", user.plan.charAt(0).toUpperCase() + user.plan.slice(1))
      : user.hasFullAccess
        ? Account.Details.AccessTrial
        : Account.Details.AccessFree;

  return (
    <AuthLayout lang={lang} layout={t.Layout}>
      <AccountHeader
        eyebrow={Account.Eyebrow}
        title={Account.Title}
        email={user.email}
        lineLabel={t.Layout.LineLabel}
        notice={notice}
        note={Account.DashboardSoon}
      />
      <AccountSheet>
        <AccountPanel id="details" title={Account.Details.Title}>
          <AccountDetails>
            <AccountDetailRow label={Account.Details.Email} value={user.email} />
            <AccountDetailRow label={Account.Details.Market} value={`${marketLabel} · ${user.market}`} />
            <AccountDetailRow label={Account.Details.Verified} value={Account.Details.VerifiedValue} tone="verdict" />
            <AccountDetailRow label={Account.Details.Access} value={accessValue} tone={user.hasFullAccess ? "verdict" : "signal"} />
            {!isAdmin && !user.plan && <AccountDetailRow label={Account.Details.Trial} value={trialValue} tone={trialEnded ? "signal" : "default"} />}
            <AccountDetailRow label={Account.Details.Since} value={formatDate(user.createdAt.toISOString(), lang)} />
          </AccountDetails>
        </AccountPanel>
        <AccountPlanPanel t={billing.Account} view={planView} notice={paymentNotice} />
        <AccountPanel id="password" title={Account.Password.Title} description={Account.Password.Description}>
          <ChangePasswordForm t={{ Fields: t.Fields, Errors: t.Errors }} labels={Account.Password} email={user.email} />
        </AccountPanel>
        <AccountPanel id="sessions" title={Account.Sessions.Title} description={Account.Sessions.Description}>
          <SignOutForms logoutLabel={Account.Sessions.Logout} everywhereLabel={Account.Sessions.LogoutEverywhere} />
        </AccountPanel>
        <AccountDataPanel
          t={billing.Data}
          fields={t.Fields}
          exportHref={BILLING_ROUTES.export}
          errorTitle={t.Errors.SummaryTitle}
          pendingLabel={billing.Legal.Sending}
          email={user.email}
          hasRunningPlan={access.renews}
        />
      </AccountSheet>
    </AuthLayout>
  );
}
