import { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import AuthCardFooter from "@/components/auth/AuthCardFooter";
import AuthIntro from "@/components/auth/AuthIntro";
import AuthLayout from "@/components/auth/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";
import RegionDetector from "@/components/region/RegionDetector";
import { AUTH_ROUTES } from "@/lib/auth/authConfig";
import { authMetadata, getAuthPageContext } from "@/lib/auth/authPage";
import { SessionService } from "@/services/SessionService";

// This page reads request-time data (cookies/headers) for locale and session.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return authMetadata((t) => t.Signup.MetaTags, false);
}

export default async function SignupPage() {
  const { t, lang, region } = await getAuthPageContext();
  if (await SessionService.getCurrentUser()) redirect(AUTH_ROUTES.afterLogin);

  return (
    <AuthLayout lang={lang} layout={t.Layout} detector={!region.isFromGeoHeader && <RegionDetector country={region.country} />}>
      <AuthIntro intro={t.Signup.Intro} formPrefix={t.Layout.FormPrefix} lineLabel={t.Layout.LineLabel} />
      <AuthCard
        label={t.Signup.CardLabel}
        formNumber={`${t.Layout.FormPrefix} ${t.Signup.Intro.FormNumber}`}
        title={t.Signup.Title}
        description={t.Signup.Description}
        footer={<AuthCardFooter question={t.Signup.HaveAccount} href={AUTH_ROUTES.login} label={t.Signup.LoginLink} />}
      >
        <SignupForm t={{ Fields: t.Fields, Errors: t.Errors, Signup: t.Signup }} defaultMarket={region.pricingCountry} />
      </AuthCard>
    </AuthLayout>
  );
}
