import { formatUnitAmount } from "@/lib/bidding/bidFormat";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { IBiddingTranslation } from "@/translations/bidding/IBiddingTranslation";
import { OwnComparable } from "@/types/bidding.types";

interface OwnComparableListProps {
  items: OwnComparable[];
  labels: IBiddingTranslation["Comparables"]["Own"];
  market: MarketCode;
  locale: LocaleOption;
  /** Left out in the printed file */
  onRemove?: (id: string) => void;
}

/** The bidder's own values, each marked as such and with the source they gave. */
export default function OwnComparableList({ items, labels, market, locale, onRemove }: OwnComparableListProps) {
  if (items.length === 0) return <p className="text-sm text-muted">{labels.Empty}</p>;
  return (
    <ul className="divide-y divide-rule border-y border-rule">
      {items.map((item) => (
        <li key={item.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-2">
          <span className="font-narrow text-xs font-bold tracking-[0.1em] uppercase">{labels.Kinds[item.kind]}</span>
          <span className="font-mono text-sm font-semibold">
            {formatUnitAmount(item.value, market, locale)} <span className="font-normal text-muted">{labels.Units[item.unit]}</span>
          </span>
          <span className="bg-paper-deep px-1 font-mono text-[10px] tracking-wide uppercase">{labels.Tag}</span>
          <span className="w-full text-xs text-ink-soft sm:w-auto sm:flex-1">
            {item.source} · {formatDate(item.asOf, locale)}
          </span>
          {onRemove && (
            <button type="button" onClick={() => onRemove(item.id)} className="cursor-pointer font-mono text-[11px] text-signal underline-offset-4 hover:underline">
              {labels.Remove}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
