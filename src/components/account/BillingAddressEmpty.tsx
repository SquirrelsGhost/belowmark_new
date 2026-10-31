interface BillingAddressEmptyProps {
  message: string;
  addLabel: string;
  onAdd: () => void;
}

/** No address yet: one dashed line with a small "Adresse hinterlegen" button instead of three empty input boxes. */
export default function BillingAddressEmpty({ message, addLabel, onAdd }: BillingAddressEmptyProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border border-dashed border-rule-strong px-4 py-3">
      <p className="text-sm text-ink-soft">{message}</p>
      <button
        type="button"
        onClick={onAdd}
        className="shrink-0 border-b border-signal font-mono text-[11px] font-semibold tracking-[0.14em] text-ink uppercase hover:text-signal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
      >
        {addLabel}
      </button>
    </div>
  );
}
