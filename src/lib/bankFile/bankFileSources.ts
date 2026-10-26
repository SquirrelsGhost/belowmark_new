import { BANK_FILE_LAWS } from "@/lib/bankFile/bankFileConstants";
import { getIcraFigures, getZvgFigures } from "@/lib/listingMath";
import { IBankFileTranslation } from "@/translations/bankFile/IBankFileTranslation";
import { BidContext } from "@/types/bidding.types";
import { Listing } from "@/types/listing.types";

/** Every source the bank file rests on, official notice first, then the statutes it cites. */
export function getBankFileSources(listing: Listing, names: IBankFileTranslation["SourceNames"]): { label: string; url: string }[] {
  const links = [{ label: names.notice, url: listing.officialUrl }];
  if (listing.documentUrl) links.push({ label: names.document, url: listing.documentUrl });
  if (listing.market === "TR") return [...links, { label: names.iik, url: BANK_FILE_LAWS.iik }, { label: names.esatis, url: BANK_FILE_LAWS.esatis }];
  return [...links, { label: names.zvg, url: BANK_FILE_LAWS.zvg }, { label: names.grestg, url: BANK_FILE_LAWS.grestg }, { label: names.gewo, url: BANK_FILE_LAWS.gewo34i }];
}

/** The deposit the notice fixes: a tenth of the appraised value (§ 68 ZVG / İİK m.114/7). */
export const getDeposit = (context: BidContext): number =>
  context.market === "TR" ? getIcraFigures(context.value, context.vatRate).deposit : getZvgFigures(context.value, null).deposit;
