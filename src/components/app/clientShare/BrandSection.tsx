import { ReactNode } from "react";

interface BrandSectionProps {
  title: string;
  lead: string;
  /** Form on the left, preview on the right */
  children: ReactNode;
}

/** The letterhead block of the client page. */
export default function BrandSection({ title, lead, children }: BrandSectionProps) {
  return (
    <section aria-label={title} className="flex flex-col gap-4">
      <div className="border-b-2 border-ink pb-2">
        <h2 className="font-display text-3xl">{title}</h2>
        <p className="mt-1 max-w-2xl text-sm text-ink-soft">{lead}</p>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">{children}</div>
    </section>
  );
}
