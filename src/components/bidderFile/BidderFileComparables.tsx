import BidderFileOwnComparables from "@/components/bidderFile/BidderFileOwnComparables";
import BidderFileRow from "@/components/bidderFile/BidderFileRow";
import { formatMoney } from "@/lib/appFormat";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { IBiddingTranslation } from "@/translations/bidding/IBiddingTranslation";
import { ListingComparables } from "@/types/bidding.types";

interface BidderFileComparablesProps {
  listingId: string;
  comparables: ListingComparables;
  labels: IBiddingTranslation["Comparables"];
  market: MarketCode;
  locale: LocaleOption;
}

/** Sourced comparison values (or why there are none), then the bidder's own entries. */
export default function BidderFileComparables({ listingId, comparables, labels, market, locale }: BidderFileComparablesProps) {
  const money = (amount: number) => formatMoney(amount, market, locale);
  return (
    <div>
      <dl className="divide-y divide-rule">
        {comparables.figures.map((figure) => (
          <BidderFileRow
            key={figure.id}
            label={labels.Kinds[figure.id]}
            value={figure.perM2 === null ? null : `${money(figure.perM2)} ${labels.PerM2}`}
            missing={figure.gap ? labels.Gaps[figure.gap] : "—"}
            note={[figure.scope, figure.asOf, figure.sourceName && `${labels.Source}: ${figure.sourceName}`, figure.objectPerM2 !== null && `${labels.ObjectPerM2}: ${money(figure.objectPerM2)}`]
              .filter(Boolean)
              .join(" · ")}
          />
        ))}
      </dl>
      <BidderFileOwnComparables listingId={listingId} labels={labels.Own} market={market} locale={locale} />
    </div>
  );
}
