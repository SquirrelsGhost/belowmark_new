import { Metadata } from "next";
import BidderFileChecklist from "@/components/bidderFile/BidderFileChecklist";
import BidderFileComparables from "@/components/bidderFile/BidderFileComparables";
import BidderFileFacts from "@/components/bidderFile/BidderFileFacts";
import BidderFileHeader from "@/components/bidderFile/BidderFileHeader";
import BidderFileHearing from "@/components/bidderFile/BidderFileHearing";
import BidderFileLimit from "@/components/bidderFile/BidderFileLimit";
import BidderFileNote from "@/components/bidderFile/BidderFileNote";
import BidderFileMoney from "@/components/bidderFile/BidderFileMoney";
import BidderFileSection from "@/components/bidderFile/BidderFileSection";
import BidderFileSheet from "@/components/bidderFile/BidderFileSheet";
import BidderFileSources from "@/components/bidderFile/BidderFileSources";
import BidderFileToolbar from "@/components/bidderFile/BidderFileToolbar";
import BidderFileVerdictSection from "@/components/bidderFile/BidderFileVerdictSection";
import ListingNotFound from "@/components/app/listing/ListingNotFound";
import LockedPanel from "@/components/app/listing/LockedPanel";
import PageNote from "@/components/ui/PageNote";
import { listingHref } from "@/lib/appConstants";
import { fill } from "@/lib/appFormat";
import { getAppPageContext } from "@/lib/appPage";
import { AUTO_PRINT_PARAM, bidderFileHref, getBidContext } from "@/lib/bidding/bidContext";
import { getFileSources, getHearingLines } from "@/lib/bidding/bidderFile";
import { formatDate } from "@/lib/format";
import { getAddressLine, getPlaceTitle, getStatusLabel } from "@/lib/listingLabels";
import { getHearingStatus } from "@/lib/listingMath";
import { ComparablesService } from "@/services/ComparablesService";
import { ListingService } from "@/services/ListingService";
import { MetaTagService } from "@/services/MetaTagService";
import { TranslationService } from "@/services/TranslationService";
import { WatchlistService } from "@/services/WatchlistService";
import { BiddingTranslations, getBiddingTranslation } from "@/translations/bidding/BiddingTranslations";

// Reads the session cookie on every request.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const labels = BiddingTranslations[await TranslationService.GetUserLocale()];
  return { ...MetaTagService.CreateMetaTags(labels.MetaTags.BidderFile), robots: { index: false, follow: false } };
}

export default async function BidderFilePage({ params, searchParams }: PageProps<"/mappe/[key]">) {
  const key = decodeURIComponent((await params).key);
  const { viewer, app, locale, meta, dataDate } = await getAppPageContext(bidderFileHref(key));
  const labels = getBiddingTranslation(locale);
  const { File } = labels;
  const L = app.Listing;
  const listing = await ListingService.getByKey(viewer.market, key);
  const autoPrint = (await searchParams)[AUTO_PRINT_PARAM] === "1";

  if (!listing || viewer.plan === "free") {
    return (
      <BidderFileSheet lang={locale}>
        {listing ? <LockedPanel title={File.Locked} body={L.Locked.Body} cta={L.Locked.Cta} /> : <ListingNotFound title={L.NotFound.Title} body={L.NotFound.Body} backLabel={L.Back} />}
      </BidderFileSheet>
    );
  }

  const market = listing.market;
  const [entry, comparables] = await Promise.all([WatchlistService.get(viewer.id, listing.key), ComparablesService.getForListing(listing, meta.generatedAt)]);
  const status = getHearingStatus(listing, viewer.now);
  const hearing = getHearingLines(listing, status, locale, app.Row);
  const context = getBidContext(listing);

  return (
    <BidderFileSheet
      lang={locale}
      toolbar={<BidderFileToolbar printLabel={File.Print} printHint={File.PrintHint} backLabel={File.Back} backHref={listingHref(listing.key)} autoPrint={autoPrint} />}
    >
      <BidderFileHeader
        kicker={File.Kicker}
        title={File.Title}
        fileNo={listing.fileNo}
        object={getPlaceTitle(listing)}
        subtitle={[listing.authority, app.Segments[listing.segment], getAddressLine(listing)].filter(Boolean).join(" · ")}
        printedAt={fill(File.PrintedAt, { date: formatDate(new Date(viewer.now).toISOString(), locale) })}
        dataAsOf={fill(File.DataAsOf, { date: dataDate })}
      />
      <BidderFileVerdictSection listing={listing} userId={viewer.id} locale={locale} now={viewer.now} />
      <BidderFileSection number="01" title={File.Sections.hearing}>
        <BidderFileHearing when={hearing.when} status={getStatusLabel(status, app.Row)} rounds={hearing.rounds} notes={File.HearingNotes[market]} />
      </BidderFileSection>
      <BidderFileSection number="02" title={File.Sections.facts}>
        <BidderFileFacts listing={listing} labels={L} locale={locale} />
      </BidderFileSection>
      <BidderFileSection number="03" title={File.Sections.money}>
        <BidderFileMoney listing={listing} labels={L} locale={locale} />
      </BidderFileSection>
      <BidderFileSection number="04" title={File.Sections.limit}>
        {context ? <BidderFileLimit listingId={listing.key} context={context} labels={labels.Limit} noLimit={File.NoLimit} locale={locale} /> : <PageNote variant="mutedSmall" text={L.NotStated} />}
      </BidderFileSection>
      <BidderFileSection number="05" title={File.Sections.comparables}>
        <BidderFileComparables listingId={listing.key} comparables={comparables} labels={labels.Comparables} market={market} locale={locale} />
      </BidderFileSection>
      <BidderFileSection number="06" title={File.Sections.checklist}>
        <BidderFileChecklist listingId={listing.key} items={L.Checklist.Items[market]} doneLabel={File.ChecklistDone} openLabel={File.ChecklistOpen} />
      </BidderFileSection>
      <BidderFileSection number="07" title={File.Sections.note}>
        <BidderFileNote note={entry?.note ?? null} empty={File.NoNote} />
      </BidderFileSection>
      <BidderFileSection number="08" title={File.Sections.sources}>
        <BidderFileSources links={getFileSources(listing, File.SourceNames)} disclaimer={File.Disclaimer} />
      </BidderFileSection>
    </BidderFileSheet>
  );
}
