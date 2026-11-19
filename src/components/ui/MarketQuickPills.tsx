import { PricingCountryCode } from "@/lib/constants";

export interface MarketPillItem {
  code: PricingCountryCode;
  label: string;
}

interface MarketQuickPillsProps {
  value: PricingCountryCode;
  options: readonly MarketPillItem[];
  onSelect: (code: PricingCountryCode) => void;
  disabled?: boolean;
  ariaLabel?: string;
}

const PILL_BASE = [
  "group/pill relative inline-flex min-w-0 cursor-pointer items-center gap-1.5 border px-2 py-1 text-left transition-colors duration-150",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal disabled:pointer-events-none disabled:opacity-50",
].join(" ");

const PILL_ACTIVE = "border-ink bg-ink text-paper-bright shadow-[2px_2px_0_0_var(--signal)]";
const PILL_IDLE = "border-ink/35 bg-paper-bright text-ink hover:border-ink hover:bg-paper-deep";

/** 1-click country chips so all 12 supported countries are visible immediately without opening a menu. */
export default function MarketQuickPills({
  value,
  options,
  onSelect,
  disabled = false,
  ariaLabel = "Countries",
}: MarketQuickPillsProps) {
  return (
    <div role="group" aria-label={ariaLabel} className="flex min-w-0 flex-wrap gap-1.5">
      {options.map((item) => {
        const isSelected = item.code === value;
        const displayCode = item.code === "GB" ? "UK" : item.code;
        return (
          <button
            key={item.code}
            type="button"
            disabled={disabled}
            aria-pressed={isSelected}
            title={`${item.label} (${displayCode})`}
            onClick={() => onSelect(item.code)}
            className={`${PILL_BASE} ${isSelected ? PILL_ACTIVE : PILL_IDLE}`}
          >
            <span className={`font-mono text-[10px] font-bold tracking-wider uppercase ${isSelected ? "text-signal" : "text-ink"}`}>
              {displayCode}
            </span>
            <span className={`max-w-[6.5rem] truncate font-narrow text-[11px] font-medium ${isSelected ? "text-paper-bright" : "text-ink-soft group-hover/pill:text-ink"}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
