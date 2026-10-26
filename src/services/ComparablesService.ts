import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { DE_COMPARISON_SOURCES, TCMB_SEGMENTS } from "@/lib/bidding/biddingConstants";
import { ComparisonFigure, ListingComparables } from "@/types/bidding.types";
import { Listing } from "@/types/listing.types";

/**
 * ComparablesService
 *
 * Comparison values for the surroundings of a proceeding — only from sources
 * the app actually holds, each with its date. Where there is none, the figure
 * is returned empty with the reason, plus the official portal to look it up.
 */

interface TcmbProvince {
  name: string;
  perM2: number;
  quarter: string;
  series: string;
}

interface TcmbSeries {
  meta: { source: string; sourceUrl: string; latestQuarter: string; basis: string };
  provinces: Record<string, TcmbProvince>;
}

/** Ratings the old pipeline considered solid enough to show an offer median (as MarketComparison). */
const SHOWN_CONFIDENCE = ["belastbar", "mittel"];
/** Area kind of Turkish notices that means floor area, not the parcel. */
const FLOOR_AREA_KIND = "Wohn-/Nutzfläche";
const EMLAKJET = { name: "emlakjet.com – öffentliche Inserate", url: "https://www.emlakjet.com/" } as const;

let tcmb: Promise<TcmbSeries> | null = null;

/** Written by scripts/build-comparables.mjs — literal path so the bundler can trace it. */
function loadTcmb(): Promise<TcmbSeries> {
  tcmb ??= readFile(join(process.cwd(), "data", "comparables", "tr-tcmb.json"), "utf8").then((raw) => JSON.parse(raw) as TcmbSeries);
  return tcmb;
}

const empty = (id: ComparisonFigure["id"], kind: ComparisonFigure["kind"], gap: ComparisonFigure["gap"], sourceName: string, sourceUrl: string): ComparisonFigure => ({
  id,
  kind,
  perM2: null,
  objectPerM2: null,
  areaKind: null,
  scope: null,
  sampleSize: null,
  confidence: null,
  asOf: null,
  sourceName,
  sourceUrl,
  gap,
});

function germanComparables(listing: Listing): ListingComparables {
  const { boris, zensus } = DE_COMPARISON_SOURCES;
  return {
    figures: [
      empty("landValue", "landValue", "noLicensedData", "BORIS-D", boris.url),
      empty("offers", "salePrice", "noLicensedData", "", ""),
      empty("rent", "rent", "noLicensedData", "Zensus 2022", zensus.url),
    ],
    lookups: [
      { id: "boris", ...boris },
      ...(listing.geoportalUrl ? [{ id: "geoportal" as const, url: listing.geoportalUrl, host: new URL(listing.geoportalUrl).host, name: listing.geoportalName ?? undefined }] : []),
      { id: "zensus", ...zensus },
    ],
  };
}

async function turkishComparables(listing: Listing, snapshotDate: string): Promise<ListingComparables> {
  const tr = listing.tr;
  const series = await loadTcmb();
  const value = listing.appraisedValue;
  const area = tr?.areaM2 ?? null;
  const objectPerM2 = value !== null && area ? value / area : null;

  const hasOffers = tr && tr.marketMedianPerM2 !== null && SHOWN_CONFIDENCE.includes(tr.confidence ?? "");
  const offers: ComparisonFigure = hasOffers
    ? { ...empty("offers", "salePrice", null, EMLAKJET.name, EMLAKJET.url), perM2: tr.marketMedianPerM2, objectPerM2, areaKind: tr.areaKind, scope: listing.place, sampleSize: tr.marketSampleSize, confidence: tr.confidence, asOf: snapshotDate }
    : empty("offers", "salePrice", "noComparableOffers", EMLAKJET.name, EMLAKJET.url);

  const province = listing.regionCode ? series.provinces[listing.regionCode] : undefined;
  const isCovered = (TCMB_SEGMENTS as readonly string[]).includes(listing.segment);
  const official: ComparisonFigure = !isCovered
    ? empty("tcmb", "salePrice", "segmentNotCovered", series.meta.source, series.meta.sourceUrl)
    : !province
      ? empty("tcmb", "salePrice", "provinceGap", series.meta.source, series.meta.sourceUrl)
      : {
          ...empty("tcmb", "salePrice", null, series.meta.source, series.meta.sourceUrl),
          perM2: province.perM2,
          objectPerM2: tr?.areaKind === FLOOR_AREA_KIND ? objectPerM2 : null,
          areaKind: tr?.areaKind === FLOOR_AREA_KIND ? tr.areaKind : null,
          scope: province.name,
          asOf: province.quarter,
        };

  return {
    figures: [offers, official, empty("rent", "rent", "noOfficialSeries", "", "")],
    lookups: [{ id: "tcmb", url: series.meta.sourceUrl, host: new URL(series.meta.sourceUrl).host }],
  };
}

export class ComparablesService {
  static getForListing = (listing: Listing, snapshotDate: string): Promise<ListingComparables> =>
    listing.market === "TR" ? turkishComparables(listing, snapshotDate) : Promise.resolve(germanComparables(listing));
}
