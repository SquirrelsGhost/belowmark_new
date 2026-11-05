// Needs state to drive the custom animated MarketDropdown
"use client";

import { useState } from "react";
import FieldMessages from "@/components/auth/FieldMessages";
import MarketDropdown, { MarketDropdownOption } from "@/components/ui/MarketDropdown";
import { FIELD_LABEL_CLASSES } from "@/lib/auth/fieldStyles";
import { PricingCountryCode } from "@/lib/constants";

interface MarketPickerProps {
  number: string;
  legend: string;
  note: string;
  defaultValue: PricingCountryCode;
  options: readonly MarketDropdownOption[];
  error?: string;
  compactInitial?: boolean;
}

/** Custom animated "Amtlicher Aushang" dropdown selector for the primary market / country. */
export default function MarketPicker({
  number,
  legend,
  note,
  defaultValue,
  options,
  error,
  compactInitial = false,
}: MarketPickerProps) {
  const [selected, setSelected] = useState<PricingCountryCode>(defaultValue);
  const [expanded, setExpanded] = useState(!compactInitial || Boolean(error));
  const currentOption = options.find((o) => o.code === selected) ?? options[0];

  if (!expanded && currentOption) {
    return (
      <div className="flex items-center justify-between gap-3 border border-rule bg-paper-bright px-3.5 py-2.5">
        <input type="hidden" name="market" value={selected} />
        <div className="min-w-0">
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
            <span className="text-signal">{number}</span> {legend}:
          </span>{" "}
          <span className="font-mono text-xs font-semibold text-ink">
            {currentOption.label} ({currentOption.code})
          </span>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="shrink-0 cursor-pointer font-mono text-[11px] font-semibold uppercase tracking-wider text-signal underline hover:text-ink"
        >
          {currentOption.code} ✎
        </button>
      </div>
    );
  }

  return (
    <div className="grid min-w-0 gap-1.5">
      <label htmlFor="signup-market" className={FIELD_LABEL_CLASSES}>
        <span className="text-signal">{number}</span> {legend}
      </label>
      <MarketDropdown
        id="signup-market"
        name="market"
        value={selected}
        options={options}
        onChange={setSelected}
        hasError={Boolean(error)}
        describedBy="market-note"
      />
      <p id="market-note" className="text-xs leading-relaxed text-muted">{note}</p>
      <FieldMessages id="market" error={error} />
    </div>
  );
}
