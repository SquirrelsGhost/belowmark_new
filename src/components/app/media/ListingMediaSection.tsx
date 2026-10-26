import SourceLink from "@/components/app/listing/SourceLink";
import ListingMedia from "@/components/app/media/ListingMedia";
import ListingPhotoGallery from "@/components/app/media/ListingPhotoGallery";
import {
  getAerialTileQuad,
  getBorisPortal,
  getMarketComparisonLinks,
  googleMapsUrl,
  hostOf,
  officialDocumentHref,
  officialPortalHref,
  TKGM_PARCEL_URL,
  UYAP_ESATIS_URL,
} from "@/lib/locationLinks";
import { IAppTranslation } from "@/translations/app/IAppTranslation";
import { Listing, OfficialPortalDetails } from "@/types/listing.types";

interface ListingMediaSectionProps {
  listing: Listing;
  labels: IAppTranslation["Media"];
  portalDetails?: OfficialPortalDetails;
}

/** Fotos & Unterlagen: real building/apartment photo gallery + satellite orthophoto + official documents. */
export default function ListingMediaSection({ listing, labels, portalDetails }: ListingMediaSectionProps) {
  const market = listing.market;
  const parcel = listing.tr?.ada && listing.tr?.parsel ? `Ada ${listing.tr.ada} / Parsel ${listing.tr.parsel}` : null;
  const portalHref = portalDetails?.portalEntryUrl ?? officialPortalHref(listing);
  const fallbackDocHref = officialDocumentHref(listing);
  const attachments = portalDetails?.attachments ?? [];
  const boris = getBorisPortal(listing);
  const comparisons = getMarketComparisonLinks(listing);
  const geoHref = portalDetails?.geoServerUrl ?? listing.geoportalUrl;
  const streetViewHref = googleMapsUrl(listing);

  const galleryUrls =
    portalDetails?.galleryUrls && portalDetails.galleryUrls.length > 0
      ? portalDetails.galleryUrls
      : listing.imageUrl
        ? [listing.imageUrl]
        : [];

  const aerialTiles = listing.geo
    ? getAerialTileQuad(listing.geo.lat, listing.geo.lng, listing.geo.precision === "postcode" ? 16 : 14)
    : [];

  return (
    <ListingMedia
      title={labels.Title}
      body={labels.Body[market]}
      slot={
        <ListingPhotoGallery
          galleryUrls={galleryUrls}
          aerialTiles={aerialTiles}
          portalHref={portalHref}
          streetViewHref={streetViewHref}
          slotLabel={labels.Slot[market]}
          isTr={market === "TR"}
        />
      }
    >
      <SourceLink href={portalHref} label={labels.Portal[market]} host={hostOf(listing.officialUrl)} isPrimary />

      {attachments.length > 0
        ? attachments.map((att) => (
            <SourceLink
              key={att.id}
              href={att.proxyUrl}
              label={att.label}
              host={`PDF · ${att.fileName}`}
            />
          ))
        : fallbackDocHref && <SourceLink href={fallbackDocHref} label={labels.Announcement} host="PDF" />}

      {boris && <SourceLink href={boris.url} label={boris.name} host={hostOf(boris.url)} />}

      {geoHref && (
        <SourceLink
          href={geoHref}
          label={labels.Aerial}
          host={listing.geoportalName ?? hostOf(geoHref)}
        />
      )}

      {portalDetails?.courtUrl && market === "DE" && (
        <SourceLink
          href={portalDetails.courtUrl}
          label={listing.authority}
          host={hostOf(portalDetails.courtUrl)}
        />
      )}

      {market === "TR" && (
        <>
          <SourceLink href={UYAP_ESATIS_URL} label="UYAP e-Satış Portalı" host="esatis.uyap.gov.tr" />
          <SourceLink href={TKGM_PARCEL_URL} label={labels.Parcel} host={parcel ?? "parselsorgu.tkgm.gov.tr"} />
        </>
      )}

      <SourceLink href={streetViewHref} label={labels.StreetView} host="google.com/maps" />

      {comparisons.map((cmp) => (
        <SourceLink key={cmp.name} href={cmp.href} label={cmp.name} host={cmp.sub} />
      ))}
    </ListingMedia>
  );
}
