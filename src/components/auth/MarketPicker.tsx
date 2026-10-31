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
}

/** Custom animated "Amtlicher Aushang" dropdown selector for the primary market / country. */
export default function MarketPicker({ number, legend, note, defaultValue, options, error }: MarketPickerProps) {
  const [selected, setSelected] = useState<PricingCountryCode>(defaultValue);

  return (
    <div className="grid gap-1.5">
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
