import { Metadata } from "next";
import ClosingBoard from "@/components/app/closing/ClosingBoard";
import ClosingDatesForm from "@/components/app/closing/ClosingDatesForm";
import ClosingDisclaimer from "@/components/app/closing/ClosingDisclaimer";
import ClosingListingLink from "@/components/app/closing/ClosingListingLink";
import LockedPanel from "@/components/app/listing/LockedPanel";
import ListingNotFound from "@/components/app/listing/ListingNotFound";
import AppMain from "@/components/app/shell/AppMain";
import AppPageHeader from "@/components/app/shell/AppPageHeader";
import PageAside from "@/components/ui/PageAside";
import PageNote from "@/components/ui/PageNote";
import PageSplitGrid from "@/components/ui/PageSplitGrid";
import PageStack from "@/components/ui/PageStack";
import { APP_MAIN_ID, listingHref } from "@/lib/appConstants";
import { getAppPageContext } from "@/lib/appPage";
import { closingHref } from "@/lib/closing/closingConstants";
import { getAddressLine, getPlaceTitle } from "@/lib/listingLabels";
import { ClosingCaseService } from "@/services/ClosingCaseService";
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
  return { ...MetaTagService.CreateMetaTags(labels.MetaTags.Tasks), robots: { index: false, follow: false } };
}

export default async function ClosingTasksPage({ params }: PageProps<"/app/zuschlag/[key]">) {
  const key = decodeURIComponent((await params).key);
  const { viewer, app, locale } = await getAppPageContext(closingHref(key));
  const { Tasks } = getClosingTranslation(locale);
  const listing = await ListingService.getByKey(viewer.market, key);

  if (!listing) {
    return (
      <AppMain id={APP_MAIN_ID}>
        <ListingNotFound title={app.Listing.NotFound.Title} body={app.Listing.NotFound.Body} backLabel={app.Listing.Back} />
      </AppMain>
    );
  }

  const closingCase = await ClosingCaseService.get(viewer.id, listing.key);
  const subtitle = [listing.authority, listing.fileNo, getAddressLine(listing)].filter(Boolean).join(" · ");

  return (
    <AppMain id={APP_MAIN_ID}>
      <ClosingListingLink href={listingHref(listing.key)} label={Tasks.Back} />
      <AppPageHeader eyebrow={`${Tasks.Kicker} · ${getPlaceTitle(listing)}`} title={Tasks.Title} lead={Tasks.Lead[listing.market]} />
      <PageNote variant="monoKicker" text={subtitle} />
      <ClosingDisclaimer text={Tasks.Disclaimer} />
      {viewer.plan === "free" ? (
        <PageStack variant="top8">
          <LockedPanel title={Tasks.Locked.Title} body={Tasks.Locked.Body} cta={Tasks.Locked.Cta} />
        </PageStack>
      ) : (
        <PageSplitGrid variant="wideLeftCompact">
          <ClosingBoard
            listingKey={listing.key}
            market={listing.market}
            dates={closingCase?.dates ?? { awardDate: null, distributionDate: null, taxNoticeDate: null, handoverDate: null }}
            done={closingCase?.done ?? []}
            now={viewer.now}
            labels={Tasks}
            locale={locale}
          />
          <PageAside variant="sticky">
            <ClosingDatesForm listingKey={listing.key} market={listing.market} dates={closingCase?.dates ?? null} labels={Tasks.Dates} />
          </PageAside>
        </PageSplitGrid>
      )}
    </AppMain>
  );
}
