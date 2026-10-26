import { Listing } from "@/types/listing.types";

/** UYAP e-Satış: photos, expert report and bid conditions — behind the e-Devlet login. */
export const ESATIS_URL = "https://esatis.uyap.gov.tr/";

/** Check-kit fields of a Turkish proceeding; names stay Turkish, as typed on the portal. */
export function checkKitFields(listing: Listing): [string, string | null][] {
  const tr = listing.tr;
  return [
    ["İl", listing.region],
    ["İlçe", listing.place],
    ["Mahalle", tr?.mahalle ?? null],
    ["Ada", tr?.ada ?? null],
    ["Parsel", tr?.parsel ?? null],
    ["Dosya No", listing.fileNo],
    ["Merci", listing.authority],
    ["İlan", listing.officialUrl],
  ];
}
