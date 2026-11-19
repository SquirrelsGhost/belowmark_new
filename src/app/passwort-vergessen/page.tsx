import { Metadata } from "next";
import AuthCard from "@/components/auth/AuthCard";
import AuthCardFooter from "@/components/auth/AuthCardFooter";
import AuthIntro from "@/components/auth/AuthIntro";
import AuthLayout from "@/components/auth/AuthLayout";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import RegionDetector from "@/components/region/RegionDetector";
import { AUTH_ROUTES } from "@/lib/auth/authConfig";
import { authMetadata, getAuthPageContext } from "@/lib/auth/authPage";

// This page reads request-time data (cookies/headers) for locale detection.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return authMetadata((t) => t.Forgot.MetaTags);
}

export default async function ForgotPasswordPage({ searchParams }: PageProps<"/passwort-vergessen">) {
  const [{ t, lang, region }, params] = await Promise.all([getAuthPageContext(), searchParams]);
  const initialEmail = typeof params.email === "string" ? params.email.trim().slice(0, 254) : undefined;
  const backHref = initialEmail ? `${AUTH_ROUTES.login}?email=${encodeURIComponent(initialEmail)}` : AUTH_ROUTES.login;

  return (
    <AuthLayout lang={lang} layout={t.Layout} detector={!region.isFromGeoHeader && <RegionDetector country={region.country} />}>
      <AuthIntro intro={t.Forgot.Intro} formPrefix={t.Layout.FormPrefix} lineLabel={t.Layout.LineLabel} />
      <AuthCard
        label={t.Forgot.CardLabel}
        formNumber={`${t.Layout.FormPrefix} ${t.Forgot.Intro.FormNumber}`}
        title={t.Forgot.Title}
        description={t.Forgot.Description}
        footer={<AuthCardFooter href={backHref} label={t.Forgot.Back} />}
      >
        <ForgotPasswordForm t={{ Fields: t.Fields, Errors: t.Errors, Forgot: t.Forgot }} initialEmail={initialEmail} />
      </AuthCard>
    </AuthLayout>
  );
}
