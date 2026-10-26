import { ReactNode } from "react";

interface ListingMediaProps {
  title: string;
  body: string;
  /** Photo frame */
  slot: ReactNode;
  /** Links to the originals */
  children: ReactNode;
}

/** Photos and documents: always the originals at the court or portal, never a stand-in picture. */
export default function ListingMedia({ title, body, slot, children }: ListingMediaProps) {
  return (
    <section aria-label={title}>
      <h2 className="font-narrow text-sm font-bold tracking-[0.12em] uppercase">{title}</h2>
      <div className="mt-3 grid gap-5 sm:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {slot}
        <div className="flex flex-col gap-3">
          <p className="text-sm leading-relaxed text-ink-soft">{body}</p>
          <div className="flex flex-col divide-y divide-rule border-y border-rule">{children}</div>
        </div>
      </div>
    </section>
  );
}
