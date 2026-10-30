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
  const precKey: "postcode" | "province" = position?.precision === "province" ? "province" : "postcode";
  const zooms = position ? MAP_TILES.zooms[precKey] : null;
  const precisionLabel =
    position?.precision === "province"
      ? listing.region ?? ""
      : [listing.postcode, listing.place].filter(Boolean).join(" ").trim() || listing.place || listing.region || "";
  const useBasemap =
    listing.market === "DE" &&
    (!listing.country || listing.country === "DE") &&
    !/^(?:edikte|shab|it-aste|es-boe|fr-licitor|gb-eig)-/.test(listing.key);

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
              label={fill(labels.Precision[precKey], { label: precisionLabel })}
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
        precision={position ? fill(labels.Precision[precKey], { label: precisionLabel }) : labels.NoGeo}
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
