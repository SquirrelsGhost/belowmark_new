import { MarketCode } from "@/lib/constants";
import { GeoRegion } from "@/types/listing.types";

/** Id of a region outline inside the sprite. */
export const locatorRegionId = (code: string) => `loc-r-${code}`;
export const LOCATOR_COUNTRY_ID = "loc-country";

/** Served by src/app/karten/[datei]/route.ts. */
export const locatorSpriteHref = (market: MarketCode, version: string) => `/karten/${market.toLowerCase()}.svg?v=${version}`;

const escapeAttribute = (value: string) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/**
 * Every region outline once, as a standalone SVG file. The small locator maps
 * reuse them with <use href="file#id">, so the outlines are downloaded once and
 * cached instead of being part of every page's HTML. Paths carry no fill of
 * their own, so each <use> can colour them.
 */
export function buildLocatorSprite(regions: GeoRegion[]): string {
  const paths = regions.map((region) => `<path id="${locatorRegionId(region.code)}" d="${escapeAttribute(region.path)}"/>`).join("");
  const country = regions.map((region) => `<use href="#${locatorRegionId(region.code)}"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg"><defs>${paths}<g id="${LOCATOR_COUNTRY_ID}">${country}</g></defs></svg>`;
}
