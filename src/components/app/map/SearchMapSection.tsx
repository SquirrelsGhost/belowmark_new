import Link from "next/link";
import MapLegend from "@/components/app/map/MapLegend";
import MapPlaceDot from "@/components/app/map/MapPlaceDot";
import MapRegionDefs from "@/components/app/map/MapRegionDefs";
import MapRegionShape from "@/components/app/map/MapRegionShape";
import MapSources from "@/components/app/map/MapSources";
import MarketMap from "@/components/app/map/MarketMap";
import { fill } from "@/lib/appFormat";
import { insetFrames } from "@/lib/geo";
import { LocaleOption } from "@/lib/constants";
import { buildMapView } from "@/lib/mapEntries";
import { IAppTranslation } from "@/translations/app/IAppTranslation";
import { ListingFilters, ListingSearchResult, MarketGeo } from "@/types/listing.types";

interface SearchMapSectionProps {
  geo: MarketGeo;
  result: ListingSearchResult;
  filters: ListingFilters;
  app: IAppTranslation;
  locale: LocaleOption;
  isLocked: boolean;
}

/** The map view of the search: region shading, one dot per postcode or province. */
export default function SearchMapSection({ geo, result, filters, app, locale, isLocked }: SearchMapSectionProps) {
  const view = buildMapView(geo, result.places, result.regionCounts, filters, result.total, app, locale, isLocked);
  const M = app.SearchMap;
  return (
    <MarketMap
      label={app.Views.Map}
      viewBox={view.viewBox}
      hint={geo.country && geo.country !== "DE" && geo.country !== "TR" ? M.HintEurope : M.Hint[geo.market]}
      legend={<MapLegend imminentLabel={M.Imminent} laterLabel={M.Later} sizeLabel={M.Size} />}
      action={
        view.resetHref && (
          <Link href={view.resetHref} className="border-2 border-ink px-3 py-1.5 font-narrow text-xs font-semibold tracking-[0.08em] uppercase hover:bg-ink hover:text-paper-bright">
            ← {M.AllRegions}
          </Link>
        )
      }
      footer={
        <MapSources
          label={M.Basis}
          sources={geo.sources}
          note={view.offMap > 0 ? fill(M.OffMap, { count: new Intl.NumberFormat(locale).format(view.offMap) }) : undefined}
        />
      }
    >
      <MapRegionDefs regions={view.regions} />
      {insetFrames(geo.projection).map(([x, y, width, height]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width={width} height={height} fill="none" stroke="var(--ink)" strokeOpacity={0.45} strokeWidth={1.2} strokeDasharray="6 4" />
          <text x={x + 6} y={y - 6} className="font-mono" fontSize={13} fill="var(--ink-soft)">
            {M.Inset}
          </text>
        </g>
      ))}
      <g>
        {view.regions.map((region) => (
          <MapRegionShape key={region.code} {...region} />
        ))}
      </g>
      <g>
        {view.places.map((place) => (
          <MapPlaceDot key={place.id} {...place} />
        ))}
      </g>
    </MarketMap>
  );
}
