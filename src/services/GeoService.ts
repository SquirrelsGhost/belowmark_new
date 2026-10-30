import "server-only";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { MarketCode } from "@/lib/constants";
import { buildLocatorSprite, locatorSpriteHref } from "@/lib/locatorSprite";
import { GeoRegion, MarketGeo } from "@/types/listing.types";

/** Outline files written by scripts/build-geo.mjs — literal paths so the bundler can trace them. */
function readGeo(market: MarketCode): Promise<string> {
  return market === "TR"
    ? readFile(join(process.cwd(), "data", "geo", "tr.json"), "utf8")
    : readFile(join(process.cwd(), "data", "geo", "de.json"), "utf8");
}

const loaded = new Map<MarketCode, Promise<MarketGeo>>();
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
