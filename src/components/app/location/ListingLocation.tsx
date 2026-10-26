import { ReactNode } from "react";

interface ListingLocationProps {
  title: string;
  /** The tile map, or a note why there is none */
  map: ReactNode;
  /** Country locator stamp */
  locator: ReactNode;
  precision: string;
  /** Links below the note */
  children?: ReactNode;
}

/** Where the proceeding is: map clip, country stamp, and how exact that position is. */
export default function ListingLocation({ title, map, locator, precision, children }: ListingLocationProps) {
  return (
    <section aria-label={title}>
      <h2 className="font-narrow text-sm font-bold tracking-[0.12em] uppercase">{title}</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-[minmax(0,1fr)_9rem]">
        {map}
        <div className="flex flex-col gap-3">
          <div className="border border-rule bg-paper-bright p-2">{locator}</div>
          <p className="font-mono text-[11px] leading-relaxed text-ink-soft">{precision}</p>
          {children}
        </div>
      </div>
    </section>
  );
}
