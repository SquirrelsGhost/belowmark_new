import ListingOfficialDetails from "@/components/app/listing/ListingOfficialDetails";
import ListingPlaceSection from "@/components/app/location/ListingPlaceSection";
import ListingMediaSection from "@/components/app/media/ListingMediaSection";
import ListingReportArea from "@/components/app/report/ListingReportArea";
import { LocaleOption } from "@/lib/constants";
import { emptyPortalDetailsForFreePlan } from "@/lib/sicherheit/antiScrapingRules";
import { OfficialPortalService } from "@/services/OfficialPortalService";
import { IAppTranslation } from "@/translations/app/IAppTranslation";
import { Listing, MarketGeo } from "@/types/listing.types";

interface ListingPortalSectionsProps {
  listing: Listing;
  userId: string;
  locale: LocaleOption;
  isLocked: boolean;
  geo: MarketGeo;
  spriteHref: string;
  locationLabels: IAppTranslation["Location"];
  mediaLabels: IAppTranslation["Media"];
}

/**
 * Streams the official portal attachments, report analyzer, location map, and
 * extracted court gallery photos so live portal HTTP fetches never block the Aktenblatt shell.
 */
export default async function ListingPortalSections({
  listing,
  userId,
  locale,
  isLocked,
  geo,
  spriteHref,
  locationLabels,
  mediaLabels,
}: ListingPortalSectionsProps) {
  const portalDetails = isLocked
    ? emptyPortalDetailsForFreePlan(listing.sourcePortal ?? "")
    : await OfficialPortalService.getDetails(listing);

  return (
    <>
      <ListingOfficialDetails listing={listing} details={portalDetails} locale={locale} isLocked={isLocked} />
      <ListingReportArea listing={listing} userId={userId} locale={locale} isLocked={isLocked} attachments={portalDetails.attachments} />
      <ListingPlaceSection listing={listing} geo={geo} sprite={spriteHref} labels={locationLabels} />
      <ListingMediaSection listing={listing} labels={mediaLabels} portalDetails={portalDetails} />
    </>
  );
}
