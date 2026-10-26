// Reads and writes the bidder's figures in localStorage and recomputes the limit live
"use client";

import { useMemo } from "react";
import BidLimitCostLedger from "@/components/app/bidding/BidLimitCostLedger";
import BidLimitHeadline from "@/components/app/bidding/BidLimitHeadline";
import BidLimitInputs from "@/components/app/bidding/BidLimitInputs";
import BidLimitReturns from "@/components/app/bidding/BidLimitReturns";
import { useStoredText } from "@/hooks/useStoredText";
import { fill, formatMoney } from "@/lib/appFormat";
import { formatDate } from "@/lib/format";
import { MAX_BID_SHARE, ZVG_COSTS } from "@/lib/bidding/biddingConstants";
import { hasAnyInput, inputsKey, parseInputs } from "@/lib/bidding/biddingStorage";
import { getBidLimit } from "@/lib/bidding/bidLimit";
import { LocaleOption } from "@/lib/constants";
import { IBiddingTranslation } from "@/translations/bidding/IBiddingTranslation";
import { BidContext, BidInputKey } from "@/types/bidding.types";

interface BidLimitCalculatorProps {
  listingId: string;
  context: BidContext;
  labels: IBiddingTranslation["Limit"];
  locale: LocaleOption;
  /** Floor area the notice states (TR), shown as a hint */
  noticeAreaM2: string | null;
}

const CURRENCY_SUFFIX = { DE: "€", TR: "₺" } as const;

/** The highest sensible bid for one proceeding, from the bidder's own figures plus the statutory costs. */
export default function BidLimitCalculator({ listingId, context, labels, locale, noticeAreaM2 }: BidLimitCalculatorProps) {
  const [raw, write] = useStoredText(inputsKey(listingId));
  const inputs = useMemo(() => parseInputs(raw), [raw]);
  const result = useMemo(() => getBidLimit(context, inputs), [context, inputs]);
  const bid = typeof result.limit === "number" ? result.limit : null;

  const update = (key: BidInputKey, value: number | null) => write(JSON.stringify({ ...inputs, [key]: value }));
  const suffixes = { money: CURRENCY_SUFFIX[context.market], pct: "%", m2: "m²", days: labels.DaysSuffix };

  return (
    <section aria-label={labels.Title} className="border-2 border-ink bg-paper-bright shadow-[8px_8px_0_0_var(--ink)]">
      <div className="flex flex-wrap items-baseline justify-between gap-2 bg-ink px-4 py-2.5 text-paper-bright">
        <h2 className="font-display text-xl tracking-wide">{labels.Title}</h2>
        <span className="font-mono text-[10px] tracking-wider text-paper/60 uppercase">{labels.Subtitle}</span>
      </div>
      <div className="grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="flex flex-col gap-4 border-b border-rule p-4 lg:border-r lg:border-b-0">
          <p className="text-xs leading-snug text-muted">{labels.Lead}</p>
          <BidLimitInputs
            labels={labels}
            market={context.market}
            inputs={inputs}
            suffixes={suffixes}
            noticeAreaHint={noticeAreaM2 ? fill(labels.NoticeArea, { area: noticeAreaM2 }) : null}
            onChange={update}
          />
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-rule pt-3">
            <p className="font-mono text-[10px] text-muted">{labels.StorageHint}</p>
            {hasAnyInput(inputs) && (
              <button type="button" onClick={() => write(null)} className="cursor-pointer font-narrow text-xs font-semibold tracking-[0.1em] uppercase underline-offset-4 hover:underline">
                {labels.Reset}
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-6 p-4 lg:sticky lg:top-24 lg:self-start">
          <BidLimitHeadline labels={labels} market={context.market} locale={locale} value={context.value} result={result} ceiling={context.value * MAX_BID_SHARE} />
          {bid !== null && result.returns && (
            <>
              <BidLimitCostLedger labels={labels.Costs} market={context.market} locale={locale} bid={bid} costs={result.costs} total={result.returns.totalCost} />
              {result.isIncomplete && <p className="border-l-4 border-caution bg-caution/10 px-3 py-2 text-sm text-caution">{labels.Costs.Incomplete}</p>}
              <BidLimitReturns labels={labels.Returns} market={context.market} locale={locale} returns={result.returns} />
            </>
          )}
          <div className="border-t border-rule pt-3">
            <p className="text-sm">
              <span className="font-semibold">{labels.Costs.Deposit}: </span>
              <span className="font-mono">{formatMoney(result.deposit, context.market, locale)}</span>
            </p>
            <p className="mt-1 text-[11px] leading-snug text-muted">{labels.Costs.DepositNote[context.market]}</p>
            {context.market === "DE" && <p className="mt-1 font-mono text-[10px] text-muted">{fill(labels.Costs.AsOf, { date: formatDate(ZVG_COSTS.feesAsOf, locale) })}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
