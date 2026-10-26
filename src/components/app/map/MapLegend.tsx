interface MapLegendProps {
  imminentLabel: string;
  laterLabel: string;
  sizeLabel: string;
}

/** Colour and size key of the search map. */
export default function MapLegend({ imminentLabel, laterLabel, sizeLabel }: MapLegendProps) {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-ink-soft">
      <li className="flex items-center gap-1.5">
        <span aria-hidden="true" className="size-2.5 rounded-full bg-signal" />
        {imminentLabel}
      </li>
      <li className="flex items-center gap-1.5">
        <span aria-hidden="true" className="size-2.5 rounded-full bg-ink/70" />
        {laterLabel}
      </li>
      <li className="flex items-center gap-1.5">
        <span aria-hidden="true" className="flex items-end gap-0.5">
          <span className="size-1.5 rounded-full bg-ink/70" />
          <span className="size-2.5 rounded-full bg-ink/70" />
          <span className="size-3.5 rounded-full bg-ink/70" />
        </span>
        {sizeLabel}
      </li>
    </ul>
  );
}
