interface PriceStatsMethodProps {
  title: string;
  items: string[];
}

/** How the figures come about — next to the figures, not behind a link. */
export default function PriceStatsMethod({ title, items }: PriceStatsMethodProps) {
  return (
    <section aria-label={title} className="flex flex-col gap-2 border-t border-rule-strong pt-4">
      <h2 className="font-narrow text-sm font-bold tracking-[0.12em] uppercase">{title}</h2>
      <ul className="flex list-disc flex-col gap-1 pl-5 text-sm leading-relaxed text-ink-soft">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
