import { PricingCountryCode } from "@/lib/constants";
import { MARKET_CURRENCY_BADGES } from "@/lib/marketSearch";

interface MarketDropdownTriggerProps {
  id: string;
  listboxId: string;
  open: boolean;
  disabled: boolean;
  hasError: boolean;
  describedBy?: string;
  code: PricingCountryCode;
  label: string;
  hint: string;
  totalCount: number;
  onClick: () => void;
}

const TRIGGER_BASE = [
  "group relative flex w-full min-w-0 max-w-full cursor-pointer items-center justify-between gap-2.5 overflow-hidden border-2 border-ink bg-paper-bright px-3 py-2.5 text-left sm:gap-3 sm:px-3.5",
  "outline-none transition-[border-color,box-shadow,background-color] duration-150",
  "hover:bg-paper focus-visible:border-ink focus-visible:shadow-[inset_0_-3px_0_0_var(--signal)]",
].join(" ");

export default function MarketDropdownTrigger({
  id,
  listboxId,
  open,
  disabled,
  hasError,
  describedBy,
  code,
  label,
  hint,
  totalCount,
  onClick,
}: MarketDropdownTriggerProps) {
  return (
    <button
      id={id}
      type="button"
      disabled={disabled}
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={listboxId}
      data-invalid={hasError || undefined}
      aria-describedby={describedBy}
      onClick={onClick}
      className={`${TRIGGER_BASE} ${open ? "shadow-[inset_0_-3px_0_0_var(--signal)]" : ""} ${hasError ? "border-signal shadow-[inset_0_-3px_0_0_var(--signal)]" : ""}`}
    >
      <span className="flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden sm:gap-3">
        <span className="flex h-8 w-10 shrink-0 items-center justify-center border border-ink bg-ink font-display text-lg leading-none tracking-wider text-signal">
          {code === "GB" ? "UK" : code}
        </span>
        <span className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <span className="truncate font-narrow text-sm font-semibold tracking-wide text-ink uppercase">{label}</span>
          <span className="truncate font-mono text-[11px] text-muted">{hint}</span>
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-2">
        <span className="hidden border border-rule-strong px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-muted uppercase sm:inline-block">
          {MARKET_CURRENCY_BADGES[code]} · {totalCount}
        </span>
        <span
          aria-hidden="true"
          className={`flex size-7 shrink-0 items-center justify-center border border-ink/30 bg-paper text-ink transition-transform duration-200 ${open ? "rotate-180 border-ink bg-ink text-paper-bright" : "group-hover:border-ink"}`}
        >
          <svg viewBox="0 0 16 16" className="size-3.5 fill-none stroke-current stroke-2">
            <path d="M3.5 6L8 10.5L12.5 6" strokeLinecap="square" />
          </svg>
        </span>
      </span>
    </button>
  );
}
