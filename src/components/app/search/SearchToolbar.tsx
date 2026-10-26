import { ReactNode } from "react";

interface SearchToolbarProps {
  summary: string;
  /** Secondary line, e.g. how many hearings fall in the next 7 days */
  detail?: string;
  sortLabel: string;
  /** List / map switch */
  view?: ReactNode;
  /** Sort links; left out in the map view */
  children?: ReactNode;
}

/** Result count and view switch on top, sort links below on the right. */
export default function SearchToolbar({ summary, detail, sortLabel, view, children }: SearchToolbarProps) {
  const hasSort = Array.isArray(children) ? children.some(Boolean) : Boolean(children);
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b-2 border-ink pb-3">
      <p role="status" className="flex flex-wrap items-baseline gap-x-3">
        <span className="font-display text-3xl leading-none">{summary}</span>
        {detail && <span className="font-mono text-xs text-signal">{detail}</span>}
      </p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {hasSort && (
          <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
            <span className="mr-2 font-mono text-[10px] tracking-[0.16em] text-muted uppercase">{sortLabel}</span>
            {children}
          </div>
        )}
        {view}
      </div>
    </div>
  );
}
