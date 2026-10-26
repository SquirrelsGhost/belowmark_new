import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { DAY_MS, SEARCH } from "@/lib/appConstants";
import { MarketCode } from "@/lib/constants";
import { getHearingStatus, getNextDate } from "@/lib/listingMath";
import {
  CalendarWeek,
  Listing,
  ListingFilters,
  ListingSearchResult,
  ListingSnapshot,
  MapPlace,
  RegionFacet,
} from "@/types/listing.types";

/** Snapshot files written by scripts/build-snapshots.mjs — literal paths so the bundler can trace them. */
function readSnapshot(market: MarketCode): Promise<string> {
  return market === "TR"
    ? readFile(join(process.cwd(), "data", "snapshots", "tr.json"), "utf8")
    : readFile(join(process.cwd(), "data", "snapshots", "de.json"), "utf8");
}

interface LoadedMarket {
  snapshot: ListingSnapshot;
  byKey: Map<string, Listing>;
  /** Normalised search text per listing key */
  haystack: Map<string, string>;
}

const loaded = new Map<MarketCode, Promise<LoadedMarket>>();

/** Lower case, no accents, Turkish dotless i folded — "cesme" finds "Çeşme". */
export function normalizeText(value: string): string {
  return value
    .replace(/İ/g, "i")
    .replace(/ı/g, "i")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ß/g, "ss");
}

function buildHaystack(listing: Listing): string {
  const parts = [
    listing.title,
    listing.place,
    listing.postcode,
    listing.street,
    listing.authority,
    listing.fileNo,
    listing.region,
    listing.segmentLabel,
    listing.sourcePortal,
    listing.tr?.adType,
    listing.tr?.source,
    listing.tr?.mahalle,
    listing.tr?.nitelik,
    listing.tr?.zoning,
    listing.tr?.ada && listing.tr?.parsel ? `${listing.tr.ada}/${listing.tr.parsel}` : null,
  ];
  return normalizeText(parts.filter(Boolean).join(" "));
}

export function isOpportunityListing(listing: Listing): boolean {
  if (listing.market === "TR") {
    return (listing.tr?.discountPct ?? 0) >= 25 || Boolean(listing.tr?.adType && listing.tr.adType !== "İCRA");
  }
  return Boolean(listing.limitsWaived);
}

export function hasListingDocs(listing: Listing): boolean {
  if (listing.market === "TR") {
    return Boolean(listing.tr?.marketMedianPerM2 || (listing.tr?.ada && listing.tr?.parsel));
  }
  return Boolean(listing.documentUrl || listing.exposeUrl || listing.biddingNotesUrl);
}

function opportunityScore(listing: Listing): number {
  if (listing.market === "TR") {
    const disc = listing.tr?.discountPct ?? -500;
    const bonus = listing.tr?.adType && listing.tr.adType !== "İCRA" ? 20 : 0;
    return disc + bonus;
  }
  return (
    (listing.limitsWaived ? 1000 : 0) +
    (listing.exposeUrl ? 200 : 0) +
    (listing.documentUrl ? 100 : 0) +
    (listing.appraisedValue ? 10 : 0)
  );
}

async function loadMarket(market: MarketCode): Promise<LoadedMarket> {
  const snapshot = JSON.parse(await readSnapshot(market)) as ListingSnapshot;
  const byKey = new Map(snapshot.listings.map((listing) => [listing.key, listing]));
  const haystack = new Map(snapshot.listings.map((listing) => [listing.key, buildHaystack(listing)]));
  return { snapshot, byKey, haystack };
}

function getMarket(market: MarketCode): Promise<LoadedMarket> {
  let entry = loaded.get(market);
  if (!entry) {
    entry = loadMarket(market);
    loaded.set(market, entry);
    entry.catch(() => loaded.delete(market));
  }
  return entry;
}

const toDay = (iso: string) => iso.slice(0, 10);

/** Monday 00:00 UTC of the week containing `time`. */
function weekStart(time: number): number {
  const date = new Date(time);
  const day = (date.getUTCDay() + 6) % 7;
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - day);
}

/**
 * ListingService
 *
 * Reads the official notice snapshot of a market and answers the app's
 * questions: search with filters, single proceedings, the hearing calendar.
 * The data source is a file for now; the interface stays when the pipeline
 * moves to Postgres.
 */
export class ListingService {
  static getMeta = async (market: MarketCode): Promise<ListingSnapshot["meta"]> => {
    return (await getMarket(market)).snapshot.meta;
  };

  static getByKey = async (market: MarketCode, key: string): Promise<Listing | null> => {
    return (await getMarket(market)).byKey.get(key) ?? null;
  };

  /** Several proceedings by key, in the given order; unknown keys are skipped. */
  static getMany = async (market: MarketCode, keys: string[]): Promise<Listing[]> => {
    const { byKey } = await getMarket(market);
    return keys.map((key) => byKey.get(key)).filter((listing): listing is Listing => Boolean(listing));
  };

  static search = async (market: MarketCode, filters: ListingFilters, now: number): Promise<ListingSearchResult> => {
    const { snapshot, haystack } = await getMarket(market);
    const terms = normalizeText(filters.query).split(/\s+/).filter(Boolean);

    // Everything except region and date range — those two get their own facets.
    const base = snapshot.listings.filter((listing) => {
      if (listing.cancelled && !filters.withCancelled) return false;
      if (filters.segment && listing.segment !== filters.segment) return false;
      if (filters.minValue !== null && (listing.appraisedValue ?? -1) < filters.minValue) return false;
      if (filters.maxValue !== null && (listing.appraisedValue ?? Infinity) > filters.maxValue) return false;
      if (filters.onlyOpportunity && !isOpportunityListing(listing)) return false;
      if (filters.onlyWithDocs && !hasListingDocs(listing)) return false;
      if (!ListingService.matchesScope(listing, filters, now)) return false;
      const text = haystack.get(listing.key) ?? "";
      return terms.every((term) => text.includes(term));
    });

    const inRegion = filters.region ? base.filter((listing) => listing.regionCode === filters.region) : base;
    const inRange = inRegion.filter((listing) => ListingService.matchesRange(listing, filters, now));
    const anyRegionInRange = filters.region ? base.filter((listing) => ListingService.matchesRange(listing, filters, now)) : inRange;
    const sorted = ListingService.sort(inRange, filters, now);

    const pageCount = Math.max(1, Math.ceil(sorted.length / SEARCH.pageSize));
    const page = Math.min(filters.page, pageCount);
    const soon = now + SEARCH.imminentDays * DAY_MS;

    return {
      items: sorted.slice((page - 1) * SEARCH.pageSize, page * SEARCH.pageSize),
      total: sorted.length,
      page,
      pageCount,
      calendar: ListingService.calendar(inRegion, now),
      regions: ListingService.regionFacets(base),
      nextSevenDays: inRange.filter((listing) => {
        const next = getNextDate(listing, now);
        return next !== null && Date.parse(next) >= now && Date.parse(next) <= soon;
      }).length,
      opportunitiesCount: inRange.filter(isOpportunityListing).length,
      withDocsCount: inRange.filter(hasListingDocs).length,
      places: filters.view === "map" ? ListingService.places(inRange, now, soon) : [],
      regionCounts: ListingService.regionCounts(anyRegionInRange),
    };
  };

  /** Groups proceedings that share a map position; listings without one are left off the map. */
  private static places(listings: Listing[], now: number, soon: number): MapPlace[] {
    const byPosition = new Map<string, { place: MapPlace; first: Listing }>();
    for (const listing of listings) {
      if (!listing.geo) continue;
      const id = listing.geo.precision === "postcode" ? `plz-${listing.postcode}` : `il-${listing.regionCode}`;
      const next = getNextDate(listing, now);
      const imminent = next !== null && Date.parse(next) >= now && Date.parse(next) <= soon ? 1 : 0;
      const entry = byPosition.get(id);
      if (entry) {
        entry.place.count += 1;
        entry.place.imminent += imminent;
        continue;
      }
      const label = listing.geo.precision === "postcode" ? `${listing.postcode} ${listing.place ?? ""}`.trim() : listing.region ?? "";
      byPosition.set(id, {
        first: listing,
        place: { id, ...listing.geo, label, regionCode: listing.regionCode, count: 1, imminent, single: null },
      });
    }
    return [...byPosition.values()].map(({ place, first }) => {
      if (place.count !== 1) return place;
      const single = { key: first.key, title: first.place ?? first.title, nextDate: getNextDate(first, now), value: first.appraisedValue, segment: first.segment };
      return { ...place, single };
    });
  }

  private static regionCounts(listings: Listing[]): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const listing of listings) {
      if (listing.regionCode) counts[listing.regionCode] = (counts[listing.regionCode] ?? 0) + 1;
    }
    return counts;
  }

  private static matchesScope(listing: Listing, filters: ListingFilters, now: number): boolean {
    if (filters.scope === "all") return true;
    const state = getHearingStatus(listing, now).state;
    const isOpen = state === "upcoming" || state === "running" || (state === "cancelled" && filters.withCancelled);
    return filters.scope === "upcoming" ? isOpen : state === "past";
  }

  private static matchesRange(listing: Listing, filters: ListingFilters, now: number): boolean {
    if (!filters.from && !filters.to) return true;
    const next = getNextDate(listing, now);
    if (!next) return false;
    const day = toDay(next);
    return (!filters.from || day >= filters.from) && (!filters.to || day <= filters.to);
  }

  private static sort(listings: Listing[], filters: ListingFilters, now: number): Listing[] {
    const dates = new Map(listings.map((listing) => [listing.key, Date.parse(getNextDate(listing, now) ?? "9999-12-31")]));
    const dateOf = (listing: Listing) => dates.get(listing.key) ?? Infinity;
    const copy = [...listings];
    switch (filters.sort) {
      case "discount":
        return copy.sort((a, b) => {
          const diff = opportunityScore(b) - opportunityScore(a);
          return diff !== 0 ? diff : dateOf(a) - dateOf(b);
        });
      case "valueAsc":
        return copy.sort((a, b) => (a.appraisedValue ?? Infinity) - (b.appraisedValue ?? Infinity));
      case "valueDesc":
        return copy.sort((a, b) => (b.appraisedValue ?? -1) - (a.appraisedValue ?? -1));
      case "newest":
        return copy.sort((a, b) => (b.firstSeenAt ?? "").localeCompare(a.firstSeenAt ?? ""));
      default:
        return filters.scope === "past" ? copy.sort((a, b) => dateOf(b) - dateOf(a)) : copy.sort((a, b) => dateOf(a) - dateOf(b));
    }
  }

  /** Hearings per week for the next weeks, starting with the current one. */
  private static calendar(listings: Listing[], now: number): CalendarWeek[] {
    const first = weekStart(now);
    const weeks: CalendarWeek[] = Array.from({ length: SEARCH.calendarWeeks }, (_, index) => {
      const start = first + index * 7 * DAY_MS;
      return { start: toDay(new Date(start).toISOString()), end: toDay(new Date(start + 6 * DAY_MS).toISOString()), count: 0 };
    });
    for (const listing of listings) {
      const next = getNextDate(listing, now);
      if (!next) continue;
      const index = Math.floor((Date.parse(next) - first) / (7 * DAY_MS));
      if (index >= 0 && index < weeks.length) weeks[index].count += 1;
    }
    return weeks;
  }

  private static regionFacets(listings: Listing[]): RegionFacet[] {
    const counts = new Map<string, RegionFacet>();
    for (const listing of listings) {
      if (!listing.regionCode || !listing.region) continue;
      const facet = counts.get(listing.regionCode) ?? { code: listing.regionCode, name: listing.region, count: 0 };
      facet.count += 1;
      counts.set(listing.regionCode, facet);
    }
    return [...counts.values()].sort((a, b) => a.name.localeCompare(b.name, "de"));
  }
}
