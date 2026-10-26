interface ListingHistoryProps {
  title: string;
  hint: string;
  entries: string[];
}

/** Changes the portal made after the proceeding was first seen, in the portal's own words. */
export default function ListingHistory({ title, hint, entries }: ListingHistoryProps) {
  return (
    <section aria-label={title}>
      <h2 className="font-narrow text-sm font-bold tracking-[0.12em] uppercase">{title}</h2>
      <p className="mt-1 font-mono text-[11px] text-muted">{hint}</p>
      <ol className="mt-3 flex flex-col border-l-2 border-signal">
        {entries.map((entry, index) => (
          <li key={`${index}-${entry}`} className="relative py-1.5 pl-4 text-sm">
            <span aria-hidden="true" className="absolute top-3 -left-[5px] size-2 bg-signal" />
            {entry}
          </li>
        ))}
      </ol>
    </section>
  );
}
