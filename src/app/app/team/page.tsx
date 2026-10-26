import { Metadata } from "next";
import AppMain from "@/components/app/shell/AppMain";
import AppPageHeader from "@/components/app/shell/AppPageHeader";
import TeamActionButton from "@/components/app/team/TeamActionButton";
import TeamCard from "@/components/app/team/TeamCard";
import TeamCardList from "@/components/app/team/TeamCardList";
import TeamCreateForm from "@/components/app/team/TeamCreateForm";
import TeamCreateSlot from "@/components/app/team/TeamCreateSlot";
import TeamEmpty from "@/components/app/team/TeamEmpty";
import TeamFinePrint from "@/components/app/team/TeamFinePrint";
import TeamInvitationCard from "@/components/app/team/TeamInvitationCard";
import TeamProPanel from "@/components/app/team/TeamProPanel";
import TeamSectionTitle from "@/components/app/team/TeamSectionTitle";
import TeamStack from "@/components/app/team/TeamStack";
import TeamStatusTally from "@/components/app/team/TeamStatusTally";
import { APP_MAIN_ID } from "@/lib/appConstants";
import { fill } from "@/lib/appFormat";
import { getAppPageContext } from "@/lib/appPage";
import { BILLING_ROUTES, OFFER_PARAM } from "@/lib/billing/billingConfig";
import { formatDate } from "@/lib/format";
import { acceptInviteAction, declineInviteAction } from "@/lib/team/invitationActions";
import { TEAM_ROUTES, teamHref, TEAMS } from "@/lib/team/teamConfig";
import { MetaTagService } from "@/services/MetaTagService";
import { TeamAccessService } from "@/services/team/TeamAccessService";
import { TeamInviteService } from "@/services/team/TeamInviteService";
import { TeamService } from "@/services/team/TeamService";
import { TranslationService } from "@/services/TranslationService";
import { TeamTranslations } from "@/translations/team/TeamTranslations";

// Reads the session cookie on every request.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const { MetaTags } = TeamTranslations[await TranslationService.GetUserLocale()];
  return { ...MetaTagService.CreateMetaTags(MetaTags.Overview), robots: { index: false, follow: false } };
}

export default async function TeamOverviewPage() {
  const { viewer, locale } = await getAppPageContext(TEAM_ROUTES.overview);
  const t = TeamTranslations[await TranslationService.GetUserLocale()];
  const { Overview: O } = t;
  const [teams, invitations, hasTeamPlan, owned] = await Promise.all([
    TeamService.listForUser(viewer.id),
    TeamInviteService.pendingForEmail(viewer.email),
    TeamAccessService.userHasTeamPlan(viewer.id),
    TeamService.countOwned(viewer.id),
  ]);
  const proHref = `${BILLING_ROUTES.order}?${OFFER_PARAM}=pro-monat`;

  return (
    <AppMain id={APP_MAIN_ID}>
      <AppPageHeader eyebrow={O.Eyebrow} title={O.Title} lead={O.Lead} />

      {invitations.length > 0 && (
        <>
          <TeamSectionTitle title={O.Invitations.Title} />
          <TeamStack label={O.Invitations.Title}>
            {invitations.map((invite) => (
              <TeamInvitationCard
                key={invite.inviteId}
                teamName={invite.teamName}
                line={`${invite.invitedByName ? fill(O.Invitations.From, { inviter: invite.invitedByName, role: t.Roles[invite.role] }) : fill(O.Invitations.FromUnknown, { role: t.Roles[invite.role] })} · ${t.Markets[invite.market]}`}
                expires={fill(O.Invitations.Expires, { date: formatDate(invite.expiresAt.toISOString(), locale) })}
              >
                <TeamActionButton action={acceptInviteAction} fields={{ inviteId: invite.inviteId }} label={O.Invitations.Accept} errors={t.Errors} tone="ink" />
                <TeamActionButton action={declineInviteAction} fields={{ inviteId: invite.inviteId }} label={O.Invitations.Decline} errors={t.Errors} tone="danger" />
              </TeamInvitationCard>
            ))}
          </TeamStack>
        </>
      )}

      {teams.length === 0 ? (
        <TeamEmpty title={O.Empty.Title} body={O.Empty.Body} />
      ) : (
        <TeamCardList label={O.Title}>
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              name={team.name}
              href={teamHref(team.id)}
              meta={`${t.Markets[team.market]} · ${fill(O.YourRole, { role: t.Roles[team.role] })}`}
              counts={`${fill(O.Members, { count: team.memberCount })} · ${fill(O.Listings, { count: team.listingCount })}`}
              pausedLabel={team.isActive ? undefined : O.Paused}
              openLabel={O.Open}
            >
              <TeamStatusTally counts={team.statusCounts} labels={t.Statuses} />
            </TeamCard>
          ))}
        </TeamCardList>
      )}

      <TeamCreateSlot>
        {hasTeamPlan ? (
          <TeamCreateForm
            labels={O.Create}
            errors={t.Errors}
            hint={fill(O.Create.Hint, { market: t.Markets[viewer.market], seats: TEAMS.maxSeats })}
            usage={fill(O.Create.Usage, { count: owned, max: TEAMS.maxOwnedPerUser })}
          />
        ) : (
          <TeamProPanel title={O.Locked.Title} body={O.Locked.Body} cta={O.Locked.Cta} href={proHref} />
        )}
      </TeamCreateSlot>

      <TeamFinePrint text={O.Privacy} />
    </AppMain>
  );
}
