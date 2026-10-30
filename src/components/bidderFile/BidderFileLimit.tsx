// Recomputes the bid limit from the figures the bidder stored on the Aktenblatt
"use client";

import { useMemo } from "react";
import BidLimitCostLedger from "@/components/app/bidding/BidLimitCostLedger";
import BidLimitHeadline from "@/components/app/bidding/BidLimitHeadline";
import BidLimitReturns from "@/components/app/bidding/BidLimitReturns";
import BidderFileInputs from "@/components/bidderFile/BidderFileInputs";
import { useStoredText } from "@/hooks/useStoredText";
import { MAX_BID_SHARE } from "@/lib/bidding/biddingConstants";
import { hasAnyInput, inputsKey, parseInputs } from "@/lib/bidding/biddingStorage";
import { getBidLimit } from "@/lib/bidding/bidLimit";
import { LocaleOption } from "@/lib/constants";
import { IBiddingTranslation } from "@/translations/bidding/IBiddingTranslation";
import { BidContext } from "@/types/bidding.types";

interface BidderFileLimitProps {
  listingId: string;
  context: BidContext;
  labels: IBiddingTranslation["Limit"];
  noLimit: string;
  locale: LocaleOption;
}

/** The bid limit as stored: the inputs it rests on, the limit, the bill and the returns. */
export default function BidderFileLimit({ listingId, context, labels, noLimit, locale }: BidderFileLimitProps) {
  const [raw] = useStoredText(inputsKey(listingId));
  const inputs = useMemo(() => parseInputs(raw), [raw]);
  const result = useMemo(() => getBidLimit(context, inputs), [context, inputs]);
  const bid = typeof result.limit === "number" ? result.limit : null;

  if (!hasAnyInput(inputs)) return <p className="bg-hatch px-2 py-1.5 text-[13px] text-ink-soft">{noLimit}</p>;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 print:grid-cols-2">
      <div className="flex flex-col gap-4">
        <BidLimitHeadline labels={labels} market={context.market} locale={locale} value={context.value} result={result} ceiling={context.value * MAX_BID_SHARE} />
        <BidderFileInputs labels={labels} market={context.market} locale={locale} inputs={inputs} />
      </div>
      {bid !== null && result.returns && (
        <div className="flex flex-col gap-4">
          <BidLimitCostLedger labels={labels.Costs} market={context.market} locale={locale} bid={bid} costs={result.costs} total={result.returns.totalCost} />
          {result.isIncomplete && <p className="border-l-4 border-caution px-2 text-[12px] text-caution">{labels.Costs.Incomplete}</p>}
          <BidLimitReturns labels={labels.Returns} market={context.market} locale={locale} returns={result.returns} />
        </div>
      )}
    </div>
  );
}
