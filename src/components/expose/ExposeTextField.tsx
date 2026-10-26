import { CONTROL_CLASSES, LABEL_CLASSES } from "@/lib/appStyles";

interface ExposeTextFieldProps {
  id: string;
  label: string;
  hint: string;
  value: string;
  maxLength: number;
  onChange: (value: string) => void;
  /** Multi-line text with this many rows */
  rows?: number;
  type?: "text" | "tel" | "email" | "date";
  autoComplete?: string;
  wide?: boolean;
}

const AREA_CLASSES = "w-full border border-rule-strong bg-paper-bright px-3 py-2 text-[13px] leading-relaxed text-ink outline-none transition-shadow focus:shadow-[3px_3px_0_0_var(--signal)]";

/** One text input of the exposé form; long texts show how much room is left. */
export default function ExposeTextField({ id, label, hint, value, maxLength, onChange, rows, type = "text", autoComplete, wide = false }: ExposeTextFieldProps) {
  return (
    <label htmlFor={id} className={`flex flex-col gap-1 ${wide ? "sm:col-span-3" : ""}`}>
      <span className="flex justify-between gap-2">
        <span className={LABEL_CLASSES}>{label}</span>
        {rows && <span className="font-mono text-[10px] text-muted">{`${value.length} / ${maxLength}`}</span>}
      </span>
      {rows ? (
        <textarea id={id} rows={rows} maxLength={maxLength} value={value} onChange={(event) => onChange(event.target.value)} className={AREA_CLASSES} />
      ) : (
        <input id={id} type={type} maxLength={maxLength} autoComplete={autoComplete} value={value} onChange={(event) => onChange(event.target.value)} className={CONTROL_CLASSES} />
      )}
      {hint && <span className="text-[11px] leading-snug text-muted">{hint}</span>}
    </label>
  );
}
