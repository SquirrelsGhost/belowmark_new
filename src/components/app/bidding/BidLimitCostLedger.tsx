import { formatMoney } from "@/lib/appFormat";
import { costLineBasis, costLineLabel } from "@/lib/bidding/bidFormat";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { IBiddingTranslation } from "@/translations/bidding/IBiddingTranslation";
import { CostLine } from "@/types/bidding.types";

interface BidLimitCostLedgerProps {
  labels: IBiddingTranslation["Limit"]["Costs"];
  market: MarketCode;
  locale: LocaleOption;
  bid: number;
  costs: CostLine[];
  total: number;
}

const ROW = "grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 py-1.5";

/** The bill at the limit: bid, every cost with its legal basis or "Ihre Angabe", and the total. */
export default function BidLimitCostLedger({ labels, market, locale, bid, costs, total }: BidLimitCostLedgerProps) {
  const money = (amount: number) => formatMoney(amount, market, locale);
  return (
    <section aria-label={labels.Title}>
      <h3 className="font-narrow text-xs font-bold tracking-[0.14em] uppercase">{labels.Title}</h3>
      <dl className="mt-1 divide-y divide-rule">
        <div className={ROW}>
          <dt className="text-sm">{labels.Bid}</dt>
          <dd className="text-right font-mono text-sm">{money(bid)}</dd>
        </div>
        {costs.map((line) => (
          <div key={line.code} className={ROW}>
            <dt className="text-sm text-ink-soft">
              {costLineLabel(line, labels, locale)}
              <span className={`block font-mono text-[10px] ${line.isUnknown ? "text-signal" : "text-muted"}`}>{costLineBasis(line, labels)}</span>
            </dt>
            <dd className={`text-right font-mono text-sm ${line.isUnknown ? "bg-hatch px-1 text-muted" : ""}`}>{line.isUnknown ? "—" : money(line.amount)}</dd>
          </div>
        ))}
        <div className={`${ROW} border-t-2 border-ink`}>
          <dt className="text-sm font-semibold">{labels.Total}</dt>
          <dd className="text-right font-mono text-sm font-semibold">{money(total)}</dd>
        </div>
      </dl>
    </section>
  );
}
