interface CalculatorRowProps {
  label: string;
  value: string;
  /** Emphasised sum row with a heavy top rule */
  isTotal?: boolean;
}

/** Ledger line with a dotted leader between label and amount. */
export default function CalculatorRow({ label, value, isTotal = false }: CalculatorRowProps) {
  return (
    <div className={`flex items-baseline gap-2 py-1.5 ${isTotal ? "mt-1 border-t-2 border-ink pt-2.5" : ""}`}>
      <dt className={`shrink-0 text-sm ${isTotal ? "font-semibold" : "text-ink-soft"}`}>{label}</dt>
      <span aria-hidden="true" className="min-w-4 flex-1 translate-y-[-3px] border-b border-dotted border-ink/40" />
      <dd className={`shrink-0 font-mono text-sm ${isTotal ? "font-semibold" : ""}`}>{value}</dd>
    </div>
  );
}
