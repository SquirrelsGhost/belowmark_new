import { ReactNode } from "react";

interface ReportTopicProps {
  title: string;
  count: number;
  emptyLabel: string;
  /** ReportFindingItem entries */
  children: ReactNode;
}

/** One subject of the Gutachten with all passages about it — or a plain "not found". */
export default function ReportTopic({ title, count, emptyLabel, children }: ReportTopicProps) {
  return (
    <section aria-label={title} className="flex flex-col gap-2">
      <h3 className="flex items-baseline justify-between gap-3 border-b border-rule pb-1">
        <span className="font-narrow text-base font-semibold">{title}</span>
        <span className="font-mono text-[11px] text-muted">{count}</span>
      </h3>
      {count === 0 ? <p className="text-sm text-muted">{emptyLabel}</p> : <ul className="flex flex-col gap-2">{children}</ul>}
    </section>
  );
}
