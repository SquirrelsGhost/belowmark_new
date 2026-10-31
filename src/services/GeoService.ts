import "server-only";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { MarketCode } from "@/lib/constants";
import { projectPoint } from "@/lib/geo";
import { countryMarket, regionCountry } from "@/lib/listingCountry";
import { buildLocatorSprite, locatorSpriteHref } from "@/lib/locatorSprite";
import { GeoRegion, ListingCountry, MarketGeo } from "@/types/listing.types";

/** Outline files written by scripts/build-geo.mjs — literal paths so the bundler can trace them. */
function readGeo(market: MarketCode): Promise<string> {
  return market === "TR"
    ? readFile(join(process.cwd(), "data", "geo", "tr.json"), "utf8")
    : readFile(join(process.cwd(), "data", "geo", "de.json"), "utf8");
}

const loaded = new Map<MarketCode, Promise<MarketGeo>>();
const countries = new Map<ListingCountry, Promise<MarketGeo>>();

/**
 * Mainland extent (minLng, minLat, maxLng, maxLat) of the countries that have
 * no outlines in data/geo yet. Their map shows the proceedings' positions only.
 */
const COUNTRY_BOUNDS: Partial<Record<ListingCountry, [number, number, number, number]>> = {
  IT: [6.6, 36.6, 18.6, 47.1],
  ES: [-9.4, 35.9, 3.4, 43.8],
  FR: [-5.2, 41.3, 9.6, 51.1],
  GB: [-8.2, 49.9, 1.8, 58.7],
};

const FRAME_PAD = 0.04;

function frameOf(geo: MarketGeo, regions: GeoRegion[], country: ListingCountry): [number, number, number, number] {
  let box: [number, number, number, number];
  const bounds = COUNTRY_BOUNDS[country];
  if (regions.length > 0) {
    box = [
      Math.min(...regions.map((region) => region.bbox[0])),
      Math.min(...regions.map((region) => region.bbox[1])),
      Math.max(...regions.map((region) => region.bbox[2])),
      Math.max(...regions.map((region) => region.bbox[3])),
    ];
  } else if (bounds) {
    const [x0, y1] = projectPoint(geo.projection, bounds[1], bounds[0]);
    const [x1, y0] = projectPoint(geo.projection, bounds[3], bounds[2]);
    box = [x0, y0, x1, y1];
  } else {
    return [0, 0, geo.projection.width, geo.projection.height];
  }
  const padX = (box[2] - box[0]) * FRAME_PAD;
  const padY = (box[3] - box[1]) * FRAME_PAD;
  return [box[0] - padX, box[1] - padY, box[2] + padX, box[3] + padY];
}
const sprites = new Map<MarketCode, Promise<LocatorSprite>>();

/** The region outlines of the small locator maps as one SVG file, and the URL it is served at. */
export interface LocatorSprite {
  svg: string;
  /** Versioned by content, so browsers may keep it for a year */
  href: string;
}

/**
 * GeoService
 *
 * Region outlines (Bundesländer / İller) for the app's own SVG maps. Drawn
 * from a local file, so no map provider sees what a user looks at.
 */
export class GeoService {
  static getMarket = (market: MarketCode): Promise<MarketGeo> => {
    let entry = loaded.get(market);
    if (!entry) {
      entry = readGeo(market).then((text) => JSON.parse(text) as MarketGeo);
      loaded.set(market, entry);
      entry.catch(() => loaded.delete(market));
    }
    return entry;
  };

  /**
   * The map of one country: only its own regions, framed to its extent. The
   * European outlines share one projection, so dots and shapes still line up.
   */
  static getCountry = (country: ListingCountry): Promise<MarketGeo> => {
    let entry = countries.get(country);
    if (!entry) {
      entry = GeoService.getMarket(countryMarket(country)).then((geo) => {
        if (geo.market === "TR") return { ...geo, country };
        const regions = geo.regions.filter((region) => regionCountry(region.code) === country);
        // Credit only the outlines this country's map actually draws
        const isAlpine = country === "AT" || country === "CH";
        const sources = regions.length === 0 ? [] : geo.sources.filter((source) => /AT & CH/.test(source.label) === isAlpine);
        return { ...geo, country, regions, sources, frame: frameOf(geo, regions, country) };
      });
      countries.set(country, entry);
      entry.catch(() => countries.delete(country));
    }
    return entry;
  };

  static getLocatorSprite = (market: MarketCode): Promise<LocatorSprite> => {
    let entry = sprites.get(market);
    if (!entry) {
      entry = GeoService.getMarket(market).then((geo) => {
        const svg = buildLocatorSprite(geo.regions);
        const version = createHash("sha256").update(svg).digest("base64url").slice(0, 12);
        return { svg, href: locatorSpriteHref(market, version) };
      });
      sprites.set(market, entry);
      entry.catch(() => sprites.delete(market));
    }
    return entry;
  };

  static getRegion = async (market: MarketCode, code: string | null): Promise<GeoRegion | null> => {
    if (!code) return null;
    return (await GeoService.getMarket(market)).regions.find((region) => region.code === code) ?? null;
  };
}
