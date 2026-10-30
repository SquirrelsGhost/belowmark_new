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
import QuotaExceededNotice from "@/components/app/listing/QuotaExceededNotice";
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
import PageAside from "@/components/ui/PageAside";
import PageSplitGrid from "@/components/ui/PageSplitGrid";
import PageStack from "@/components/ui/PageStack";
import Stamp from "@/components/ui/Stamp";
import { APP_MAIN_ID, APP_ROUTES, listingHref } from "@/lib/appConstants";
import { fill, formatArea, formatHearing, formatMoney } from "@/lib/appFormat";
import { appMetadata, getAppPageContext } from "@/lib/appPage";
import { getAddressLine, getPlaceTitle, getStatusLabel } from "@/lib/listingLabels";
import { getHearingStatus, isNewListing } from "@/lib/listingMath";
import { formatDate } from "@/lib/format";
import { GeoService } from "@/services/GeoService";
import { ListingService } from "@/services/ListingService";
import { OfficialPortalService } from "@/services/OfficialPortalService";
import { AntiScrapingService } from "@/services/sicherheit/AntiScrapingService";
import { WatchlistService } from "@/services/WatchlistService";
import {
  emptyPortalDetailsForFreePlan,
  redactListingForFreePlan,
} from "@/lib/sicherheit/antiScrapingRules";
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
  const isLocked = viewer.plan === "free";

  const quota = await AntiScrapingService.enforceDetailQuota(viewer.id, isLocked, key);
  if (!quota.allowed) {
    return (
      <AppMain id={APP_MAIN_ID}>
        <ListingBackLink label={L.Back} />
        <QuotaExceededNotice locale={locale} retryAfterMinutes={quota.retryAfterMinutes} isLocked={isLocked} />
      </AppMain>
    );
  }

  const rawListing = await ListingService.getByKey(viewer.market, key);

  if (!rawListing) {
    return (
      <AppMain id={APP_MAIN_ID}>
        <ListingNotFound title={L.NotFound.Title} body={L.NotFound.Body} backLabel={L.Back} />
      </AppMain>
    );
  }

  const listing = isLocked ? redactListingForFreePlan(rawListing) : rawListing;
  const market = listing.market;
  const [entry, geo, sprite, portalDetails] = await Promise.all([
    WatchlistService.get(viewer.id, listing.key),
    GeoService.getMarket(market),
    GeoService.getLocatorSprite(market),
    isLocked
      ? Promise.resolve(emptyPortalDetailsForFreePlan(listing.sourcePortal ?? ""))
      : OfficialPortalService.getDetails(listing),
  ]);
  const status = getHearingStatus(listing, viewer.now);
  const hearingIso = status.round?.start ?? listing.hearingAt;
  const tr = listing.tr;
  const livingArea = portalDetails.livingAreaM2 ?? listing.livingAreaM2 ?? tr?.buildingAreaM2 ?? null;
  const netArea = portalDetails.netAreaM2 ?? tr?.netAreaM2 ?? null;
  const usableArea = portalDetails.usableAreaM2 ?? listing.usableAreaM2 ?? null;
  const landArea = portalDetails.landAreaM2 ?? listing.landAreaM2 ?? tr?.landAreaM2 ?? null;
  const primaryArea = livingArea ?? netArea ?? usableArea ?? tr?.areaM2 ?? listing.areaM2 ?? landArea ?? null;
  const pricePerM2 =
    !isLocked && primaryArea && primaryArea > 0 && listing.appraisedValue && listing.appraisedValue > 0
      ? `${formatMoney(Math.round(listing.appraisedValue / primaryArea), market, locale, listing.currency)} / m²`
      : null;
  const roomsVal = portalDetails.rooms ?? listing.rooms ?? tr?.rooms ?? null;
  const floorVal = portalDetails.floor ?? tr?.floor ?? null;
  const yearBuiltVal = portalDetails.yearBuilt ?? listing.yearBuilt ?? tr?.yearBuilt ?? null;
  const unitNoVal = portalDetails.unitNo ?? tr?.unitNo ?? null;
  const arsaPayiVal = portalDetails.arsaPayi ?? tr?.arsaPayi ?? null;
  const grundbuchVal = portalDetails.grundbuch ?? listing.grundbuch ?? null;

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
      <ListingDeadlineSection listing={listing} userId={viewer.id} locale={locale} isLocked={isLocked} now={viewer.now} />
      <ClientShareArea listingKey={listing.key} locale={locale} isLocked={isLocked} />

      <PageSplitGrid variant="listing">
        <PageStack variant="col10Min">
          <ListingOfficialDetails listing={listing} details={portalDetails} locale={locale} isLocked={isLocked} />
          <ListingReportArea listing={listing} userId={viewer.id} locale={locale} isLocked={isLocked} attachments={portalDetails.attachments} />
          <ListingPlaceSection listing={listing} geo={geo} sprite={sprite.href} labels={app.Location} />
          <ListingMediaSection listing={listing} labels={app.Media} portalDetails={portalDetails} />
          <ListingEvidenceSection listing={listing} labels={app.Evidence} />
          {listing.history.length > 0 && <ListingHistory title={app.History.Title} hint={app.History.Hint} entries={listing.history} />}
          <CaveatList title={L.Caveats.Title} emptyLabel={L.Caveats.Empty} pointsLabel={(points) => fill(L.Caveats.Points, { points })} caveats={listing.caveats} />
        </PageStack>

        <PageAside variant="stack">
          <FactSheet title={L.FactsTitle}>
            <FactRow label={L.FileNo} value={listing.fileNo} notStated={L.NotStated} mono />
            <FactRow label={L.Authority[market]} value={listing.authority} notStated={L.NotStated} />
            <FactRow label={L.Region[market]} value={listing.region} notStated={L.NotStated} />
            <FactRow label={L.Address} value={getAddressLine(listing) || null} notStated={L.NotStated} />
            <FactRow label={L.Segment} value={listing.segmentLabel} notStated={L.NotStated} />
            <FactRow label={L.Tr.BuildingArea} value={livingArea === null ? null : formatArea(livingArea, locale)} notStated={L.NotStated} mono />
            {netArea !== null && netArea !== livingArea && (
              <FactRow label={L.Tr.NetArea} value={formatArea(netArea, locale)} notStated={L.NotStated} mono />
            )}
            {usableArea !== null && usableArea !== livingArea && (
              <FactRow label={L.Tr.UsableArea} value={formatArea(usableArea, locale)} notStated={L.NotStated} mono />
            )}
            <FactRow
              label={L.Tr.LandArea}
              value={landArea === null ? null : `${formatArea(landArea, locale)}${tr?.isCondo ? ` · ${L.Tr.Condo}` : ""}`}
              notStated={L.NotStated}
              mono
            />
            {pricePerM2 && <FactRow label={L.Tr.PricePerM2} value={pricePerM2} notStated={L.NotStated} mono />}
            {roomsVal && <FactRow label={L.Tr.Rooms} value={roomsVal} notStated={L.NotStated} mono />}
            {floorVal && <FactRow label={L.Tr.Floor} value={floorVal} notStated={L.NotStated} mono />}
            {yearBuiltVal && <FactRow label={L.Tr.YearBuilt} value={String(yearBuiltVal)} notStated={L.NotStated} mono />}
            {tr ? (
              <FactRow
                label={L.Tr.Parcel}
                value={tr.ada && tr.parsel ? `${tr.ada} / ${tr.parsel}${unitNoVal ? ` · ${L.Tr.UnitNoPrefix} ${unitNoVal}` : ""}` : grundbuchVal}
                notStated={L.NotStated}
                mono
              />
            ) : (
              grundbuchVal && <FactRow label={L.Tr.Grundbuch} value={grundbuchVal} notStated={L.NotStated} mono />
            )}
            {arsaPayiVal && <FactRow label={L.Tr.ArsaPayi} value={arsaPayiVal} notStated={L.NotStated} mono />}
            <FactRow label={L.FileYear} value={listing.fileYear ? String(listing.fileYear) : null} notStated={L.NotStated} mono />
            <FactRow label={L.FirstSeen} value={listing.firstSeenAt ? formatDate(listing.firstSeenAt, locale) : null} notStated={L.NotStated} mono />
          </FactSheet>
          <NoteForm listingId={listing.key} note={entry?.note ?? ""} title={L.Note.Title} placeholder={L.Note.Placeholder} saveLabel={L.Note.Save} savedLabel={L.Note.Saved} errorLabel={L.Note.Error} hint={L.Note.Hint} />
          <PreBidChecklist listingId={listing.key} title={L.Checklist.Title} hint={L.Checklist.Hint} progressTemplate={L.Checklist.Progress} items={L.Checklist.Items[market]} />
        </PageAside>
      </PageSplitGrid>
    </AppMain>
  );
}
