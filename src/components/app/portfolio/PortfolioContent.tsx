import LockedPanel from "@/components/app/listing/LockedPanel";
import PortfolioBoard from "@/components/app/portfolio/PortfolioBoard";
import PortfolioNote from "@/components/app/portfolio/PortfolioNote";
import WatchlistEmpty from "@/components/app/watchlist/WatchlistEmpty";
import PageStack from "@/components/ui/PageStack";
import { fill } from "@/lib/appFormat";
import { LocaleOption } from "@/lib/constants";
import { AppViewer } from "@/services/AppSessionService";
import { PortfolioService } from "@/services/PortfolioService";
import { IAppTranslation } from "@/translations/app/IAppTranslation";
import { IPortfolioTranslation } from "@/translations/portfolio/IPortfolioTranslation";
import { getVerdictTranslation } from "@/translations/verdict/VerdictTranslations";

interface PortfolioContentProps {
  viewer: AppViewer;
  app: IAppTranslation;
  locale: LocaleOption;
  labels: IPortfolioTranslation;
}

/**
 * Async portfolio board content that streams in while the page header is already visible.
 */
export default async function PortfolioContent({ viewer, app, locale, labels }: PortfolioContentProps) {
  const { Page } = labels;
  const isLocked = viewer.plan === "free";

  if (isLocked) {
    return (
      <PageStack variant="top10">
        <LockedPanel title={Page.Locked.Title} body={Page.Locked.Body} cta={app.Listing.Locked.Cta} />
      </PageStack>
    );
  }

  const { sources, missing } = await PortfolioService.getSources(viewer, app);
  const { States } = getVerdictTranslation(locale);
  const verdictNames = { go: States.go.Stamp, open: States.open.Stamp, stop: States.stop.Stamp, none: States.none.Stamp };

  return (
    <>
      {missing.length > 0 && <PortfolioNote text={fill(Page.Missing, { count: missing.length })} />}
      {sources.length === 0 && <WatchlistEmpty title={Page.Empty.Title} body={Page.Empty.Body} cta={Page.Empty.Cta} />}
      {sources.length > 0 && (
        <PortfolioBoard
          sources={sources}
          labels={labels}
          verdictNames={verdictNames}
          market={viewer.market}
          locale={locale}
          today={new Date(viewer.now).toISOString().slice(0, 10)}
        />
      )}
    </>
  );
}
