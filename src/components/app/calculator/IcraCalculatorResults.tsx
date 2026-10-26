import CalculatorRow from "@/components/hero/CalculatorRow";
import { TR_COSTS } from "@/lib/appConstants";
import { fill, formatMoney } from "@/lib/appFormat";
import { LocaleOption } from "@/lib/constants";
import { formatDate, formatPercent } from "@/lib/format";
import { IcraFigures } from "@/lib/listingMath";
import { IAppTranslation } from "@/translations/app/IAppTranslation";

interface IcraCalculatorResultsProps {
  labels: IAppTranslation["Listing"]["Tr"];
  locale: LocaleOption;
  value: number;
  bid: number;
  figures: IcraFigures;
}

/** Ledger of the bid, deposit and every cost item — with the rate source date. */
export default function IcraCalculatorResults({ labels, locale, value, bid, figures }: IcraCalculatorResultsProps) {
  const money = (amount: number) => formatMoney(amount, "TR", locale);
  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <p className="font-mono text-[11px] tracking-wider text-muted uppercase">{labels.BidLabel}</p>
        <p className="font-display text-5xl leading-none">{money(bid)}</p>
        <p className="mt-2 font-mono text-sm text-signal">{bid <= value ? `−${money(value - bid)}` : `+${money(bid - value)}`}</p>
      </div>
      <dl className="flex flex-col">
        <CalculatorRow label={labels.StartingBid} value={money(figures.startingBid)} />
        <CalculatorRow label={labels.Deposit} value={money(figures.deposit)} />
        {figures.items.map((item) => (
          <CalculatorRow key={item.code} label={fill(labels.Costs[item.code], { pct: item.pct === null ? "" : formatPercent(item.pct, locale) })} value={money(item.amount)} />
        ))}
        <CalculatorRow label={labels.AllIn} value={money(figures.allIn)} isTotal />
      </dl>
      {!figures.vatKnown && <p className="border-l-4 border-caution bg-caution/10 px-3 py-2 text-sm text-caution">{labels.VatUnknown}</p>}
      <p className="font-mono text-[11px] text-muted">
        {labels.Tellaliye} {fill(labels.CostsAsOf, { date: formatDate(TR_COSTS.asOf, locale) })}
      </p>
    </div>
  );
}
