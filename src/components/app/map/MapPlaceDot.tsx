interface MapPlaceDotProps {
  cx: number;
  cy: number;
  r: number;
  href: string;
  title: string;
  detail: string;
  isImminent: boolean;
}

/** One position on the map: a single proceeding or several in the same postcode / province. */
export default function MapPlaceDot({ cx, cy, r, href, title, detail, isImminent }: MapPlaceDotProps) {
  return (
    <a href={href} aria-label={`${title}, ${detail}`} data-title={title} data-detail={detail} className="group outline-none">
      <circle
        cx={cx.toFixed(1)}
        cy={cy.toFixed(1)}
        r={r.toFixed(2)}
        fill={isImminent ? "var(--signal)" : "var(--ink)"}
        fillOpacity={isImminent ? 0.92 : 0.72}
        stroke="var(--paper-bright)"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
        className="transition-[fill-opacity] group-hover:[fill-opacity:1] group-focus-visible:[stroke:var(--signal)]"
      />
    </a>
  );
}
