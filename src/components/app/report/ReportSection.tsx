import { VERDICT_ANCHORS } from "@/lib/verdict/verdictConstants";
import { ReactNode } from "react";

interface ReportSectionProps {
  title: string;
  lead: string;
  policy: string;
  children: ReactNode;
}

/** Frame of the Gutachten reader on the Aktenblatt. */
export default function ReportSection({ title, lead, policy, children }: ReportSectionProps) {
  return (
    <section id={VERDICT_ANCHORS.report} aria-label={title} className="flex scroll-mt-24 flex-col gap-4">
      <div>
        <h2 className="font-narrow text-sm font-bold tracking-[0.12em] uppercase">{title}</h2>
        <p className="mt-1 text-sm text-ink-soft">{lead}</p>
        <p className="mt-1 text-xs text-muted">{policy}</p>
      </div>
      {children}
    </section>
  );
}
