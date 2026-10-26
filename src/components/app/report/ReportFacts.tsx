import { ReactNode } from "react";

interface ReportFactsProps {
  title: string;
  /** ReportFactRow entries */
  children: ReactNode;
}

/** Key figures exactly as the Gutachten prints them. */
export default function ReportFacts({ title, children }: ReportFactsProps) {
  return (
    <section aria-label={title} className="border-2 border-ink bg-paper-bright">
      <h3 className="bg-ink px-4 py-2 font-narrow text-sm font-bold tracking-[0.12em] text-paper-bright uppercase">{title}</h3>
      <dl className="divide-y divide-rule px-4">{children}</dl>
    </section>
  );
}
