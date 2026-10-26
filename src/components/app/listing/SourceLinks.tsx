import { ReactNode } from "react";

interface SourceLinksProps {
  title: string;
  note: string;
  children: ReactNode;
}

/** Official source first, then tools. Originals are always linked, never copied. */
export default function SourceLinks({ title, note, children }: SourceLinksProps) {
  return (
    <section aria-label={title}>
      <h2 className="font-narrow text-sm font-bold tracking-[0.12em] uppercase">{title}</h2>
      <div className="mt-3 flex flex-col divide-y divide-rule border-y border-rule">{children}</div>
      <p className="mt-2 font-mono text-[11px] leading-relaxed text-muted">{note}</p>
    </section>
  );
}
