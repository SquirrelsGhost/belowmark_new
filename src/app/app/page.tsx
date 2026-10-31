import { Metadata } from "next";
import SearchHotkey from "@/components/app/search/SearchHotkey";
import SearchResultsContent from "@/components/app/search/SearchResultsContent";
import AppMain from "@/components/app/shell/AppMain";
import AppPageHeader from "@/components/app/shell/AppPageHeader";
import AppSectionSuspense from "@/components/app/shell/AppSectionSuspense";
import { APP_MAIN_ID, APP_ROUTES } from "@/lib/appConstants";
import { fill } from "@/lib/appFormat";
import { appMetadata, getAppPageContext } from "@/lib/appPage";
import { parseFilters } from "@/lib/listingFilters";
import { sanitizeFiltersForPlan } from "@/lib/sicherheit/antiScrapingRules";
import { ListingFilters } from "@/types/listing.types";

// Reads the session cookie and the search parameters on every request.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return appMetadata((app) => app.MetaTags.Search);
}

export default async function SearchPage({ searchParams }: PageProps<"/app">) {
  const { viewer, app, locale, meta } = await getAppPageContext(APP_ROUTES.search);
  const isLocked = viewer.plan === "free";
  const requested = sanitizeFiltersForPlan(parseFilters(await searchParams), isLocked);
  // One board per country. Only an account holding several countries can switch; a country outside the account is ignored.
  const country = requested.country && viewer.countries.includes(requested.country) ? requested.country : viewer.country;
  const filters: ListingFilters = { ...requested, country: country !== viewer.country ? country : "" };
  const market = viewer.market;
  const { Search } = app;
  const countryText = { country: Search.Countries[country].Name, source: Search.Countries[country].Source };
  const eyebrow = fill(Search.CountryEyebrow, countryText);
  const lead = market === "TR" ? Search.Lead.TR : fill(Search.CountryLead, countryText);

  return (
    <AppMain id={APP_MAIN_ID}>
      <SearchHotkey targetId="filter-q" />
      <AppPageHeader eyebrow={eyebrow} title={Search.Title} lead={lead} />
      <AppSectionSuspense variant="search">
        <SearchResultsContent
          viewer={viewer}
          country={country}
          filters={filters}
          app={app}
          locale={locale}
          generatedAt={meta.generatedAt}
        />
      </AppSectionSuspense>
    </AppMain>
  );
}
