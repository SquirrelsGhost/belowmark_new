import BidderFileRow from "@/components/bidderFile/BidderFileRow";
import { formatArea, formatMoney } from "@/lib/appFormat";
import { LocaleOption } from "@/lib/constants";
import { getAddressLine } from "@/lib/listingLabels";
import { IAppTranslation } from "@/translations/app/IAppTranslation";
import { Listing } from "@/types/listing.types";

interface BidderFileFactsProps {
  listing: Listing;
  labels: IAppTranslation["Listing"];
  locale: LocaleOption;
}

/** Every fact of the notice that identifies the proceeding and property in court. */
export default function BidderFileFacts({ listing, labels: L, locale }: BidderFileFactsProps) {
  const market = listing.market;
  const tr = listing.tr;
  const living = listing.livingAreaM2 ?? tr?.buildingAreaM2 ?? null;
  const net = tr?.netAreaM2 ?? null;
  const usable = listing.usableAreaM2 ?? null;
  const land = listing.landAreaM2 ?? tr?.landAreaM2 ?? null;
  const primaryArea = living ?? net ?? usable ?? tr?.areaM2 ?? listing.areaM2 ?? land ?? null;
  const pricePerM2 =
    primaryArea && primaryArea > 0 && listing.appraisedValue && listing.appraisedValue > 0
      ? `${formatMoney(Math.round(listing.appraisedValue / primaryArea), market, locale)} / m²`
      : null;
  const rooms = listing.rooms ?? tr?.rooms ?? null;
  const yearBuilt = listing.yearBuilt ?? tr?.yearBuilt ?? null;

  return (
    <dl className="grid grid-cols-1 gap-x-8 divide-y divide-rule sm:grid-cols-2 print:grid-cols-2">
      <BidderFileRow label={L.FileNo} value={listing.fileNo} missing={L.NotStated} />
      <BidderFileRow label={L.Authority[market]} value={listing.authority} missing={L.NotStated} />
      <BidderFileRow label={L.Region[market]} value={listing.region} missing={L.NotStated} />
      <BidderFileRow label={L.Address} value={getAddressLine(listing) || null} missing={L.NotStated} />
      <BidderFileRow label={L.Segment} value={listing.segmentLabel} missing={L.NotStated} />
      <BidderFileRow label={L.FileYear} value={listing.fileYear ? String(listing.fileYear) : null} missing={L.NotStated} />
      <BidderFileRow label={L.Tr.BuildingArea} value={living === null ? null : formatArea(living, locale)} missing={L.NotStated} />
      {net !== null && net !== living && (
        <BidderFileRow label={locale === "tr" ? "Net Alan" : "Nettofläche"} value={formatArea(net, locale)} missing={L.NotStated} />
      )}
      {usable !== null && usable !== living && (
        <BidderFileRow label={locale === "tr" ? "Kullanım Alanı" : "Nutz-/Gewerbefläche"} value={formatArea(usable, locale)} missing={L.NotStated} />
      )}
      <BidderFileRow label={L.Tr.LandArea} value={land === null ? null : formatArea(land, locale)} missing={L.NotStated} />
      {pricePerM2 && <BidderFileRow label={locale === "tr" ? "m² Birim Değeri" : "Richtwert / m²"} value={pricePerM2} missing={L.NotStated} />}
      {rooms && <BidderFileRow label={locale === "tr" ? "Oda Sayısı" : "Zimmer"} value={rooms} missing={L.NotStated} />}
      {yearBuilt && <BidderFileRow label={locale === "tr" ? "Yapım Yılı" : "Baujahr"} value={String(yearBuilt)} missing={L.NotStated} />}
      {tr ? (
        <BidderFileRow
          label={L.Tr.Parcel}
          value={tr.ada && tr.parsel ? `${tr.ada} / ${tr.parsel}${tr.unitNo ? ` · BB ${tr.unitNo}` : ""}` : listing.grundbuch ?? null}
          missing={L.NotStated}
        />
      ) : (
        listing.grundbuch && <BidderFileRow label="Grundbuch" value={listing.grundbuch} missing={L.NotStated} />
      )}
      {tr?.arsaPayi && <BidderFileRow label="Arsa Payı" value={tr.arsaPayi} missing={L.NotStated} />}
    </dl>
  );
}
