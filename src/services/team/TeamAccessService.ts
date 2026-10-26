import "server-only";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { teamMembers, teams, users } from "@/db/schema";
import { MarketCode } from "@/lib/constants";
import { effectiveUserPermissions, hasPermission } from "@/lib/permissions";
import { isTeamRole, TEAM_PLAN_PERMISSION, TeamRole } from "@/lib/team/teamConfig";
import { canDo, needsActivePlan, TeamAction } from "@/lib/team/teamRoles";
import { activePlanSql } from "@/services/billing/activePlanSql";

/** The viewer's place in one team, as every team action checks it. */
export interface TeamMembership {
  teamId: string;
  teamName: string;
  market: MarketCode;
  role: TeamRole;
  /** The owner's plan allows team work */
  isActive: boolean;
}

export type AccessResult = { ok: true; membership: TeamMembership } | { ok: false; reason: "forbidden" | "inactive" };

const toMarket = (value: string): MarketCode => (value === "TR" ? "TR" : "DE");

/**
 * TeamAccessService
 *
 * Membership, role and the plan gate in one place. A team works while its
 * owner has the Pro capability (booked Pro plan or superuser) — the same
 * capability check as everywhere else, evaluated for the owner, not for the
 * person clicking. Without it the team stays readable, so nobody loses their
 * notes when a plan ends, but nothing new can be added.
 */
export class TeamAccessService {
  /** Whether a user (by their stored plan, trial and grants) may run a team. */
  static userHasTeamPlan = async (userId: string): Promise<boolean> => {
    const [row] = await db
      .select({ permissions: users.permissions, plan: activePlanSql, trialEndsAt: users.trialEndsAt, bannedAt: users.gesperrtAm })
      .from(users)
      .where(eq(users.id, userId));
    return row ? hasPermission(effectiveUserPermissions(row), TEAM_PLAN_PERMISSION) : false;
  };

  /** Team id → owner's plan allows team work. */
  static activeTeams = async (teamIds: string[]): Promise<Map<string, boolean>> => {
    if (teamIds.length === 0) return new Map();
    const owners = await db
      .select({ teamId: teamMembers.teamId, permissions: users.permissions, plan: activePlanSql, trialEndsAt: users.trialEndsAt, bannedAt: users.gesperrtAm })
      .from(teamMembers)
      .innerJoin(users, eq(users.id, teamMembers.userId))
      .where(and(inArray(teamMembers.teamId, teamIds), eq(teamMembers.role, "owner")));
    const result = new Map(teamIds.map((id) => [id, false]));
    for (const owner of owners) result.set(owner.teamId, hasPermission(effectiveUserPermissions(owner), TEAM_PLAN_PERMISSION));
    return result;
  };

  static membership = async (teamId: string, userId: string): Promise<TeamMembership | null> => {
    const [row] = await db
      .select({ teamId: teams.id, teamName: teams.name, market: teams.market, role: teamMembers.role })
      .from(teamMembers)
      .innerJoin(teams, eq(teams.id, teamMembers.teamId))
      .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)));
    if (!row || !isTeamRole(row.role)) return null;
    const isActive = (await TeamAccessService.activeTeams([teamId])).get(teamId) ?? false;
    return { teamId: row.teamId, teamName: row.teamName, market: toMarket(row.market), role: row.role, isActive };
  };

  /** Membership plus the right to do `action`; write actions also need the owner's plan. */
  static authorise = async (teamId: string, userId: string, action: TeamAction): Promise<AccessResult> => {
    const membership = await TeamAccessService.membership(teamId, userId);
    if (!membership || !canDo(membership.role, action)) return { ok: false, reason: "forbidden" };
    if (needsActivePlan(action) && !membership.isActive) return { ok: false, reason: "inactive" };
    return { ok: true, membership };
  };
}
