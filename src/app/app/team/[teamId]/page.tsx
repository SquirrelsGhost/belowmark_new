import { Metadata } from "next";
import { notFound } from "next/navigation";
import AppMain from "@/components/app/shell/AppMain";
import AppPageHeader from "@/components/app/shell/AppPageHeader";
import TeamBoardView from "@/components/app/team/TeamBoardView";
import TeamMembersView from "@/components/app/team/TeamMembersView";
import TeamNotice from "@/components/app/team/TeamNotice";
import TeamTabs from "@/components/app/team/TeamTabs";
import { APP_MAIN_ID } from "@/lib/appConstants";
import { fill } from "@/lib/appFormat";
import { getAppPageContext } from "@/lib/appPage";
import { UUID } from "@/lib/team/teamActionHelpers";
import { isTeamStatus, TEAM_PARAMS, TEAM_VIEWS, teamHref } from "@/lib/team/teamConfig";
import { MetaTagService } from "@/services/MetaTagService";
import { TeamService } from "@/services/team/TeamService";
import { TranslationService } from "@/services/TranslationService";
import { TeamTranslations } from "@/translations/team/TeamTranslations";

// Reads the session cookie on every request.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const { MetaTags } = TeamTranslations[await TranslationService.GetUserLocale()];
  return { ...MetaTagService.CreateMetaTags(MetaTags.Team), robots: { index: false, follow: false } };
}

export default async function TeamPage({ params, searchParams }: PageProps<"/app/team/[teamId]">) {
  const { teamId } = await params;
  const query = await searchParams;
  const { viewer, app, locale } = await getAppPageContext(teamHref(teamId));
  const t = TeamTranslations[await TranslationService.GetUserLocale()];
  // Not a member looks the same as not existing — team ids are not to be probed
  const team = UUID.test(teamId) ? await TeamService.get(teamId, viewer.id) : null;
  if (!team) notFound();

  const isMembers = query[TEAM_PARAMS.view] === TEAM_VIEWS.members;
  const status = query[TEAM_PARAMS.status];
  const base = teamHref(team.id);

  return (
    <AppMain id={APP_MAIN_ID}>
      <AppPageHeader eyebrow={fill(t.Team.Eyebrow, { market: t.Markets[team.market] })} title={team.name} lead={fill(t.Overview.YourRole, { role: `${t.Roles[team.role]} (${t.RoleHints[team.role]})` })} />
      <TeamTabs
        label={t.Team.Tabs.Label}
        tabs={[
          { href: base, label: `${t.Team.Tabs.List} · ${team.listingCount}`, isActive: !isMembers },
          { href: `${base}?${TEAM_PARAMS.view}=${TEAM_VIEWS.members}`, label: `${t.Team.Tabs.Members} · ${team.memberCount}`, isActive: isMembers },
        ]}
      />
      {!team.isActive && <TeamNotice text={t.Team.Paused} tone="signal" />}
      {team.isActive && team.role === "viewer" && !isMembers && <TeamNotice text={t.Team.ReadOnly} tone="muted" />}
      {isMembers ? (
        <TeamMembersView team={team} viewerId={viewer.id} t={t} locale={locale} />
      ) : (
        <TeamBoardView team={team} filter={isTeamStatus(status) ? status : null} t={t} app={app} locale={locale} now={viewer.now} />
      )}
    </AppMain>
  );
}
