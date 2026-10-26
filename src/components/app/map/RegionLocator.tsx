import { LOCATOR_COUNTRY_ID, locatorRegionId } from "@/components/app/map/RegionLocatorSprite";

interface RegionLocatorProps {
  width: number;
  height: number;
  regionCode: string | null;
  /** Projected position of the proceeding, if known */
  point: [number, number] | null;
  label: string;
  className?: string;
}

/**
 * A stamp-sized map: the whole country, the region in ink, the proceeding as a
 * red dot. Needs a RegionLocatorSprite on the same page.
 */
export default function RegionLocator({ width, height, regionCode, point, label, className = "w-16" }: RegionLocatorProps) {
  const dot = width / 22;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label} className={`block h-auto ${className}`}>
      <use href={`#${LOCATOR_COUNTRY_ID}`} fill="var(--paper-deep)" stroke="var(--ink)" strokeOpacity={0.35} strokeWidth={width / 400} />
      {regionCode && <use href={`#${locatorRegionId(regionCode)}`} fill="var(--ink)" fillOpacity={0.82} stroke="var(--ink)" strokeWidth={width / 400} />}
      {point && (
        <>
          <circle cx={point[0]} cy={point[1]} r={dot * 1.9} fill="var(--signal)" fillOpacity={0.25} />
          <circle cx={point[0]} cy={point[1]} r={dot} fill="var(--signal)" stroke="var(--paper-bright)" strokeWidth={dot / 3} />
        </>
      )}
    </svg>
  );
}
