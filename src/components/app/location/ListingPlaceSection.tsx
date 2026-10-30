import ListingLocation from "@/components/app/location/ListingLocation";
import LocationMissing from "@/components/app/location/LocationMissing";
import LocationTileMap from "@/components/app/location/LocationTileMap";
import RegionLocator from "@/components/app/map/RegionLocator";
import { MAP_TILES } from "@/lib/appConstants";
import { fill } from "@/lib/appFormat";
import { projectPoint } from "@/lib/geo";
import { openStreetMapUrl } from "@/lib/locationLinks";
import { IAppTranslation } from "@/translations/app/IAppTranslation";
import { Listing, MarketGeo } from "@/types/listing.types";

interface ListingPlaceSectionProps {
  listing: Listing;
  geo: MarketGeo;
  /** URL of the locator outline file */
  sprite: string;
  labels: IAppTranslation["Location"];
}

/** Rough size of a postcode area, for the "somewhere in here" circle. */
const POSTCODE_RADIUS_M = 1500;

/** The "Lage" block of the Aktenblatt, built from the notice's postcode or province. */
export default function ListingPlaceSection({ listing, geo, sprite, labels }: ListingPlaceSectionProps) {
  const position = listing.geo;
  const zooms = position ? MAP_TILES.zooms[position.precision] : null;
  const precisionLabel = position?.precision === "postcode" ? `${listing.postcode} ${listing.place ?? ""}`.trim() : listing.region ?? "";
  const useBasemap =
    listing.market === "DE" &&
    listing.country !== "AT" &&
    listing.country !== "CH" &&
    !listing.key.startsWith("edikte-") &&
    !listing.key.startsWith("shab-");

  return (
    <>
      <ListingLocation
        title={labels.Title}
        map={
          position && zooms ? (
            <LocationTileMap
              lat={position.lat}
              lng={position.lng}
              zooms={zooms}
              provider={useBasemap ? "basemap" : "osm"}
              radiusMetres={position.precision === "postcode" ? POSTCODE_RADIUS_M : null}
              scaleLabel={labels.Scale}
              levels={labels.Levels}
              label={fill(labels.Precision[position.precision], { label: precisionLabel })}
            />
          ) : (
            <LocationMissing message={labels.NoGeo} />
          )
        }
        locator={
          <RegionLocator
            sprite={sprite}
            width={geo.projection.width}
            height={geo.projection.height}
            regionCode={listing.regionCode}
            point={position ? projectPoint(geo.projection, position.lat, position.lng) : null}
            label={fill(labels.Locator, { region: listing.region ?? "" })}
            className="w-full"
          />
        }
        precision={position ? fill(labels.Precision[position.precision], { label: precisionLabel }) : labels.NoGeo}
      >
        {position && zooms && (
          <a
            href={openStreetMapUrl(position.lat, position.lng, zooms[2])}
            target="_blank"
            rel="noreferrer"
            className="font-narrow text-xs font-semibold tracking-[0.08em] text-signal uppercase hover:underline"
          >
            {labels.OpenLarge} ↗
          </a>
        )}
      </ListingLocation>
    </>
  );
}
