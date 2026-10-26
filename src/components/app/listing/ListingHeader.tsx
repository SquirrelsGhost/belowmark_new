import { ReactNode } from "react";

interface ListingHeaderProps {
  /** Court · file number · region, in mono */
  kicker: string;
  title: string;
  subtitle: string;
  /** Stamps such as "Aufgehoben" or "Neu" */
  stamps?: ReactNode;
  /** Right column: hearing date and actions */
  aside: ReactNode;
}

/** Head of the file sheet: who, what, where — and when, on the right. */
export default function ListingHeader({ kicker, title, subtitle, stamps, aside }: ListingHeaderProps) {
  return (
    <header className="mt-4 grid gap-6 border-b-2 border-ink pb-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
      <div className="min-w-0">
        <p className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">{kicker}</p>
        <h1 className="mt-2 font-display text-5xl leading-[0.88] break-words sm:text-7xl">{title}</h1>
        <p className="mt-3 text-base text-ink-soft">{subtitle}</p>
        {stamps && <div className="mt-4 flex flex-wrap gap-3">{stamps}</div>}
      </div>
      {aside}
    </header>
  );
}
