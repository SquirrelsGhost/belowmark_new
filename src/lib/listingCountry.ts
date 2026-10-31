import { MarketCode, PricingCountryCode, pricingCountryToMarket } from "@/lib/constants";
import { DachCountry, Listing, ListingCountry } from "@/types/listing.types";

/**
 * Countries are separate products: every country is booked on its own (own
 * prices per country in billingConfig), so an account only ever sees the
 * proceedings of the country it holds. The snapshot files are still split by
 * platform market (DE file = the seven European countries, TR file = Turkey);
 * this module is the one place that maps a proceeding to its country.
 */

/** Countries kept in each snapshot file, in display order. */
export const MARKET_COUNTRIES: Record<MarketCode, readonly ListingCountry[]> = {
  DE: ["DE", "AT", "CH", "IT", "ES", "FR", "GB"],
  TR: ["TR"],
};

export const LISTING_COUNTRIES: readonly ListingCountry[] = [...MARKET_COUNTRIES.DE, ...MARKET_COUNTRIES.TR];

export const isListingCountry = (value: unknown): value is ListingCountry =>
  typeof value === "string" && (LISTING_COUNTRIES as readonly string[]).includes(value);

/** Snapshot file a country lives in. */
export const countryMarket = (country: ListingCountry): MarketCode => pricingCountryToMarket(country as PricingCountryCode);

/** Country of a proceeding in the European snapshot (Germany when nothing else matches). */
export function getListingDachCountry(listing: Pick<Listing, "key" | "country" | "regionCode">): DachCountry {
  if (listing.country === "AT" || listing.regionCode?.startsWith("at-") || listing.key.startsWith("edikte-")) return "AT";
  if (listing.country === "CH" || listing.regionCode?.startsWith("ch-") || listing.key.startsWith("shab-")) return "CH";
  if (listing.country === "IT" || listing.regionCode?.startsWith("it-") || listing.key.startsWith("it-aste-")) return "IT";
  if (listing.country === "ES" || listing.regionCode?.startsWith("es-") || listing.key.startsWith("es-boe-")) return "ES";
  if (listing.country === "FR" || listing.regionCode?.startsWith("fr-") || listing.key.startsWith("fr-licitor-")) return "FR";
  if (listing.country === "GB" || listing.regionCode?.startsWith("gb-") || listing.key.startsWith("gb-eig-")) return "GB";
  return "DE";
}

/** Country of any proceeding. */
export const getListingCountry = (listing: Pick<Listing, "key" | "country" | "regionCode" | "market">): ListingCountry =>
  listing.market === "TR" ? "TR" : getListingDachCountry(listing);

/** Region codes of the European snapshot carry their country as prefix ("at-w", "ch-zh"); German ones have none. */
export function regionCountry(code: string): ListingCountry {
  const prefix = code.includes("-") ? code.split("-")[0].toUpperCase() : "";
  return isListingCountry(prefix) ? prefix : "DE";
}

/**
 * The country an account is for: the stored country when it belongs to the
 * account's market, otherwise the market's home country. Never a country of
 * the other market — that would be a second product.
 */
export function accountCountry(storedCountry: string | null | undefined, market: MarketCode): ListingCountry {
  if (isListingCountry(storedCountry) && countryMarket(storedCountry) === market) return storedCountry;
  return market;
}

/** Snapshot files that hold the countries of a scope. */
export const marketsOfScope = (scope: readonly ListingCountry[]): MarketCode[] => [...new Set(scope.map(countryMarket))];
