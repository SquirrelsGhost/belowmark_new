import RegionLocator from "@/components/app/map/RegionLocator";
import SearchViewSwitch from "@/components/app/search/SearchViewSwitch";
import WatchCompareRow from "@/components/app/watchlist/WatchCompareRow";
import WatchCompareTable from "@/components/app/watchlist/WatchCompareTable";
import WatchlistEmpty from "@/components/app/watchlist/WatchlistEmpty";
import WatchlistExport from "@/components/app/watchlist/WatchlistExport";
import WatchlistItem from "@/components/app/watchlist/WatchlistItem";
import WatchlistMissing from "@/components/app/watchlist/WatchlistMissing";
import WatchlistSection from "@/components/app/watchlist/WatchlistSection";
import PageNote from "@/components/ui/PageNote";
import { APP_ROUTES, listingHref, SEARCH, SEARCH_PARAMS, WATCHLIST_COMPARE_VIEW } from "@/lib/appConstants";
import { fill, getDateParts } from "@/lib/appFormat";
import { compareRows } from "@/lib/compareRows";
import { LocaleOption } from "@/lib/constants";
import { projectPoint } from "@/lib/geo";
import { getPlaceTitle, getStatusLabel } from "@/lib/listingLabels";
import { getHearingStatus, getNextDate } from "@/lib/listingMath";
import { AppViewer } from "@/services/AppSessionService";
import { DeadlineService } from "@/services/DeadlineService";
import { FreeUnlockService } from "@/services/FreeUnlockService";
import { GeoService } from "@/services/GeoService";
import { ListingService } from "@/services/ListingService";
import { WatchlistService } from "@/services/WatchlistService";
import { IAppTranslation } from "@/translations/app/IAppTranslation";
import { getDeadlineTranslation } from "@/translations/deadlines/DeadlineTranslations";

interface WatchlistContentProps {
  viewer: AppViewer;
  app: IAppTranslation;
  locale: LocaleOption;
  isCompare: boolean;
}

/**
 * Streams the user's saved watchlist items and comparison table.
 */
export default async function WatchlistContent({ viewer, app, locale, isCompare }: WatchlistContentProps) {
  const { Watchlist: W, Row, Compare: C } = app;
  const deadlineFollow = getDeadlineTranslation(locale).Follow;
  const [entries, follows, geo, sprite] = await Promise.all([
    WatchlistService.list(viewer.id),
    DeadlineService.list(viewer.id),
    GeoService.getCountry(viewer.country),
    GeoService.getLocatorSprite(viewer.country),
  ]);
  const mailByKey = new Map(follows.map((follow) => [follow.listingKey, follow.mailEnabled]));
  const rawListings = await ListingService.getMany(viewer.countries, entries.map((entry) => entry.listingId));
  const listings = await FreeUnlockService.redactForViewer(viewer.id, viewer.plan === "free", rawListings);
  const byKey = new Map(listings.map((listing) => [listing.key, listing]));
  const notes = new Map(entries.map((entry) => [entry.listingId, entry.note]));
  const missing = entries.filter((entry) => !byKey.has(entry.listingId));
  const watchLabels = { watch: Row.Watch, unwatch: Row.Unwatch, error: Row.WatchError };

  const rows = listings
    .map((listing) => ({ listing, status: getHearingStatus(listing, viewer.now), date: getNextDate(listing, viewer.now) ?? listing.firstSeenAt ?? "" }))
    .sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = rows.filter((row) => row.status.state === "upcoming" || row.status.state === "running");
  const over = rows.filter((row) => !upcoming.includes(row)).reverse();
  const compared = upcoming.map((row) => row.listing);

  const renderItem = ({ listing, status, date }: (typeof rows)[number]) => {
    const parts = getDateParts(date, listing.market, locale);
    const isOver = status.state === "past" || status.state === "cancelled";
    return (
      <WatchlistItem
        key={listing.key}
        href={listingHref(listing.key)}
        dateLabel={`${parts.day} ${parts.month}`}
        timeLabel={`${parts.weekday} ${parts.time} · ${parts.year}`}
        status={getStatusLabel(status, Row)}
        isImminent={status.state === "running" || (status.state === "upcoming" && (status.days ?? Infinity) < SEARCH.imminentDays)}
        isOver={isOver}
        title={`${getPlaceTitle(listing)} · ${app.Segments[listing.segment]}`}
        subtitle={`${listing.authority} · ${listing.fileNo}`}
        note={notes.get(listing.key) ?? null}
        noNoteLabel={W.NoNote}
        editNoteLabel={W.EditNote}
        listingId={listing.key}
        watchLabels={watchLabels}
        mailReminder={
          !isOver
            ? { isOn: Boolean(mailByKey.get(listing.key)), onLabel: deadlineFollow.MailOn, offLabel: deadlineFollow.MailOff, errorLabel: deadlineFollow.Error }
            : undefined
        }
      />
    );
  };

  return (
    <>
      {entries.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <SearchViewSwitch
            label={app.Views.Label}
            options={[
              { href: APP_ROUTES.watchlist, label: C.Plan, icon: "calendar", isActive: !isCompare },
              { href: `${APP_ROUTES.watchlist}?${SEARCH_PARAMS.view}=${WATCHLIST_COMPARE_VIEW}`, label: C.Compare, icon: "scale", isActive: isCompare },
            ]}
          />
          <WatchlistExport label={W.ExportAll} count={fill(W.Count, { count: entries.length })} />
        </div>
      )}
      {entries.length === 0 && <WatchlistEmpty title={W.Empty.Title} body={W.Empty.Body} cta={W.Empty.Cta} />}
      {isCompare && compared.length < 2 && entries.length > 0 && <PageNote variant="softTop" text={C.NeedTwo} />}
      {isCompare && compared.length >= 2 && (
        <WatchCompareTable
          title={C.Title}
          columns={compared.map((listing) => ({
            key: listing.key,
            href: listingHref(listing.key),
            title: getPlaceTitle(listing),
            locator: (
              geo.regions.length > 0 && (
                <RegionLocator
                  sprite={sprite.href}
                  width={geo.projection.width}
                  height={geo.projection.height}
                  frame={geo.frame}
                  regionCode={listing.regionCode}
                  point={listing.geo ? projectPoint(geo.projection, listing.geo.lat, listing.geo.lng) : null}
                  label={listing.region ?? ""}
                  className={viewer.market === "TR" ? "w-28" : "w-14"}
                />
              )
            ),
          }))}
        >
          {compareRows(compared, viewer.market, app, locale, viewer.now, notes).map(({ key, ...row }) => (
            <WatchCompareRow key={key} {...row} bestLabel={C.Best} notStated={app.Listing.NotStated} isLocked={viewer.plan === "free"} lockedLabel={Row.Locked} />
          ))}
        </WatchCompareTable>
      )}
      {!isCompare && upcoming.length > 0 && (
        <WatchlistSection title={W.Upcoming} count={upcoming.length}>
          {upcoming.map(renderItem)}
        </WatchlistSection>
      )}
      {!isCompare && (over.length > 0 || missing.length > 0) && (
        <WatchlistSection title={W.Past} count={over.length + missing.length}>
          {over.map(renderItem)}
          {missing.map((entry) => (
            <WatchlistMissing key={entry.listingId} listingId={entry.listingId} message={W.Missing} watchLabels={watchLabels} />
          ))}
        </WatchlistSection>
      )}
    </>
  );
}
