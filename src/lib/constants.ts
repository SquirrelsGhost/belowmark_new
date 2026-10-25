/**
 * Global application constants.
 *
 * Keep shared magic numbers, cookie names, and configuration values here.
 */

export const APP_NAME = "Belowmark";
export const LOCALE_COOKIE_NAME = "MANUAL_NEXT_LOCALE";
export const DEFAULT_LOCALE = "de";

/** One year — how long a manually chosen locale is remembered. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Locales offered in the language switch, as written to the locale cookie. */
export const LOCALE_OPTIONS = ["de", "en"] as const;

/** In-page anchors and routes used by navigation, CTAs and footer. */
export const ROUTES = {
  home: "/",
  features: "#features",
  process: "#process",
  stats: "#stats",
  contact: "#contact",
  login: "/login",
  signup: "/signup",
  privacy: "/privacy",
  imprint: "/imprint",
} as const;

export const CURRENT_YEAR = new Date().getFullYear();
