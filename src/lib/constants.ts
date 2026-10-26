/**
 * Global application constants.
 *
 * Keep shared magic numbers, cookie names, and configuration values here.
 */

export const APP_NAME = "Belowmark";
export const DEFAULT_LOCALE = "de";

/** Locales the page is written in; used for Intl formatting and the lang attribute. */
export const LOCALE_OPTIONS = ["de", "tr"] as const;
export type LocaleOption = (typeof LOCALE_OPTIONS)[number];

/** The two separately booked markets: German ZVG and Turkish İcra/İhale. */
export const MARKETS = ["DE", "TR"] as const;
export type MarketCode = (typeof MARKETS)[number];
export const DEFAULT_MARKET: MarketCode = "DE";

/** Country detected from the browser time zone when the host sends no geo header. */
export const COUNTRY_COOKIE_NAME = "BELOWMARK_COUNTRY";
/** Market the visitor picked in the pricing section. */
export const MARKET_COOKIE_NAME = "BELOWMARK_MARKET";
/** One year — how long detected country and chosen market are remembered. */
export const REGION_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Geo headers set by common hosts (Vercel, Cloudflare, CloudFront), checked in order. */
export const GEO_COUNTRY_HEADERS = ["x-vercel-ip-country", "cf-ipcountry", "cloudfront-viewer-country"] as const;
/** Location beats system language: the time zone travels with the device, the language setting does not. */
export const TURKEY_TIME_ZONE = /Istanbul|Turkey/i;

/** In-page anchors and routes used by navigation, CTAs and footer. */
export const ROUTES = {
  home: "/",
  calculator: "#rechner",
  notice: "#aushang",
  method: "#rechenweg",
  states: "#bundeslaender",
  compare: "#vergleich",
  pricing: "#preise",
  faq: "#fragen",
  blog: "/blog",
  login: "/login",
  signup: "/signup",
  contact: "mailto:contact@belowmark.com",
  imprint: "/impressum",
  terms: "/agb",
  privacy: "/datenschutz",
  withdrawal: "/widerruf",
} as const;

/** Official sources referenced on the page. */
export const SOURCES = {
  zvgPortal: "https://www.zvg-portal.de/",
  zvgLaw: "https://www.gesetze-im-internet.de/zvg/",
  justiz: "https://justiz.de/",
} as const;

/** ZVG value limits and deposit, as fractions of the court-appraised value. */
export const ZVG = {
  /** § 85a ZVG — below this the bid is refused ex officio in the first hearing */
  absoluteLimit: 0.5,
  /** § 74a ZVG — below this an entitled party may apply for refusal */
  relativeLimit: 0.7,
  /** § 68 Abs. 1 ZVG — usual security deposit */
  deposit: 0.1,
} as const;

/** Calculator bounds (euros and percent of appraised value). */
export const CALCULATOR = {
  minValue: 10_000,
  maxValue: 2_000_000,
  valueStep: 5_000,
  defaultValue: 240_000,
  minBidPct: 30,
  maxBidPct: 100,
  defaultBidPct: 55,
  defaultState: "nw",
} as const;

export const CURRENT_YEAR = new Date().getFullYear();
