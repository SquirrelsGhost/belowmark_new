// Needs controlled select state to display the active country code badge alongside the dropdown
"use client";

import { ReactNode, useState } from "react";
import FieldMessages from "@/components/auth/FieldMessages";
import { FIELD_INPUT_CLASSES, FIELD_LABEL_CLASSES } from "@/lib/auth/fieldStyles";
import { PricingCountryCode } from "@/lib/constants";

interface MarketPickerProps {
  number: string;
  legend: string;
  note: string;
  defaultValue: PricingCountryCode;
  error?: string;
  /** <MarketOption /> elements */
  children: ReactNode;
}

/** Dropdown selector for the primary market / country (DE, AT, CH, IT, ES, FR, GB, TR). */
export default function MarketPicker({ number, legend, note, defaultValue, error, children }: MarketPickerProps) {
  const [selected, setSelected] = useState<string>(defaultValue);

  return (
    <div className="grid gap-1.5">
      <label htmlFor="signup-market" className={FIELD_LABEL_CLASSES}>
        <span className="text-signal">{number}</span> {legend}
      </label>
      <div className="relative">
        <select
          id="signup-market"
          name="market"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          aria-describedby="market-note"
          className={`${FIELD_INPUT_CLASSES(Boolean(error))} appearance-none pr-16 font-sans text-sm font-medium cursor-pointer`}
        >
          {children}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-3 flex items-center gap-2 font-mono text-xs font-semibold tracking-widest text-signal"
        >
          <span>{selected}</span>
          <span className="text-ink">▾</span>
        </span>
      </div>
      <p id="market-note" className="text-xs leading-relaxed text-muted">{note}</p>
      <FieldMessages id="market" error={error} />
    </div>
  );
}
