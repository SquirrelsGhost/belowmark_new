import { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import AuthCardFooter from "@/components/auth/AuthCardFooter";
import AuthIntro from "@/components/auth/AuthIntro";
import AuthLayout from "@/components/auth/AuthLayout";
import DevQuickLogin from "@/components/auth/DevQuickLogin";
import DevQuickLoginButton from "@/components/auth/DevQuickLoginButton";
import LoginForm from "@/components/auth/LoginForm";
import RegionDetector from "@/components/region/RegionDetector";
import { AUTH_PARAMS, AUTH_ROUTES } from "@/lib/auth/authConfig";
import { authMetadata, getAuthPageContext } from "@/lib/auth/authPage";
import { DEV_ACCOUNT_LIST, isDevLoginEnabled, isLocalRequest } from "@/lib/auth/devLogin";
import { safeRedirect } from "@/lib/auth/safeRedirect";
import { SessionService } from "@/services/SessionService";

// This page reads request-time data (cookies/headers) for locale and session.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return authMetadata((t) => t.Login.MetaTags, false);
}

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { t, lang, region } = await getAuthPageContext();
  const next = safeRedirect((await searchParams)[AUTH_PARAMS.next]);
  if (await SessionService.getCurrentUser()) redirect(next);
  const showDevLogin = isDevLoginEnabled() && (await isLocalRequest());

  return (
    <AuthLayout lang={lang} layout={t.Layout} detector={!region.isFromGeoHeader && <RegionDetector country={region.country} />}>
      <AuthIntro intro={t.Login.Intro} formPrefix={t.Layout.FormPrefix} lineLabel={t.Layout.LineLabel} />
      <AuthCard
        label={t.Login.CardLabel}
        formNumber={`${t.Layout.FormPrefix} ${t.Login.Intro.FormNumber}`}
        title={t.Login.Title}
        description={t.Login.Description}
        footer={<AuthCardFooter question={t.Login.NoAccount} href={AUTH_ROUTES.signup} label={t.Login.SignupLink} />}
      >
        <LoginForm t={{ Fields: t.Fields, Errors: t.Errors, Login: t.Login }} next={next} />
        {showDevLogin && (
          <DevQuickLogin label={t.DevLogin.Label} title={t.DevLogin.Title} note={t.DevLogin.Note}>
            {DEV_ACCOUNT_LIST.map((account) => (
              <DevQuickLoginButton key={account.key} account={account.key} email={account.email} label={t.DevLogin.Accounts[account.key as keyof typeof t.DevLogin.Accounts]} next={next} />
            ))}
          </DevQuickLogin>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
