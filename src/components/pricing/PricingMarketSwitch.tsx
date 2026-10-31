// Needs click handling + router.refresh() to re-render the server-side plans
"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { PRICING_COUNTRIES, PricingCountryCode } from "@/lib/constants";
import { setMarketAction } from "@/lib/regionActions";

interface MarketOption {
  label: string;
  scope: string;
}

interface PricingMarketSwitchProps {
  current: PricingCountryCode;
  label: string;
  /** Shown next to the label while the market still follows the location */
  detectedLabel?: string;
  hint: string;
  options: Record<PricingCountryCode, MarketOption>;
}

/** Country notice tabs across all 8 localized markets (DE, AT, CH, IT, ES, FR, GB, TR); stored via Server Action. */
export default function PricingMarketSwitch({ current, label, detectedLabel, hint, options }: PricingMarketSwitchProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const select = (market: PricingCountryCode) => {
    if (market === current) return;
    startTransition(async () => {
      await setMarketAction(market);
      router.refresh();
    });
  };

  return (
    <div className="mt-12 max-w-xl">
      <label htmlFor="pricing-market-select" className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-xs tracking-[0.2em] uppercase">
        <span>{label}</span>
        {detectedLabel && <span className="tracking-normal text-signal normal-case">· {detectedLabel}</span>}
      </label>
      <div className={`relative mt-3 ${isPending ? "opacity-60" : ""}`}>
        <select
          id="pricing-market-select"
          value={current}
          onChange={(e) => select(e.target.value as PricingCountryCode)}
          className="w-full cursor-pointer appearance-none border-2 border-ink bg-paper-bright px-5 py-4 pr-24 font-sans text-base font-semibold text-ink shadow-[4px_4px_0_var(--color-ink)] transition-colors hover:bg-paper-deep focus:outline-2 focus:outline-offset-2 focus:outline-signal"
        >
          {PRICING_COUNTRIES.map((market) => (
            <option key={market} value={market}>
              {options[market].label} ({market}) — {options[market].scope}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-4 flex items-center gap-2.5 font-display text-2xl leading-none text-signal"
        >
          <span>{current}</span>
          <span className="font-sans text-sm text-ink">▾</span>
        </span>
      </div>
      <p className="mt-3 font-mono text-xs text-muted">{hint}</p>
    </div>
  );
}
