import Link from "next/link";
import { ReactNode } from "react";
import ListingDateBlock from "@/components/app/search/ListingDateBlock";
import ListingFigures from "@/components/app/search/ListingFigures";
import WatchButton from "@/components/app/watchlist/WatchButton";
import Stamp from "@/components/ui/Stamp";
import { listingHref, SEARCH } from "@/lib/appConstants";
import { formatMoney, getDateParts } from "@/lib/appFormat";
import { LocaleOption } from "@/lib/constants";
import { getAddressLine, getListingSourceTag, getPlaceTitle, getPropertyMetricsChips, getRoundLabel, getStatusLabel } from "@/lib/listingLabels";
import { getEntryBid } from "@/lib/listingMath";
import { getAerialTileUrl } from "@/lib/locationLinks";
import { IAppTranslation } from "@/translations/app/IAppTranslation";
import { HearingStatus, Listing } from "@/types/listing.types";

interface ListingRowProps {
  listing: Listing;
  status: HearingStatus;
  labels: IAppTranslation["Row"];
  segmentLabel: string;
  locale: LocaleOption;
  isSaved: boolean;
  isNew: boolean;
  isLocked: boolean;
  /** Small map stamp showing where the proceeding is */
  locator?: ReactNode;
}

/** Comparisons are only shown when the old pipeline rated them as solid enough. */
const SHOWN_CONFIDENCE = ["belastbar", "mittel"];
const HIGH_DISCOUNT_PCT = 25;
const CONFIDENCE_TR: Record<string, string> = { belastbar: "güvenilir", mittel: "orta" };

/** One proceeding on the board: date sheet, map stamp, place and file, figures, watch button. */
export default function ListingRow({ listing, status, labels, segmentLabel, locale, isSaved, isNew, isLocked, locator }: ListingRowProps) {
  const date = getDateParts((status.state === "running" ? status.round?.end : status.round?.start) ?? listing.hearingAt ?? listing.firstSeenAt ?? "", listing.market, locale);
  const money = (value: number) => formatMoney(value, listing.market, locale, listing.currency);
  const entry = getEntryBid(listing);
  const discount = listing.tr?.discountPct;
  const rawConfidence = listing.tr?.confidence ?? "";
  const showComparison = discount !== null && discount !== undefined && SHOWN_CONFIDENCE.includes(rawConfidence);
  const confidenceLabel = locale === "tr" ? (CONFIDENCE_TR[rawConfidence] ?? rawConfidence) : rawConfidence;
  const round = getRoundLabel(listing, status, labels);
  const href = listingHref(listing.key);
  const hasPdf = Boolean(listing.documentUrl || listing.exposeUrl);
  const metricChips = getPropertyMetricsChips(listing, locale);
  const thumbUrl = listing.imageUrl ?? (listing.geo ? getAerialTileUrl(listing.geo.lat, listing.geo.lng, listing.geo.precision === "postcode" ? 16 : 14) : null);
  const isDirectPhoto = Boolean(listing.imageUrl);
  const thumbBadge = isDirectPhoto ? "FOTO" : locale === "tr" ? "UYDU" : "LUFTBILD";
  const sourceTag = getListingSourceTag(listing);

  return (
    <li className="group relative flex gap-4 py-5 transition-colors hover:bg-paper-bright/60 sm:gap-6 sm:px-2">
      <ListingDateBlock
        {...date}
        status={getStatusLabel(status, labels)}
        state={status.state}
        isImminent={status.state === "upcoming" && (status.days ?? Infinity) < SEARCH.imminentDays}
      />
      {thumbUrl ? (
        <div className="relative hidden h-20 w-28 shrink-0 self-center overflow-hidden border border-ink/80 bg-ink sm:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={thumbUrl} alt="" loading="lazy" className="size-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <span className={`absolute bottom-1 left-1 px-1 py-px font-mono text-[9px] tracking-[0.12em] text-paper-bright uppercase ${isDirectPhoto ? "bg-signal" : "bg-ink/80"}`}>
            {thumbBadge}
          </span>
        </div>
      ) : (
        locator && <div className="hidden shrink-0 self-center md:block">{locator}</div>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-4 lg:flex-row lg:items-center">
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[10px] tracking-[0.15em] text-muted uppercase">
            <span>{segmentLabel}</span>
            {round && <span className="text-ink">{round}</span>}
            {sourceTag && <span className="border border-ink/40 px-1.5 py-px text-ink">{sourceTag}</span>}
            {hasPdf && <span className="border border-ink/35 bg-paper-warm/70 px-1.5 py-px text-ink">PDF</span>}
            {listing.limitsWaived && <span className="bg-signal px-1.5 py-px font-semibold text-paper-bright">★ {labels.Waived}</span>}
            {showComparison && discount >= HIGH_DISCOUNT_PCT && (
              <span className="bg-verdict px-1.5 py-px font-semibold text-paper-bright">−{Math.round(discount)} %</span>
            )}
            {isNew && <span className="bg-ink px-1.5 py-px text-paper-bright">{labels.New}</span>}
          </p>
          <h3 className="mt-1 font-narrow text-2xl leading-tight font-bold">
            <Link href={href} className="after:absolute after:inset-0 hover:text-signal">
              {getPlaceTitle(listing)}
            </Link>
          </h3>
          <p className="mt-0.5 truncate text-sm text-ink-soft">{getAddressLine(listing) || listing.title}</p>
          {metricChips.length > 0 && (
            <p className="mt-1.5 flex flex-wrap items-center gap-1.5 font-mono text-[11px] font-medium text-ink">
              {metricChips.map((chip) => (
                <span key={chip} className="border border-ink/25 bg-paper-warm/50 px-1.5 py-0.5">
                  {chip}
                </span>
              ))}
            </p>
          )}
          <p className="mt-1.5 truncate font-mono text-[11px] text-muted">
            {listing.authority} · {listing.fileNo} · {listing.region}
          </p>
          {listing.cancelled && (
            <span className="mt-2 inline-block">
              <Stamp label={labels.Cancelled} tilt="left" />
            </span>
          )}
        </div>
        <ListingFigures
          valueLabel={labels.Value[listing.market]}
          value={listing.appraisedValue === null ? null : money(listing.appraisedValue)}
          noValueLabel={labels.NoValue}
          entryLabel={listing.market === "TR" ? labels.EntryTr : labels.EntryDe}
          entry={entry === null ? labels.Waived : money(entry)}
          comparison={showComparison ? `−${Math.round(discount)} % · ${confidenceLabel}` : undefined}
          isLocked={isLocked}
          lockedLabel={labels.Locked}
        />
      </div>
      <div className="relative z-10 flex shrink-0 flex-col items-end justify-between gap-2">
        <WatchButton listingId={listing.key} isSaved={isSaved} watchLabel={labels.Watch} unwatchLabel={labels.Unwatch} errorLabel={labels.WatchError} />
        <Link href={href} className="hidden font-narrow text-[11px] font-semibold tracking-[0.1em] text-ink-soft uppercase hover:text-signal sm:inline">
          {labels.Open} →
        </Link>
      </div>
    </li>
  );
}
