// Holds the calculator inputs in state and recomputes all figures live
"use client";

import { useState } from "react";
import BidGauge from "@/components/hero/BidGauge";
import CalculatorControls from "@/components/hero/CalculatorControls";
import CalculatorResults from "@/components/hero/CalculatorResults";
import { CALCULATOR, LocaleOption, ROUTES, ZVG } from "@/lib/constants";
import { DACH_STATES, StateCode } from "@/lib/snapshot";
import { ITranslation } from "@/translations/ITranslation";
import { HearingKind, Verdict } from "@/types/calculator.types";

interface BidCalculatorProps {
  t: ITranslation["HomePage"]["Calculator"];
  locale: LocaleOption;
}

function getVerdict(bidShare: number, hearing: HearingKind): Verdict {
  if (hearing === "followUp") return "waived";
  if (bidShare < ZVG.absoluteLimit) return "refused";
  if (bidShare < ZVG.relativeLimit) return "contestable";
  return "clear";
}

/** Interactive ZVG bid calculator: limits, deposit, transfer tax and entry price. */
export default function BidCalculator({ t, locale }: BidCalculatorProps) {
  const [value, setValue] = useState<number>(CALCULATOR.defaultValue);
  const [stateCode, setStateCode] = useState<StateCode>(CALCULATOR.defaultState);
  const [hearing, setHearing] = useState<HearingKind>("first");
  const [bidPct, setBidPct] = useState<number>(CALCULATOR.defaultBidPct);

  const state = DACH_STATES.find((entry) => entry.code === stateCode) ?? DACH_STATES[0];
  const bid = (value * bidPct) / 100;
  const tax = (bid * state.transferTaxPct) / 100;
  const verdict = getVerdict(bidPct / 100, hearing);

  return (
    <div id={ROUTES.calculator.slice(1)} className="scroll-mt-24 border-2 border-ink bg-paper-bright shadow-[10px_10px_0_0_var(--ink)]">
      <div className="flex items-baseline justify-between gap-4 bg-ink px-5 py-3 text-paper-bright">
        <h2 className="font-display text-2xl tracking-wide">{t.Title}</h2>
        <span className="font-mono text-[11px] tracking-wider text-paper/60 uppercase">{t.Subtitle}</span>
      </div>
      <CalculatorControls
        t={t}
        locale={locale}
        value={value}
        stateCode={stateCode}
        hearing={hearing}
        onValueChange={setValue}
        onStateChange={setStateCode}
        onHearingChange={setHearing}
      />
      <div className="grid border-t border-rule sm:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <BidGauge t={t} locale={locale} value={value} bidPct={bidPct} hearing={hearing} onBidChange={setBidPct} />
        <CalculatorResults
          t={t}
          locale={locale}
          value={value}
          bid={bid}
          tax={tax}
          taxPct={state.transferTaxPct}
          deposit={value * ZVG.deposit}
          verdict={verdict}
        />
      </div>
      <p className="border-t border-rule px-5 py-3 font-mono text-[11px] leading-relaxed text-muted">{t.Footnote}</p>
    </div>
  );
}
