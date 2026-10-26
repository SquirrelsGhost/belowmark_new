// Reads the bidder's own comparison values from localStorage
"use client";

import OwnComparableList from "@/components/app/bidding/OwnComparableList";
import { useStoredText } from "@/hooks/useStoredText";
import { comparablesKey, parseComparables } from "@/lib/bidding/biddingStorage";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { IBiddingTranslation } from "@/translations/bidding/IBiddingTranslation";

interface BidderFileOwnComparablesProps {
  listingId: string;
  labels: IBiddingTranslation["Comparables"]["Own"];
  market: MarketCode;
  locale: LocaleOption;
}

/** Own comparison values in the file, marked as own entries with their source. */
export default function BidderFileOwnComparables({ listingId, labels, market, locale }: BidderFileOwnComparablesProps) {
  const [raw] = useStoredText(comparablesKey(listingId));
  return (
    <div className="mt-3">
      <p className="mb-1 font-narrow text-xs font-bold tracking-[0.12em] uppercase">{labels.Title}</p>
      <OwnComparableList items={parseComparables(raw)} labels={labels} market={market} locale={locale} />
    </div>
  );
}
