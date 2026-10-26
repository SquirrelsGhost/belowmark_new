import PageRef from "@/components/app/report/PageRef";

interface ReportFactRowProps {
  label: string;
  /** null when the Gutachten does not state it in a readable way */
  value: string | null;
  quote: string | null;
  pageLabel: string | null;
  notStated: string;
}

/** A figure, its page, and the sentence it stands in as tooltip. */
export default function ReportFactRow({ label, value, quote, pageLabel, notStated }: ReportFactRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5" title={quote ?? undefined}>
      <dt className="text-sm text-ink-soft">{label}</dt>
      <dd className="flex items-baseline gap-2 text-right">
        {value ? <span className="font-mono text-sm font-semibold">{value}</span> : <span className="text-sm text-muted">{notStated}</span>}
        {pageLabel && <PageRef label={pageLabel} />}
      </dd>
    </div>
  );
}
