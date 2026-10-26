import { ReactNode } from "react";
import Container from "@/components/ui/Container";

interface StatsLedgerProps {
  asOfLabel: string;
  asOfDate: string;
  sourceLabel: string;
  /** <StatsLedgerItem /> elements */
  children: ReactNode;
}

/** Row of key figures set like a ledger, with the date of the data stand. */
export default function StatsLedger({ asOfLabel, asOfDate, sourceLabel, children }: StatsLedgerProps) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="flex items-baseline justify-between border-b-2 border-ink pb-2 font-mono text-[11px] tracking-wider uppercase">
          <span>
            {asOfLabel} {asOfDate}
          </span>
          <span className="text-muted">{sourceLabel}</span>
        </div>
        <dl className="grid grid-cols-2 lg:grid-cols-5 [&>*]:border-b [&>*]:border-rule lg:[&>*:not(:last-child)]:border-r max-lg:[&>*:nth-child(odd)]:border-r">
          {children}
        </dl>
      </Container>
    </section>
  );
}
