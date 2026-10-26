import BidLimitCostLedger from "@/components/app/bidding/BidLimitCostLedger";
import BidLimitHeadline from "@/components/app/bidding/BidLimitHeadline";
import BidLimitReturns from "@/components/app/bidding/BidLimitReturns";
import BidderFileInputs from "@/components/bidderFile/BidderFileInputs";
import { MAX_BID_SHARE } from "@/lib/bidding/biddingConstants";
import { getBidLimit } from "@/lib/bidding/bidLimit";
import { LocaleOption } from "@/lib/constants";
import { IBiddingTranslation } from "@/translations/bidding/IBiddingTranslation";
import { BidContext, BidInputs } from "@/types/bidding.types";

interface ClientShareLimitProps {
  context: BidContext;
  inputs: BidInputs;
  labels: IBiddingTranslation["Limit"];
  locale: LocaleOption;
}

const GRID = "grid grid-cols-1 gap-6 sm:grid-cols-2 print:grid-cols-2";

/** The bid limit from the frozen figures: what it rests on, the limit, the bill and the returns. */
export default function ClientShareLimit({ context, inputs, labels, locale }: ClientShareLimitProps) {
  const result = getBidLimit(context, inputs);
  const bid = typeof result.limit === "number" ? result.limit : null;
  return (
    <div className={GRID}>
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
