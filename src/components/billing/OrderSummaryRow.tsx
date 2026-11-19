interface OrderSummaryRowProps {
  label: string;
  value: string;
  /** The total: larger, set on a heavy rule */
  isTotal?: boolean;
  note?: string;
}

/** A line of the order summary, ledger style — stacks cleanly on small screens and wraps safely on wide ones. */
export default function OrderSummaryRow({ label, value, isTotal = false, note }: OrderSummaryRowProps) {
  return (
    <div className={`flex min-w-0 flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 ${isTotal ? "border-t-2 border-ink" : "border-b border-rule"}`}>
      <dt className="min-w-0 font-mono text-[11px] leading-snug tracking-[0.12em] wrap-break-word text-muted uppercase sm:max-w-[46%]">
        {label}
      </dt>
      <dd className="min-w-0 wrap-break-word sm:text-right">
        <span className={isTotal ? "font-display text-3xl leading-none" : "font-mono text-xs leading-snug font-medium text-ink sm:text-sm"}>
          {value}
        </span>
        {note && <span className="mt-1 block font-mono text-[11px] leading-relaxed text-muted">{note}</span>}
      </dd>
    </div>
  );
}
