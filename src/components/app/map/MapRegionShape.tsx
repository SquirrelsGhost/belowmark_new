interface MapRegionShapeProps {
  /** Outline drawn by MapRegionDefs on the same map */
  code: string;
  href: string;
  label: string;
  /** 0–1, how many results compared with the busiest region */
  share: number;
  isSelected: boolean;
  isDimmed: boolean;
}

/** A Bundesland / İl: darker the more results it holds, a link that filters to it. */
export default function MapRegionShape({ code, href, label, share, isSelected, isDimmed }: MapRegionShapeProps) {
  const opacity = share === 0 || isDimmed ? 0 : 0.05 + share * 0.2;
  const outline = `#map-r-${code}`;
  return (
    <a href={href} aria-label={label} data-title={label} className="group outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal">
      <use href={outline} fill={isDimmed ? "var(--paper-deep)" : "var(--paper)"} stroke="none" />
      {(share === 0 || isDimmed) && <use href={outline} fill="url(#map-hatch)" stroke="none" />}
      <use
        href={outline}
        fill={isSelected ? "var(--signal)" : "var(--ink)"}
        fillOpacity={isSelected ? 0.08 : opacity}
        stroke={isSelected ? "var(--signal)" : "var(--ink)"}
        strokeOpacity={isSelected ? 1 : 0.55}
        strokeWidth={isSelected ? 2 : 0.8}
        className="transition-[fill-opacity] group-hover:[fill-opacity:0.3] group-focus-visible:[fill-opacity:0.3]"
      />
    </a>
  );
}
