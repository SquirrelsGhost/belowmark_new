interface MapPlaceDotProps {
  cx: number;
  cy: number;
  r: number;
  href: string;
  title: string;
  detail: string;
  isImminent: boolean;
}

/**
 * One position on the map: a single proceeding or several in the same postcode / province.
 * Colours and hover live in the `map-dot` rules of globals.css — the search map
 * draws thousands of these, so every attribute here is repeated thousands of times.
 */
export default function MapPlaceDot({ cx, cy, r, href, title, detail, isImminent }: MapPlaceDotProps) {
  return (
    <a href={href} aria-label={`${title}, ${detail}`} data-title={title} data-detail={detail} className={isImminent ? "map-dot is-imminent" : "map-dot"}>
      <circle cx={cx.toFixed(1)} cy={cy.toFixed(1)} r={r.toFixed(2)} />
    </a>
  );
}
