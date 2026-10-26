import { ReactNode } from "react";

interface EvidenceTableProps {
  title: string;
  lead: string;
  figureLabel: string;
  basisLabel: string;
  sourceLabel: string;
  children: ReactNode;
}

/** Belege: each figure on the sheet with its legal basis and a link to the official text. */
export default function EvidenceTable({ title, lead, figureLabel, basisLabel, sourceLabel, children }: EvidenceTableProps) {
  return (
    <section aria-label={title}>
      <h2 className="font-narrow text-sm font-bold tracking-[0.12em] uppercase">{title}</h2>
      <p className="mt-1 text-sm text-ink-soft">{lead}</p>
      <div className="mt-3 overflow-x-auto border-y-2 border-ink">
        <table className="w-full min-w-[34rem] text-left text-sm">
          <thead>
            <tr className="border-b border-rule font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
              <th scope="col" className="py-2 pr-4 font-normal">{figureLabel}</th>
              <th scope="col" className="py-2 pr-4 font-normal">{basisLabel}</th>
              <th scope="col" className="py-2 font-normal">{sourceLabel}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">{children}</tbody>
        </table>
      </div>
    </section>
  );
}
