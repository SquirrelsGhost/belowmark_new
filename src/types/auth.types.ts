import type { Permission } from "@/types/permissions.types";

/**
 * Error codes travel from the server to the form and are only turned into
 * words there — the same split as in the old app, so DE and TR stay in sync.
 */
export type AuthErrorCode =
  | "email_required"
  | "email_invalid"
  | "email_disposable"
  | "password_required"
  | "password_short"
  | "password_long"
  | "password_weak"
  | "password_breached"
  | "password_same_as_email"
  | "password_wrong"
  | "terms_required"
  | "market_invalid"
  | "invalid_credentials"
  | "unverified"
  | "account_banned"
  | "device_banned"
  | "bot_detected"
  | "rate_limited"
  | "token_invalid"
  | "mail_unavailable"
  | "unknown";

export type AuthFieldName = "email" | "password" | "currentPassword" | "terms" | "market";

export type AuthFormStatus = "idle" | "error" | "success";

export interface AuthFormState {
  status: AuthFormStatus;
  /** Form-wide message (shown in the error summary) */
  code?: AuthErrorCode;
  /** Per-field messages */
  fieldErrors?: Partial<Record<AuthFieldName, AuthErrorCode>>;
  /** Minutes until a rate limit lifts */
  retryAfterMinutes?: number;
  /** Values echoed back so the user never retypes them (never passwords) */
  values?: { email?: string; market?: string; terms?: boolean; remember?: boolean };
}

export const INITIAL_AUTH_STATE: AuthFormState = { status: "idle" };

/** What pages may know about the signed-in user — no hashes, no tokens. */
export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  market: string;
  locale: string;
  emailVerifiedAt: Date | null;
  trialEndsAt: Date | null;
  /** true once the trial date has passed */
  hasTrialEnded: boolean;
  /** Booked plan (PAID_PLANS) or null */
  plan: string | null;
  /** Granular capabilities (`*`, `<domain>:*`, `<domain>:<action>`) */
  permissions: Permission[];
  /** Capability `app:investor` / `*` (booked plan, running trial, or superuser permission) */
  hasFullAccess: boolean;
  /** Full access comes from a team seat (owner's Pro), not from an own plan or trial */
  teamSeat: boolean;
  createdAt: Date;
  sessionId: string;
}
