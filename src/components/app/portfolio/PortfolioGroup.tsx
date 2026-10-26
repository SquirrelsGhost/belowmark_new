import { ReactNode } from "react";

interface PortfolioGroupProps {
  title: string;
  lead: string;
  count: number;
  children: ReactNode;
}

/** One group of the portfolio (won, in review, lost): heading, what it is computed at, sums and table. */
export default function PortfolioGroup({ title, lead, count, children }: PortfolioGroupProps) {
  return (
    <section aria-label={title} className="mt-12">
      <div className="flex items-baseline gap-3 border-b-2 border-ink pb-2">
        <h2 className="font-display text-4xl">{title}</h2>
        <span className="font-mono text-sm text-muted">{count}</span>
      </div>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-soft">{lead}</p>
      {children}
    </section>
  );
}
