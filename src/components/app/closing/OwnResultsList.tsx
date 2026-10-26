import Link from "next/link";
import { formatMoney } from "@/lib/appFormat";
import { listingHref } from "@/lib/appConstants";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { getPlaceTitle } from "@/lib/listingLabels";
import { StoredHearingResult } from "@/services/HearingResultService";
import { IClosingTranslation } from "@/translations/closing/IClosingTranslation";
import { HearingOutcome } from "@/types/closing.types";
import { Listing } from "@/types/listing.types";

interface OwnResultsListProps {
  rows: { entry: StoredHearingResult; listing: Listing | null }[];
  labels: IClosingTranslation["Results"]["Own"];
  outcomes: Record<HearingOutcome, string>;
  market: MarketCode;
  locale: LocaleOption;
}

/** The user's own reports, each linking back to its Aktenblatt for corrections. */
export default function OwnResultsList({ rows, labels, outcomes, market, locale }: OwnResultsListProps) {
  return (
    <aside aria-label={labels.Title} className="flex flex-col gap-3 self-start border border-ink/70 bg-paper-bright p-5">
      <h2 className="font-narrow text-sm font-bold tracking-[0.12em] uppercase">{labels.Title}</h2>
      <p className="text-xs text-muted">{labels.Lead}</p>
      {rows.length === 0 ? (
        <p className="text-sm text-ink-soft">{labels.Empty}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-rule">
          {rows.map(({ entry, listing }) => (
            <li key={`${entry.listingKey}-${entry.hearingDate}`} className="flex flex-col gap-1 py-3 text-sm">
              <Link href={`${listingHref(entry.listingKey)}#ergebnis`} className="font-semibold underline-offset-4 hover:underline">
                {listing ? getPlaceTitle(listing) : entry.listingKey}
              </Link>
              <span className="font-mono text-[11px] text-ink-soft">
                {formatDate(entry.hearingDate, locale)} · {outcomes[entry.outcome]}
                {entry.highestBid !== null && ` · ${formatMoney(entry.highestBid, market, locale)}`}
              </span>
              <span className="font-mono text-[10px] tracking-[0.1em] text-muted uppercase">
                {entry.shared ? labels.Shared : labels.Private}
                {entry.isBuyer && ` · ${labels.Buyer}`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
