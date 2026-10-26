import { ReactNode } from "react";

interface FactSheetProps {
  title: string;
  children: ReactNode;
}

/** Ruled list of every fact the notice gives. */
export default function FactSheet({ title, children }: FactSheetProps) {
  return (
    <section aria-label={title} className="border-2 border-ink bg-paper-bright">
      <h2 className="bg-ink px-4 py-2.5 font-display text-xl tracking-wide text-paper-bright">{title}</h2>
      <dl className="divide-y divide-rule px-4">{children}</dl>
    </section>
  );
}
