import { MarketCode } from "@/lib/constants";
import { TeamRole, TeamStatus } from "@/lib/team/teamConfig";

/** A team as one of its members sees it. */
export interface TeamView {
  id: string;
  name: string;
  market: MarketCode;
  /** The viewer's own role */
  role: TeamRole;
  /** The owner's plan allows team work; otherwise the team is read-only */
  isActive: boolean;
  memberCount: number;
  listingCount: number;
  statusCounts: Record<TeamStatus, number>;
  createdAt: Date;
}

export interface TeamMemberView {
  userId: string;
  /** Name, or the part of the address before the @ */
  displayName: string;
  email: string;
  role: TeamRole;
  joinedAt: Date;
}

export interface TeamInviteView {
  id: string;
  email: string;
  role: TeamRole;
  invitedByName: string | null;
  expiresAt: Date;
}

/** An invitation as the invited person sees it, before they decide. */
export interface InvitationPreview {
  inviteId: string;
  teamId: string;
  teamName: string;
  market: MarketCode;
  role: TeamRole;
  email: string;
  invitedByName: string | null;
  expiresAt: Date;
  /** Seats are full or the owner's plan ended — accepting is not possible right now */
  isBlocked: boolean;
}

export interface TeamNoteView {
  id: string;
  authorId: string | null;
  authorName: string;
  body: string;
  createdAt: Date;
}

/** One proceeding on the shared list. */
export interface TeamListingView {
  listingId: string;
  status: TeamStatus;
  /** Who set the status — null once that person left the team */
  statusByName: string | null;
  statusAt: Date;
  addedAt: Date;
  noteCount: number;
  lastNote: TeamNoteView | null;
}

/** What the Aktenblatt shows per team for one proceeding. */
export interface TeamListingPanel {
  team: TeamView;
  entry: TeamListingView | null;
  notes: TeamNoteView[];
}

/** Error codes of the team actions, translated only in the interface. */
export type TeamErrorCode =
  | "failed"
  | "invalid"
  | "forbidden"
  | "inactive"
  | "plan_required"
  | "team_limit"
  | "seats_full"
  | "list_full"
  | "notes_full"
  | "already_member"
  | "already_invited"
  | "rate_limited"
  | "mail_unavailable"
  | "wrong_account"
  | "market_mismatch"
  | "invite_invalid"
  | "owner_must_transfer"
  | "confirm_mismatch";

export interface TeamActionState {
  ok: boolean;
  error?: TeamErrorCode;
  /** Set when the action finished and the form can show its success line */
  done?: boolean;
}
