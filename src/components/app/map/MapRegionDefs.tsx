interface MapRegionDefsProps {
  regions: { code: string; path: string }[];
}

/** Id of a region outline on the search map. */
const mapRegionId = (code: string) => `map-r-${code}`;

/**
 * Every region outline once; MapRegionShape draws its layers with <use>, so
 * a page carries each outline one time instead of three.
 */
export default function MapRegionDefs({ regions }: MapRegionDefsProps) {
  return (
    <defs>
      {regions.map((region) => (
        <path key={region.code} id={mapRegionId(region.code)} d={region.path} vectorEffect="non-scaling-stroke" />
      ))}
    </defs>
  );
}
