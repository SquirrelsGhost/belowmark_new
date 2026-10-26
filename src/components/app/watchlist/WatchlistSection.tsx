import { ReactNode } from "react";

interface WatchlistSectionProps {
  title: string;
  count: number;
  children: ReactNode;
}

/** A group of the plan (upcoming / past), with its count. */
export default function WatchlistSection({ title, count, children }: WatchlistSectionProps) {
  return (
    <section aria-label={title} className="mt-10">
      <h2 className="flex items-baseline gap-3 border-b-2 border-ink pb-2 font-narrow text-sm font-bold tracking-[0.12em] uppercase">
        {title}
        <span className="font-mono text-xs font-normal text-muted">{count}</span>
      </h2>
      <ol className="relative">{children}</ol>
    </section>
  );
}
