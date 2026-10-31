// Interactive country-specific foreclosure & auction calculator for AT, CH, IT, ES, FR, GB
"use client";

import { useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { EU_MARKET_COPY } from "@/lib/pseo/euMarketCopy";
import { EU_MARKET_META } from "@/lib/pseo/euMarketRegions";
import { EuPseoMarketCode, PseoLocale } from "@/types/pseo.types";

interface PseoEuPublicCalculatorProps {
  market: EuPseoMarketCode;
}

const LOCALE_FORMAT: Record<PseoLocale, string> = {
  de: "de-DE",
  tr: "tr-TR",
  en: "en-GB",
  it: "it-IT",
  es: "es-ES",
  fr: "fr-FR",
};

export default function PseoEuPublicCalculator({ market }: PseoEuPublicCalculatorProps) {
  const copy = EU_MARKET_COPY[market];
  const meta = EU_MARKET_META[market];

  const [appraisedValue, setAppraisedValue] = useState<number>(copy.defaultValue);
  const [taxRatePct, setTaxRatePct] = useState<number>(copy.defaultTaxPct);
  const [repairBudget, setRepairBudget] = useState<number>(copy.defaultRepair);

  const fmt = (val: number) =>
    new Intl.NumberFormat(LOCALE_FORMAT[meta.locale], {
      style: "currency",
      currency: meta.currency,
      maximumFractionDigits: 0,
    }).format(Math.round(val));

  const minBid = appraisedValue * copy.minBidRatio;
  const thresholdBid = appraisedValue * copy.thresholdRatio;
  const rawDeposit =
    market === "IT"
      ? minBid * copy.depositRatio
      : market === "FR"
        ? Math.max(3000, minBid * copy.depositRatio)
        : market === "GB"
          ? Math.max(5000, minBid * copy.depositRatio)
          : appraisedValue * copy.depositRatio;
  const courtFee = appraisedValue * copy.courtFeeRatio;
  const transferTax = thresholdBid * (taxRatePct / 100);
  const totalAtThreshold = thresholdBid + courtFee + transferTax + repairBudget;
  const discountAtMin = Math.max(0, appraisedValue - minBid);

  return (
    <div className="mt-8 grid gap-6 border-2 border-ink bg-paper-bright p-6 sm:p-8 lg:grid-cols-12">
      <div className="space-y-5 lg:col-span-6">
        <div>
          <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-ink">
            {copy.valueLabel}
          </label>
          <input
            type="number"
            min={10000}
            step={5000}
            value={appraisedValue}
            onChange={(e) => setAppraisedValue(Math.max(0, Number(e.target.value) || 0))}
            className="mt-2 h-11 w-full border-2 border-ink bg-paper px-3.5 font-mono text-base font-semibold text-ink"
          />
        </div>

        <div>
          <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-ink">
            {copy.taxLabel}
          </label>
          <input
            type="number"
            min={0}
            max={25}
            step={0.2}
            value={taxRatePct}
            onChange={(e) => setTaxRatePct(Math.max(0, Number(e.target.value) || 0))}
            className="mt-2 h-11 w-full border-2 border-ink bg-paper px-3.5 font-mono text-base font-semibold text-ink"
          />
        </div>

        <div>
          <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-ink">
            {copy.repairLabel}
          </label>
          <input
            type="number"
            min={0}
            step={2500}
            value={repairBudget}
            onChange={(e) => setRepairBudget(Math.max(0, Number(e.target.value) || 0))}
            className="mt-2 h-11 w-full border-2 border-ink bg-paper px-3.5 font-mono text-base font-semibold text-ink"
          />
        </div>
      </div>

      <div className="flex flex-col justify-between border-2 border-ink bg-paper-deep p-6 lg:col-span-6">
        <div className="space-y-4">
          <div className="flex items-baseline justify-between border-b border-rule-strong pb-3">
            <span className="font-mono text-xs uppercase text-ink-soft">{copy.depositLabel}</span>
            <span className="font-mono text-lg font-bold text-ink">{fmt(rawDeposit)}</span>
          </div>

          <div className="flex items-baseline justify-between border-b border-rule-strong pb-3">
            <span className="font-mono text-xs uppercase text-ink-soft">{copy.minBidLabel}</span>
            <span className="font-mono text-xl font-bold text-signal">{fmt(minBid)}</span>
          </div>

          <div className="flex items-baseline justify-between border-b border-rule-strong pb-3">
            <span className="font-mono text-xs uppercase text-ink-soft">{copy.thresholdLabel}</span>
            <span className="font-mono text-lg font-bold text-ink">{fmt(thresholdBid)}</span>
          </div>

          <div className="flex items-baseline justify-between border-b border-rule-strong pb-3">
            <span className="font-mono text-xs uppercase text-ink-soft">{copy.totalCostLabel}</span>
            <span className="font-mono text-lg font-bold text-ink">{fmt(totalAtThreshold)}</span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="font-mono text-xs uppercase text-ink-soft">{copy.discountLabel}</span>
            <span className="font-mono text-base font-semibold text-signal">-{fmt(discountAtMin)}</span>
          </div>
        </div>

        <div className="mt-6 pt-4">
          <Link
            href={ROUTES.signup}
            className="inline-flex h-11 w-full items-center justify-center border-2 border-signal bg-signal px-5 font-narrow text-xs font-semibold uppercase tracking-wider text-paper-bright hover:bg-signal-deep"
          >
            {copy.ctaButtonLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
