// Needs click handling + router.refresh() to re-render the server-side plans
"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { MARKETS, MarketCode } from "@/lib/constants";
import { setMarketAction } from "@/lib/regionActions";

interface MarketOption {
  label: string;
  scope: string;
}

interface PricingMarketSwitchProps {
  current: MarketCode;
  label: string;
  /** Shown next to the label while the market still follows the location */
  detectedLabel?: string;
  hint: string;
  options: Record<MarketCode, MarketOption>;
}

/** Two notice tabs, Deutschland / Türkei; the choice is stored via a Server Action. */
export default function PricingMarketSwitch({ current, label, detectedLabel, hint, options }: PricingMarketSwitchProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const select = (market: MarketCode) => {
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
      <div role="radiogroup" aria-label={label} className={`mt-3 grid border-2 border-ink sm:inline-grid sm:grid-cols-2 ${isPending ? "opacity-60" : ""}`}>
        {MARKETS.map((market) => {
          const isActive = market === current;
          return (
            <button
              key={market}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => select(market)}
              className={`group relative flex items-center gap-4 px-5 py-4 text-left transition-colors duration-200 not-first:border-t-2 not-first:border-ink sm:min-w-72 sm:not-first:border-t-0 sm:not-first:border-l-2 ${
                isActive ? "bg-ink text-paper-bright" : "bg-paper-bright text-ink hover:bg-paper-deep"
              }`}
            >
              <span className={`font-display text-4xl leading-none ${isActive ? "text-signal" : "text-muted group-hover:text-ink"}`}>{market}</span>
              <span className="flex flex-col">
                <span className="text-lg leading-tight font-semibold">{options[market].label}</span>
                <span className={`font-mono text-[11px] ${isActive ? "text-paper/65" : "text-muted"}`}>{options[market].scope}</span>
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
