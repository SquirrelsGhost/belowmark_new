import BidderFileButton from "@/components/app/bidding/BidderFileButton";
import BidLimitCalculator from "@/components/app/bidding/BidLimitCalculator";
import ComparablesPanel from "@/components/app/bidding/ComparablesPanel";
import LockedPanel from "@/components/app/listing/LockedPanel";
import { formatArea } from "@/lib/appFormat";
import { bidderFileHref, getBidContext } from "@/lib/bidding/bidContext";
import { LocaleOption } from "@/lib/constants";
import { VERDICT_ANCHORS } from "@/lib/verdict/verdictConstants";
import { ComparablesService } from "@/services/ComparablesService";
import { IAppTranslation } from "@/translations/app/IAppTranslation";
import { IBiddingTranslation } from "@/translations/bidding/IBiddingTranslation";
import { Listing } from "@/types/listing.types";

interface ListingBiddingSectionProps {
  listing: Listing;
  labels: IBiddingTranslation;
  locked: IAppTranslation["Listing"]["Locked"];
  locale: LocaleOption;
  isLocked: boolean;
  snapshotDate: string;
}

/** The decision block of the Aktenblatt: bid limit, comparison values, and the bidder file. */
export default async function ListingBiddingSection({ listing, labels, locked, locale, isLocked, snapshotDate }: ListingBiddingSectionProps) {
  const { Section } = labels;
  const context = getBidContext(listing);
  const comparables = await ComparablesService.getForListing(listing, snapshotDate);
  const tr = listing.tr;
  const noticeArea = tr?.buildingAreaM2 ?? null;

  return (
    <section id={VERDICT_ANCHORS.limit} aria-label={Section.Title} className="mt-14 scroll-mt-24 flex flex-col gap-8 border-t-2 border-ink pt-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.16em] text-signal uppercase">{Section.Eyebrow}</p>
          <h2 className="font-display text-4xl sm:text-5xl">{Section.Title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{Section.Lead}</p>
        </div>
        {!isLocked && <BidderFileButton href={bidderFileHref(listing.key, true)} label={labels.File.Button} hint={labels.File.ButtonHint} />}
      </div>
      {isLocked || !context ? (
        isLocked && <LockedPanel title={locked.Title} body={locked.Body} cta={locked.Cta} />
      ) : (
        <BidLimitCalculator listingId={listing.key} context={context} labels={labels.Limit} locale={locale} noticeAreaM2={noticeArea === null ? null : formatArea(noticeArea, locale)} />
      )}
      {!isLocked && <ComparablesPanel listingId={listing.key} comparables={comparables} labels={labels.Comparables} market={listing.market} locale={locale} />}
    </section>
  );
}
