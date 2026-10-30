import { listingHref } from "@/lib/appConstants";
import { fill, formatCompactMoney, formatDayMonth } from "@/lib/appFormat";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { projectPoint } from "@/lib/geo";
import { searchHref } from "@/lib/listingFilters";
import { IAppTranslation } from "@/translations/app/IAppTranslation";
import { ListingFilters, MapPlace, MarketGeo } from "@/types/listing.types";

/** Everything the search map draws, already projected and linked. */

export interface MapRegionEntry {
  code: string;
  name: string;
  path: string;
  href: string;
  label: string;
  /** 0–1, share of the region with the most results */
  share: number;
  isSelected: boolean;
  /** Another region is selected — this one steps back */
  isDimmed: boolean;
}

export interface MapPlaceEntry {
  id: string;
  cx: number;
  cy: number;
  r: number;
  href: string;
  title: string;
  detail: string;
  isImminent: boolean;
}

export interface MapView {
  viewBox: string;
  /** Link back to the whole country while a region is selected */
  resetHref: string | null;
  regions: MapRegionEntry[];
  places: MapPlaceEntry[];
  /** Results that have no position */
  offMap: number;
}

const PAD_SHARE = 0.08;

/** Zooms onto the selected region; the dots shrink far less than the map grows, so they stay easy to see and hit. */
export function buildMapView(
  geo: MarketGeo,
  places: MapPlace[],
  regionCounts: Record<string, number>,
  filters: ListingFilters,
  total: number,
  app: IAppTranslation,
  locale: LocaleOption,
  isLocked: boolean,
): MapView {
  const market: MarketCode = geo.market;
  const { width, height } = geo.projection;
  const selected = geo.regions.find((region) => region.code === filters.region);
  const [minX, minY, maxX, maxY] = selected?.bbox ?? [0, 0, width, height];
  const padX = selected ? (maxX - minX) * PAD_SHARE : 0;
  const padY = selected ? (maxY - minY) * PAD_SHARE : 0;
  const boxWidth = maxX - minX + 2 * padX;
  const zoom = width / boxWidth;
  const max = Math.max(1, ...Object.values(regionCounts));
  const count = new Intl.NumberFormat(locale);
  const base = market === "TR" ? 3 : 3.2;
  const growth = market === "TR" ? 0.85 : 1.9;

  const regions = geo.regions.map((region) => {
    const n = regionCounts[region.code] ?? 0;
    const isSelected = region.code === filters.region;
    return {
      code: region.code,
      name: region.name,
      path: region.path,
      href: searchHref(filters, { region: isSelected ? "" : region.code }),
      label: fill(app.SearchMap.RegionCount, { region: region.name, count: count.format(n) }),
      share: n / max,
      isSelected,
      isDimmed: Boolean(filters.region) && !isSelected,
    };
  });

  const entries = places.map((place) => {
    const [cx, cy] = projectPoint(geo.projection, place.lat, place.lng);
    const r = (base + Math.sqrt(Math.max(0, place.count)) * growth) / Math.max(0.01, zoom) ** 0.15;
    const isImminent = place.imminent > 0;
    if (place.single) {
      const value = place.single.value === null || isLocked ? "" : ` · ${formatCompactMoney(place.single.value, market, locale)}`;
      const date = place.single.nextDate ? formatDayMonth(place.single.nextDate, locale) : "";
      return {
        id: place.id, cx, cy, r, isImminent,
        href: listingHref(place.single.key),
        title: place.single.title,
        detail: `${app.Segments[place.single.segment]} · ${date}${value}`,
      };
    }
    const changes = place.precision === "postcode" ? { query: place.label.split(" ")[0], view: "list" as const } : { region: place.regionCode ?? "", view: "list" as const };
    return {
      id: place.id, cx, cy, r, isImminent,
      href: searchHref(filters, changes),
      title: place.label,
      detail: fill(app.SearchMap.Several, { count: count.format(place.count) }),
    };
  });

  const onMap = places.reduce((sum, place) => sum + place.count, 0);
  return {
    resetHref: selected ? searchHref(filters, { region: "" }) : null,
    viewBox: `${(minX - padX).toFixed(1)} ${(minY - padY).toFixed(1)} ${boxWidth.toFixed(1)} ${(maxY - minY + 2 * padY).toFixed(1)}`,
    regions,
    // Imminent dots last, so they are drawn on top.
    places: entries.sort((a, b) => Number(a.isImminent) - Number(b.isImminent) || b.r - a.r),
    offMap: Math.max(0, total - onMap),
  };
}
