import { ReactNode } from "react";

interface BidderFileSectionProps {
  number: string;
  title: string;
  children: ReactNode;
}

/** A numbered section of the file, kept on one page where it fits. */
export default function BidderFileSection({ number, title, children }: BidderFileSectionProps) {
  return (
    <section aria-label={title} className="break-inside-avoid border-t-2 border-ink pt-3">
      <h2 className="flex items-baseline gap-3 font-narrow text-sm font-bold tracking-[0.14em] uppercase">
        <span className="font-mono text-[11px] text-signal">{number}</span>
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
