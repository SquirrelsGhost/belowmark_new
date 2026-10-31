// Needs click handling + router.refresh() to re-render the server-side plans
"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import MarketDropdown from "@/components/ui/MarketDropdown";
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

/** Custom animated dropdown across all 8 localized markets (DE, AT, CH, IT, ES, FR, GB, TR); stored via Server Action. */
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
      <label htmlFor="pricing-market-select" className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-xs tracking-[0.2em] uppercase">
        <span>{label}</span>
        {detectedLabel && <span className="tracking-normal text-signal normal-case">· {detectedLabel}</span>}
      </label>
      <MarketDropdown
        id="pricing-market-select"
        value={current}
        disabled={isPending}
        onChange={select}
        options={PRICING_COUNTRIES.map((code) => ({
          code,
          label: options[code].label,
          hint: options[code].scope,
        }))}
      />
      <p className="mt-3 font-mono text-xs text-muted">{hint}</p>
    </div>
  );
}
