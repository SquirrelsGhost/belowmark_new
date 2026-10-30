import { createHash } from "node:crypto";
import { MarketCode } from "@/lib/constants";
import { RateLimitRule } from "@/lib/auth/authConfig";
import { Listing, ListingFilters, ListingSearchResult, OfficialPortalDetails } from "@/types/listing.types";

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

export const MAX_FREE_SEARCH_PAGES = 3;
export const HONEYPOT_KEY_PREFIX = "bm-trap-";

/** Multi-tier scraping quotas per user and plan. */
export const SCRAPING_LIMITS = {
  searchFreeMinute: { limit: 20, windowMs: MINUTE_MS } satisfies RateLimitRule,
  searchFreeHour: { limit: 80, windowMs: HOUR_MS } satisfies RateLimitRule,
  searchPaidMinute: { limit: 45, windowMs: MINUTE_MS } satisfies RateLimitRule,
  searchPaidHour: { limit: 400, windowMs: HOUR_MS } satisfies RateLimitRule,
  detailFreeMinute: { limit: 8, windowMs: MINUTE_MS } satisfies RateLimitRule,
  detailFreeDay: { limit: 15, windowMs: DAY_MS } satisfies RateLimitRule,
  detailPaidMinute: { limit: 20, windowMs: MINUTE_MS } satisfies RateLimitRule,
  detailPaidDay: { limit: 150, windowMs: DAY_MS } satisfies RateLimitRule,
  sourceDocMinute: { limit: 12, windowMs: MINUTE_MS } satisfies RateLimitRule,
  sourceDocDay: { limit: 45, windowMs: DAY_MS } satisfies RateLimitRule,
  burstStrikesHour: { limit: 5, windowMs: HOUR_MS } satisfies RateLimitRule,
} as const;

const BOT_UA_PATTERN =
  /python-requests|python-httpx|aiohttp|curl\/|wget\/|scrapy|go-http-client|libwww-perl|java\/|php\/|axios\/|node-fetch|undici|headlesschrome|phantomjs|selenium|puppeteer|playwright|crawl4ai|scrapling|httrack|colly/i;

/**
 * Detects automated HTTP clients and headless scrapers on protected `/app` and `/api` routes.
 */
export function isAutomatedBotRequest(headers: Headers, pathname: string): boolean {
  const isProtectedSurface =
    pathname.startsWith("/app") ||
    pathname.startsWith("/mappe/") ||
    pathname.startsWith("/bankmappe/") ||
    pathname.startsWith("/expose/") ||
    pathname.startsWith("/api/quelle/") ||
    pathname.startsWith("/api/gutachten");

  if (!isProtectedSurface) return false;
  // Calendar download routes may be fetched by calendar clients, but still block obvious scraping libraries
  const ua = (headers.get("user-agent") ?? "").trim();
  if (!ua || ua.length < 12 || BOT_UA_PATTERN.test(ua)) return true;

  // Browser navigations to HTML/API surfaces always send Accept or Accept-Language
  const accept = headers.get("accept");
  const acceptLang = headers.get("accept-language");
  if (!accept && !acceptLang) return true;

  // Detect mismatched Sec-Fetch headers when present
  const secFetchSite = headers.get("sec-fetch-site");
  if (secFetchSite === "cross-site" && pathname.startsWith("/api/quelle/")) {
    return true;
  }

  return false;
}

/** Deterministic daily canary listing key per market. */
export function buildHoneypotListingKey(market: MarketCode, nowMs = Date.now()): string {
  const dayBucket = Math.floor(nowMs / DAY_MS);
  const digest = createHash("sha256")
    .update(`bm-canary:${market}:${dayBucket}`, "utf8")
    .digest("hex")
    .slice(0, 10);
  const prefix = market === "TR" ? "uyap" : "zvgportal";
  return `${HONEYPOT_KEY_PREFIX}${prefix}-${digest}`;
}

export function isHoneypotListingKey(key: string): boolean {
  return key.startsWith(HONEYPOT_KEY_PREFIX);
}

/**
 * Strips price-oracle filters (`minValue`, `maxValue`, `onlyOpportunity`, value sorts)
 * and caps pagination when `isLocked` (`plan === "free"`) is active.
 */
export function sanitizeFiltersForPlan(filters: ListingFilters, isLocked: boolean): ListingFilters {
  if (!isLocked) return filters;
  const allowedSort = filters.sort === "newest" ? "newest" : "hearing";
  return {
    ...filters,
    minValue: null,
    maxValue: null,
    onlyOpportunity: false,
    sort: allowedSort,
    page: Math.min(filters.page, MAX_FREE_SEARCH_PAGES),
  };
}

/** Masks a court file number for free users so it cannot be scraped for external lookup. */
export function maskFileNo(fileNo: string): string {
  const trimmed = fileNo.trim();
  if (trimmed.length <= 4) return "•••/••••";
  return `${trimmed.slice(0, 4)} •••/••••`;
}

/**
 * Strips sensitive valuation, parcel, street, and document fields from a `Listing`
 * before rendering for a `free` account so nothing leaks into the DOM or RSC payload.
 */
export function redactListingForFreePlan(listing: Listing): Listing {
  return {
    ...listing,
    street: null,
    fileNo: maskFileNo(listing.fileNo),
    limitsWaived: false,
    appraisedValue: null,
    minimumBid: null,
    depositAmount: null,
    grundbuch: null,
    description: listing.description ? `${listing.description.slice(0, 90)}…` : null,
    creditor: null,
    officialUrl: "",
    documentUrl: null,
    exposeUrl: null,
    reportUrl: null,
    biddingNotesUrl: null,
    tr: listing.tr
      ? {
          ...listing.tr,
          ada: null,
          parsel: null,
          startingBid: null,
          marketMedianPerM2: null,
          discountPct: null,
          unitNo: null,
          arsaPayi: null,
          excerpt: listing.tr.excerpt ? `${listing.tr.excerpt.slice(0, 90)}…` : null,
        }
      : undefined,
  };
}

/** Redacts a full search result for free accounts (items, pagination cap, and map single values). */
export function redactSearchResultForFreePlan(result: ListingSearchResult): ListingSearchResult {
  return {
    ...result,
    pageCount: Math.min(result.pageCount, MAX_FREE_SEARCH_PAGES),
    items: result.items.map(redactListingForFreePlan),
    places: result.places.map((place) => ({
      ...place,
      single: place.single ? { ...place.single, value: null } : null,
    })),
  };
}

/** Returns an empty portal details object for free accounts so external portal data is never leaked. */
export function emptyPortalDetailsForFreePlan(sourcePortal = ""): OfficialPortalDetails {
  return {
    sourcePortal,
    portalEntryUrl: "",
    proceedingKind: null,
    grundbuch: null,
    description: null,
    hearingPlace: null,
    creditor: null,
    courtUrl: null,
    geoServerUrl: null,
    livingAreaM2: null,
    usableAreaM2: null,
    landAreaM2: null,
    netAreaM2: null,
    rooms: null,
    yearBuilt: null,
    floor: null,
    unitNo: null,
    arsaPayi: null,
    zoning: null,
    ownershipShare: null,
    attachments: [],
    galleryUrls: [],
    tkgmParcelUrl: null,
  };
}
