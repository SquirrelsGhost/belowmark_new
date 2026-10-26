import { GeoRegion } from "@/types/listing.types";

interface RegionLocatorSpriteProps {
  regions: GeoRegion[];
}

/** Id of a region outline inside the sprite. */
export const locatorRegionId = (code: string) => `loc-r-${code}`;
export const LOCATOR_COUNTRY_ID = "loc-country";

/**
 * Draws every region outline once per page; the small locator maps reuse them
 * with <use>, so a list of 25 rows does not repeat the whole country 25 times.
 * Paths carry no fill of their own, so each <use> can colour them.
 */
export default function RegionLocatorSprite({ regions }: RegionLocatorSpriteProps) {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <defs>
        {regions.map((region) => (
          <path key={region.code} id={locatorRegionId(region.code)} d={region.path} />
        ))}
        <g id={LOCATOR_COUNTRY_ID}>
          {regions.map((region) => (
            <use key={region.code} href={`#${locatorRegionId(region.code)}`} />
          ))}
        </g>
      </defs>
    </svg>
  );
}
