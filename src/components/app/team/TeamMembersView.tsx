import TeamActionButton from "@/components/app/team/TeamActionButton";
import TeamDeleteForm from "@/components/app/team/TeamDeleteForm";
import TeamHint from "@/components/app/team/TeamHint";
import TeamInviteForm from "@/components/app/team/TeamInviteForm";
import TeamInviteRow from "@/components/app/team/TeamInviteRow";
import TeamLeaveSection from "@/components/app/team/TeamLeaveSection";
import TeamListing from "@/components/app/team/TeamListing";
import TeamMemberRow from "@/components/app/team/TeamMemberRow";
import TeamRenameForm from "@/components/app/team/TeamRenameForm";
import TeamRoleForm from "@/components/app/team/TeamRoleForm";
import TeamSectionTitle from "@/components/app/team/TeamSectionTitle";
import { fill } from "@/lib/appFormat";
import { LocaleOption } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { leaveTeamAction, removeMemberAction, revokeInviteAction, transferTeamAction } from "@/lib/team/teamActions";
import { ASSIGNABLE_ROLES, TEAMS } from "@/lib/team/teamConfig";
import { canDo, outranks } from "@/lib/team/teamRoles";
import { TeamInviteService } from "@/services/team/TeamInviteService";
import { TeamService } from "@/services/team/TeamService";
import { ITeamTranslation } from "@/translations/team/ITeamTranslation";
import { TeamView } from "@/types/team.types";

interface TeamMembersViewProps {
  team: TeamView;
  viewerId: string;
  t: ITeamTranslation;
  locale: LocaleOption;
}

/** Members, invitations, settings and leaving — each control only where the viewer's role allows it. */
export default async function TeamMembersView({ team, viewerId, t, locale }: TeamMembersViewProps) {
  const { Members: M } = t;
  const canManage = canDo(team.role, "removeMember");
  const [members, invites] = await Promise.all([TeamService.members(team.id), canManage ? TeamInviteService.listForTeam(team.id) : Promise.resolve([])]);
  const date = (value: Date) => formatDate(value.toISOString(), locale);
  const roleOptions = ASSIGNABLE_ROLES.filter((role) => outranks(team.role, role)).map((value) => ({ value, label: t.Roles[value] }));
  const isOwner = team.role === "owner";
  const mayInvite = team.isActive && canDo(team.role, "invite") && members.length + invites.length < TEAMS.maxSeats;

  return (
    <>
      <TeamSectionTitle title={M.Title} aside={fill(M.Seats, { count: members.length + invites.length, max: TEAMS.maxSeats })} />
      <TeamListing label={M.Title} isFlush>
        {members.map((member) => {
          const isYou = member.userId === viewerId;
          const mayEdit = !isYou && member.role !== "owner" && outranks(team.role, member.role);
          const fields = { teamId: team.id, userId: member.userId };
          return (
            <TeamMemberRow key={member.userId} name={member.displayName} email={member.email} role={t.Roles[member.role]} joined={fill(M.Joined, { date: date(member.joinedAt) })} isYou={isYou} youLabel={M.You}>
              {mayEdit && team.isActive && member.role !== "owner" && (
                <TeamRoleForm teamId={team.id} userId={member.userId} current={member.role} options={roleOptions} label={M.RoleLabel} submitLabel={M.SaveRole} errors={t.Errors} />
              )}
              {mayEdit && <TeamActionButton action={removeMemberAction} fields={fields} label={M.Remove} errors={t.Errors} tone="danger" />}
              {isOwner && !isYou && <TeamActionButton action={transferTeamAction} fields={fields} label={M.Transfer} errors={t.Errors} />}
            </TeamMemberRow>
          );
        })}
      </TeamListing>
      {isOwner && members.length > 1 && <TeamHint text={M.TransferHint} />}

      {canManage && invites.length > 0 && (
        <>
          <TeamSectionTitle title={M.Pending.Title} />
          <TeamListing label={M.Pending.Title} isFlush>
            {invites.map((invite) => (
              <TeamInviteRow
                key={invite.id}
                line={fill(M.Pending.Line, { email: invite.email, role: t.Roles[invite.role], date: date(invite.expiresAt) })}
                by={invite.invitedByName ? fill(M.Pending.By, { name: invite.invitedByName }) : t.FormerMember}
              >
                <TeamActionButton action={revokeInviteAction} fields={{ teamId: team.id, inviteId: invite.id }} label={M.Pending.Revoke} errors={t.Errors} tone="danger" />
              </TeamInviteRow>
            ))}
          </TeamListing>
        </>
      )}

      {mayInvite && (
        <>
          <TeamSectionTitle title={M.Invite.Title} />
          <TeamInviteForm teamId={team.id} roles={roleOptions} labels={M.Invite} errors={t.Errors} />
        </>
      )}

      {team.isActive && canDo(team.role, "rename") && (
        <>
          <TeamSectionTitle title={M.Settings.Title} />
          <TeamRenameForm teamId={team.id} name={team.name} label={M.Settings.NameLabel} submitLabel={M.Settings.Rename} savedLabel={t.Saved} errors={t.Errors} />
        </>
      )}

      <TeamLeaveSection title={M.Leave.Title} body={isOwner ? M.Leave.OwnerHint : M.Leave.Body}>
        {!isOwner && <TeamActionButton action={leaveTeamAction} fields={{ teamId: team.id }} label={M.Leave.Submit} errors={t.Errors} tone="danger" />}
      </TeamLeaveSection>
      {isOwner && <TeamDeleteForm teamId={team.id} labels={M.Delete} errors={t.Errors} />}
    </>
  );
}
