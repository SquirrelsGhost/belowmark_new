interface OrderSummaryRowProps {
  label: string;
  value: string;
  /** The total: larger, set on a heavy rule */
  isTotal?: boolean;
  note?: string;
}

/** A line of the order summary, ledger style. */
export default function OrderSummaryRow({ label, value, isTotal = false, note }: OrderSummaryRowProps) {
  return (
    <div className={`flex items-baseline justify-between gap-4 py-3 ${isTotal ? "border-t-2 border-ink" : "border-b border-rule"}`}>
      <dt className="shrink-0 font-mono text-[11px] tracking-[0.12em] text-muted uppercase">{label}</dt>
      <dd className="min-w-0 text-right">
        <span className={isTotal ? "font-display text-3xl leading-none whitespace-nowrap" : "font-mono text-xs leading-snug font-medium text-ink sm:text-sm"}>
          {value}
        </span>
        {note && <span className="mt-1 block font-mono text-[11px] text-muted">{note}</span>}
      </dd>
    </div>
  );
}
