// Holds the calculator inputs in state and recomputes all figures live
"use client";

import { useState } from "react";
import BidGauge from "@/components/hero/BidGauge";
import CalculatorControls from "@/components/hero/CalculatorControls";
import CalculatorResults from "@/components/hero/CalculatorResults";
import { LocaleOption, ROUTES } from "@/lib/constants";
import { HomeCalculatorConfig, getHomeMarketBundle } from "@/lib/homeMarketData";
import { ITranslation } from "@/translations/ITranslation";
import { HearingKind, Verdict } from "@/types/calculator.types";

interface BidCalculatorProps {
  t: ITranslation["HomePage"]["Calculator"];
  locale: LocaleOption;
  config?: HomeCalculatorConfig;
}

function getVerdict(bidShare: number, hearing: HearingKind, config: HomeCalculatorConfig): Verdict {
  if (hearing === "followUp" && config.secondHearingWaivesLimits) return "waived";
  if (bidShare < config.absoluteLimit) return "refused";
  if (hearing === "followUp" && !config.secondHearingWaivesLimits) return "waived";
  if (bidShare < config.relativeLimit) return "contestable";
  return "clear";
}

function mergeCopy(
  base: ITranslation["HomePage"]["Calculator"],
  overrides?: HomeCalculatorConfig["copyOverrides"],
): ITranslation["HomePage"]["Calculator"] {
  if (!overrides) return base;
  return {
    ...base,
    Subtitle: overrides.subtitle ?? base.Subtitle,
    LimitAbsolute: overrides.limitAbsolute ?? base.LimitAbsolute,
    LimitRelative: overrides.limitRelative ?? base.LimitRelative,
    Deposit: overrides.deposit ?? base.Deposit,
    TransferTax: overrides.transferTax ?? base.TransferTax,
    VerdictRefused: overrides.verdictRefused ?? base.VerdictRefused,
    VerdictContestable: overrides.verdictContestable ?? base.VerdictContestable,
    VerdictClear: overrides.verdictClear ?? base.VerdictClear,
    VerdictWaived: overrides.verdictWaived ?? base.VerdictWaived,
    Footnote: overrides.footnote ?? base.Footnote,
  };
}

/** Interactive country-aware judicial auction bid calculator. */
export default function BidCalculator({ t, locale, config: configProp }: BidCalculatorProps) {
  const config = configProp ?? getHomeMarketBundle("DE", locale).calculator;
  const [value, setValue] = useState<number>(config.defaultValue);
  const [regionCode, setRegionCode] = useState<string>(config.defaultRegionCode);
  const [hearing, setHearing] = useState<HearingKind>("first");
  const [bidPct, setBidPct] = useState<number>(config.defaultBidPct);

  const copy = mergeCopy(t, config.copyOverrides);
  const region = config.regions.find((entry) => entry.code === regionCode) ?? config.regions[0];
  const taxPct = region?.transferTaxPct ?? 4;
  const bid = (value * bidPct) / 100;
  const tax = (bid * taxPct) / 100;
  const verdict = getVerdict(bidPct / 100, hearing, config);

  return (
    <div id={ROUTES.calculator.slice(1)} className="scroll-mt-24 border-2 border-ink bg-paper-bright shadow-[10px_10px_0_0_var(--ink)]">
      <div className="flex items-baseline justify-between gap-4 bg-ink px-5 py-3 text-paper-bright">
        <h2 className="font-display text-2xl tracking-wide">{copy.Title}</h2>
        <span className="font-mono text-[11px] tracking-wider text-paper/60 uppercase">{copy.Subtitle}</span>
      </div>
      <CalculatorControls
        t={copy}
        locale={locale}
        config={config}
        value={value}
        regionCode={region?.code ?? config.defaultRegionCode}
        hearing={hearing}
        onValueChange={setValue}
        onRegionChange={setRegionCode}
        onHearingChange={setHearing}
      />
      <div className="grid border-t border-rule sm:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <BidGauge
          t={copy}
          locale={locale}
          bidPct={bidPct}
          hearing={hearing}
          gaugeMarks={config.gaugeMarks}
          secondHearingWaivesLimits={config.secondHearingWaivesLimits}
          onBidChange={setBidPct}
        />
        <CalculatorResults
          t={copy}
          locale={locale}
          currency={config.currency}
          value={value}
          bid={bid}
          tax={tax}
          taxPct={taxPct}
          absoluteLimit={config.absoluteLimit}
          relativeLimit={config.relativeLimit}
          deposit={value * config.depositRatio}
          verdict={verdict}
        />
      </div>
      <p className="border-t border-rule px-5 py-3 font-mono text-[11px] leading-relaxed text-muted">{copy.Footnote}</p>
    </div>
  );
}
