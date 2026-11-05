import SearchAlertSave from "@/components/app/alerts/SearchAlertSave";
import QuotaExceededNotice from "@/components/app/listing/QuotaExceededNotice";
import RegionLocator from "@/components/app/map/RegionLocator";
import SearchMapSection from "@/components/app/map/SearchMapSection";
import HearingCalendar from "@/components/app/search/HearingCalendar";
import HearingCalendarWeek from "@/components/app/search/HearingCalendarWeek";
import HoneypotTrapRow from "@/components/app/search/HoneypotTrapRow";
import ListingList from "@/components/app/search/ListingList";
import ListingRow from "@/components/app/search/ListingRow";
import Pagination from "@/components/app/search/Pagination";
import QuickFilterChip from "@/components/app/search/QuickFilterChip";
import QuickFilters from "@/components/app/search/QuickFilters";
import SearchEmpty from "@/components/app/search/SearchEmpty";
import SearchFilterPanel from "@/components/app/search/SearchFilterPanel";
import SearchToolbar from "@/components/app/search/SearchToolbar";
import SearchViewSwitch from "@/components/app/search/SearchViewSwitch";
import SortLink from "@/components/app/search/SortLink";
import PageSection from "@/components/ui/PageSection";
import PageSplitGrid from "@/components/ui/PageSplitGrid";
import { fill } from "@/lib/appFormat";
import { LocaleOption } from "@/lib/constants";
import { projectPoint } from "@/lib/geo";
import { searchHref, SORT_KEYS } from "@/lib/listingFilters";
import { getHearingStatus, isNewListing } from "@/lib/listingMath";
import { calendarEntries, quickFilters } from "@/lib/searchOptions";
import { buildHoneypotListingKey, redactSearchResultForFreePlan } from "@/lib/sicherheit/antiScrapingRules";
import { AppViewer } from "@/services/AppSessionService";
import { GeoService } from "@/services/GeoService";
import { ListingService } from "@/services/ListingService";
import { AntiScrapingService } from "@/services/sicherheit/AntiScrapingService";
import { WatchlistService } from "@/services/WatchlistService";
import { IAppTranslation } from "@/translations/app/IAppTranslation";
import { ListingCountry, ListingFilters } from "@/types/listing.types";

interface SearchResultsContentProps {
  viewer: AppViewer;
  country: ListingCountry;
  filters: ListingFilters;
  app: IAppTranslation;
  locale: LocaleOption;
  generatedAt: string;
}

/**
 * Streams the hearing calendar, filter panel, and listing results inside SearchPage.
 */
export default async function SearchResultsContent({
  viewer,
  country,
  filters,
  app,
  locale,
  generatedAt,
}: SearchResultsContentProps) {
  const isLocked = viewer.plan === "free";
  const market = viewer.market;
  const { Search, Row, Segments, Views } = app;

  const quota = await AntiScrapingService.enforceSearchQuota(viewer.id, isLocked);
  if (!quota.allowed) {
    return <QuotaExceededNotice locale={locale} retryAfterMinutes={quota.retryAfterMinutes} isLocked={isLocked} />;
  }

  const [rawResult, saved, geo, sprite] = await Promise.all([
    ListingService.search(country, filters, viewer.now),
    WatchlistService.keys(viewer.id),
    GeoService.getCountry(country),
    GeoService.getLocatorSprite(country),
  ]);
  const result = isLocked ? redactSearchResultForFreePlan(rawResult) : rawResult;
  const isMap = filters.view === "map";
  const count = new Intl.NumberFormat(locale).format(result.total);
  const { width, height } = geo.projection;

  return (
    <>
      <HearingCalendar
        title={Search.Calendar.Title}
        hint={Search.Calendar.Hint}
        clearLabel={Search.Calendar.Clear}
        clearHref={filters.from || filters.to ? searchHref(filters, { from: "", to: "" }) : undefined}
      >
        {calendarEntries(result.calendar, filters, app, locale).map(({ key, ...week }) => (
          <HearingCalendarWeek key={key} {...week} selectedLabel={Search.Calendar.Selected} />
        ))}
      </HearingCalendar>

      <PageSplitGrid variant="search">
        <SearchFilterPanel filters={filters} regions={result.regions} country={country} countries={viewer.countries} market={market} app={app} locale={locale} />

        <PageSection label={Search.Title}>
          <SearchToolbar
            summary={result.total === 1 ? Search.SummaryOne : fill(Search.Summary, { count })}
            detail={result.nextSevenDays > 0 && filters.scope !== "past" ? fill(Search.NextSevenDays, { count: result.nextSevenDays }) : undefined}
            sortLabel={Search.SortLabel}
            view={
              <SearchViewSwitch
                label={Views.Label}
                options={[
                  { href: searchHref(filters, { view: "list" }), label: Views.List, icon: "list", isActive: !isMap },
                  { href: searchHref(filters, { view: "map" }), label: Views.Map, icon: "map", isActive: isMap },
                ]}
              />
            }
          >
            {!isMap && SORT_KEYS.map((sort) => <SortLink key={sort} href={searchHref(filters, { sort })} label={Search.Sorts[sort]} isActive={filters.sort === sort} />)}
          </SearchToolbar>

          <QuickFilters label={app.Quick.Label}>
            {quickFilters(filters, app, market, locale, viewer.now, result).map(({ key, ...chip }) => (
              <QuickFilterChip key={key} {...chip} />
            ))}
          </QuickFilters>

          <SearchAlertSave filters={filters} regions={result.regions} market={market} segments={Segments} locale={locale} />

          {isMap && <SearchMapSection geo={geo} result={result} filters={filters} app={app} locale={locale} isLocked={isLocked} />}
          {!isMap && result.items.length === 0 && <SearchEmpty title={Search.Empty.Title} body={Search.Empty.Body} resetLabel={Search.Empty.Reset} />}

          {!isMap && result.items.length > 0 && (
            <ListingList label={Search.Title}>
              {result.items.map((listing) => (
                <ListingRow
                  key={listing.key}
                  listing={listing}
                  status={getHearingStatus(listing, viewer.now)}
                  labels={Row}
                  segmentLabel={Segments[listing.segment]}
                  locale={locale}
                  isSaved={saved.has(listing.key)}
                  isNew={isNewListing(listing, generatedAt)}
                  isLocked={isLocked}
                  locator={
                    geo.regions.length > 0 && (
                      <RegionLocator
                        sprite={sprite.href}
                        width={width}
                        height={height}
                        frame={geo.frame}
                        regionCode={listing.regionCode}
                        point={listing.geo ? projectPoint(geo.projection, listing.geo.lat, listing.geo.lng) : null}
                        label={fill(app.Location.Locator, { region: listing.region ?? "" })}
                        className={market === "TR" ? "w-24" : "w-14"}
                      />
                    )
                  }
                />
              ))}
              <HoneypotTrapRow honeypotKey={buildHoneypotListingKey(market, viewer.now)} />
            </ListingList>
          )}

          {!isMap && result.pageCount > 1 && (
            <Pagination
              label={Search.Pagination.Label}
              pageLabel={fill(Search.Pagination.Page, { page: result.page, count: result.pageCount })}
              previousLabel={Search.Pagination.Previous}
              nextLabel={Search.Pagination.Next}
              previousHref={result.page > 1 ? searchHref(filters, { page: result.page - 1 }) : undefined}
              nextHref={result.page < result.pageCount ? searchHref(filters, { page: result.page + 1 }) : undefined}
            />
          )}
        </PageSection>
      </PageSplitGrid>
    </>
  );
}
