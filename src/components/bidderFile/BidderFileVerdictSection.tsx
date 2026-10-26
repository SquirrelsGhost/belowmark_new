import BidderFileSection from "@/components/bidderFile/BidderFileSection";
import BidderFileVerdict from "@/components/bidderFile/BidderFileVerdict";
import { LocaleOption } from "@/lib/constants";
import { VerdictService } from "@/services/VerdictService";
import { getVerdictTranslation } from "@/translations/verdict/VerdictTranslations";
import { Listing } from "@/types/listing.types";

interface BidderFileVerdictSectionProps {
  listing: Listing;
  userId: string;
  locale: LocaleOption;
  now: number;
}

/** First section of the bidder file: the verdict, before the facts it rests on. */
export default async function BidderFileVerdictSection({ listing, userId, locale, now }: BidderFileVerdictSectionProps) {
  const labels = getVerdictTranslation(locale);
  const { evidence, context, names } = await VerdictService.getSource(listing, userId, locale, now);
  return (
    <BidderFileSection number="00" title={labels.File.Title}>
      <BidderFileVerdict listingId={listing.key} evidence={evidence} context={context} labels={labels} names={names} locale={locale} />
    </BidderFileSection>
  );
}
