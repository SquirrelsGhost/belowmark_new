import { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import AuthIntro from "@/components/auth/AuthIntro";
import AuthLayout from "@/components/auth/AuthLayout";
import VerifyEmailForm from "@/components/auth/VerifyEmailForm";
import RegionDetector from "@/components/region/RegionDetector";
import { AUTH_PARAMS, AUTH_ROUTES } from "@/lib/auth/authConfig";
import { authMetadata, getAuthPageContext } from "@/lib/auth/authPage";
import { SessionService } from "@/services/SessionService";

// This page reads request-time data (cookies/headers) for locale detection.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return authMetadata((t) => t.Verify.MetaTags);
}

export default async function VerifyEmailPage({ searchParams }: PageProps<"/email-bestaetigen">) {
  const [{ t, lang, region }, params] = await Promise.all([getAuthPageContext(), searchParams]);
  const rawToken = params[AUTH_PARAMS.token];
  const token = typeof rawToken === "string" ? rawToken : "";
  const rawObjekt = params.objekt ?? params.key;
  const targetKey = typeof rawObjekt === "string" ? rawObjekt.trim().slice(0, 128) : undefined;
  const rawStadt = params.stadt ?? params.city;
  const targetCity = typeof rawStadt === "string" ? rawStadt.trim().slice(0, 80) : undefined;

  if (await SessionService.getCurrentUser()) {
    redirect(targetKey ? `/app/objekt/${encodeURIComponent(targetKey)}` : AUTH_ROUTES.afterLogin);
  }

  return (
    <AuthLayout lang={lang} layout={t.Layout} detector={!region.isFromGeoHeader && <RegionDetector country={region.country} />}>
      <AuthIntro intro={t.Verify.Intro} formPrefix={t.Layout.FormPrefix} lineLabel={t.Layout.LineLabel} />
      <AuthCard
        label={t.Verify.CardLabel}
        formNumber={`${t.Layout.FormPrefix} ${t.Verify.Intro.FormNumber}`}
        title={t.Verify.Title}
        description={token ? t.Verify.Description : undefined}
      >
        <VerifyEmailForm
          t={{ Fields: t.Fields, Errors: t.Errors, Verify: t.Verify }}
          token={token}
          targetKey={targetKey}
          targetCity={targetCity}
        />
      </AuthCard>
    </AuthLayout>
  );
}
