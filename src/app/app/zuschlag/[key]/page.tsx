import { Metadata } from "next";
import ClosingBoard from "@/components/app/closing/ClosingBoard";
import ClosingDatesForm from "@/components/app/closing/ClosingDatesForm";
import ClosingDisclaimer from "@/components/app/closing/ClosingDisclaimer";
import ClosingListingLink from "@/components/app/closing/ClosingListingLink";
import LockedPanel from "@/components/app/listing/LockedPanel";
import ListingNotFound from "@/components/app/listing/ListingNotFound";
import AppMain from "@/components/app/shell/AppMain";
import AppPageHeader from "@/components/app/shell/AppPageHeader";
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
      <p className="mt-2 font-mono text-[11px] tracking-[0.1em] text-muted uppercase">{subtitle}</p>
      <ClosingDisclaimer text={Tasks.Disclaimer} />
      {viewer.plan === "free" ? (
        <div className="mt-8">
          <LockedPanel title={Tasks.Locked.Title} body={Tasks.Locked.Body} cta={Tasks.Locked.Cta} />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
          <ClosingBoard
            listingKey={listing.key}
            market={listing.market}
            dates={closingCase?.dates ?? { awardDate: null, distributionDate: null, taxNoticeDate: null, handoverDate: null }}
            done={closingCase?.done ?? []}
            now={viewer.now}
            labels={Tasks}
            locale={locale}
          />
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <ClosingDatesForm listingKey={listing.key} market={listing.market} dates={closingCase?.dates ?? null} labels={Tasks.Dates} />
          </aside>
        </div>
      )}
    </AppMain>
  );
}
