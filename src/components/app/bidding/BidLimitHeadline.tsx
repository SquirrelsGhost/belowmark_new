import { fill, formatMoney } from "@/lib/appFormat";
import { LABEL_CLASSES } from "@/lib/appStyles";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { formatPercent } from "@/lib/format";
import { IBiddingTranslation } from "@/translations/bidding/IBiddingTranslation";
import { BidLimitResult, LimitCriterion } from "@/types/bidding.types";

interface BidLimitHeadlineProps {
  labels: IBiddingTranslation["Limit"];
  market: MarketCode;
  locale: LocaleOption;
  value: number;
  result: BidLimitResult;
  /** Ceiling the search stops at (3 × value) */
  ceiling: number;
}

const VERDICT_TONE = {
  belowStart: "border-signal bg-signal/10 text-signal-deep",
  belowHalf: "border-signal bg-signal/10 text-signal-deep",
  belowSevenTenths: "border-caution bg-caution/10 text-caution",
  clear: "border-verdict bg-verdict/10 text-verdict",
  waived: "border-rule-strong bg-paper-deep text-ink",
} as const;

/** The limit as the loudest number, its share of the value, what caps it, and where it stands legally. */
export default function BidLimitHeadline({ labels, market, locale, value, result, ceiling }: BidLimitHeadlineProps) {
  const { Result } = labels;
  const money = (amount: number) => formatMoney(amount, market, locale);
  const limit = result.limit;
  const criteria = Object.keys(result.limits) as LimitCriterion[];

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className={LABEL_CLASSES}>{Result.Label}</p>
        {limit === null && <p className="mt-2 text-sm leading-snug text-ink-soft">{Result.NeedsInputs}</p>}
        {limit === "unreachable" && <p className="mt-2 font-display text-3xl leading-tight text-signal">{Result.Unreachable}</p>}
        {typeof limit === "number" && (
          <>
            <p className="font-display text-5xl leading-none sm:text-6xl">{money(limit)}</p>
            <p className="mt-1 font-mono text-xs text-muted">
              {fill(Result.OfValue, { pct: formatPercent((limit / value) * 100, locale) })}
              {result.decidingCriterion && ` · ${Result.DecidedBy}: ${Result.Criteria[result.decidingCriterion]}`}
            </p>
            {limit >= ceiling && <p className="mt-1 text-xs text-caution">{Result.AtCeiling}</p>}
          </>
        )}
      </div>
      {result.verdict && <p className={`border-l-4 px-3 py-2 text-sm leading-snug ${VERDICT_TONE[result.verdict]}`}>{labels.Verdicts[result.verdict]}</p>}
      <p className={LABEL_CLASSES}>{Result.PerCriterion}</p>
      <ul className="-mt-2 flex flex-col gap-0.5 font-mono text-[11px] text-muted">
        {criteria.map((criterion) => {
          const own = result.limits[criterion];
          const shown = own === null ? Result.CriterionUnused : own === "unreachable" ? "—" : money(own);
          return <li key={criterion} className={criterion === result.decidingCriterion ? "font-semibold text-ink" : ""}>{`${Result.Criteria[criterion]}: ${shown}`}</li>;
        })}
      </ul>
    </div>
  );
}
