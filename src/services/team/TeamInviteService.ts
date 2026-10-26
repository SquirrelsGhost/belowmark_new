import "server-only";
import { and, asc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { teamInvites, teamMembers, teams, users } from "@/db/schema";
import { DAY_MS } from "@/lib/appConstants";
import { generateToken, hashToken } from "@/lib/auth/tokens";
import { isTeamRole, TeamRole, TEAMS } from "@/lib/team/teamConfig";
import { TeamAccessService } from "@/services/team/TeamAccessService";
import { displayName, TeamService } from "@/services/team/TeamService";
import { InvitationPreview, TeamErrorCode, TeamInviteView } from "@/types/team.types";

const notExpired = sql`${teamInvites.expiresAt} > now()`;

const PREVIEW_COLUMNS = {
  inviteId: teamInvites.id,
  teamId: teams.id,
  teamName: teams.name,
  market: teams.market,
  role: teamInvites.role,
  email: teamInvites.email,
  inviterName: users.name,
  inviterEmail: users.email,
  expiresAt: teamInvites.expiresAt,
};

interface PreviewRow {
  inviteId: string;
  teamId: string;
  teamName: string;
  market: string;
  role: string;
  email: string;
  inviterName: string | null;
  inviterEmail: string | null;
  expiresAt: Date;
}

/** Who accepts: only the account behind the invited address, in the team's market. */
export interface InviteAccepter {
  id: string;
  email: string;
  market: string;
}

export type AcceptResult = { ok: true; teamId: string } | { ok: false; error: TeamErrorCode };

/**
 * TeamInviteService
 *
 * Invitations by mail. The invited address belongs to someone who has not
 * agreed to anything yet, so it is kept for one purpose only and deleted as
 * soon as it is no longer needed: on accept, decline, withdrawal or after
 * TEAMS.inviteTtlDays. Only the hash of the link token is stored.
 */
export class TeamInviteService {
  /** Deletes every expired invitation — run before reads so stale addresses never linger. */
  static purgeExpired = async (): Promise<void> => {
    await db.delete(teamInvites).where(sql`${teamInvites.expiresAt} <= now()`);
  };

  static listForTeam = async (teamId: string): Promise<TeamInviteView[]> => {
    await TeamInviteService.purgeExpired();
    const rows = await db
      .select({ id: teamInvites.id, email: teamInvites.email, role: teamInvites.role, name: users.name, inviterEmail: users.email, expiresAt: teamInvites.expiresAt })
      .from(teamInvites)
      .leftJoin(users, eq(users.id, teamInvites.invitedBy))
      .where(eq(teamInvites.teamId, teamId))
      .orderBy(asc(teamInvites.createdAt));
    return rows
      .filter((row) => isTeamRole(row.role))
      .map((row) => ({ id: row.id, email: row.email, role: row.role as TeamRole, invitedByName: row.inviterEmail ? displayName(row.name, row.inviterEmail) : null, expiresAt: row.expiresAt }));
  };

  /** Creates the invitation and returns the plain link token (sent by mail, never stored). */
  static create = async (teamId: string, invitedBy: string, email: string, role: TeamRole): Promise<{ ok: true; token: string } | { ok: false; error: TeamErrorCode }> => {
    const [existingMember] = await db
      .select({ userId: teamMembers.userId })
      .from(teamMembers)
      .innerJoin(users, eq(users.id, teamMembers.userId))
      .where(and(eq(teamMembers.teamId, teamId), eq(users.email, email)));
    if (existingMember) return { ok: false, error: "already_member" };
    if ((await TeamService.seatsTaken(teamId)) >= TEAMS.maxSeats) return { ok: false, error: "seats_full" };
    const [open] = await db.select({ id: teamInvites.id }).from(teamInvites).where(and(eq(teamInvites.teamId, teamId), eq(teamInvites.email, email)));
    if (open) return { ok: false, error: "already_invited" };

    const token = generateToken();
    await db.insert(teamInvites).values({
      teamId,
      email,
      role,
      tokenHash: hashToken(token),
      invitedBy,
      expiresAt: new Date(Date.now() + TEAMS.inviteTtlDays * DAY_MS),
    });
    return { ok: true, token };
  };

  static purgeByEmail = async (teamId: string, email: string): Promise<void> => {
    await db.delete(teamInvites).where(and(eq(teamInvites.teamId, teamId), eq(teamInvites.email, email)));
  };

  static revoke = async (teamId: string, inviteId: string): Promise<void> => {
    await db.delete(teamInvites).where(and(eq(teamInvites.teamId, teamId), eq(teamInvites.id, inviteId)));
  };

  private static toPreview = async (row: PreviewRow): Promise<InvitationPreview | null> => {
    if (!isTeamRole(row.role)) return null;
    const isActive = (await TeamAccessService.activeTeams([row.teamId])).get(row.teamId) ?? false;
    return {
      inviteId: row.inviteId,
      teamId: row.teamId,
      teamName: row.teamName,
      market: row.market === "TR" ? "TR" : "DE",
      role: row.role,
      email: row.email,
      invitedByName: row.inviterEmail ? displayName(row.inviterName, row.inviterEmail) : null,
      expiresAt: row.expiresAt,
      isBlocked: !isActive,
    };
  };

  /** The invitation behind a mail link, or null when it is unknown, used or expired. */
  static previewByToken = async (token: string): Promise<InvitationPreview | null> => {
    if (!token || token.length > 128) return null;
    const [row] = await db
      .select(PREVIEW_COLUMNS)
      .from(teamInvites)
      .innerJoin(teams, eq(teams.id, teamInvites.teamId))
      .leftJoin(users, eq(users.id, teamInvites.invitedBy))
      .where(and(eq(teamInvites.tokenHash, hashToken(token)), notExpired));
    return row ? TeamInviteService.toPreview(row) : null;
  };

  /** Open invitations addressed to a signed-in person — shown on their team overview. */
  static pendingForEmail = async (email: string): Promise<InvitationPreview[]> => {
    const rows = await db
      .select(PREVIEW_COLUMNS)
      .from(teamInvites)
      .innerJoin(teams, eq(teams.id, teamInvites.teamId))
      .leftJoin(users, eq(users.id, teamInvites.invitedBy))
      .where(and(eq(teamInvites.email, email), notExpired))
      .orderBy(asc(teamInvites.createdAt));
    return (await Promise.all(rows.map(TeamInviteService.toPreview))).filter((preview): preview is InvitationPreview => preview !== null);
  };

  /** Declining needs no account: the link holder says no, the address is deleted. */
  static declineByToken = async (token: string): Promise<boolean> => {
    const deleted = await db.delete(teamInvites).where(eq(teamInvites.tokenHash, hashToken(token))).returning({ id: teamInvites.id });
    return deleted.length > 0;
  };

  static declineById = async (inviteId: string, email: string): Promise<void> => {
    await db.delete(teamInvites).where(and(eq(teamInvites.id, inviteId), eq(teamInvites.email, email)));
  };

  /**
   * Turns the invitation into a membership. The signed-in account must own
   * the invited address (a forwarded link does not let someone else in) and
   * work in the team's market (listing keys exist per market).
   */
  static accept = async (preview: InvitationPreview, accepter: InviteAccepter): Promise<AcceptResult> => {
    if (preview.email !== accepter.email) return { ok: false, error: "wrong_account" };
    if (preview.market !== (accepter.market === "TR" ? "TR" : "DE")) return { ok: false, error: "market_mismatch" };
    if (preview.isBlocked) return { ok: false, error: "inactive" };

    await db.insert(teamMembers).values({ teamId: preview.teamId, userId: accepter.id, role: preview.role }).onConflictDoNothing();
    await db.delete(teamInvites).where(eq(teamInvites.id, preview.inviteId));
    return { ok: true, teamId: preview.teamId };
  };
}
