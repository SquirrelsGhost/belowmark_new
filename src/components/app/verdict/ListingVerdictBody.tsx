import VerdictDossier from "@/components/app/verdict/VerdictDossier";
import { LocaleOption } from "@/lib/constants";
import { VerdictService } from "@/services/VerdictService";
import { getVerdictTranslation } from "@/translations/verdict/VerdictTranslations";
import { Listing } from "@/types/listing.types";

interface ListingVerdictBodyProps {
  listing: Listing;
  userId: string;
  locale: LocaleOption;
  now: number;
}

/** Gathers notice, Gutachten and risk check on the server and hands them to the live verdict. */
export default async function ListingVerdictBody({ listing, userId, locale, now }: ListingVerdictBodyProps) {
  const { evidence, context, names } = await VerdictService.getSource(listing, userId, locale, now);
  return <VerdictDossier listingId={listing.key} evidence={evidence} context={context} labels={getVerdictTranslation(locale)} names={names} locale={locale} />;
}
