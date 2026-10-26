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
    <div className={`flex items-baseline justify-between gap-6 py-3 ${isTotal ? "border-t-2 border-ink" : "border-b border-rule"}`}>
      <dt className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">{label}</dt>
      <dd className="text-right">
        <span className={isTotal ? "font-display text-3xl leading-none" : "font-mono text-sm font-medium text-ink"}>{value}</span>
        {note && <span className="mt-1 block font-mono text-[11px] text-muted">{note}</span>}
      </dd>
    </div>
  );
}
