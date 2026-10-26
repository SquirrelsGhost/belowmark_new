// Holds value, KDV rate and bid in state and recomputes the purchase costs live
"use client";

import { useState } from "react";
import IcraCalculatorControls from "@/components/app/calculator/IcraCalculatorControls";
import IcraCalculatorResults from "@/components/app/calculator/IcraCalculatorResults";
import { LocaleOption } from "@/lib/constants";
import { getIcraFigures } from "@/lib/listingMath";
import { IAppTranslation } from "@/translations/app/IAppTranslation";

interface IcraCalculatorProps {
  labels: IAppTranslation["Calculator"]["Tr"];
  costLabels: IAppTranslation["Listing"]["Tr"];
  locale: LocaleOption;
  value: number;
  vatRate: number | null;
  /** On the detail page value and KDV come from the notice and stay fixed */
  isFixed: boolean;
}

/** Bids start at 50 % of the appraised value; the slider goes up to 150 %. */
const BID_RANGE = { min: 50, max: 150, initial: 50 } as const;

/** Turkish e-auction calculator: starting bid, deposit, KDV, tapu, damga, döner sermaye. */
export default function IcraCalculator({ labels, costLabels, locale, value: initialValue, vatRate: initialVat, isFixed }: IcraCalculatorProps) {
  const [value, setValue] = useState(initialValue);
  const [vatRate, setVatRate] = useState<number | null>(initialVat);
  const [bidPct, setBidPct] = useState<number>(BID_RANGE.initial);
  const bid = (value * bidPct) / 100;
  const figures = getIcraFigures(value, vatRate, bid);

  return (
    <section aria-label={labels.Title} className="border-2 border-ink bg-paper-bright shadow-[8px_8px_0_0_var(--ink)]">
      <div className="flex flex-wrap items-baseline justify-between gap-2 bg-ink px-4 py-2.5 text-paper-bright">
        <h2 className="font-display text-xl tracking-wide">{labels.Title}</h2>
        <span className="font-mono text-[10px] tracking-wider text-paper/60 uppercase">{labels.Subtitle}</span>
      </div>
      <IcraCalculatorControls
        labels={labels}
        bidLabel={costLabels.BidLabel}
        locale={locale}
        value={value}
        vatRate={vatRate}
        bidPct={bidPct}
        bidRange={BID_RANGE}
        isFixed={isFixed}
        onValueChange={setValue}
        onVatChange={setVatRate}
        onBidChange={setBidPct}
      />
      <IcraCalculatorResults labels={costLabels} locale={locale} value={value} bid={bid} figures={figures} />
      <p className="border-t border-rule px-4 py-3 font-mono text-[11px] leading-relaxed text-muted">{labels.Footnote}</p>
    </section>
  );
}
