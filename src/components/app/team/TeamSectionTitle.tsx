interface TeamSectionTitleProps {
  title: string;
  aside?: string;
}

/** Small section heading on the team pages. */
export default function TeamSectionTitle({ title, aside }: TeamSectionTitleProps) {
  return (
    <div className="mt-12 flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-ink pb-2">
      <h2 className="font-narrow text-sm font-bold tracking-[0.14em] uppercase">{title}</h2>
      {aside && <p className="font-mono text-[10px] text-muted">{aside}</p>}
    </div>
  );
}
