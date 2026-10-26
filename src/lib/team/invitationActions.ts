"use server";

import { redirect } from "next/navigation";
import { RATE_LIMITS } from "@/lib/auth/authConfig";
import { getRequestInfo } from "@/lib/auth/requestInfo";
import { currentActor, fail, failed, field, refreshTeamViews, uuidField } from "@/lib/team/teamActionHelpers";
import { teamHref } from "@/lib/team/teamConfig";
import { RateLimitService } from "@/services/RateLimitService";
import { TeamInviteService } from "@/services/team/TeamInviteService";
import { InvitationPreview, TeamActionState } from "@/types/team.types";

/** Guards the token lookups, which work without sign-in. */
async function tokenRateOk(): Promise<boolean> {
  const { ip } = await getRequestInfo();
  return (await RateLimitService.hit(`team:token:${ip}`, RATE_LIMITS.tokenIp)).allowed;
}

/** The invitation behind a mail link (`token`) or, on the overview, behind an id addressed to the signed-in person. */
async function findInvitation(formData: FormData, email: string | null): Promise<InvitationPreview | null> {
  const token = field(formData, "token");
  if (token) return TeamInviteService.previewByToken(token);
  const inviteId = uuidField(formData, "inviteId");
  if (!inviteId || !email) return null;
  return (await TeamInviteService.pendingForEmail(email)).find((invite) => invite.inviteId === inviteId) ?? null;
}

/** Server Action: accepts an invitation with the signed-in account and opens the team. */
export async function acceptInviteAction(_: TeamActionState, formData: FormData): Promise<TeamActionState> {
  const actor = await currentActor();
  if (!actor) return fail("failed");
  let teamId: string;
  try {
    if (!(await tokenRateOk())) return fail("rate_limited");
    const invitation = await findInvitation(formData, actor.email);
    if (!invitation) return fail("invite_invalid");
    const result = await TeamInviteService.accept(invitation, actor);
    if (!result.ok) return fail(result.error);
    teamId = result.teamId;
  } catch (error) {
    return failed("acceptInviteAction", error);
  }
  refreshTeamViews();
  redirect(teamHref(teamId));
}

/** Server Action: declines — with the mail link no sign-in is needed. The address is deleted at once. */
export async function declineInviteAction(_: TeamActionState, formData: FormData): Promise<TeamActionState> {
  try {
    if (!(await tokenRateOk())) return fail("rate_limited");
    const token = field(formData, "token");
    if (token) {
      if (token.length > 128 || !(await TeamInviteService.declineByToken(token))) return fail("invite_invalid");
    } else {
      const actor = await currentActor();
      const inviteId = uuidField(formData, "inviteId");
      if (!actor || !inviteId) return fail("failed");
      await TeamInviteService.declineById(inviteId, actor.email);
      refreshTeamViews();
    }
  } catch (error) {
    return failed("declineInviteAction", error);
  }
  return { ok: true, done: true };
}
