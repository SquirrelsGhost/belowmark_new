import { APP_ROUTES } from "@/lib/appConstants";

interface WatchlistExportProps {
  label: string;
  count: string;
}

/** Count of saved proceedings and the calendar download for all of them. */
export default function WatchlistExport({ label, count }: WatchlistExportProps) {
  return (
    <div className="flex flex-col items-end gap-2">
      <span className="font-mono text-xs text-muted">{count}</span>
      <a
        href={APP_ROUTES.calendar}
        download
        className="inline-flex h-10 items-center bg-ink px-4 font-narrow text-xs font-semibold tracking-[0.1em] text-paper-bright uppercase shadow-[3px_3px_0_0_var(--signal)]"
      >
        {label}
      </a>
    </div>
  );
}
