import { BidContext } from "@/types/bidding.types";
import { Listing } from "@/types/listing.types";

/** Route of the printable bidder file — outside /app so the app chrome is not printed. */
export const BIDDER_FILE_ROUTE = "/mappe";

/** URL flag that makes the file open the print dialog right away (set by the Aktenblatt button). */
export const AUTO_PRINT_PARAM = "drucken";

export const bidderFileHref = (key: string, autoPrint = false): string =>
  `${BIDDER_FILE_ROUTE}/${encodeURIComponent(key)}${autoPrint ? `?${AUTO_PRINT_PARAM}=1` : ""}`;

/** What the notice fixes for the bid limit; null without an appraised value — then there is nothing to compute. */
export function getBidContext(listing: Listing): BidContext | null {
  if (listing.appraisedValue === null) return null;
  return {
    market: listing.market,
    value: listing.appraisedValue,
    transferTaxPct: listing.transferTaxPct,
    vatRate: listing.tr?.vatRate ?? null,
    limitsWaived: listing.limitsWaived,
    startingBid: listing.tr?.startingBid ?? null,
  };
}
