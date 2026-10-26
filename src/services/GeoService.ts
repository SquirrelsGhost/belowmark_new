import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { MarketCode } from "@/lib/constants";
import { GeoRegion, MarketGeo } from "@/types/listing.types";

/** Outline files written by scripts/build-geo.mjs — literal paths so the bundler can trace them. */
function readGeo(market: MarketCode): Promise<string> {
  return market === "TR"
    ? readFile(join(process.cwd(), "data", "geo", "tr.json"), "utf8")
    : readFile(join(process.cwd(), "data", "geo", "de.json"), "utf8");
}

const loaded = new Map<MarketCode, Promise<MarketGeo>>();

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

  static getRegion = async (market: MarketCode, code: string | null): Promise<GeoRegion | null> => {
    if (!code) return null;
    return (await GeoService.getMarket(market)).regions.find((region) => region.code === code) ?? null;
  };
}
