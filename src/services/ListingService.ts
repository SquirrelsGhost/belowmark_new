import "server-only";
import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { DAY_MS, SEARCH } from "@/lib/appConstants";
import { MarketCode } from "@/lib/constants";
import { getHearingState, getNextDate } from "@/lib/listingMath";
import {
  CalendarWeek,
  Listing,
  ListingFilters,
  ListingSearchResult,
  ListingSnapshot,
  MapPlace,
  RegionFacet,
} from "@/types/listing.types";

function snapshotPath(market: MarketCode): string {
  return market === "TR"
    ? join(process.cwd(), "data", "snapshots", "tr.json")
    : join(process.cwd(), "data", "snapshots", "de.json");
}

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
  mtimeMs: number;
  checkedAt: number;
}

const loaded = new Map<MarketCode, Promise<LoadedMarket>>();
const STAT_TTL_MS = 10_000;

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
    listing.grundbuch,
    listing.rooms,
    listing.proceedingKind,
    listing.description,
    listing.tr?.adType,
    listing.tr?.source,
    listing.tr?.mahalle,
    listing.tr?.nitelik,
    listing.tr?.zoning,
    listing.tr?.rooms,
    listing.tr?.floor,
    listing.tr?.excerpt,
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

const TR_PROVINCE_ALIASES: Record<string, { region: string; regionCode: string }> = {
  "ş.urfa": { region: "Şanlıurfa", regionCode: "sanliurfa" },
  "s.urfa": { region: "Şanlıurfa", regionCode: "sanliurfa" },
  "k.maraş": { region: "Kahramanmaraş", regionCode: "kahramanmaras" },
  "k.maras": { region: "Kahramanmaraş", regionCode: "kahramanmaras" },
  "g.antep": { region: "Gaziantep", regionCode: "gaziantep" },
  "a.karahisar": { region: "Afyonkarahisar", regionCode: "afyonkarahisar" },
};

function sanitizeSnapshotListing(listing: Listing): Listing {
  if (listing.market === "DE") {
    if (listing.courtUrl && !/^https?:\/\//i.test(listing.courtUrl)) {
      try {
        listing.courtUrl = new URL(listing.courtUrl, "https://www.zvg-portal.de/index.php").toString();
      } catch {
        // Keep original courtUrl if malformed
      }
    }
    if (listing.appraisedValue !== null && listing.appraisedValue < 500) {
      listing.appraisedValue = null;
    }
    return listing;
  }

  if (listing.region) {
    const alias = TR_PROVINCE_ALIASES[listing.region.toLocaleLowerCase("tr").replace(/\s+/g, "")];
    if (alias) {
      listing.region = alias.region;
      listing.regionCode = alias.regionCode;
    }
  }
  if (listing.appraisedValue !== null && listing.appraisedValue < 1000) {
    listing.appraisedValue = null;
    if (listing.tr && listing.tr.startingBid !== null && listing.tr.startingBid < 500) {
      listing.tr.startingBid = null;
    }
  }
  return listing;
}

async function loadMarket(market: MarketCode): Promise<LoadedMarket> {
  const [raw, fileStat] = await Promise.all([
    readSnapshot(market),
    stat(snapshotPath(market)).catch(() => ({ mtimeMs: 0 })),
  ]);
  const snapshot = JSON.parse(raw) as ListingSnapshot;
  snapshot.listings = snapshot.listings.map(sanitizeSnapshotListing);
  const byKey = new Map(snapshot.listings.map((listing) => [listing.key, listing]));
  const haystack = new Map(snapshot.listings.map((listing) => [listing.key, buildHaystack(listing)]));
  return { snapshot, byKey, haystack, mtimeMs: fileStat.mtimeMs, checkedAt: Date.now() };
}

const refreshing = new Set<MarketCode>();

/**
 * Loads a market once and keeps it in memory. When the snapshot file changes
 * (npm run sync), the new file is parsed in the background while requests
 * keep getting the previous data — parsing the TR file takes about half a
 * second, nobody should wait for it.
 */
async function getMarket(market: MarketCode): Promise<LoadedMarket> {
  const entry = loaded.get(market);
  if (!entry) {
    const fresh = loadMarket(market);
    loaded.set(market, fresh);
    fresh.catch(() => loaded.delete(market));
    return fresh;
  }
  const current = await entry;
  if (Date.now() - current.checkedAt > STAT_TTL_MS && !refreshing.has(market)) {
    current.checkedAt = Date.now();
    refreshing.add(market);
    stat(snapshotPath(market))
      .then(async (fileStat) => {
        if (fileStat.mtimeMs <= current.mtimeMs) return;
        const next = await loadMarket(market);
        if (loaded.get(market) === entry) loaded.set(market, Promise.resolve(next));
      })
      // A half-written file fails to parse: keep the previous data and try again after the next interval
      .catch(() => undefined)
      .finally(() => refreshing.delete(market));
  }
  return current;
}

const toDay = (iso: string) => iso.slice(0, 10);

type NextDateOf = (listing: Listing) => string | null;

/** getNextDate, worked out once per proceeding and search — the search asks up to five times. */
function nextDates(now: number): NextDateOf {
  const known = new Map<Listing, string | null>();
  return (listing) => {
    let next = known.get(listing);
    if (next === undefined) {
      next = getNextDate(listing, now);
      known.set(listing, next);
    }
    return next;
  };
}

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
    const nextOf = nextDates(now);

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
    const inRange = inRegion.filter((listing) => ListingService.matchesRange(listing, filters, nextOf));
    const anyRegionInRange = filters.region ? base.filter((listing) => ListingService.matchesRange(listing, filters, nextOf)) : inRange;
    const sorted = ListingService.sort(inRange, filters, nextOf);

    const pageCount = Math.max(1, Math.ceil(sorted.length / SEARCH.pageSize));
    const page = Math.min(filters.page, pageCount);
    const soon = now + SEARCH.imminentDays * DAY_MS;

    return {
      items: sorted.slice((page - 1) * SEARCH.pageSize, page * SEARCH.pageSize),
      total: sorted.length,
      page,
      pageCount,
      calendar: ListingService.calendar(inRegion, now, nextOf),
      regions: ListingService.regionFacets(base),
      nextSevenDays: inRange.filter((listing) => {
        const next = nextOf(listing);
        return next !== null && Date.parse(next) >= now && Date.parse(next) <= soon;
      }).length,
      opportunitiesCount: inRange.filter(isOpportunityListing).length,
      withDocsCount: inRange.filter(hasListingDocs).length,
      places: filters.view === "map" ? ListingService.places(inRange, now, soon, nextOf) : [],
      regionCounts: ListingService.regionCounts(anyRegionInRange),
    };
  };

  /** Groups proceedings that share a map position; listings without one are left off the map. */
  private static places(listings: Listing[], now: number, soon: number, nextOf: NextDateOf): MapPlace[] {
    const byPosition = new Map<string, { place: MapPlace; first: Listing }>();
    for (const listing of listings) {
      if (!listing.geo) continue;
      const id = listing.geo.precision === "postcode" ? `plz-${listing.postcode}` : `il-${listing.regionCode}`;
      const next = nextOf(listing);
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
      const single = { key: first.key, title: first.place ?? first.title, nextDate: nextOf(first), value: first.appraisedValue, segment: first.segment };
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
    const state = getHearingState(listing, now).state;
    const isOpen = state === "upcoming" || state === "running" || (state === "cancelled" && filters.withCancelled);
    return filters.scope === "upcoming" ? isOpen : state === "past";
  }

  private static matchesRange(listing: Listing, filters: ListingFilters, nextOf: NextDateOf): boolean {
    if (!filters.from && !filters.to) return true;
    const next = nextOf(listing);
    if (!next) return false;
    const day = toDay(next);
    return (!filters.from || day >= filters.from) && (!filters.to || day <= filters.to);
  }

  private static sort(listings: Listing[], filters: ListingFilters, nextOf: NextDateOf): Listing[] {
    const dates = new Map(listings.map((listing) => [listing.key, Date.parse(nextOf(listing) ?? "9999-12-31")]));
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
  private static calendar(listings: Listing[], now: number, nextOf: NextDateOf): CalendarWeek[] {
    const first = weekStart(now);
    const weeks: CalendarWeek[] = Array.from({ length: SEARCH.calendarWeeks }, (_, index) => {
      const start = first + index * 7 * DAY_MS;
      return { start: toDay(new Date(start).toISOString()), end: toDay(new Date(start + 6 * DAY_MS).toISOString()), count: 0 };
    });
    for (const listing of listings) {
      const next = nextOf(listing);
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
