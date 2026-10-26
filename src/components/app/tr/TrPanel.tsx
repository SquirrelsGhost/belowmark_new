import { ReactNode } from "react";

interface TrPanelProps {
  title: string;
  lead?: string;
  children: ReactNode;
}

/** Ruled panel in the fact-sheet look, for the Turkish reference figures. */
export default function TrPanel({ title, lead, children }: TrPanelProps) {
  return (
    <section aria-label={title} className="flex flex-col border-2 border-ink bg-paper-bright">
      <h2 className="bg-ink px-4 py-2.5 font-display text-xl tracking-wide text-paper-bright">{title}</h2>
      {lead && <p className="px-4 pt-3 text-sm leading-relaxed text-ink-soft">{lead}</p>}
      {children}
    </section>
  );
}
