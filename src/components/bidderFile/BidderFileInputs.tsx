import { formatMoney } from "@/lib/appFormat";
import { FIELD_GROUPS, FIELD_UNITS } from "@/lib/bidding/biddingConstants";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { formatNumber, formatPercent } from "@/lib/format";
import { IBiddingTranslation } from "@/translations/bidding/IBiddingTranslation";
import { BidInputKey, BidInputs } from "@/types/bidding.types";

interface BidderFileInputsProps {
  labels: IBiddingTranslation["Limit"];
  market: MarketCode;
  locale: LocaleOption;
  inputs: BidInputs;
}

/** The bidder's own figures behind the limit — only those actually entered. */
export default function BidderFileInputs({ labels, market, locale, inputs }: BidderFileInputsProps) {
  const format = (key: BidInputKey, value: number): string => {
    const unit = FIELD_UNITS[key];
    if (unit === "money") return formatMoney(value, market, locale);
    if (unit === "pct") return formatPercent(value, locale);
    if (unit === "m2") return `${formatNumber(value, locale)} m²`;
    return `${formatNumber(value, locale)} ${labels.DaysSuffix}`;
  };
  const entered = FIELD_GROUPS.flatMap(({ fields }) => fields).filter((key) => inputs[key] !== null);

  return (
    <dl className="divide-y divide-rule border-y border-rule">
      {entered.map((key) => (
        <div key={key} className="flex items-baseline justify-between gap-3 py-1">
          <dt className="text-[12px] text-ink-soft">{labels.Fields[key].label}</dt>
          <dd className="font-mono text-[12px]">{format(key, inputs[key] as number)}</dd>
        </div>
      ))}
    </dl>
  );
}
