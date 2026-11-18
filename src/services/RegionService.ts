import { cookies, headers } from "next/headers";
import { cache } from "react";
import {
  COUNTRY_COOKIE_NAME,
  DEFAULT_LOCALE,
  DEFAULT_MARKET,
  DEFAULT_PRICING_COUNTRY,
  GEO_COUNTRY_HEADERS,
  isLocaleOption,
  isPricingCountry,
  LOCALE_COOKIE_NAME,
  LocaleOption,
  MARKET_COOKIE_NAME,
  MARKETS,
  MarketCode,
  PricingCountryCode,
  pricingCountryToMarket,
} from "@/lib/constants";
import {
  normalizeGeoCountryCode,
  parseGeoScopedCookie,
  resolveFallbackFromAcceptLanguage,
  resolveLocaleForCountry,
  resolvePricingCountryForDetected,
} from "@/lib/regionLocale";

export interface IRegion {
  /** Market whose snapshot is active (DE = Europe, TR = Türkiye) */
  market: MarketCode;
  /** Specific country selected in the pricing/checkout switcher (DE, AT, CH, IT, ES, FR, GB, NL, PL, CZ, SE, TR) */
  pricingCountry: PricingCountryCode;
  /** Resolved UI language for the visitor's country (or English as global default) */
  locale: LocaleOption;
  /** true when the detected country directly matched one of the localized pricing markets */
  isCountryMatched: boolean;
  /** true once the visitor picked the market/country in the pricing section during this location session */
  isMarketChosen: boolean;
  /** true when the host's geo header decided — then no browser check is needed */
  isFromGeoHeader: boolean;
  /** Normalized 2-letter ISO country code detected on the server (or null if none yet) */
  country: string | null;
}

/**
 * RegionService
 *
 * Decides where the visitor is located and which language to show, in priority order:
 *   1. Geo-IP header of the host / proxy (Vercel, Cloudflare, CloudFront, Nginx)
 *   2. Cookie "BELOWMARK_COUNTRY" — written by <RegionDetector /> from the browser IANA time zone
 *   3. Accept-Language header (when neither Geo-IP nor cookie exists yet)
 *   4. Global fallback language: English ("en")
 *
 * Manual overrides (navbar language switcher or pricing market dropdown) are session-only
 * and geo-scoped (`<geo>:<value>`), so traveling to another country always auto-detects fresh.
 */
const SEARCH_CRAWLER_UA =
  /googlebot|adsbot-google|apis-google|mediapartners-google|inspectiontool|bingbot|adidxbot|msnbot|slurp|duckduckbot|baiduspider|yandexbot|applebot|facebookexternalhit|twitterbot|linkedinbot|oai-searchbot|gptbot|chatgpt-user|perplexitybot|claudebot|amazonbot|ahrefsbot|semrushbot/i;

export class RegionService {
  static GetRegion = cache(async (): Promise<IRegion> => {
    const headersList = await headers();
    const cookieStore = await cookies();
    const ua = headersList.get("user-agent") ?? "";

    const geoCountry =
      GEO_COUNTRY_HEADERS.map((name) => normalizeGeoCountryCode(headersList.get(name))).find(Boolean) ?? null;
    const cookieCountry = normalizeGeoCountryCode(cookieStore.get(COUNTRY_COOKIE_NAME)?.value);
    const locationCountry = geoCountry ?? cookieCountry;

    const scopedMarketRaw = parseGeoScopedCookie(
      cookieStore.get(MARKET_COOKIE_NAME)?.value,
      locationCountry,
    )?.toUpperCase();
    const isMarketChosen = isPricingCountry(scopedMarketRaw);

    const scopedLocaleRaw = parseGeoScopedCookie(
      cookieStore.get(LOCALE_COOKIE_NAME)?.value,
      locationCountry,
    )?.toLowerCase();
    const chosenLocale = isLocaleOption(scopedLocaleRaw) ? scopedLocaleRaw : null;

    // Deterministic canonical region & English global default for search & AI crawlers
    if (!isMarketChosen && !chosenLocale && SEARCH_CRAWLER_UA.test(ua)) {
      return {
        market: DEFAULT_MARKET,
        pricingCountry: DEFAULT_PRICING_COUNTRY,
        locale: DEFAULT_LOCALE,
        isCountryMatched: false,
        isMarketChosen: false,
        isFromGeoHeader: true,
        country: null,
      };
    }

    const acceptLang = headersList.get("accept-language");
    let detectedCountryCode: string | null;
    let detectedLocale: LocaleOption;

    if (locationCountry) {
      detectedCountryCode = locationCountry;
      detectedLocale = resolveLocaleForCountry(locationCountry, acceptLang);
    } else {
      const fallback = resolveFallbackFromAcceptLanguage(acceptLang);
      detectedCountryCode = fallback.countryCode;
      detectedLocale = fallback.locale;
    }

    const { pricingCountry: detectedPricingCountry, isCountryMatched } =
      resolvePricingCountryForDetected(detectedCountryCode);
    const pricingCountry: PricingCountryCode = isMarketChosen ? scopedMarketRaw : detectedPricingCountry;
    const locale: LocaleOption = chosenLocale ?? detectedLocale;

    return {
      market: pricingCountryToMarket(pricingCountry),
      pricingCountry,
      locale,
      isCountryMatched,
      isMarketChosen,
      isFromGeoHeader: Boolean(geoCountry),
      country: detectedCountryCode,
    };
  });

  static IsMarket = (value: string | undefined): value is MarketCode => {
    return MARKETS.includes(value as MarketCode);
  };

  /** Turkey maps to the TR market, every other country to DE. */
  static ToMarket = (country: string | undefined | null): MarketCode => {
    return country?.toUpperCase() === "TR" ? "TR" : DEFAULT_MARKET;
  };

  /** Maps a 2-letter ISO country code to one of the 12 localized pricing countries. */
  static ToPricingCountry = (country: string | undefined | null): PricingCountryCode => {
    return resolvePricingCountryForDetected(country).pricingCountry;
  };
}
