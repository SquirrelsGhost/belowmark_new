interface MapRegionShapeProps {
  path: string;
  href: string;
  label: string;
  /** 0–1, how many results compared with the busiest region */
  share: number;
  isSelected: boolean;
  isDimmed: boolean;
}

/** A Bundesland / İl: darker the more results it holds, a link that filters to it. */
export default function MapRegionShape({ path, href, label, share, isSelected, isDimmed }: MapRegionShapeProps) {
  const opacity = share === 0 || isDimmed ? 0 : 0.05 + share * 0.2;
  return (
    <a href={href} aria-label={label} data-title={label} className="group outline-none">
      <path d={path} fill={isDimmed ? "var(--paper-deep)" : "var(--paper)"} stroke="none" />
      {(share === 0 || isDimmed) && <path d={path} fill="url(#map-hatch)" stroke="none" />}
      <path
        d={path}
        fill={isSelected ? "var(--signal)" : "var(--ink)"}
        fillOpacity={isSelected ? 0.08 : opacity}
        stroke={isSelected ? "var(--signal)" : "var(--ink)"}
        strokeOpacity={isSelected ? 1 : 0.55}
        strokeWidth={isSelected ? 2 : 0.8}
        vectorEffect="non-scaling-stroke"
        className="transition-[fill-opacity] group-hover:[fill-opacity:0.3] group-focus-visible:[fill-opacity:0.3]"
      />
    </a>
  );
}
