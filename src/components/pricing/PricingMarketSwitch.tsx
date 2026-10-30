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
    <div className="mt-12">
      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-xs tracking-[0.2em] uppercase">
        <span>{label}</span>
        {detectedLabel && <span className="tracking-normal text-signal normal-case">· {detectedLabel}</span>}
      </p>
      <div role="radiogroup" aria-label={label} className={`mt-3 grid grid-cols-2 border-2 border-ink sm:grid-cols-4 ${isPending ? "opacity-60" : ""}`}>
        {PRICING_COUNTRIES.map((market, index) => {
          const isActive = market === current;
          const borderClasses = [
            index >= 2 ? "border-t-2 border-ink" : "",
            index >= 2 && index < 4 ? "sm:border-t-0" : "",
            index % 2 === 1 ? "border-l-2 border-ink" : "",
            index % 4 !== 0 ? "sm:border-l-2 sm:border-ink" : "sm:border-l-0",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <button
              key={market}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => select(market)}
              className={`group relative flex items-center gap-3.5 px-4 py-3.5 text-left transition-colors duration-200 ${borderClasses} ${
                isActive ? "bg-ink text-paper-bright" : "bg-paper-bright text-ink hover:bg-paper-deep"
              }`}
            >
              <span className={`font-display text-3xl leading-none ${isActive ? "text-signal" : "text-muted group-hover:text-ink"}`}>{market}</span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-base leading-tight font-semibold">{options[market].label}</span>
                <span className={`truncate font-mono text-[11px] ${isActive ? "text-paper/65" : "text-muted"}`}>{options[market].scope}</span>
              </span>
              {isActive && <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-signal" />}
            </button>
          );
        })}
      </div>
      <p className="mt-3 font-mono text-xs text-muted">{hint}</p>
    </div>
  );
}
