import { Metadata } from "next";
import SearchAlertSave from "@/components/app/alerts/SearchAlertSave";
import RegionLocator from "@/components/app/map/RegionLocator";
import SearchMapSection from "@/components/app/map/SearchMapSection";
import AppMain from "@/components/app/shell/AppMain";
import AppPageHeader from "@/components/app/shell/AppPageHeader";
import HearingCalendar from "@/components/app/search/HearingCalendar";
import HearingCalendarWeek from "@/components/app/search/HearingCalendarWeek";
import ListingList from "@/components/app/search/ListingList";
import ListingRow from "@/components/app/search/ListingRow";
import Pagination from "@/components/app/search/Pagination";
import QuickFilterChip from "@/components/app/search/QuickFilterChip";
import QuickFilters from "@/components/app/search/QuickFilters";
import SearchEmpty from "@/components/app/search/SearchEmpty";
import SearchFilterPanel from "@/components/app/search/SearchFilterPanel";
import SearchHotkey from "@/components/app/search/SearchHotkey";
import SearchToolbar from "@/components/app/search/SearchToolbar";
import SearchViewSwitch from "@/components/app/search/SearchViewSwitch";
import SortLink from "@/components/app/search/SortLink";
import PageSection from "@/components/ui/PageSection";
import PageSplitGrid from "@/components/ui/PageSplitGrid";
import { APP_MAIN_ID, APP_ROUTES } from "@/lib/appConstants";
import { fill } from "@/lib/appFormat";
import { appMetadata, getAppPageContext } from "@/lib/appPage";
import { projectPoint } from "@/lib/geo";
import { parseFilters, searchHref, SORT_KEYS } from "@/lib/listingFilters";
import { getHearingStatus, isNewListing } from "@/lib/listingMath";
import { calendarEntries, quickFilters } from "@/lib/searchOptions";
import { GeoService } from "@/services/GeoService";
import { ListingService } from "@/services/ListingService";
import { WatchlistService } from "@/services/WatchlistService";

// Reads the session cookie and the search parameters on every request.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return appMetadata((app) => app.MetaTags.Search);
}

export default async function SearchPage({ searchParams }: PageProps<"/app">) {
  const { viewer, app, locale, meta } = await getAppPageContext(APP_ROUTES.search);
  const filters = parseFilters(await searchParams);
  const market = viewer.market;
  const [result, saved, geo, sprite] = await Promise.all([
    ListingService.search(market, filters, viewer.now),
    WatchlistService.keys(viewer.id),
    GeoService.getMarket(market),
    GeoService.getLocatorSprite(market),
  ]);
  const { Search, Row, Segments, Views } = app;
  const isLocked = viewer.plan === "free";
  const isMap = filters.view === "map";
  const count = new Intl.NumberFormat(locale).format(result.total);
  const { width, height } = geo.projection;

  return (
    <AppMain id={APP_MAIN_ID}>
      <SearchHotkey targetId="filter-q" />
      <AppPageHeader eyebrow={Search.Eyebrow[market]} title={Search.Title} lead={Search.Lead[market]} />

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
        <SearchFilterPanel filters={filters} regions={result.regions} market={market} app={app} locale={locale} />

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
                  isNew={isNewListing(listing, meta.generatedAt)}
                  isLocked={isLocked}
                  locator={
                    <RegionLocator
                      sprite={sprite.href}
                      width={width}
                      height={height}
                      regionCode={listing.regionCode}
                      point={listing.geo ? projectPoint(geo.projection, listing.geo.lat, listing.geo.lng) : null}
                      label={fill(app.Location.Locator, { region: listing.region ?? "" })}
                      className={market === "TR" ? "w-24" : "w-14"}
                    />
                  }
                />
              ))}
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
    </AppMain>
  );
}
