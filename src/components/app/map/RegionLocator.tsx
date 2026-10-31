import { LOCATOR_COUNTRY_ID, locatorRegionId } from "@/lib/locatorSprite";

interface RegionLocatorProps {
  width: number;
  height: number;
  regionCode: string | null;
  /** Projected position of the proceeding, if known */
  point: [number, number] | null;
  label: string;
  /** URL of the outline file, GeoService.getLocatorSprite(market).href */
  sprite: string;
  /** Part of the map to show (minX, minY, maxX, maxY), MarketGeo.frame of a country map; whole map without */
  frame?: [number, number, number, number];
  className?: string;
}

/**
 * A stamp-sized map: the whole country, the region in ink, the proceeding as a
 * red dot. The outlines come from the cached sprite file.
 */
export default function RegionLocator({ width, height, regionCode, point, label, sprite, frame, className = "w-16" }: RegionLocatorProps) {
  const [x0, y0, x1, y1] = frame ?? [0, 0, width, height];
  const dot = (x1 - x0) / 22;
  return (
    <svg viewBox={`${x0} ${y0} ${x1 - x0} ${y1 - y0}`} role="img" aria-label={label} className={`block h-auto ${className}`}>
      <use href={`${sprite}#${LOCATOR_COUNTRY_ID}`} fill="var(--paper-deep)" stroke="var(--ink)" strokeOpacity={0.35} strokeWidth={(x1 - x0) / 400} />
      {regionCode && <use href={`${sprite}#${locatorRegionId(regionCode)}`} fill="var(--ink)" fillOpacity={0.82} stroke="var(--ink)" strokeWidth={(x1 - x0) / 400} />}
      {point && (
        <>
          <circle cx={point[0]} cy={point[1]} r={dot * 1.9} fill="var(--signal)" fillOpacity={0.25} />
          <circle cx={point[0]} cy={point[1]} r={dot} fill="var(--signal)" stroke="var(--paper-bright)" strokeWidth={dot / 3} />
        </>
      )}
    </svg>
  );
}
