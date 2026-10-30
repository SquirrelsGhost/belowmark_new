import { Metadata } from "next";
import LockedPanel from "@/components/app/listing/LockedPanel";
import PortfolioBoard from "@/components/app/portfolio/PortfolioBoard";
import PortfolioNote from "@/components/app/portfolio/PortfolioNote";
import AppMain from "@/components/app/shell/AppMain";
import AppPageHeader from "@/components/app/shell/AppPageHeader";
import WatchlistEmpty from "@/components/app/watchlist/WatchlistEmpty";
import PageCountBadge from "@/components/ui/PageCountBadge";
import PageStack from "@/components/ui/PageStack";
import { APP_MAIN_ID } from "@/lib/appConstants";
import { fill } from "@/lib/appFormat";
import { getAppPageContext } from "@/lib/appPage";
import { PORTFOLIO_ROUTE } from "@/lib/portfolio/portfolioConstants";
import { MetaTagService } from "@/services/MetaTagService";
import { PortfolioService } from "@/services/PortfolioService";
import { TranslationService } from "@/services/TranslationService";
import { getPortfolioTranslation } from "@/translations/portfolio/PortfolioTranslations";
import { getVerdictTranslation } from "@/translations/verdict/VerdictTranslations";

// Reads the session cookie on every request.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const locale = TranslationService.ToLocaleOption(await TranslationService.GetUserLocale());
  return { ...MetaTagService.CreateMetaTags(getPortfolioTranslation(locale).MetaTags), robots: { index: false, follow: false } };
}

export default async function PortfolioPage() {
  const { viewer, app, locale } = await getAppPageContext(PORTFOLIO_ROUTE);
  const labels = getPortfolioTranslation(locale);
  const { Page } = labels;
  const isLocked = viewer.plan === "free";
  const { sources, missing } = isLocked ? { sources: [], missing: [] } : await PortfolioService.getSources(viewer, app);
  const { States } = getVerdictTranslation(locale);
  const verdictNames = { go: States.go.Stamp, open: States.open.Stamp, stop: States.stop.Stamp, none: States.none.Stamp };

  return (
    <AppMain id={APP_MAIN_ID}>
      <AppPageHeader
        eyebrow={Page.Eyebrow}
        title={Page.Title}
        lead={Page.Lead}
        aside={sources.length > 0 && <PageCountBadge label={fill(Page.Count, { count: sources.length })} />}
      />
      {isLocked && (
        <PageStack variant="top10">
          <LockedPanel title={Page.Locked.Title} body={Page.Locked.Body} cta={app.Listing.Locked.Cta} />
        </PageStack>
      )}
      {!isLocked && missing.length > 0 && <PortfolioNote text={fill(Page.Missing, { count: missing.length })} />}
      {!isLocked && sources.length === 0 && <WatchlistEmpty title={Page.Empty.Title} body={Page.Empty.Body} cta={Page.Empty.Cta} />}
      {sources.length > 0 && (
        <PortfolioBoard sources={sources} labels={labels} verdictNames={verdictNames} market={viewer.market} locale={locale} today={new Date(viewer.now).toISOString().slice(0, 10)} />
      )}
    </AppMain>
  );
}
