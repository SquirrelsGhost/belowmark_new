import type { LocaleOption, PricingCountryCode } from "./constants";

const SENTINEL_COUNTRY_CODES = new Set(["XX", "ZZ", "T1"]);

const PRICING_COUNTRY_SET = new Set<PricingCountryCode>([
  "DE", "AT", "CH", "IT", "ES", "FR", "GB", "NL", "PL", "CZ", "SE", "TR",
]);

const SPANISH_COUNTRIES = new Set([
  "ES", "MX", "AR", "CO", "CL", "PE", "VE", "EC", "GT", "CU", "BO",
  "DO", "HN", "PY", "SV", "NI", "CR", "PA", "UY", "PR", "GQ",
]);

const FRENCH_COUNTRIES = new Set([
  "FR", "MC", "GF", "GP", "MQ", "RE", "YT", "PF", "NC", "SN", "CI",
]);

const TIMEZONE_TO_COUNTRY: Readonly<Record<string, string>> = {
  "Europe/Berlin": "DE",
  "Europe/Busingen": "DE",
  "Europe/Vienna": "AT",
  "Europe/Zurich": "CH",
  "Europe/Vaduz": "CH",
  "Europe/Istanbul": "TR",
  "Asia/Istanbul": "TR",
  Turkey: "TR",
  "Europe/Rome": "IT",
  "Europe/Vatican": "IT",
  "Europe/San_Marino": "IT",
  "Europe/Madrid": "ES",
  "Atlantic/Canary": "ES",
  "Africa/Ceuta": "ES",
  "Europe/Paris": "FR",
  "Europe/Monaco": "FR",
  "Europe/London": "GB",
  "Europe/Belfast": "GB",
  "Europe/Guernsey": "GB",
  "Europe/Jersey": "GB",
  "Europe/Isle_of_Man": "GB",
  GB: "GB",
  "Europe/Dublin": "IE",
  "Europe/Amsterdam": "NL",
  "Europe/Warsaw": "PL",
  "Europe/Prague": "CZ",
  "Europe/Stockholm": "SE",
  "Europe/Brussels": "BE",
  "Europe/Luxembourg": "LU",
};

const SPANISH_AMERICAS_TZ_RE =
  /^America\/(?:Mexico_City|Cancun|Merida|Monterrey|Matamoros|Chihuahua|Mazatlan|Hermosillo|Tijuana|Bogota|Lima|Santiago|Buenos_Aires|Argentina\/|Caracas|Guayaquil|La_Paz|Asuncion|Montevideo|Santo_Domingo|Havana|Guatemala|Tegucigalpa|Managua|El_Salvador|Costa_Rica|Panama|Puerto_Rico)/i;

const GENERIC_UTC_TZ_RE = /^(?:UTC|GMT|Etc\/)/i;

/** Normalizes a 2-letter ISO-3166-1 alpha-2 country code; filters out CDN unknown/Tor sentinels. */
export function normalizeGeoCountryCode(raw: string | null | undefined): string | null {
  const upper = (raw ?? "").trim().toUpperCase();
  if (upper === "UK") return "GB";
  if (!/^[A-Z]{2}$/.test(upper) || SENTINEL_COUNTRY_CODES.has(upper)) return null;
  return upper;
}

/** Parses RFC 9110 Accept-Language and returns the highest-weight language tag in lowercase. */
export function parsePrimaryAcceptLanguage(acceptLanguage: string | null | undefined): string | null {
  if (!acceptLanguage) return null;
  const entries = acceptLanguage
    .split(",")
    .map((part, index) => {
      const [rawTag, ...params] = part.trim().split(";");
      const tag = (rawTag ?? "").trim().toLowerCase();
      let q = 1;
      for (const param of params) {
        const [k, v] = param.trim().split("=");
        if (k?.trim().toLowerCase() === "q") {
          const parsed = Number.parseFloat(v ?? "");
          if (!Number.isNaN(parsed)) q = parsed;
        }
      }
      return { tag, q, index };
    })
    .filter((item) => item.tag.length > 0 && item.tag !== "*" && item.q > 0)
    .sort((a, b) => (b.q !== a.q ? b.q - a.q : a.index - b.index));

  return entries[0]?.tag ?? null;
}

/**
 * Resolves the UI language (`LocaleOption`) for the country where the visitor is located.
 * Any country without a dedicated UI translation defaults to English (`"en"`).
 */
export function resolveLocaleForCountry(
  countryCode: string | null | undefined,
  acceptLanguage?: string | null,
): LocaleOption {
  const code = normalizeGeoCountryCode(countryCode);
  if (!code) return "en";

  const primaryLang = parsePrimaryAcceptLanguage(acceptLanguage) ?? "";

  if (code === "DE" || code === "AT" || code === "LI") return "de";
  if (code === "CH") {
    if (primaryLang.startsWith("fr")) return "fr";
    if (primaryLang.startsWith("it")) return "it";
    return "de";
  }
  if (code === "TR") return "tr";
  if (code === "IT" || code === "SM" || code === "VA") return "it";
  if (code === "PL") return "pl";
  if (code === "CZ" || code === "SK") return "cs";
  if (code === "NL") return "nl";
  if (code === "SE") return "sv";
  if (SPANISH_COUNTRIES.has(code)) return "es";
  if (FRENCH_COUNTRIES.has(code)) return "fr";

  if (code === "BE" || code === "LU") {
    if (primaryLang.startsWith("nl")) return "nl";
    if (primaryLang.startsWith("fr")) return "fr";
    if (primaryLang.startsWith("de")) return "de";
    return code === "BE" ? "nl" : "en";
  }
  if (code === "CA") {
    return primaryLang.startsWith("fr") ? "fr" : "en";
  }
  if (code === "CY" || code === "AZ") {
    return primaryLang.startsWith("tr") ? "tr" : "en";
  }

  return "en";
}

/** Maps a detected ISO country code to the closest localized pricing market. */
export function resolvePricingCountryForDetected(countryCode: string | null | undefined): {
  pricingCountry: PricingCountryCode;
  isCountryMatched: boolean;
} {
  const code = normalizeGeoCountryCode(countryCode);
  if (!code) return { pricingCountry: "DE", isCountryMatched: false };

  if (PRICING_COUNTRY_SET.has(code as PricingCountryCode)) {
    return { pricingCountry: code as PricingCountryCode, isCountryMatched: true };
  }
  if (code === "IE" || code === "IM" || code === "JE" || code === "GG") {
    return { pricingCountry: "GB", isCountryMatched: true };
  }
  if (code === "LI") return { pricingCountry: "CH", isCountryMatched: true };
  if (code === "SM" || code === "VA") return { pricingCountry: "IT", isCountryMatched: true };
  if (code === "MC") return { pricingCountry: "FR", isCountryMatched: true };
  if (SPANISH_COUNTRIES.has(code)) return { pricingCountry: "ES", isCountryMatched: false };
  if (FRENCH_COUNTRIES.has(code)) return { pricingCountry: "FR", isCountryMatched: false };

  return { pricingCountry: "DE", isCountryMatched: false };
}

/** Fallback when neither Geo-IP header nor timezone cookie is present yet. Defaults to English (`"en"`). */
export function resolveFallbackFromAcceptLanguage(acceptLanguage: string | null | undefined): {
  countryCode: string | null;
  locale: LocaleOption;
} {
  const primary = parsePrimaryAcceptLanguage(acceptLanguage);
  if (!primary) return { countryCode: null, locale: "en" };

  if (primary === "de-at") return { countryCode: "AT", locale: "de" };
  if (primary === "de-ch") return { countryCode: "CH", locale: "de" };
  if (primary.startsWith("de")) return { countryCode: "DE", locale: "de" };
  if (primary.startsWith("tr")) return { countryCode: "TR", locale: "tr" };
  if (primary === "it-ch") return { countryCode: "CH", locale: "it" };
  if (primary.startsWith("it")) return { countryCode: "IT", locale: "it" };
  if (primary.startsWith("es")) return { countryCode: "ES", locale: "es" };
  if (primary === "fr-ch") return { countryCode: "CH", locale: "fr" };
  if (primary.startsWith("fr")) return { countryCode: "FR", locale: "fr" };
  if (primary.startsWith("nl")) return { countryCode: "NL", locale: "nl" };
  if (primary.startsWith("pl")) return { countryCode: "PL", locale: "pl" };
  if (primary.startsWith("cs") || primary.startsWith("sk")) return { countryCode: "CZ", locale: "cs" };
  if (primary.startsWith("sv")) return { countryCode: "SE", locale: "sv" };
  if (primary === "en-gb" || primary === "en-ie") return { countryCode: "GB", locale: "en" };

  return { countryCode: null, locale: "en" };
}

/** Derives a 2-letter ISO country code from the browser IANA timezone when no host Geo-IP header exists. */
export function detectCountryFromTimeZone(timeZone: string | null | undefined): string | null {
  const tz = (timeZone ?? "").trim();
  if (!tz || GENERIC_UTC_TZ_RE.test(tz)) return null;
  const exact = TIMEZONE_TO_COUNTRY[tz];
  if (exact) return exact;
  if (SPANISH_AMERICAS_TZ_RE.test(tz)) return "MX";
  if (tz.includes("/")) return "US";
  return null;
}

/** Encodes a manual choice bound to the visitor's current detected country ("TR:en" or "--:en"). */
export function formatGeoScopedCookie(
  geoCountry: string | null | undefined,
  value: string,
): string {
  const scope = normalizeGeoCountryCode(geoCountry) ?? "--";
  return `${scope}:${value.trim()}`;
}

/**
 * Reads a geo-scoped cookie and invalidates it automatically if the visitor
 * is now physically in a different country (or if it is a legacy unscoped cookie).
 */
export function parseGeoScopedCookie(
  rawCookie: string | null | undefined,
  currentGeoCountry: string | null | undefined,
): string | null {
  if (!rawCookie || !rawCookie.includes(":")) return null;
  const [rawScope, rawVal] = rawCookie.split(":", 2);
  if (!rawScope || !rawVal) return null;
  const expectedScope = normalizeGeoCountryCode(currentGeoCountry) ?? "--";
  if (rawScope !== expectedScope) return null;
  return rawVal.trim() || null;
}
