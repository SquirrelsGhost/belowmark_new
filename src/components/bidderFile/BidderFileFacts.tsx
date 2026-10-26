import BidderFileRow from "@/components/bidderFile/BidderFileRow";
import { formatArea } from "@/lib/appFormat";
import { LocaleOption } from "@/lib/constants";
import { getAddressLine } from "@/lib/listingLabels";
import { IAppTranslation } from "@/translations/app/IAppTranslation";
import { Listing } from "@/types/listing.types";

interface BidderFileFactsProps {
  listing: Listing;
  labels: IAppTranslation["Listing"];
  locale: LocaleOption;
}

/** Every fact of the notice that identifies the proceeding in court. */
export default function BidderFileFacts({ listing, labels: L, locale }: BidderFileFactsProps) {
  const market = listing.market;
  const tr = listing.tr;
  return (
    <dl className="grid grid-cols-2 gap-x-8 divide-y divide-rule">
      <BidderFileRow label={L.FileNo} value={listing.fileNo} missing={L.NotStated} />
      <BidderFileRow label={L.Authority[market]} value={listing.authority} missing={L.NotStated} />
      <BidderFileRow label={L.Region[market]} value={listing.region} missing={L.NotStated} />
      <BidderFileRow label={L.Address} value={getAddressLine(listing) || null} missing={L.NotStated} />
      <BidderFileRow label={L.Segment} value={listing.segmentLabel} missing={L.NotStated} />
      <BidderFileRow label={L.FileYear} value={listing.fileYear ? String(listing.fileYear) : null} missing={L.NotStated} />
      {tr && <BidderFileRow label={L.Tr.Parcel} value={tr.ada && tr.parsel ? `${tr.ada} / ${tr.parsel}` : null} missing={L.NotStated} />}
      {tr && <BidderFileRow label={L.Tr.LandArea} value={tr.landAreaM2 === null ? null : formatArea(tr.landAreaM2, locale)} missing={L.NotStated} />}
      {tr && <BidderFileRow label={L.Tr.BuildingArea} value={tr.buildingAreaM2 === null ? null : formatArea(tr.buildingAreaM2, locale)} missing={L.NotStated} />}
    </dl>
  );
}
