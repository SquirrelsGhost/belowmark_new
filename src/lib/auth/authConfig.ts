/**
 * Authentication constants — every lifetime, limit and route in one place.
 */

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** `__Host-` forces Secure + Path=/ + no Domain, so subdomains can't plant it. */
export const SESSION_COOKIE_NAME = process.env.NODE_ENV === "production" ? "__Host-bm_session" : "bm_session";
export const SESSION_COOKIE_CANDIDATES = ["__Host-bm_session", "bm_session"] as const;

export const SESSION_TTL = {
  /** "Angemeldet bleiben" ticked */
  remember: 30 * DAY,
  /** Browser-session cookie; the server forgets it after a day at most */
  browser: DAY,
} as const;

export const TOKEN_TTL = {
  verifyEmail: 24 * HOUR,
  resetPassword: HOUR,
} as const;

export const TOKEN_PURPOSE = {
  verifyEmail: "verify_email",
  resetPassword: "reset_password",
} as const;
export type TokenPurpose = (typeof TOKEN_PURPOSE)[keyof typeof TOKEN_PURPOSE];

/** Free trial length, started by the e-mail confirmation (as in the old app). */
export const TRIAL_DAYS = 14;
export const TRIAL_MS = TRIAL_DAYS * DAY;

/** Booked plans (set by billing). Any of them means full access, without a trial date. */
export const PAID_PLANS = ["investor", "pro"] as const;
export type PaidPlan = (typeof PAID_PLANS)[number];

export const PASSWORD_RULES = {
  minLength: 10,
  maxLength: 128,
} as const;

export const EMAIL_MAX_LENGTH = 254;

/** Rate limits: `limit` hits per `windowMs`. */
export const RATE_LIMITS = {
  loginIp: { limit: 20, windowMs: 15 * MINUTE },
  /** Failed attempts per account before it pauses — protects against guessing. */
  loginAccount: { limit: 5, windowMs: 15 * MINUTE },
  signupIp: { limit: 5, windowMs: HOUR },
  mailIp: { limit: 6, windowMs: 15 * MINUTE },
  /** Mails per address — silently capped so nobody can flood an inbox. */
  mailAccount: { limit: 3, windowMs: HOUR },
  tokenIp: { limit: 20, windowMs: 15 * MINUTE },
  changePassword: { limit: 5, windowMs: 15 * MINUTE },
  /** Orders per account — enough for retries, not for scripted checkout spam. */
  order: { limit: 10, windowMs: 15 * MINUTE },
  /** Cancellations / withdrawals per IP (no sign-in needed, so this guards the mail it sends). */
  declarationIp: { limit: 8, windowMs: HOUR },
  /** Account deletion attempts (password check). */
  deleteAccount: { limit: 5, windowMs: 15 * MINUTE },
  /** Authenticated profile / user mutation actions per window. */
  profileUpdate: { limit: 30, windowMs: 15 * MINUTE },
} as const;
export interface RateLimitRule {
  readonly limit: number;
  readonly windowMs: number;
}

export const AUTH_ROUTES = {
  login: "/login",
  signup: "/signup",
  forgotPassword: "/passwort-vergessen",
  resetPassword: "/passwort-neu",
  verifyEmail: "/email-bestaetigen",
  account: "/konto",
  /** Where a successful sign-in lands when no safe `next` is given */
  afterLogin: "/app",
} as const;

/** Query parameter names used between auth pages. */
export const AUTH_PARAMS = {
  next: "next",
  token: "token",
  status: "status",
} as const;
