import ResultField from "@/components/app/closing/ResultField";
import { CONTROL_CLASSES } from "@/lib/appStyles";
import { CURRENCY_SUFFIX } from "@/lib/bankFile/bankFileConstants";
import { MarketCode } from "@/lib/constants";
import { IClosingTranslation } from "@/translations/closing/IClosingTranslation";

interface ResultAmountFieldsProps {
  market: MarketCode;
  labels: IClosingTranslation["Result"];
  highestBid: number | null;
  retainedRights: number | null;
  bidderCount: number | null;
  onBidChange: (bid: number | null, rights: number | null) => void;
  bid: number | null;
  rights: number | null;
}

const AMOUNT_CLASSES = `${CONTROL_CLASSES} text-right`;

/** Bid, retained rights (DE) and bidder count of a reported hearing. */
export default function ResultAmountFields({ market, labels, highestBid, retainedRights, bidderCount, onBidChange, bid, rights }: ResultAmountFieldsProps) {
  const toNumber = (value: string): number | null => (value === "" ? null : Math.max(0, Math.round(Number(value))));
  const suffix = CURRENCY_SUFFIX[market];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <ResultField htmlFor="result-bid" label={`${labels.HighestBid[market].label} (${suffix})`} hint={labels.HighestBid[market].hint}>
        <input
          id="result-bid"
          name="highestBid"
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          defaultValue={highestBid ?? ""}
          onChange={(event) => onBidChange(toNumber(event.target.value), rights)}
          className={AMOUNT_CLASSES}
        />
      </ResultField>
      {market === "DE" && (
        <ResultField htmlFor="result-rights" label={`${labels.RetainedRights.label} (${suffix})`} hint={labels.RetainedRights.hint}>
          <input
            id="result-rights"
            name="retainedRights"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            defaultValue={retainedRights ?? ""}
            onChange={(event) => onBidChange(bid, toNumber(event.target.value))}
            className={AMOUNT_CLASSES}
          />
        </ResultField>
      )}
      <ResultField htmlFor="result-bidders" label={labels.BidderCount.label} hint={labels.BidderCount.hint}>
        <input id="result-bidders" name="bidderCount" type="number" inputMode="numeric" min={0} step={1} defaultValue={bidderCount ?? ""} className={AMOUNT_CLASSES} />
      </ResultField>
    </div>
  );
}
