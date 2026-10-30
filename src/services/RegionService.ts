import { cookies, headers } from "next/headers";
import {
  COUNTRY_COOKIE_NAME,
  DEFAULT_MARKET,
  DEFAULT_PRICING_COUNTRY,
  GEO_COUNTRY_HEADERS,
  isPricingCountry,
  MARKET_COOKIE_NAME,
  MARKETS,
  MarketCode,
  PricingCountryCode,
  pricingCountryToMarket,
} from "@/lib/constants";

export interface IRegion {
  /** Market whose snapshot is active (DE = Europe, TR = Türkiye) */
  market: MarketCode;
  /** Specific country selected in the pricing/checkout switcher (DE, AT, CH, IT, ES, FR, GB, TR) */
  pricingCountry: PricingCountryCode;
  /** true once the visitor picked the market/country in the pricing section */
  isMarketChosen: boolean;
  /** true when the host's geo header decided — then no browser check is needed */
  isFromGeoHeader: boolean;
  /** Country used for language and default market */
  country: MarketCode;
}

/**
 * RegionService
 *
 * Decides where the visitor is, in priority order:
 *   1. Geo header of the host (Vercel, Cloudflare, CloudFront)
 *   2. Cookie "BELOWMARK_COUNTRY" — written by <RegionDetector /> from the browser time zone
 *   3. Accept-Language header
 *   4. Fallback: DE
 *
 * The market follows the country until the visitor picks one in the pricing section.
 */
export class RegionService {
  static GetRegion = async (): Promise<IRegion> => {
    const headersList = await headers();
    const cookieStore = await cookies();

    const geoCountry = GEO_COUNTRY_HEADERS.map((name) => headersList.get(name)).find(Boolean);
    const cookieCountry = cookieStore.get(COUNTRY_COOKIE_NAME)?.value;
    const languageCountry = headersList.get("accept-language")?.toLowerCase().startsWith("tr") ? "TR" : undefined;

    const detectedCountryCode = geoCountry ?? cookieCountry ?? languageCountry;
    const country = RegionService.ToMarket(detectedCountryCode);
    const detectedPricingCountry = RegionService.ToPricingCountry(detectedCountryCode);
    const chosenRaw = cookieStore.get(MARKET_COOKIE_NAME)?.value?.toUpperCase();
    const isMarketChosen = isPricingCountry(chosenRaw);
    const pricingCountry: PricingCountryCode = isMarketChosen ? chosenRaw : detectedPricingCountry;

    return {
      market: pricingCountryToMarket(pricingCountry),
      pricingCountry,
      isMarketChosen,
      isFromGeoHeader: Boolean(geoCountry),
      country,
    };
  };

  static IsMarket = (value: string | undefined): value is MarketCode => {
    return MARKETS.includes(value as MarketCode);
  };

  /** Turkey maps to the TR market, every other country to DE. */
  static ToMarket = (country: string | undefined | null): MarketCode => {
    return country?.toUpperCase() === "TR" ? "TR" : DEFAULT_MARKET;
  };

  /** Maps a 2-letter ISO country code to one of the 8 localized pricing countries. */
  static ToPricingCountry = (country: string | undefined | null): PricingCountryCode => {
    const upper = country?.toUpperCase();
    if (upper === "UK") return "GB";
    return isPricingCountry(upper) ? upper : DEFAULT_PRICING_COUNTRY;
  };
}
