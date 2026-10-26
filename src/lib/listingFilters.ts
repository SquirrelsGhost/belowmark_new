import { APP_ROUTES, SEARCH, SEARCH_PARAMS, VIEW_VALUES } from "@/lib/appConstants";
import { SegmentKey } from "@/lib/snapshot";
import { ListingFilters, ListingScope, ListingSort, SearchView } from "@/types/listing.types";

/**
 * Every filter lives in the URL, so a search is a bookmark and can be sent on.
 * Unknown or broken values fall back to the default instead of failing.
 */

type RawParams = Record<string, string | string[] | undefined>;

const SEGMENTS: SegmentKey[] = ["house", "apartment", "multiFamily", "land", "farmland", "commercial", "other"];
const SORTS: ListingSort[] = ["hearing", "discount", "valueAsc", "valueDesc", "newest"];
const SCOPES: ListingScope[] = ["upcoming", "all", "past"];
export const VIEW_KEYS: SearchView[] = ["list", "map"];
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export const DEFAULT_FILTERS: ListingFilters = {
  query: "",
  region: "",
  segment: "",
  minValue: null,
  maxValue: null,
  from: "",
  to: "",
  scope: "upcoming",
  withCancelled: false,
  onlyOpportunity: false,
  onlyWithDocs: false,
  sort: "hearing",
  view: "list",
  page: 1,
};

export const SEGMENT_KEYS = SEGMENTS;
export const SORT_KEYS = SORTS;
export const SCOPE_KEYS = SCOPES;

const first = (value: string | string[] | undefined): string => (Array.isArray(value) ? value[0] ?? "" : value ?? "").trim();

const pick = <T extends string>(value: string, allowed: readonly T[], fallback: T): T =>
  allowed.includes(value as T) ? (value as T) : fallback;

const amount = (value: string): number | null => {
  const parsed = Number.parseInt(value.replace(/\D/g, ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export function parseFilters(params: RawParams): ListingFilters {
  const page = Number.parseInt(first(params[SEARCH_PARAMS.page]), 10);
  const from = first(params[SEARCH_PARAMS.from]);
  const to = first(params[SEARCH_PARAMS.to]);
  return {
    query: first(params[SEARCH_PARAMS.query]).slice(0, SEARCH.maxQueryLength),
    region: first(params[SEARCH_PARAMS.region]).toLowerCase(),
    segment: pick(first(params[SEARCH_PARAMS.segment]), [...SEGMENTS, ""] as const, ""),
    minValue: amount(first(params[SEARCH_PARAMS.minValue])),
    maxValue: amount(first(params[SEARCH_PARAMS.maxValue])),
    from: ISO_DATE.test(from) ? from : "",
    to: ISO_DATE.test(to) ? to : "",
    scope: pick(first(params[SEARCH_PARAMS.scope]), SCOPES, DEFAULT_FILTERS.scope),
    withCancelled: first(params[SEARCH_PARAMS.withCancelled]) === "1",
    onlyOpportunity: first(params[SEARCH_PARAMS.onlyOpportunity]) === "1",
    onlyWithDocs: first(params[SEARCH_PARAMS.onlyWithDocs]) === "1",
    sort: pick(first(params[SEARCH_PARAMS.sort]), SORTS, DEFAULT_FILTERS.sort),
    view: first(params[SEARCH_PARAMS.view]) === VIEW_VALUES.map ? "map" : "list",
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

/** Query string for the given filters; default values are left out to keep URLs short. */
export function toSearchQuery(filters: ListingFilters): string {
  const query = new URLSearchParams();
  const set = (name: string, value: string | number | null | boolean, fallback: string | number | null | boolean) => {
    if (value !== fallback && value !== "" && value !== null) query.set(name, value === true ? "1" : String(value));
  };
  set(SEARCH_PARAMS.query, filters.query, DEFAULT_FILTERS.query);
  set(SEARCH_PARAMS.region, filters.region, DEFAULT_FILTERS.region);
  set(SEARCH_PARAMS.segment, filters.segment, DEFAULT_FILTERS.segment);
  set(SEARCH_PARAMS.minValue, filters.minValue, DEFAULT_FILTERS.minValue);
  set(SEARCH_PARAMS.maxValue, filters.maxValue, DEFAULT_FILTERS.maxValue);
  set(SEARCH_PARAMS.from, filters.from, DEFAULT_FILTERS.from);
  set(SEARCH_PARAMS.to, filters.to, DEFAULT_FILTERS.to);
  set(SEARCH_PARAMS.scope, filters.scope, DEFAULT_FILTERS.scope);
  set(SEARCH_PARAMS.withCancelled, filters.withCancelled, DEFAULT_FILTERS.withCancelled);
  set(SEARCH_PARAMS.onlyOpportunity, filters.onlyOpportunity, DEFAULT_FILTERS.onlyOpportunity);
  set(SEARCH_PARAMS.onlyWithDocs, filters.onlyWithDocs, DEFAULT_FILTERS.onlyWithDocs);
  set(SEARCH_PARAMS.sort, filters.sort, DEFAULT_FILTERS.sort);
  set(SEARCH_PARAMS.view, VIEW_VALUES[filters.view], VIEW_VALUES[DEFAULT_FILTERS.view]);
  set(SEARCH_PARAMS.page, filters.page, DEFAULT_FILTERS.page);
  const text = query.toString();
  return text ? `?${text}` : "";
}

/** Search URL with some filters changed; any change other than the page resets to page 1. */
export function searchHref(filters: ListingFilters, changes: Partial<ListingFilters>): string {
  const next = { ...filters, page: 1, ...changes };
  return `${APP_ROUTES.search}${toSearchQuery(next)}`;
}

export function hasActiveFilters(filters: ListingFilters): boolean {
  return toSearchQuery({ ...filters, sort: DEFAULT_FILTERS.sort, view: DEFAULT_FILTERS.view, page: 1 }) !== "";
}
