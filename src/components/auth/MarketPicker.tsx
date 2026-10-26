import { ReactNode } from "react";
import FieldMessages from "@/components/auth/FieldMessages";
import { FIELD_LABEL_CLASSES } from "@/lib/auth/fieldStyles";

interface MarketPickerProps {
  number: string;
  legend: string;
  note: string;
  error?: string;
  /** <MarketOption /> elements */
  children: ReactNode;
}

/** Radio group for the booked market — one market per account. */
export default function MarketPicker({ number, legend, note, error, children }: MarketPickerProps) {
  return (
    <fieldset className="grid gap-1.5" aria-describedby="market-note">
      <legend className={`${FIELD_LABEL_CLASSES} mb-1.5`}>
        <span className="text-signal">{number}</span> {legend}
      </legend>
      <div className="grid grid-cols-2 gap-2">{children}</div>
      <p id="market-note" className="text-xs leading-relaxed text-muted">{note}</p>
      <FieldMessages id="market" error={error} />
    </fieldset>
  );
}
