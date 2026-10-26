import { CALCULATOR, LocaleOption, ZVG } from "@/lib/constants";
import { formatPercent } from "@/lib/format";
import { ITranslation } from "@/translations/ITranslation";
import { HearingKind } from "@/types/calculator.types";

interface BidGaugeProps {
  t: ITranslation["HomePage"]["Calculator"];
  locale: LocaleOption;
  value: number;
  bidPct: number;
  hearing: HearingKind;
  onBidChange: (pct: number) => void;
}

/** Lowest percentage shown on the vertical scale — keeps the interesting range large. */
const SCALE_FLOOR = 20;

const toHeight = (pct: number) => ((pct - SCALE_FLOOR) / (100 - SCALE_FLOOR)) * 100;

/**
 * The brand mark as an instrument: the red line is the appraised value
 * (market level), the dot is your bid. The gap between them is the discount.
 */
export default function BidGauge({ t, locale, bidPct, hearing, onBidChange }: BidGaugeProps) {
  const limitsActive = hearing === "first";
  const marks = [
    { pct: ZVG.relativeLimit * 100, label: "7/10" },
    { pct: ZVG.absoluteLimit * 100, label: "5/10" },
  ];

  return (
    <div className="flex flex-col gap-4 border-rule p-5 sm:border-r">
      <div className="relative h-64 bg-hatch" role="img" aria-label={`${t.BidLabel}: ${formatPercent(bidPct, locale)} ${t.ScaleMarket}`}>
        <div className="absolute inset-x-0 top-0 h-1.5 -translate-y-1/2 bg-signal" />
        <span className="absolute top-2 left-0 bg-paper-bright pr-2 font-mono text-[10px] tracking-wider text-signal uppercase">
          100 % · {t.ScaleMarket}
        </span>
        {marks.map((mark) => (
          // Positions are data-driven percentages — inline style is unavoidable here
          <div key={mark.label} className="absolute inset-x-0 border-t border-dashed border-ink/50" style={{ bottom: `${toHeight(mark.pct)}%` }}>
            <span className={`absolute right-0 -translate-y-full bg-paper-bright pl-2 font-mono text-[10px] ${limitsActive ? "text-ink" : "text-muted line-through"}`}>
              {mark.label}
            </span>
          </div>
        ))}
        <div
          className="absolute left-1/2 w-px -translate-x-1/2 bg-signal/60 transition-[height] duration-300"
          style={{ top: 0, height: `${100 - toHeight(bidPct)}%` }}
        />
        <div
          className="absolute left-1/2 size-5 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-paper-bright bg-ink shadow-[0_0_0_1px_var(--ink)] transition-[bottom] duration-300"
          style={{ bottom: `${toHeight(bidPct)}%` }}
        />
        <span
          className="absolute left-1/2 ml-5 translate-y-1/2 font-display text-2xl text-signal transition-[bottom] duration-300"
          style={{ bottom: `${(toHeight(bidPct) + 100) / 2}%` }}
        >
          −{formatPercent(100 - bidPct, locale)}
        </span>
      </div>
      <label className="flex flex-col gap-3">
        <span className="flex items-baseline justify-between font-mono text-[11px] tracking-wider text-muted uppercase">
          <span>{t.BidLabel}</span>
          <span className="text-ink">{formatPercent(bidPct, locale)}</span>
        </span>
        <input
          type="range"
          className="range-ink w-full"
          min={CALCULATOR.minBidPct}
          max={CALCULATOR.maxBidPct}
          value={bidPct}
          onChange={(event) => onBidChange(Number(event.target.value))}
        />
      </label>
    </div>
  );
}
