import FilterActions from "@/components/app/search/FilterActions";
import FilterCheckbox from "@/components/app/search/FilterCheckbox";
import FilterField from "@/components/app/search/FilterField";
import FilterInput from "@/components/app/search/FilterInput";
import FilterPanel from "@/components/app/search/FilterPanel";
import FilterScope from "@/components/app/search/FilterScope";
import FilterSelect from "@/components/app/search/FilterSelect";
import { SEARCH_PARAMS } from "@/lib/appConstants";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { hasActiveFilters } from "@/lib/listingFilters";
import { countryOptions, preservedParams, regionOptions, scopeOptions, segmentOptions, valueOptions } from "@/lib/searchOptions";
import { IAppTranslation } from "@/translations/app/IAppTranslation";
import { DachCountry, ListingFilters, RegionFacet } from "@/types/listing.types";

interface SearchFilterPanelProps {
  filters: ListingFilters;
  regions: RegionFacet[];
  countryCounts?: Record<DachCountry, number>;
  market: MarketCode;
  app: IAppTranslation;
  locale: LocaleOption;
}

/** The register on the left of the search: every filter, submitted as a GET form. */
export default function SearchFilterPanel({ filters, regions, countryCounts, market, app, locale }: SearchFilterPanelProps) {
  const F = app.Search.Filters;
  return (
    <FilterPanel title={F.Title} hidden={preservedParams(filters)}>
      <FilterField label={F.Query} htmlFor="filter-q">
        <FilterInput id="filter-q" name={SEARCH_PARAMS.query} type="search" value={filters.query} placeholder={F.QueryPlaceholder[market]} />
      </FilterField>
      <FilterField label={F.Scope}>
        <FilterScope name={SEARCH_PARAMS.scope} value={filters.scope} options={scopeOptions(app)} />
      </FilterField>
      {market === "DE" && (
        <FilterField label={locale === "tr" ? "Ülke (DACH)" : "Land (DACH)"} htmlFor="filter-country">
          <FilterSelect
            id="filter-country"
            name={SEARCH_PARAMS.country}
            value={filters.country ?? ""}
            options={countryOptions(countryCounts, locale)}
          />
        </FilterField>
      )}
      <FilterField label={F.Region[market]} htmlFor="filter-region">
        <FilterSelect id="filter-region" name={SEARCH_PARAMS.region} value={filters.region} options={regionOptions(regions, F.AllRegions, locale)} />
      </FilterField>
      <FilterField label={F.Segment} htmlFor="filter-segment">
        <FilterSelect id="filter-segment" name={SEARCH_PARAMS.segment} value={filters.segment} options={segmentOptions(app)} />
      </FilterField>
      <FilterField label={F.Value[market]}>
        <div className="grid grid-cols-2 gap-2">
          <FilterSelect id="filter-min" name={SEARCH_PARAMS.minValue} value={String(filters.minValue ?? "")} options={valueOptions(market, F.Min, locale)} ariaLabel={`${F.Value[market]} ${F.Min}`} />
          <FilterSelect id="filter-max" name={SEARCH_PARAMS.maxValue} value={String(filters.maxValue ?? "")} options={valueOptions(market, F.Max, locale)} ariaLabel={`${F.Value[market]} ${F.Max}`} />
        </div>
      </FilterField>
      <FilterField label={`${F.From} / ${F.To}`}>
        <div className="grid grid-cols-2 gap-2">
          <FilterInput id="filter-from" name={SEARCH_PARAMS.from} type="date" value={filters.from} ariaLabel={F.From} />
          <FilterInput id="filter-to" name={SEARCH_PARAMS.to} type="date" value={filters.to} ariaLabel={F.To} />
        </div>
      </FilterField>
      <FilterCheckbox name={SEARCH_PARAMS.withCancelled} label={F.WithCancelled} checked={filters.withCancelled} />
      <FilterActions applyLabel={F.Apply} resetLabel={F.Reset} canReset={hasActiveFilters(filters)} />
    </FilterPanel>
  );
}
