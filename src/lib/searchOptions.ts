import type { FilterOption } from "@/components/app/search/FilterSelect";
import { DAY_MS, MARKET_TIME_ZONES, SEARCH_PARAMS, VALUE_PRESETS, VIEW_VALUES } from "@/lib/appConstants";
import { fill, formatCompactMoney, formatDayMonth, formatMoney, isoWeek } from "@/lib/appFormat";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { SCOPE_KEYS, SEGMENT_KEYS, searchHref } from "@/lib/listingFilters";
import { IAppTranslation } from "@/translations/app/IAppTranslation";
import { CalendarWeek, ListingFilters, RegionFacet } from "@/types/listing.types";

/** Select options and calendar entries of the search page, built from facets and strings. */

export function regionOptions(regions: RegionFacet[], allLabel: string, locale: LocaleOption): FilterOption[] {
  const count = new Intl.NumberFormat(locale);
  return [{ value: "", label: allLabel }, ...regions.map((region) => ({ value: region.code, label: `${region.name} (${count.format(region.count)})` }))];
}

export function segmentOptions(app: IAppTranslation): FilterOption[] {
  return [{ value: "", label: app.Search.Filters.AllSegments }, ...SEGMENT_KEYS.map((key) => ({ value: key, label: app.Segments[key] }))];
}

export function valueOptions(market: MarketCode, anyLabel: string, locale: LocaleOption): FilterOption[] {
  return [{ value: "", label: anyLabel }, ...VALUE_PRESETS[market].map((value) => ({ value: String(value), label: formatCompactMoney(value, market, locale) }))];
}

export function scopeOptions(app: IAppTranslation): FilterOption[] {
  return SCOPE_KEYS.map((key) => ({ value: key, label: app.Search.Filters.Scopes[key] }));
}

export interface CalendarEntry {
  key: string;
  href: string;
  weekLabel: string;
  dateLabel: string;
  count: number;
  share: number;
  isSelected: boolean;
  isCurrent: boolean;
}

/** Each week links to "only this week"; clicking the selected week again clears the range. */
export function calendarEntries(weeks: CalendarWeek[], filters: ListingFilters, app: IAppTranslation, locale: LocaleOption): CalendarEntry[] {
  const max = Math.max(1, ...weeks.map((week) => week.count));
  return weeks.map((week, index) => {
    const isSelected = filters.from === week.start && filters.to === week.end;
    return {
      key: week.start,
      href: searchHref(filters, isSelected ? { from: "", to: "" } : { from: week.start, to: week.end, scope: "upcoming" }),
      weekLabel: `${app.Search.Calendar.Week} ${isoWeek(week.start)}`,
      dateLabel: formatDayMonth(week.start, locale),
      count: week.count,
      share: week.count / max,
      isSelected,
      isCurrent: index === 0,
    };
  });
}

/** Hidden inputs that keep the sort order when the filter form is submitted. */
export function preservedParams(filters: ListingFilters): Record<string, string> {
  const params: Record<string, string> = {};
  if (filters.sort !== "hearing") params[SEARCH_PARAMS.sort] = filters.sort;
  if (filters.view === "map") params[SEARCH_PARAMS.view] = VIEW_VALUES.map;
  if (filters.onlyOpportunity) params[SEARCH_PARAMS.onlyOpportunity] = "1";
  if (filters.onlyWithDocs) params[SEARCH_PARAMS.onlyWithDocs] = "1";
  return params;
}

export interface QuickFilter {
  key: string;
  label: string;
  href: string;
  isActive: boolean;
}

/** yyyy-mm-dd of `now` plus some days, in the court's time zone. */
function marketDay(now: number, market: MarketCode, plusDays = 0): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: MARKET_TIME_ZONES[market], year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(now + plusDays * DAY_MS));
}

/** Price cap of the "up to" chip: the second value preset of the market. */
const QUICK_CAP = { DE: VALUE_PRESETS.DE[1], TR: VALUE_PRESETS.TR[1] } as const;

/** One-tap filters; tapping an active one takes exactly that filter off again. */
export function quickFilters(
  filters: ListingFilters,
  app: IAppTranslation,
  market: MarketCode,
  locale: LocaleOption,
  now: number,
  counts?: { opportunitiesCount: number; withDocsCount: number },
): QuickFilter[] {
  const today = marketDay(now, market);
  const nf = new Intl.NumberFormat(locale);
  const range = (days: number) => {
    const to = marketDay(now, market, days - 1);
    const isActive = filters.from === today && filters.to === to;
    return { isActive, href: searchHref(filters, isActive ? { from: "", to: "" } : { from: today, to, scope: "upcoming" }) };
  };
  const segment = (key: "house" | "apartment") => {
    const isActive = filters.segment === key;
    return { isActive, href: searchHref(filters, { segment: isActive ? "" : key }) };
  };
  const capActive = filters.maxValue === QUICK_CAP[market];
  const Q = app.Quick;
  const oppSuffix = counts ? ` (${nf.format(counts.opportunitiesCount)})` : "";
  const docSuffix = counts ? ` (${nf.format(counts.withDocsCount)})` : "";
  return [
    {
      key: "opportunity",
      label: `${Q.Opportunity[market]}${oppSuffix}`,
      isActive: filters.onlyOpportunity,
      href: searchHref(filters, { onlyOpportunity: !filters.onlyOpportunity }),
    },
    {
      key: "docs",
      label: `${Q.WithDocs[market]}${docSuffix}`,
      isActive: filters.onlyWithDocs,
      href: searchHref(filters, { onlyWithDocs: !filters.onlyWithDocs }),
    },
    { key: "week", label: Q.ThisWeek, ...range(7) },
    { key: "month", label: Q.NextMonth, ...range(30) },
    { key: "house", label: Q.Houses, ...segment("house") },
    { key: "apartment", label: Q.Apartments, ...segment("apartment") },
    {
      key: "cap",
      label: fill(Q.UpTo, { value: formatMoney(QUICK_CAP[market], market, locale) }),
      isActive: capActive,
      href: searchHref(filters, { maxValue: capActive ? null : QUICK_CAP[market] }),
    },
  ];
}
