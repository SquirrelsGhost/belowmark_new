// Shows the award date only once the box is ticked
"use client";

import { useState } from "react";
import ResultField from "@/components/app/closing/ResultField";
import { CONTROL_CLASSES } from "@/lib/appStyles";
import { MarketCode } from "@/lib/constants";
import { IClosingTranslation } from "@/translations/closing/IClosingTranslation";

interface ResultBuyerFieldsProps {
  market: MarketCode;
  labels: IClosingTranslation["Result"];
  isBuyer: boolean;
}

/** "I got the Zuschlag" — private, starts the task list. */
export default function ResultBuyerFields({ market, labels, isBuyer }: ResultBuyerFieldsProps) {
  const [checked, setChecked] = useState(isBuyer);
  return (
    <div className="flex flex-col gap-3 border-l-4 border-signal pl-4">
      <label className="flex items-center gap-3 text-sm font-semibold">
        <input type="checkbox" name="isBuyer" checked={checked} onChange={(event) => setChecked(event.target.checked)} className="size-4 accent-signal" />
        {labels.IsBuyer[market]}
      </label>
      {checked && (
        <ResultField htmlFor="result-award" label={labels.AwardDate[market].label} hint={labels.AwardDate[market].hint}>
          <input id="result-award" name="awardDate" type="date" className={`${CONTROL_CLASSES} sm:max-w-56`} />
        </ResultField>
      )}
    </div>
  );
}
