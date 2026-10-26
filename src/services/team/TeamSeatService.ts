import "server-only";
import { and, eq, inArray, ne } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "@/db";
import { teamMembers, users } from "@/db/schema";
import { effectiveUserPermissions, hasPermission } from "@/lib/permissions";
import { TEAM_PLAN_PERMISSION } from "@/lib/team/teamConfig";
import { activePlanSql } from "@/services/billing/activePlanSql";

const owners = alias(teamMembers, "seat_owner");

/**
 * TeamSeatService
 *
 * A seat in a team comes with full app access, paid for by the owner's Pro
 * plan: every member of a team whose owner currently holds the Pro
 * capability counts as a seat holder. The check runs live on every request,
 * so leaving the team, being removed or the owner's plan ending takes the
 * access away at once. A seat never passes on the Pro capability itself —
 * members cannot open teams or client links of their own with it.
 */
export class TeamSeatService {
  /** The ids among `userIds` that hold a seat in at least one working team. */
  static holders = async (userIds: string[]): Promise<Set<string>> => {
    if (userIds.length === 0) return new Set();
    const rows = await db
      .select({ memberId: teamMembers.userId, permissions: users.permissions, plan: activePlanSql, trialEndsAt: users.trialEndsAt, bannedAt: users.gesperrtAm })
      .from(teamMembers)
      .innerJoin(owners, and(eq(owners.teamId, teamMembers.teamId), eq(owners.role, "owner")))
      .innerJoin(users, eq(users.id, owners.userId))
      .where(and(inArray(teamMembers.userId, userIds), ne(teamMembers.role, "owner")));
    return new Set(rows.filter((row) => hasPermission(effectiveUserPermissions(row), TEAM_PLAN_PERMISSION)).map((row) => row.memberId));
  };

  static has = async (userId: string): Promise<boolean> => (await TeamSeatService.holders([userId])).has(userId);
}
