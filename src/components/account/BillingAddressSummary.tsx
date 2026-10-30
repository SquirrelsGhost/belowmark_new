interface BillingAddressSummaryProps {
  name: string;
  address: string;
  vatId: string;
  vatLabel: string;
  editLabel: string;
  onEdit: () => void;
}

/** The saved address as one small card — name, address lines, VAT id — with an "edit" button instead of input boxes. */
export default function BillingAddressSummary({ name, address, vatId, vatLabel, editLabel, onEdit }: BillingAddressSummaryProps) {
  const lines = address.split(/\r?\n/).filter(Boolean);
  return (
    <div className="flex items-start justify-between gap-4 border border-rule bg-paper-bright px-4 py-3">
      <address className="min-w-0 text-sm leading-relaxed not-italic text-ink">
        <span className="font-semibold">{name}</span>
        <span className="text-ink-soft">{lines.map((line) => ` · ${line}`).join("")}</span>
        {vatId && (
          <span className="mt-0.5 block font-mono text-[11px] tracking-[0.08em] text-muted">
            {vatLabel} {vatId}
          </span>
        )}
      </address>
      <button
        type="button"
        onClick={onEdit}
        className="shrink-0 border-b border-signal font-mono text-[11px] font-semibold tracking-[0.14em] text-ink uppercase hover:text-signal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
      >
        {editLabel}
      </button>
    </div>
  );
}
