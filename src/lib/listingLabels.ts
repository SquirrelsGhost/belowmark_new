import { fill } from "@/lib/appFormat";
import { IAppTranslation } from "@/translations/app/IAppTranslation";
import { HearingStatus, Listing } from "@/types/listing.types";

type RowLabels = IAppTranslation["Row"];

/** "in 12 Tagen", "läuft · noch 3 T.", "Aufgehoben" … */
export function getStatusLabel(status: HearingStatus, labels: RowLabels): string {
  switch (status.state) {
    case "cancelled":
      return labels.Cancelled;
    case "past":
      return labels.Past;
    case "unknown":
      return labels.Unknown;
    case "running":
      return status.days ? fill(labels.Running, { days: status.days }) : labels.RunningToday;
    default:
      if (status.days === 0) return labels.Today;
      if (status.days === 1) return labels.Tomorrow;
      return fill(labels.Upcoming, { days: status.days ?? 0 });
  }
}

/** Round name only where there are several (Turkish e-auctions). */
export function getRoundLabel(listing: Listing, status: HearingStatus, labels: RowLabels): string | null {
  if (listing.rounds.length < 2 || !status.round) return null;
  return fill(labels.Round, { round: status.round.round });
}

/** "Freudenbach 60, 97993 Creglingen" / "Konak · Süleymaniye" */
export function getAddressLine(listing: Listing): string {
  if (listing.market === "TR") return [listing.place, listing.tr?.mahalle].filter(Boolean).join(" · ");
  const town = [listing.postcode, listing.place].filter(Boolean).join(" ");
  return [listing.street, town].filter(Boolean).join(", ");
}

/** Headline of a row: the town / district, the most scannable part. */
export function getPlaceTitle(listing: Listing): string {
  return listing.place ?? listing.region ?? listing.authority;
}

/** Search text for a general map service: the address as the notice gives it. */
export function getMapQuery(listing: Listing): string {
  if (listing.market === "TR") return [listing.tr?.mahalle, listing.place, listing.region, "Türkiye"].filter(Boolean).join(", ");
  return [getAddressLine(listing), "Deutschland"].filter(Boolean).join(", ");
}
