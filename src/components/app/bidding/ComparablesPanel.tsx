import ComparisonFigureCard from "@/components/app/bidding/ComparisonFigureCard";
import OwnComparables from "@/components/app/bidding/OwnComparables";
import SourceLink from "@/components/app/listing/SourceLink";
import SourceLinks from "@/components/app/listing/SourceLinks";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { IBiddingTranslation } from "@/translations/bidding/IBiddingTranslation";
import { ListingComparables } from "@/types/bidding.types";

interface ComparablesPanelProps {
  listingId: string;
  comparables: ListingComparables;
  labels: IBiddingTranslation["Comparables"];
  market: MarketCode;
  locale: LocaleOption;
}

/** What the surroundings say about the value: sourced figures, the gaps, where to look, and own entries. */
export default function ComparablesPanel({ listingId, comparables, labels, market, locale }: ComparablesPanelProps) {
  return (
    <section aria-label={labels.Title} className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-3xl">{labels.Title}</h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-ink-soft">{labels.Lead[market]}</p>
      </div>
      <div className="grid gap-px border border-rule bg-rule sm:grid-cols-3">
        {comparables.figures.map((figure) => (
          <ComparisonFigureCard key={figure.id} figure={figure} labels={labels} market={market} locale={locale} />
        ))}
      </div>
      <SourceLinks title={labels.Lookups.Title} note={labels.Lookups.Hint}>
        {comparables.lookups.map((lookup) => (
          <SourceLink key={lookup.id} href={lookup.url} label={lookup.name ?? labels.Lookups.Names[lookup.id]} host={lookup.host} />
        ))}
      </SourceLinks>
      <OwnComparables listingId={listingId} labels={labels.Own} market={market} locale={locale} />
    </section>
  );
}
