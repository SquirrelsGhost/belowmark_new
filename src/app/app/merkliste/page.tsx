import { Metadata } from "next";
import AppMain from "@/components/app/shell/AppMain";
import AppPageHeader from "@/components/app/shell/AppPageHeader";
import AppSectionSuspense from "@/components/app/shell/AppSectionSuspense";
import WatchlistContent from "@/components/app/watchlist/WatchlistContent";
import { APP_MAIN_ID, APP_ROUTES, SEARCH_PARAMS, WATCHLIST_COMPARE_VIEW } from "@/lib/appConstants";
import { appMetadata, getAppPageContext } from "@/lib/appPage";

// Reads the session cookie on every request.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return appMetadata((app) => app.MetaTags.Watchlist);
}

export default async function WatchlistPage({ searchParams }: PageProps<"/app/merkliste">) {
  const { viewer, app, locale } = await getAppPageContext(APP_ROUTES.watchlist);
  const isCompare = (await searchParams)[SEARCH_PARAMS.view] === WATCHLIST_COMPARE_VIEW;
  const { Watchlist: W } = app;

  return (
    <AppMain id={APP_MAIN_ID}>
      <AppPageHeader eyebrow={W.Eyebrow} title={W.Title} lead={W.Lead} />
      <AppSectionSuspense variant="list">
        <WatchlistContent viewer={viewer} app={app} locale={locale} isCompare={isCompare} />
      </AppSectionSuspense>
    </AppMain>
  );
}
