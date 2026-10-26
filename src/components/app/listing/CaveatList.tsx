import { ListingCaveat } from "@/types/listing.types";

interface CaveatListProps {
  title: string;
  emptyLabel: string;
  pointsLabel: (points: number) => string;
  caveats: ListingCaveat[];
}

/** Remarks read from the notice, each with its rank deduction — open by default, details on click. */
export default function CaveatList({ title, emptyLabel, pointsLabel, caveats }: CaveatListProps) {
  return (
    <section aria-label={title}>
      <h2 className="font-narrow text-sm font-bold tracking-[0.12em] uppercase">{title}</h2>
      {caveats.length === 0 ? (
        <p className="mt-2 text-sm text-muted">{emptyLabel}</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {caveats.map((caveat) => (
            <li key={caveat.short}>
              <details className="group border-l-4 border-caution bg-caution/8 px-3 py-2">
                <summary className="flex cursor-pointer items-baseline justify-between gap-3 text-sm font-medium">
                  <span>{caveat.short}</span>
                  {caveat.points > 0 && <span className="shrink-0 font-mono text-[11px] text-caution">{pointsLabel(caveat.points)}</span>}
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{caveat.long}</p>
              </details>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
