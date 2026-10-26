import "server-only";
import { and, asc, count, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { teamInvites, teamListings, teamMembers, teamNotes, teams, users } from "@/db/schema";
import { MarketCode } from "@/lib/constants";
import { isTeamRole, isTeamStatus, TEAM_STATUSES, TeamRole, TeamStatus } from "@/lib/team/teamConfig";
import { TeamAccessService } from "@/services/team/TeamAccessService";
import { TeamMemberView, TeamView } from "@/types/team.types";

const toMarket = (value: string): MarketCode => (value === "TR" ? "TR" : "DE");

export const displayName = (name: string | null, email: string): string => name || email.split("@")[0] || email;

const emptyCounts = (): Record<TeamStatus, number> => Object.fromEntries(TEAM_STATUSES.map((status) => [status, 0])) as Record<TeamStatus, number>;

/** Order in which a team without owner (after an account deletion) picks its next owner. */
const SUCCESSION: readonly TeamRole[] = ["admin", "member", "viewer"];

/**
 * TeamService
 *
 * Teams and their members. Every read is scoped to a team the user belongs
 * to; the role checks live in TeamAccessService and are done by the actions
 * before they call in here.
 */
export class TeamService {
  static listForUser = async (userId: string): Promise<TeamView[]> => {
    const rows = await db
      .select({ id: teams.id, name: teams.name, market: teams.market, role: teamMembers.role, createdAt: teams.createdAt })
      .from(teamMembers)
      .innerJoin(teams, eq(teams.id, teamMembers.teamId))
      .where(eq(teamMembers.userId, userId))
      .orderBy(asc(teams.name));
    const ids = rows.map((row) => row.id);
    if (ids.length === 0) return [];

    const [memberCounts, statusRows, active] = await Promise.all([
      db.select({ teamId: teamMembers.teamId, total: count() }).from(teamMembers).where(inArray(teamMembers.teamId, ids)).groupBy(teamMembers.teamId),
      db
        .select({ teamId: teamListings.teamId, status: teamListings.status, total: count() })
        .from(teamListings)
        .where(inArray(teamListings.teamId, ids))
        .groupBy(teamListings.teamId, teamListings.status),
      TeamAccessService.activeTeams(ids),
    ]);
    const members = new Map(memberCounts.map((row) => [row.teamId, row.total]));

    return rows
      .filter((row) => isTeamRole(row.role))
      .map((row) => {
        const statusCounts = emptyCounts();
        for (const entry of statusRows) if (entry.teamId === row.id && isTeamStatus(entry.status)) statusCounts[entry.status] = entry.total;
        return {
          id: row.id,
          name: row.name,
          market: toMarket(row.market),
          role: row.role as TeamRole,
          isActive: active.get(row.id) ?? false,
          memberCount: members.get(row.id) ?? 0,
          listingCount: Object.values(statusCounts).reduce((sum, value) => sum + value, 0),
          statusCounts,
          createdAt: row.createdAt,
        };
      });
  };

  static get = async (teamId: string, userId: string): Promise<TeamView | null> => (await TeamService.listForUser(userId)).find((team) => team.id === teamId) ?? null;

  static countOwned = async (userId: string): Promise<number> => {
    const [row] = await db.select({ total: count() }).from(teamMembers).where(and(eq(teamMembers.userId, userId), eq(teamMembers.role, "owner")));
    return row?.total ?? 0;
  };

  static members = async (teamId: string): Promise<TeamMemberView[]> => {
    const rows = await db
      .select({ userId: teamMembers.userId, name: users.name, email: users.email, role: teamMembers.role, joinedAt: teamMembers.joinedAt })
      .from(teamMembers)
      .innerJoin(users, eq(users.id, teamMembers.userId))
      .where(eq(teamMembers.teamId, teamId))
      .orderBy(asc(teamMembers.joinedAt));
    return rows.filter((row) => isTeamRole(row.role)).map((row) => ({ ...row, role: row.role as TeamRole, displayName: displayName(row.name, row.email) }));
  };

  static memberRole = async (teamId: string, userId: string): Promise<TeamRole | null> => {
    const [row] = await db.select({ role: teamMembers.role }).from(teamMembers).where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)));
    return row && isTeamRole(row.role) ? row.role : null;
  };

  /** Seats taken: members plus open invitations (expired ones are purged first). */
  static seatsTaken = async (teamId: string): Promise<number> => {
    await db.delete(teamInvites).where(and(eq(teamInvites.teamId, teamId), sql`${teamInvites.expiresAt} < now()`));
    const [[members], [invites]] = await Promise.all([
      db.select({ total: count() }).from(teamMembers).where(eq(teamMembers.teamId, teamId)),
      db.select({ total: count() }).from(teamInvites).where(eq(teamInvites.teamId, teamId)),
    ]);
    return (members?.total ?? 0) + (invites?.total ?? 0);
  };

  static create = async (ownerId: string, market: MarketCode, name: string): Promise<string> => {
    const [team] = await db.insert(teams).values({ name, market }).returning({ id: teams.id });
    await db.insert(teamMembers).values({ teamId: team.id, userId: ownerId, role: "owner" });
    return team.id;
  };

  static rename = async (teamId: string, name: string): Promise<void> => {
    await db.update(teams).set({ name }).where(eq(teams.id, teamId));
  };

  /** Deletes the team with its list, notes, members and open invitations (all cascade). */
  static remove = async (teamId: string): Promise<void> => {
    await db.delete(teams).where(eq(teams.id, teamId));
  };

  static setRole = async (teamId: string, userId: string, role: TeamRole): Promise<void> => {
    await db.update(teamMembers).set({ role }).where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)));
  };

  /** Hands the team over: the new owner takes the role, the old one becomes admin. */
  static transfer = async (teamId: string, fromUserId: string, toUserId: string): Promise<void> => {
    await db.update(teamMembers).set({ role: "owner" }).where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, toUserId)));
    await db.update(teamMembers).set({ role: "admin" }).where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, fromUserId)));
  };

  /**
   * Takes a person out of the team (leaving or removed). Their notes in this
   * team are deleted; on the list their name is dropped from "added by" and
   * "status set by", the status itself stays as the team's work result.
   */
  static removeMember = async (teamId: string, userId: string): Promise<void> => {
    await db.delete(teamNotes).where(and(eq(teamNotes.teamId, teamId), eq(teamNotes.authorId, userId)));
    await db.update(teamListings).set({ addedBy: null }).where(and(eq(teamListings.teamId, teamId), eq(teamListings.addedBy, userId)));
    await db.update(teamListings).set({ statusBy: null }).where(and(eq(teamListings.teamId, teamId), eq(teamListings.statusBy, userId)));
    await db.update(teamInvites).set({ invitedBy: null }).where(and(eq(teamInvites.teamId, teamId), eq(teamInvites.invitedBy, userId)));
    await db.delete(teamMembers).where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)));
  };

  /**
   * Called before an account is deleted. Teams the person owns go to the
   * longest-serving admin (then member, then viewer); a team with nobody else
   * in it is deleted. Their notes go with the account (cascade).
   */
  static beforeAccountDelete = async (userId: string): Promise<void> => {
    const owned = await db.select({ teamId: teamMembers.teamId }).from(teamMembers).where(and(eq(teamMembers.userId, userId), eq(teamMembers.role, "owner")));
    for (const { teamId } of owned) {
      const others = (await TeamService.members(teamId)).filter((member) => member.userId !== userId);
      const heir = SUCCESSION.map((role) => others.find((member) => member.role === role)).find(Boolean);
      if (heir) await TeamService.setRole(teamId, heir.userId, "owner");
      else await TeamService.remove(teamId);
    }
  };

  /** Art. 15 DSGVO: the person's memberships, the notes they wrote and the statuses they set. */
  static exportFor = async (userId: string): Promise<Record<string, unknown>> => {
    const [memberships, notes, statuses] = await Promise.all([
      db
        .select({ team: teams.name, market: teams.market, role: teamMembers.role, joinedAt: teamMembers.joinedAt })
        .from(teamMembers)
        .innerJoin(teams, eq(teams.id, teamMembers.teamId))
        .where(eq(teamMembers.userId, userId)),
      db
        .select({ team: teams.name, listingId: teamNotes.listingId, body: teamNotes.body, createdAt: teamNotes.createdAt })
        .from(teamNotes)
        .innerJoin(teams, eq(teams.id, teamNotes.teamId))
        .where(eq(teamNotes.authorId, userId)),
      db
        .select({ team: teams.name, listingId: teamListings.listingId, status: teamListings.status, statusAt: teamListings.statusAt })
        .from(teamListings)
        .innerJoin(teams, eq(teams.id, teamListings.teamId))
        .where(eq(teamListings.statusBy, userId)),
    ]);
    return { memberships, notes, statusesSet: statuses };
  };
}
