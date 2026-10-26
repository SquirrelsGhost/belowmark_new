import { CONTROL_CLASSES, LABEL_CLASSES } from "@/lib/appStyles";

interface BidLimitFieldProps {
  id: string;
  label: string;
  hint: string;
  /** "€", "%", "m²", "Tage" */
  suffix: string;
  value: number | null;
  onChange: (value: number | null) => void;
}

/** One number input of the bid limit. Empty stays empty — it is never read as 0 by the label. */
export default function BidLimitField({ id, label, hint, suffix, value, onChange }: BidLimitFieldProps) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1">
      <span className={LABEL_CLASSES}>{label}</span>
      <span className="relative flex">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          step="any"
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value === "" ? null : Math.max(0, Number(event.target.value)))}
          className={`${CONTROL_CLASSES} pr-12 text-right`}
        />
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-[11px] text-muted">
          {suffix}
        </span>
      </span>
      {hint && <span className="text-[11px] leading-snug text-muted">{hint}</span>}
    </label>
  );
}
