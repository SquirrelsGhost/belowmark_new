import { Metadata } from "next";
import AuthCard from "@/components/auth/AuthCard";
import AuthIntro from "@/components/auth/AuthIntro";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthNotice from "@/components/auth/AuthNotice";
import AuthTextLink from "@/components/auth/AuthTextLink";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import RegionDetector from "@/components/region/RegionDetector";
import { AUTH_PARAMS, AUTH_ROUTES } from "@/lib/auth/authConfig";
import { authMetadata, getAuthPageContext } from "@/lib/auth/authPage";
import { AuthService } from "@/services/AuthService";

// This page reads request-time data (cookies/headers) for locale detection.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return authMetadata((t) => t.Reset.MetaTags);
}

export default async function ResetPasswordPage({ searchParams }: PageProps<"/passwort-neu">) {
  const { t, lang, region } = await getAuthPageContext();
  const raw = (await searchParams)[AUTH_PARAMS.token];
  const token = typeof raw === "string" ? raw : "";
  // Looking the link up does not use it — only saving the password does.
  const email = token ? await AuthService.getResetEmail(token) : null;

  return (
    <AuthLayout lang={lang} layout={t.Layout} detector={!region.isFromGeoHeader && <RegionDetector country={region.country} />}>
      <AuthIntro intro={t.Reset.Intro} formPrefix={t.Layout.FormPrefix} lineLabel={t.Layout.LineLabel} />
      <AuthCard
        label={t.Reset.CardLabel}
        formNumber={`${t.Layout.FormPrefix} ${t.Reset.Intro.FormNumber}`}
        title={t.Reset.Title}
        description={email ? t.Reset.Description : undefined}
      >
        {email ? (
          <ResetPasswordForm t={{ Fields: t.Fields, Errors: t.Errors, Reset: t.Reset }} token={token} email={email} />
        ) : (
          <AuthNotice tone="signal" title={t.Reset.InvalidTitle} body={t.Reset.InvalidBody}>
            <AuthTextLink href={AUTH_ROUTES.forgotPassword} label={t.Reset.InvalidAction} />
          </AuthNotice>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
