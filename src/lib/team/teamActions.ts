"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { EMAIL_MAX_LENGTH } from "@/lib/auth/authConfig";
import { isDisposableEmail, normalizeEmail } from "@/lib/auth/normalizeEmail";
import { hasPermission } from "@/lib/permissions";
import { currentActor, fail, failed, field, refreshTeamViews, uuidField } from "@/lib/team/teamActionHelpers";
import { isAssignableRole, TEAM_PLAN_PERMISSION, TEAM_ROUTES, teamHref, TEAMS } from "@/lib/team/teamConfig";
import { outranks } from "@/lib/team/teamRoles";
import { MailService } from "@/services/MailService";
import { RateLimitService } from "@/services/RateLimitService";
import { TeamAccessService } from "@/services/team/TeamAccessService";
import { TeamInviteService } from "@/services/team/TeamInviteService";
import { TeamMailService } from "@/services/team/TeamMailService";
import { TeamService } from "@/services/team/TeamService";
import { TeamActionState } from "@/types/team.types";

const emailSchema = z.string().max(EMAIL_MAX_LENGTH).transform(normalizeEmail).pipe(z.email());

const cleanName = (value: string): string => value.replace(/\s+/g, " ").slice(0, TEAMS.nameMaxLength);

/** Server Action: creates a team; the creator becomes owner. Needs the Pro capability. */
export async function createTeamAction(_: TeamActionState, formData: FormData): Promise<TeamActionState> {
  const actor = await currentActor();
  if (!actor) return fail("failed");
  if (!hasPermission(actor.permissions, TEAM_PLAN_PERMISSION)) return fail("plan_required");
  const name = cleanName(field(formData, "name"));
  if (!name) return fail("invalid");
  let teamId: string;
  try {
    if ((await TeamService.countOwned(actor.id)) >= TEAMS.maxOwnedPerUser) return fail("team_limit");
    teamId = await TeamService.create(actor.id, actor.market, name);
  } catch (error) {
    return failed("createTeamAction", error);
  }
  refreshTeamViews();
  redirect(teamHref(teamId));
}

/** Server Action: renames the team (owner, admin). */
export async function renameTeamAction(_: TeamActionState, formData: FormData): Promise<TeamActionState> {
  const actor = await currentActor();
  const teamId = uuidField(formData, "teamId");
  const name = cleanName(field(formData, "name"));
  if (!actor || !teamId) return fail("failed");
  if (!name) return fail("invalid");
  try {
    const access = await TeamAccessService.authorise(teamId, actor.id, "rename");
    if (!access.ok) return fail(access.reason);
    await TeamService.rename(teamId, name);
  } catch (error) {
    return failed("renameTeamAction", error);
  }
  refreshTeamViews();
  return { ok: true, done: true };
}

/** Server Action: deletes the team with everything in it (owner only, name typed as confirmation). */
export async function deleteTeamAction(_: TeamActionState, formData: FormData): Promise<TeamActionState> {
  const actor = await currentActor();
  const teamId = uuidField(formData, "teamId");
  if (!actor || !teamId) return fail("failed");
  try {
    const access = await TeamAccessService.authorise(teamId, actor.id, "deleteTeam");
    if (!access.ok) return fail(access.reason);
    if (field(formData, "confirm") !== access.membership.teamName) return fail("confirm_mismatch");
    await TeamService.remove(teamId);
  } catch (error) {
    return failed("deleteTeamAction", error);
  }
  refreshTeamViews();
  redirect(TEAM_ROUTES.overview);
}

/** Server Action: invites an address by mail. Admins may invite members and viewers, the owner also admins. */
export async function inviteMemberAction(_: TeamActionState, formData: FormData): Promise<TeamActionState> {
  const actor = await currentActor();
  const teamId = uuidField(formData, "teamId");
  const role = field(formData, "role");
  const parsedEmail = emailSchema.safeParse(field(formData, "email"));
  if (!actor || !teamId) return fail("failed");
  if (!parsedEmail.success || !isAssignableRole(role)) return fail("invalid");
  if (isDisposableEmail(parsedEmail.data)) return fail("invalid");
  if (!MailService.isAvailable()) return fail("mail_unavailable");
  try {
    const access = await TeamAccessService.authorise(teamId, actor.id, "invite");
    if (!access.ok) return fail(access.reason);
    if (!outranks(access.membership.role, role)) return fail("forbidden");
    if (!(await RateLimitService.hit(`team:invite:${teamId}`, TEAMS.invitesPerDay)).allowed) return fail("rate_limited");

    const created = await TeamInviteService.create(teamId, actor.id, parsedEmail.data, role);
    if (!created.ok) return fail(created.error);
    try {
      await TeamMailService.sendInvite({
        to: parsedEmail.data,
        locale: actor.locale,
        inviter: actor.name,
        team: access.membership.teamName,
        role,
        market: access.membership.market,
        token: created.token,
      });
    } catch (error) {
      // No mail, no stored address: an invitation nobody can open is pointless
      await TeamInviteService.purgeByEmail(teamId, parsedEmail.data);
      return failed("inviteMemberAction:mail", error);
    }
  } catch (error) {
    return failed("inviteMemberAction", error);
  }
  refreshTeamViews();
  return { ok: true, done: true };
}

/** Server Action: withdraws an open invitation — the address is deleted. Works even while the team rests. */
export async function revokeInviteAction(_: TeamActionState, formData: FormData): Promise<TeamActionState> {
  const actor = await currentActor();
  const teamId = uuidField(formData, "teamId");
  const inviteId = uuidField(formData, "inviteId");
  if (!actor || !teamId || !inviteId) return fail("failed");
  try {
    const access = await TeamAccessService.authorise(teamId, actor.id, "removeMember");
    if (!access.ok) return fail(access.reason);
    await TeamInviteService.revoke(teamId, inviteId);
  } catch (error) {
    return failed("revokeInviteAction", error);
  }
  refreshTeamViews();
  return { ok: true, done: true };
}

/** Server Action: gives a member another role (never owner — that is a handover). */
export async function changeRoleAction(_: TeamActionState, formData: FormData): Promise<TeamActionState> {
  const actor = await currentActor();
  const teamId = uuidField(formData, "teamId");
  const userId = uuidField(formData, "userId");
  const role = field(formData, "role");
  if (!actor || !teamId || !userId || !isAssignableRole(role)) return fail("failed");
  try {
    const access = await TeamAccessService.authorise(teamId, actor.id, "changeRole");
    if (!access.ok) return fail(access.reason);
    const current = await TeamService.memberRole(teamId, userId);
    if (!current || userId === actor.id || !outranks(access.membership.role, current) || !outranks(access.membership.role, role)) return fail("forbidden");
    await TeamService.setRole(teamId, userId, role);
  } catch (error) {
    return failed("changeRoleAction", error);
  }
  refreshTeamViews();
  return { ok: true, done: true };
}

/** Server Action: removes a member; their notes in the team are deleted. */
export async function removeMemberAction(_: TeamActionState, formData: FormData): Promise<TeamActionState> {
  const actor = await currentActor();
  const teamId = uuidField(formData, "teamId");
  const userId = uuidField(formData, "userId");
  if (!actor || !teamId || !userId || userId === actor.id) return fail("failed");
  try {
    const access = await TeamAccessService.authorise(teamId, actor.id, "removeMember");
    if (!access.ok) return fail(access.reason);
    const current = await TeamService.memberRole(teamId, userId);
    if (!current || !outranks(access.membership.role, current)) return fail("forbidden");
    await TeamService.removeMember(teamId, userId);
  } catch (error) {
    return failed("removeMemberAction", error);
  }
  refreshTeamViews();
  return { ok: true, done: true };
}

/** Server Action: hands the team to another member; the old owner becomes admin. */
export async function transferTeamAction(_: TeamActionState, formData: FormData): Promise<TeamActionState> {
  const actor = await currentActor();
  const teamId = uuidField(formData, "teamId");
  const userId = uuidField(formData, "userId");
  if (!actor || !teamId || !userId || userId === actor.id) return fail("failed");
  try {
    const access = await TeamAccessService.authorise(teamId, actor.id, "transfer");
    if (!access.ok) return fail(access.reason);
    if (!(await TeamService.memberRole(teamId, userId))) return fail("forbidden");
    await TeamService.transfer(teamId, actor.id, userId);
  } catch (error) {
    return failed("transferTeamAction", error);
  }
  refreshTeamViews();
  return { ok: true, done: true };
}

/** Server Action: leaves the team. The owner has to hand over or delete first. */
export async function leaveTeamAction(_: TeamActionState, formData: FormData): Promise<TeamActionState> {
  const actor = await currentActor();
  const teamId = uuidField(formData, "teamId");
  if (!actor || !teamId) return fail("failed");
  try {
    const role = await TeamService.memberRole(teamId, actor.id);
    if (!role) return fail("forbidden");
    if (role === "owner") return fail("owner_must_transfer");
    await TeamService.removeMember(teamId, actor.id);
  } catch (error) {
    return failed("leaveTeamAction", error);
  }
  refreshTeamViews();
  redirect(TEAM_ROUTES.overview);
}
