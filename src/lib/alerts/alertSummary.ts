import { APP_ROUTES, SEARCH_PARAMS } from "@/lib/appConstants";
import { fill, formatMoney } from "@/lib/appFormat";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { DEFAULT_FILTERS, toSearchQuery } from "@/lib/listingFilters";
import { SegmentKey } from "@/lib/snapshot";
import { IAlertsTranslation } from "@/translations/alerts/IAlertsTranslation";
import { ListingFilters } from "@/types/listing.types";
import { StoredAlertFilters } from "@/types/alert.types";

/** The saved filters back as full search filters (upcoming only, default order). */
export function toListingFilters(filters: StoredAlertFilters): ListingFilters {
  return {
    ...DEFAULT_FILTERS,
    query: filters.query,
    region: filters.region,
    segment: filters.segment as SegmentKey | "",
    minValue: filters.minValue,
    maxValue: filters.maxValue,
  };
}

/** Path of the search an alert stands for. */
export const alertSearchPath = (filters: StoredAlertFilters): string => `${APP_ROUTES.search}${toSearchQuery(toListingFilters(filters))}`;

/** Short description of a saved search: region · type · value range · search word. */
export function alertSummary(
  filters: StoredAlertFilters,
  market: MarketCode,
  segments: Record<SegmentKey, string>,
  labels: IAlertsTranslation["Summary"],
  locale: LocaleOption,
): string[] {
  const money = (value: number) => formatMoney(value, market, locale);
  const parts = [
    filters.region ? (filters.regionName ?? filters.region) : labels.AllRegions[market],
    filters.segment ? segments[filters.segment as SegmentKey] ?? filters.segment : labels.AllSegments,
  ];
  if (filters.minValue !== null) parts.push(fill(labels.Min, { value: money(filters.minValue) }));
  if (filters.maxValue !== null) parts.push(fill(labels.Max, { value: money(filters.maxValue) }));
  if (filters.query) parts.push(fill(labels.Query, { query: filters.query }));
  return parts;
}

/** Hidden fields of the save form: exactly the filters an alert keeps, under the search's URL names. */
export function alertFormParams(filters: ListingFilters): Record<string, string> {
  const params: Record<string, string> = {};
  if (filters.query) params[SEARCH_PARAMS.query] = filters.query;
  if (filters.region) params[SEARCH_PARAMS.region] = filters.region;
  if (filters.segment) params[SEARCH_PARAMS.segment] = filters.segment;
  if (filters.minValue !== null) params[SEARCH_PARAMS.minValue] = String(filters.minValue);
  if (filters.maxValue !== null) params[SEARCH_PARAMS.maxValue] = String(filters.maxValue);
  return params;
}
