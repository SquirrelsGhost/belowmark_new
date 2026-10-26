import { Metadata } from "next";
import { connection } from "next/server";
import AuthCard from "@/components/auth/AuthCard";
import AuthIntro from "@/components/auth/AuthIntro";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthNotice from "@/components/auth/AuthNotice";
import AuthTextLink from "@/components/auth/AuthTextLink";
import InvitationActions from "@/components/app/team/InvitationActions";
import { fill } from "@/lib/appFormat";
import { getAuthPageContext } from "@/lib/auth/authPage";
import { formatDate } from "@/lib/format";
import { TEAM_PARAMS, TEAM_ROUTES } from "@/lib/team/teamConfig";
import { MetaTagService } from "@/services/MetaTagService";
import { SessionService } from "@/services/SessionService";
import { TeamInviteService } from "@/services/team/TeamInviteService";
import { TranslationService } from "@/services/TranslationService";
import { TeamTranslations } from "@/translations/team/TeamTranslations";

// This page reads request-time data (cookies/headers) for locale detection and the session.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

/** Form number shown on the slip, like the auth pages. */
const FORM_NUMBER = "BM-T1";

export async function generateMetadata(): Promise<Metadata> {
  const { MetaTags } = TeamTranslations[await TranslationService.GetUserLocale()];
  // The URL carries the invitation token: keep it out of indexes and Referer headers
  return { ...MetaTagService.CreateMetaTags(MetaTags.Invitation), robots: { index: false, follow: false }, referrer: "no-referrer" };
}

export default async function InvitationPage({ searchParams }: PageProps<"/einladung">) {
  // Expiry is checked against the clock — always render per request
  await connection();
  const { t: auth, lang } = await getAuthPageContext();
  const t = TeamTranslations[await TranslationService.GetUserLocale()];
  const { Invitation: L } = t;
  const raw = (await searchParams)[TEAM_PARAMS.token];
  const token = typeof raw === "string" ? raw : "";
  const [invitation, user] = await Promise.all([TeamInviteService.previewByToken(token), SessionService.getCurrentUser()]);
  const returnTo = `${TEAM_ROUTES.invitation}?${TEAM_PARAMS.token}=${encodeURIComponent(token)}`;

  const intro = invitation
    ? {
        FormNumber: FORM_NUMBER,
        HeadlineTop: L.Title,
        HeadlineBelow: invitation.invitedByName ? fill(L.Lead, { inviter: invitation.invitedByName, team: invitation.teamName }) : fill(L.LeadUnknown, { team: invitation.teamName }),
        Lede: "",
        Points: [
          fill(L.RoleLine, { role: t.Roles[invitation.role], hint: t.RoleHints[invitation.role] }),
          fill(L.MarketLine, { market: t.Markets[invitation.market] }),
          fill(L.ForLine, { email: invitation.email, date: formatDate(invitation.expiresAt.toISOString(), lang) }),
        ],
      }
    : { FormNumber: FORM_NUMBER, HeadlineTop: L.Invalid.Title, HeadlineBelow: L.Invalid.Body, Lede: "", Points: [] };

  return (
    <AuthLayout lang={lang} layout={auth.Layout}>
      <AuthIntro intro={intro} formPrefix={auth.Layout.FormPrefix} lineLabel={auth.Layout.LineLabel} />
      <AuthCard label={L.Eyebrow} formNumber={`${auth.Layout.FormPrefix} ${FORM_NUMBER}`} title={invitation ? invitation.teamName : L.Invalid.Title} description={invitation ? L.Privacy : undefined}>
        {invitation ? (
          <InvitationActions token={token} returnTo={returnTo} viewerEmail={user?.email ?? null} invitedEmail={invitation.email} isBlocked={invitation.isBlocked} labels={L} errors={t.Errors} />
        ) : (
          <AuthNotice title={L.Invalid.Title} body={L.Invalid.Body} tone="signal">
            <AuthTextLink href={TEAM_ROUTES.overview} label={L.ToTeams} />
          </AuthNotice>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
