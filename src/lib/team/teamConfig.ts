/**
 * Constants of the team accounts: several people judge the same proceedings
 * on one shared list, each with a role, with notes and a common status.
 */

export const TEAM_ROUTES = {
  overview: "/app/team",
  /** Public page behind the link in the invitation mail */
  invitation: "/einladung",
} as const;

export const teamHref = (teamId: string): string => `${TEAM_ROUTES.overview}/${teamId}`;

/** Query parameter and values of the team page's tabs and status filter. */
export const TEAM_PARAMS = { view: "ansicht", status: "status", token: "token" } as const;
export const TEAM_VIEWS = { members: "mitglieder" } as const;

/** Anchor of the team panel on the Aktenblatt. */
export const TEAM_PANEL_ID = "team";

/**
 * Where a proceeding stands for the team. The order is the order of work:
 * look into it → see it → bid on it, or drop it.
 */
export const TEAM_STATUSES = ["pruefen", "besichtigen", "bieten", "verworfen"] as const;
export type TeamStatus = (typeof TEAM_STATUSES)[number];
export const DEFAULT_TEAM_STATUS: TeamStatus = "pruefen";

/**
 * Roles. "owner" holds the plan the team runs on and is the only one who can
 * delete the team or hand it over. Exactly one owner per team.
 */
export const TEAM_ROLES = ["owner", "admin", "member", "viewer"] as const;
export type TeamRole = (typeof TEAM_ROLES)[number];
/** Roles that can be given by invitation or role change — ownership is only handed over. */
export const ASSIGNABLE_ROLES = ["admin", "member", "viewer"] as const;
export type AssignableRole = (typeof ASSIGNABLE_ROLES)[number];

export const TEAMS = {
  /**
   * Seats per team including the owner. Open invitations count, so a team
   * can never end up larger than this. Placeholder until the Pro offer fixes it.
   */
  maxSeats: 5,
  /** Teams one person may own */
  maxOwnedPerUser: 3,
  /** Proceedings on one shared list */
  maxListingsPerTeam: 500,
  /** Notes per proceeding and team */
  maxNotesPerListing: 200,
  nameMaxLength: 80,
  noteMaxLength: 2000,
  /** Invitation links stay valid this long; afterwards the address is deleted */
  inviteTtlDays: 7,
  /** Invitation mails per team and day, against misuse as a mail cannon */
  invitesPerDay: { limit: 20, windowMs: 24 * 60 * 60 * 1000 },
} as const;

/** Capability the team owner needs for the team to work (Pro plan or superuser). */
export const TEAM_PLAN_PERMISSION = "app:pro" as const;

export const isTeamStatus = (value: unknown): value is TeamStatus => typeof value === "string" && (TEAM_STATUSES as readonly string[]).includes(value);

export const isAssignableRole = (value: unknown): value is AssignableRole => typeof value === "string" && (ASSIGNABLE_ROLES as readonly string[]).includes(value);

export const isTeamRole = (value: unknown): value is TeamRole => typeof value === "string" && (TEAM_ROLES as readonly string[]).includes(value);
