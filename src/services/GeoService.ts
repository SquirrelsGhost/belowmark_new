import "server-only";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { MarketCode } from "@/lib/constants";
import { buildLocatorSprite, locatorSpriteHref } from "@/lib/locatorSprite";
import { GeoRegion, ListingCountry, MarketGeo } from "@/types/listing.types";

/**
 * Outline files — literal paths so the bundler can trace them.
 * data/geo/tr.json and de.json: scripts/build-geo.mjs (market files, input for the country maps).
 * data/geo/countries/*.json: scripts/build-country-geo.mjs, one projection per country.
 */
function readCountryGeo(country: ListingCountry): Promise<string> {
  const geo = join(process.cwd(), "data", "geo");
  switch (country) {
    case "TR":
      return readFile(join(geo, "tr.json"), "utf8");
    case "AT":
      return readFile(join(geo, "countries", "at.json"), "utf8");
    case "CH":
      return readFile(join(geo, "countries", "ch.json"), "utf8");
    case "IT":
      return readFile(join(geo, "countries", "it.json"), "utf8");
    case "ES":
      return readFile(join(geo, "countries", "es.json"), "utf8");
    case "FR":
      return readFile(join(geo, "countries", "fr.json"), "utf8");
    case "GB":
      return readFile(join(geo, "countries", "gb.json"), "utf8");
    default:
      return readFile(join(geo, "countries", "de.json"), "utf8");
  }
}

const countries = new Map<ListingCountry, Promise<MarketGeo>>();
const sprites = new Map<ListingCountry, Promise<LocatorSprite>>();

/** The region outlines of the small locator maps as one SVG file, and the URL it is served at. */
export interface LocatorSprite {
  svg: string;
  /** Versioned by content, so browsers may keep it for a year */
  href: string;
}

/**
 * GeoService
 *
 * Region outlines for the app's own SVG maps, one map per country with its
 * own projection (so Spain is not drawn on Germany's grid). Drawn from local
 * files, so no map provider sees what a user looks at.
 */
export class GeoService {
  /** The map of one country: its regions, projection and sources. */
  static getCountry = (country: ListingCountry): Promise<MarketGeo> => {
    let entry = countries.get(country);
    if (!entry) {
      entry = readCountryGeo(country).then((text) => {
        const geo = JSON.parse(text) as MarketGeo;
        return { ...geo, market: (country === "TR" ? "TR" : "DE") as MarketCode, country };
      });
      countries.set(country, entry);
      entry.catch(() => countries.delete(country));
    }
    return entry;
  };

  static getLocatorSprite = (country: ListingCountry): Promise<LocatorSprite> => {
    let entry = sprites.get(country);
    if (!entry) {
      entry = GeoService.getCountry(country).then((geo) => {
        const svg = buildLocatorSprite(geo.regions);
        const version = createHash("sha256").update(svg).digest("base64url").slice(0, 12);
        return { svg, href: locatorSpriteHref(country, version) };
      });
      sprites.set(country, entry);
      entry.catch(() => sprites.delete(country));
    }
    return entry;
  };

  static getRegion = async (country: ListingCountry, code: string | null): Promise<GeoRegion | null> => {
    if (!code) return null;
    return (await GeoService.getCountry(country)).regions.find((region) => region.code === code) ?? null;
  };
}
