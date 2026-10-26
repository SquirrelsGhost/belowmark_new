"use server";

import { currentActor, fail, failed, field, refreshTeamViews, uuidField } from "@/lib/team/teamActionHelpers";
import { isTeamStatus, TEAMS } from "@/lib/team/teamConfig";
import { canDo, TeamAction } from "@/lib/team/teamRoles";
import { ListingService } from "@/services/ListingService";
import { TeamAccessService, TeamMembership } from "@/services/team/TeamAccessService";
import { TeamBoardService } from "@/services/team/TeamBoardService";
import { TeamActionState, TeamErrorCode } from "@/types/team.types";

interface BoardTarget {
  actorId: string;
  membership: TeamMembership;
  listingId: string;
}

/** Signed in, allowed to do `action` in the team, and — unless `allowMissing` — a key that exists in the team's market. */
async function target(formData: FormData, action: TeamAction, allowMissing = false): Promise<BoardTarget | TeamErrorCode> {
  const actor = await currentActor();
  const teamId = uuidField(formData, "teamId");
  const listingId = field(formData, "listingId");
  if (!actor || !teamId || !listingId || listingId.length > 128) return "failed";
  const access = await TeamAccessService.authorise(teamId, actor.id, action);
  if (!access.ok) return access.reason;
  if (!allowMissing && !(await ListingService.getByKey(access.membership.market, listingId))) return "invalid";
  return { actorId: actor.id, membership: access.membership, listingId };
}

const done = (): TeamActionState => {
  refreshTeamViews();
  return { ok: true, done: true };
};

/** Server Action: puts a proceeding on the team's list (status "Prüfen"). */
export async function addToTeamAction(_: TeamActionState, formData: FormData): Promise<TeamActionState> {
  try {
    const t = await target(formData, "editList");
    if (typeof t === "string") return fail(t);
    const error = await TeamBoardService.add(t.membership.teamId, t.listingId, t.actorId);
    return error ? fail(error) : done();
  } catch (error) {
    return failed("addToTeamAction", error);
  }
}

/** Server Action: takes a proceeding off the team's list, with its notes. Possible even when it left the data. */
export async function removeFromTeamAction(_: TeamActionState, formData: FormData): Promise<TeamActionState> {
  try {
    const t = await target(formData, "editList", true);
    if (typeof t === "string") return fail(t);
    await TeamBoardService.remove(t.membership.teamId, t.listingId);
    return done();
  } catch (error) {
    return failed("removeFromTeamAction", error);
  }
}

/** Server Action: sets the team's status of a proceeding. */
export async function setTeamStatusAction(_: TeamActionState, formData: FormData): Promise<TeamActionState> {
  const status = field(formData, "status");
  if (!isTeamStatus(status)) return fail("invalid");
  try {
    const t = await target(formData, "setStatus");
    if (typeof t === "string") return fail(t);
    const error = await TeamBoardService.setStatus(t.membership.teamId, t.listingId, status, t.actorId);
    return error ? fail(error) : done();
  } catch (error) {
    return failed("setTeamStatusAction", error);
  }
}

/** Server Action: shares a note with the team. */
export async function addTeamNoteAction(_: TeamActionState, formData: FormData): Promise<TeamActionState> {
  const body = field(formData, "body").slice(0, TEAMS.noteMaxLength);
  if (!body) return fail("invalid");
  try {
    const t = await target(formData, "writeNote");
    if (typeof t === "string") return fail(t);
    const error = await TeamBoardService.addNote(t.membership.teamId, t.listingId, t.actorId, body);
    return error ? fail(error) : done();
  } catch (error) {
    return failed("addTeamNoteAction", error);
  }
}

/**
 * Server Action: deletes a note — your own always (also while the team
 * rests, it is your data), anyone's as owner or admin.
 */
export async function deleteTeamNoteAction(_: TeamActionState, formData: FormData): Promise<TeamActionState> {
  const actor = await currentActor();
  const teamId = uuidField(formData, "teamId");
  const noteId = uuidField(formData, "noteId");
  if (!actor || !teamId || !noteId) return fail("failed");
  try {
    const access = await TeamAccessService.authorise(teamId, actor.id, "read");
    if (!access.ok) return fail(access.reason);
    const deleted = await TeamBoardService.deleteNote(teamId, noteId, actor.id, canDo(access.membership.role, "moderateNotes"));
    return deleted ? done() : fail("forbidden");
  } catch (error) {
    return failed("deleteTeamNoteAction", error);
  }
}
