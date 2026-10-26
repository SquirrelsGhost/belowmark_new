import { ReactNode } from "react";

interface RiskCheckSectionProps {
  title: string;
  lead: string;
  scope: string;
  disclaimer: string;
  /** RiskRow items */
  children: ReactNode;
}

/** The traffic light for one proceeding — five rows, each backed by its sources. */
export default function RiskCheckSection({ title, lead, scope, disclaimer, children }: RiskCheckSectionProps) {
  return (
    <section aria-label={title}>
      <h2 className="font-narrow text-sm font-bold tracking-[0.12em] uppercase">{title}</h2>
      <p className="mt-1 text-sm text-ink-soft">{lead}</p>
      <ul className="mt-3 divide-y divide-rule border-y-2 border-ink">{children}</ul>
      <p className="mt-2 font-mono text-[11px] text-muted">{scope}</p>
      <p className="mt-1 text-xs text-muted">{disclaimer}</p>
    </section>
  );
}
