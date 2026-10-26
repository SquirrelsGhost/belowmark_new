// Keeps the bidder's own comparison values per proceeding in localStorage
"use client";

import { useMemo } from "react";
import OwnComparableForm from "@/components/app/bidding/OwnComparableForm";
import OwnComparableList from "@/components/app/bidding/OwnComparableList";
import { useStoredText } from "@/hooks/useStoredText";
import { comparablesKey, parseComparables } from "@/lib/bidding/biddingStorage";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { IBiddingTranslation } from "@/translations/bidding/IBiddingTranslation";
import { OwnComparable } from "@/types/bidding.types";

interface OwnComparablesProps {
  listingId: string;
  labels: IBiddingTranslation["Comparables"]["Own"];
  market: MarketCode;
  locale: LocaleOption;
}

/** Values the bidder looked up at BORIS, the Zensus or a broker — kept with their source. */
export default function OwnComparables({ listingId, labels, market, locale }: OwnComparablesProps) {
  const [raw, write] = useStoredText(comparablesKey(listingId));
  const items = useMemo(() => parseComparables(raw), [raw]);
  const save = (next: OwnComparable[]) => write(next.length ? JSON.stringify(next) : null);

  return (
    <section aria-label={labels.Title} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-narrow text-sm font-bold tracking-[0.12em] uppercase">{labels.Title}</h3>
        <p className="font-mono text-[10px] text-muted">{labels.Hint}</p>
      </div>
      <OwnComparableList items={items} labels={labels} market={market} locale={locale} onRemove={(id) => save(items.filter((item) => item.id !== id))} />
      <OwnComparableForm labels={labels} onAdd={(item) => save([...items, item])} />
    </section>
  );
}
