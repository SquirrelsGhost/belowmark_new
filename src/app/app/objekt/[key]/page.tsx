import { Metadata } from "next";
import CaveatList from "@/components/app/listing/CaveatList";
import CopyButton from "@/components/app/listing/CopyButton";
import FactRow from "@/components/app/listing/FactRow";
import FactSheet from "@/components/app/listing/FactSheet";
import ListingBackLink from "@/components/app/listing/ListingBackLink";
import ListingHeader from "@/components/app/listing/ListingHeader";
import ListingHearing from "@/components/app/listing/ListingHearing";
import ListingNotFound from "@/components/app/listing/ListingNotFound";
import ListingOfficialDetails from "@/components/app/listing/ListingOfficialDetails";
import ListingPurchase from "@/components/app/listing/ListingPurchase";
import NoteForm from "@/components/app/listing/NoteForm";
import PreBidChecklist from "@/components/app/listing/PreBidChecklist";
import CalendarLink from "@/components/app/listing/CalendarLink";
import ListingHistory from "@/components/app/listing/ListingHistory";
import ListingEvidenceSection from "@/components/app/evidence/ListingEvidenceSection";
import ListingPlaceSection from "@/components/app/location/ListingPlaceSection";
import ListingBiddingSection from "@/components/app/bidding/ListingBiddingSection";
import BankFileTeaser from "@/components/app/bankFile/BankFileTeaser";
import ListingClosingSection from "@/components/app/closing/ListingClosingSection";
import ClientShareArea from "@/components/app/clientShare/ClientShareArea";
import ListingMediaSection from "@/components/app/media/ListingMediaSection";
import ListingReportArea from "@/components/app/report/ListingReportArea";
import ListingVerdictSection from "@/components/app/verdict/ListingVerdictSection";
import ListingTeamSection from "@/components/app/team/ListingTeamSection";
import ListingDeadlineSection from "@/components/app/deadlines/ListingDeadlineSection";
import AppMain from "@/components/app/shell/AppMain";
import TrListingExtras from "@/components/app/tr/TrListingExtras";
import WatchButton from "@/components/app/watchlist/WatchButton";
import Stamp from "@/components/ui/Stamp";
import { APP_MAIN_ID, APP_ROUTES, listingHref } from "@/lib/appConstants";
import { fill, formatArea, formatHearing } from "@/lib/appFormat";
import { appMetadata, getAppPageContext } from "@/lib/appPage";
import { getAddressLine, getPlaceTitle, getStatusLabel } from "@/lib/listingLabels";
import { getHearingStatus, isNewListing } from "@/lib/listingMath";
import { formatDate } from "@/lib/format";
import { GeoService } from "@/services/GeoService";
import { ListingService } from "@/services/ListingService";
import { OfficialPortalService } from "@/services/OfficialPortalService";
import { WatchlistService } from "@/services/WatchlistService";
import { getBiddingTranslation } from "@/translations/bidding/BiddingTranslations";
import { getBankFileTranslation } from "@/translations/bankFile/BankFileTranslations";

// Reads the session cookie on every request.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return appMetadata((app) => app.MetaTags.Listing);
}

export default async function ListingPage({ params }: PageProps<"/app/objekt/[key]">) {
  const key = decodeURIComponent((await params).key);
  const { viewer, t, app, locale, meta } = await getAppPageContext(listingHref(key));
  const { Listing: L, Row } = app;
  const listing = await ListingService.getByKey(viewer.market, key);

  if (!listing) {
    return (
      <AppMain id={APP_MAIN_ID}>
        <ListingNotFound title={L.NotFound.Title} body={L.NotFound.Body} backLabel={L.Back} />
      </AppMain>
    );
  }

  const market = listing.market;
  const [entry, geo, portalDetails] = await Promise.all([
    WatchlistService.get(viewer.id, listing.key),
    GeoService.getMarket(market),
    OfficialPortalService.getDetails(listing),
  ]);
  const status = getHearingStatus(listing, viewer.now);
  const isLocked = viewer.plan === "free";
  const hearingIso = status.round?.start ?? listing.hearingAt;
  const tr = listing.tr;

  return (
    <AppMain id={APP_MAIN_ID}>
      <ListingBackLink label={L.Back} />
      <ListingHeader
        kicker={`${listing.authority} · ${listing.fileNo} · ${listing.region ?? ""}`}
        title={getPlaceTitle(listing)}
        subtitle={[app.Segments[listing.segment], getAddressLine(listing)].filter(Boolean).join(" · ")}
        stamps={
          (listing.cancelled || isNewListing(listing, meta.generatedAt)) && (
            <>
              {listing.cancelled && <Stamp label={Row.Cancelled} tilt="left" />}
              {isNewListing(listing, meta.generatedAt) && <Stamp label={Row.New} tone="verdict" tilt="right" />}
            </>
          )
        }
        aside={
          <ListingHearing
            label={L.Hearing}
            when={
              status.round && status.round.end !== status.round.start
                ? `${formatHearing(status.round.start, market, locale)} – ${formatHearing(status.round.end, market, locale)}`
                : hearingIso
                  ? formatHearing(hearingIso, market, locale)
                  : Row.Unknown
            }
            status={getStatusLabel(status, Row)}
            isActive={status.state === "running" || status.state === "upcoming"}
            rounds={listing.rounds.map((r) => `${fill(Row.Round, { round: r.round })} · ${formatHearing(r.start, market, locale)} – ${formatHearing(r.end, market, locale)}`)}
            roundsLabel={L.Rounds}
          >
            <WatchButton size="large" listingId={listing.key} isSaved={entry !== null} watchLabel={Row.Watch} unwatchLabel={Row.Unwatch} errorLabel={Row.WatchError} />
            <CopyButton text={listing.fileNo} label={L.Sources.CopyFileNo} copiedLabel={L.Sources.Copied} />
            {hearingIso && status.state !== "past" && <CalendarLink href={`${APP_ROUTES.calendar}?key=${encodeURIComponent(listing.key)}`} label={L.Sources.Calendar} />}
          </ListingHearing>
        }
      />

      <ListingVerdictSection listing={listing} userId={viewer.id} locale={locale} isLocked={isLocked} now={viewer.now} lockedCta={L.Locked.Cta} />
      <ListingPurchase listing={listing} t={t} locale={locale} isLocked={isLocked} />
      {market === "TR" && <TrListingExtras listing={listing} app={app} locale={locale} now={viewer.now} isLocked={isLocked} />}
      <ListingBiddingSection listing={listing} labels={getBiddingTranslation(locale)} locked={L.Locked} locale={locale} isLocked={isLocked} snapshotDate={meta.generatedAt} />
      <BankFileTeaser listingKey={listing.key} market={market} labels={getBankFileTranslation(locale).Teaser} isLocked={isLocked} />
      <ListingClosingSection listing={listing} userId={viewer.id} locale={locale} isLocked={isLocked} now={viewer.now} />
      <ListingTeamSection listingKey={listing.key} market={market} userId={viewer.id} locale={locale} />
      <ListingDeadlineSection listing={listing} userId={viewer.id} locale={locale} isLocked={isLocked} now={viewer.now} lockedCta={L.Locked.Cta} />
      <ClientShareArea listingKey={listing.key} locale={locale} isLocked={isLocked} />

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="flex min-w-0 flex-col gap-10">
          <ListingOfficialDetails listing={listing} details={portalDetails} locale={locale} />
          <ListingReportArea listing={listing} userId={viewer.id} locale={locale} isLocked={isLocked} attachments={portalDetails.attachments} />
          <ListingPlaceSection listing={listing} geo={geo} labels={app.Location} />
          <ListingMediaSection listing={listing} labels={app.Media} portalDetails={portalDetails} />
          <ListingEvidenceSection listing={listing} labels={app.Evidence} />
          {listing.history.length > 0 && <ListingHistory title={app.History.Title} hint={app.History.Hint} entries={listing.history} />}
          <CaveatList title={L.Caveats.Title} emptyLabel={L.Caveats.Empty} pointsLabel={(points) => fill(L.Caveats.Points, { points })} caveats={listing.caveats} />
        </div>

        <aside className="flex flex-col gap-6">
          <FactSheet title={L.FactsTitle}>
            <FactRow label={L.FileNo} value={listing.fileNo} notStated={L.NotStated} mono />
            <FactRow label={L.Authority[market]} value={listing.authority} notStated={L.NotStated} />
            <FactRow label={L.Region[market]} value={listing.region} notStated={L.NotStated} />
            <FactRow label={L.Address} value={getAddressLine(listing) || null} notStated={L.NotStated} />
            <FactRow label={L.Segment} value={listing.segmentLabel} notStated={L.NotStated} />
            {tr && <FactRow label={L.Tr.Parcel} value={tr.ada && tr.parsel ? `${tr.ada} / ${tr.parsel}` : null} notStated={L.NotStated} mono />}
            {tr && <FactRow label={L.Tr.LandArea} value={tr.landAreaM2 === null ? null : `${formatArea(tr.landAreaM2, locale)}${tr.isCondo ? ` · ${L.Tr.Condo}` : ""}`} notStated={L.NotStated} mono />}
            {tr && <FactRow label={L.Tr.BuildingArea} value={tr.buildingAreaM2 === null ? null : formatArea(tr.buildingAreaM2, locale)} notStated={L.NotStated} mono />}
            <FactRow label={L.FileYear} value={listing.fileYear ? String(listing.fileYear) : null} notStated={L.NotStated} mono />
            <FactRow label={L.FirstSeen} value={listing.firstSeenAt ? formatDate(listing.firstSeenAt, locale) : null} notStated={L.NotStated} mono />
          </FactSheet>
          <NoteForm listingId={listing.key} note={entry?.note ?? ""} title={L.Note.Title} placeholder={L.Note.Placeholder} saveLabel={L.Note.Save} savedLabel={L.Note.Saved} errorLabel={L.Note.Error} hint={L.Note.Hint} />
          <PreBidChecklist listingId={listing.key} title={L.Checklist.Title} hint={L.Checklist.Hint} progressTemplate={L.Checklist.Progress} items={L.Checklist.Items[market]} />
        </aside>
      </div>
    </AppMain>
  );
}
