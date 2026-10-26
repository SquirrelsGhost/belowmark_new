// Holds the bid and hearing in state; value and tax rate are fixed by the notice
"use client";

import { useState } from "react";
import BidGauge from "@/components/hero/BidGauge";
import CalculatorResults from "@/components/hero/CalculatorResults";
import { CALCULATOR, LocaleOption, ZVG } from "@/lib/constants";
import { ITranslation } from "@/translations/ITranslation";
import { HearingKind, Verdict } from "@/types/calculator.types";

interface ObjectBidCalculatorProps {
  t: ITranslation["HomePage"]["Calculator"];
  locale: LocaleOption;
  title: string;
  note: string;
  value: number;
  transferTaxPct: number;
  /** Limits already fell away in an earlier hearing */
  limitsWaived: boolean;
}

const HEARING_BUTTON = "h-9 flex-1 cursor-pointer border border-ink font-narrow text-xs font-semibold tracking-[0.06em] uppercase";

function getVerdict(bidShare: number, hearing: HearingKind): Verdict {
  if (hearing === "followUp") return "waived";
  if (bidShare < ZVG.absoluteLimit) return "refused";
  if (bidShare < ZVG.relativeLimit) return "contestable";
  return "clear";
}

/** The landing page calculator, bound to one proceeding. */
export default function ObjectBidCalculator({ t, locale, title, note, value, transferTaxPct, limitsWaived }: ObjectBidCalculatorProps) {
  const [hearing, setHearing] = useState<HearingKind>(limitsWaived ? "followUp" : "first");
  const [bidPct, setBidPct] = useState<number>(CALCULATOR.defaultBidPct);
  const bid = (value * bidPct) / 100;

  return (
    <section aria-label={title} className="border-2 border-ink bg-paper-bright shadow-[8px_8px_0_0_var(--ink)]">
      <div className="flex flex-wrap items-baseline justify-between gap-2 bg-ink px-4 py-2.5 text-paper-bright">
        <h2 className="font-display text-xl tracking-wide">{title}</h2>
        <span className="font-mono text-[10px] tracking-wider text-paper/60 uppercase">{t.Subtitle}</span>
      </div>
      <div className="flex flex-wrap items-center gap-3 border-b border-rule px-4 py-3">
        <p className="flex-1 text-xs leading-snug text-muted">{note}</p>
        <div role="group" aria-label={t.HearingLabel} className="flex w-full gap-0 sm:w-64">
          {(["first", "followUp"] as const).map((kind) => (
            <button
              key={kind}
              type="button"
              aria-pressed={hearing === kind}
              onClick={() => setHearing(kind)}
              className={`${HEARING_BUTTON} ${hearing === kind ? "bg-ink text-paper-bright" : "bg-paper-bright text-ink"}`}
            >
              {kind === "first" ? t.FirstHearing : t.FollowUpHearing}
            </button>
          ))}
        </div>
      </div>
      <div className="grid sm:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <BidGauge t={t} locale={locale} value={value} bidPct={bidPct} hearing={hearing} onBidChange={setBidPct} />
        <CalculatorResults
          t={t}
          locale={locale}
          value={value}
          bid={bid}
          tax={(bid * transferTaxPct) / 100}
          taxPct={transferTaxPct}
          deposit={value * ZVG.deposit}
          verdict={getVerdict(bidPct / 100, hearing)}
        />
      </div>
      <p className="border-t border-rule px-4 py-3 font-mono text-[11px] leading-relaxed text-muted">{t.Footnote}</p>
    </section>
  );
}
