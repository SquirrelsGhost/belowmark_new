import { Metadata } from "next";
import OwnResultsList from "@/components/app/closing/OwnResultsList";
import PriceStatsMethod from "@/components/app/closing/PriceStatsMethod";
import PriceStatsTable from "@/components/app/closing/PriceStatsTable";
import AppMain from "@/components/app/shell/AppMain";
import AppPageHeader from "@/components/app/shell/AppPageHeader";
import PageSplitGrid from "@/components/ui/PageSplitGrid";
import PageStack from "@/components/ui/PageStack";
import { APP_MAIN_ID } from "@/lib/appConstants";
import { getAppPageContext } from "@/lib/appPage";
import { CLOSING_ROUTES } from "@/lib/closing/closingConstants";
import { buildPriceStats } from "@/lib/closing/priceStats";
import { HearingResultService } from "@/services/HearingResultService";
import { ListingService } from "@/services/ListingService";
import { MetaTagService } from "@/services/MetaTagService";
import { TranslationService } from "@/services/TranslationService";
import { ClosingTranslations, getClosingTranslation } from "@/translations/closing/ClosingTranslations";

// Reads the session cookie on every request.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const labels = ClosingTranslations[await TranslationService.GetUserLocale()];
  return { ...MetaTagService.CreateMetaTags(labels.MetaTags.Results), robots: { index: false, follow: false } };
}

export default async function HearingResultsPage() {
  const { viewer, app, locale, meta } = await getAppPageContext(CLOSING_ROUTES.results);
  const { Results, Result } = getClosingTranslation(locale);
  const [samples, own] = await Promise.all([HearingResultService.samples(viewer.market), HearingResultService.listOwn(viewer.id, viewer.market)]);
  const regionNames = new Map(meta.states.map((state) => [state.code, state.name]));
  const stats = buildPriceStats(viewer.market, samples, regionNames, Results.OtherRegion);
  const ownRows = await Promise.all(own.map(async (entry) => ({ entry, listing: await ListingService.getByKey(viewer.market, entry.listingKey) })));

  return (
    <AppMain id={APP_MAIN_ID}>
      <AppPageHeader eyebrow={Results.Kicker} title={Results.Title} lead={Results.Lead} />
      <PageSplitGrid variant="wideLeft">
        <PageStack variant="col8Min">
          <PriceStatsTable stats={stats} labels={Results} segments={app.Segments} locale={locale} isLocked={viewer.plan === "free"} />
          <PriceStatsMethod title={Results.Method.Title} items={Results.Method.Items} />
        </PageStack>
        <OwnResultsList rows={ownRows} labels={Results.Own} outcomes={Result.Outcomes} market={viewer.market} locale={locale} />
      </PageSplitGrid>
    </AppMain>
  );
}
