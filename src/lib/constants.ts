/**
 * Global application constants.
 *
 * Keep shared magic numbers, cookie names, and configuration values here.
 */

export const APP_NAME = "Belowmark";
export const DEFAULT_LOCALE: LocaleOption = "en";

/** Locales the page is written in; used for Intl formatting and the lang attribute. */
export const LOCALE_OPTIONS = ["de", "tr", "en", "it", "es", "fr"] as const;
export type LocaleOption = (typeof LOCALE_OPTIONS)[number];

export const isLocaleOption = (value: unknown): value is LocaleOption =>
  typeof value === "string" && (LOCALE_OPTIONS as readonly string[]).includes(value);

/** The two separately booked markets: German/European ZVG & Turkish İcra/İhale. */
export const MARKETS = ["DE", "TR"] as const;
export type MarketCode = (typeof MARKETS)[number];
export const DEFAULT_MARKET: MarketCode = "DE";

/** All 12 countries selectable in the Pricing & Checkout sections (Option B localized pricing). */
export const PRICING_COUNTRIES = ["DE", "AT", "CH", "IT", "ES", "FR", "GB", "NL", "PL", "CZ", "SE", "TR"] as const;
export type PricingCountryCode = (typeof PRICING_COUNTRIES)[number];
export const DEFAULT_PRICING_COUNTRY: PricingCountryCode = "DE";

export const isPricingCountry = (value: unknown): value is PricingCountryCode =>
  typeof value === "string" && (PRICING_COUNTRIES as readonly string[]).includes(value);

/** Maps any of the 12 pricing countries to its platform snapshot market (11 European countries → DE, Turkey → TR). */
export const pricingCountryToMarket = (country: PricingCountryCode): MarketCode =>
  country === "TR" ? "TR" : "DE";

/** Maps any of the 12 pricing countries to its UI language. */
export const pricingCountryToLocale = (country: PricingCountryCode): LocaleOption => {
  switch (country) {
    case "TR":
      return "tr";
    case "GB":
    case "NL":
    case "PL":
    case "CZ":
    case "SE":
      return "en";
    case "IT":
      return "it";
    case "ES":
      return "es";
    case "FR":
      return "fr";
    default:
      return "de";
  }
};

/** Country detected from the browser time zone when the host sends no geo header. */
export const COUNTRY_COOKIE_NAME = "BELOWMARK_COUNTRY";
/** Geo-scoped pricing market picked in the pricing section (session-only). */
export const MARKET_COOKIE_NAME = "BELOWMARK_PRICING_V2";
/** Geo-scoped UI language manually selected in the navbar (session-only). */
export const LOCALE_COOKIE_NAME = "BELOWMARK_LOCALE_V2";
/** Legacy unscoped cookie name — purged when encountered so old DE cookies never override Geo-IP. */
export const LEGACY_MARKET_COOKIE_NAME = "BELOWMARK_MARKET";
/** Max age for browser time-zone fallback cookie when no CDN Geo-IP header is present (7 days). */
export const REGION_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

/** Geo headers set by common hosts & reverse proxies (Vercel, Cloudflare, CloudFront, Nginx), checked in order. */
export const GEO_COUNTRY_HEADERS = [
  "x-vercel-ip-country",
  "cf-ipcountry",
  "cloudfront-viewer-country",
  "x-country-code",
  "x-geo-country",
] as const;
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
