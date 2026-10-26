import { TeamRole } from "@/lib/team/teamConfig";

/** Everything a team member can do; checked on the server before every change. */
export type TeamAction =
  | "read"
  | "editList"
  | "setStatus"
  | "writeNote"
  | "moderateNotes"
  | "invite"
  | "removeMember"
  | "changeRole"
  | "rename"
  | "transfer"
  | "deleteTeam";

const RIGHTS: Record<TeamRole, readonly TeamAction[]> = {
  owner: ["read", "editList", "setStatus", "writeNote", "moderateNotes", "invite", "removeMember", "changeRole", "rename", "transfer", "deleteTeam"],
  admin: ["read", "editList", "setStatus", "writeNote", "moderateNotes", "invite", "removeMember", "changeRole", "rename"],
  member: ["read", "editList", "setStatus", "writeNote"],
  viewer: ["read"],
};

/** Actions that change the team's content or members — paused while the team has no active plan. */
const WRITE_ACTIONS: readonly TeamAction[] = ["editList", "setStatus", "writeNote", "invite", "changeRole", "rename"];

export function canDo(role: TeamRole, action: TeamAction): boolean {
  return RIGHTS[role].includes(action);
}

export function needsActivePlan(action: TeamAction): boolean {
  return WRITE_ACTIONS.includes(action);
}

/**
 * Who may remove or re-role whom: the owner anybody but themself, an admin
 * only members and viewers. Nobody touches the owner except by handover.
 */
export function outranks(actor: TeamRole, target: TeamRole): boolean {
  if (target === "owner") return false;
  if (actor === "owner") return true;
  return actor === "admin" && (target === "member" || target === "viewer");
}
