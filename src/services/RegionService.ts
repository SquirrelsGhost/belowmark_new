import { cookies, headers } from "next/headers";
import {
  COUNTRY_COOKIE_NAME,
  DEFAULT_MARKET,
  GEO_COUNTRY_HEADERS,
  MARKET_COOKIE_NAME,
  MARKETS,
  MarketCode,
} from "@/lib/constants";

export interface IRegion {
  /** Market whose plans and prices are shown */
  market: MarketCode;
  /** true once the visitor picked the market in the pricing section */
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

    const country = RegionService.ToMarket(geoCountry ?? cookieCountry ?? languageCountry);
    const chosenMarket = cookieStore.get(MARKET_COOKIE_NAME)?.value;
    const isMarketChosen = RegionService.IsMarket(chosenMarket);

    return {
      market: isMarketChosen ? chosenMarket : country,
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
}
