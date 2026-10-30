import { fill, formatArea, formatMoney } from "@/lib/appFormat";
import { LocaleOption } from "@/lib/constants";
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
  const countryName = listing.country === "AT" ? "Österreich" : listing.country === "CH" ? "Schweiz" : "Deutschland";
  return [getAddressLine(listing), countryName].filter(Boolean).join(", ");
}

/** Compact area, €/m², room, and parcel badges for search list rows. */
export function getPropertyMetricsChips(listing: Listing, locale: LocaleOption): string[] {
  const chips: string[] = [];
  const isTr = listing.market === "TR";
  const tr = listing.tr;

  const living = listing.livingAreaM2 ?? tr?.buildingAreaM2 ?? null;
  const net = tr?.netAreaM2 ?? null;
  const usable = listing.usableAreaM2 ?? null;
  const land = listing.landAreaM2 ?? tr?.landAreaM2 ?? null;

  if (living && living > 0) {
    const prefix = isTr ? (locale === "tr" ? "Brüt" : "Wohn-/Geb.") : locale === "tr" ? "Konut" : "Wfl.";
    chips.push(`${prefix} ${formatArea(living, locale)}`);
  }
  if (net && net > 0 && net !== living) {
    chips.push(`Net ${formatArea(net, locale)}`);
  }
  if (usable && usable > 0 && usable !== living) {
    chips.push(`${locale === "tr" ? "Kullanım" : "Nfl."} ${formatArea(usable, locale)}`);
  }
  if (land && land > 0 && land !== living) {
    const prefix = isTr ? (locale === "tr" ? "Arsa" : "Grundst.") : locale === "tr" ? "Arsa" : "Grundst.";
    chips.push(`${prefix} ${formatArea(land, locale)}`);
  }

  const primaryArea = living ?? net ?? usable ?? tr?.areaM2 ?? listing.areaM2 ?? land ?? null;
  if (primaryArea && primaryArea > 0 && listing.appraisedValue && listing.appraisedValue > 0) {
    const perM2 = Math.round(listing.appraisedValue / primaryArea);
    if (perM2 > 0) {
      chips.push(`${formatMoney(perM2, listing.market, locale, listing.currency)}/m²`);
    }
  }

  const rooms = listing.rooms ?? tr?.rooms ?? null;
  if (rooms) chips.push(rooms);

  if (tr?.floor) chips.push(tr.floor);

  const yearBuilt = listing.yearBuilt ?? tr?.yearBuilt ?? null;
  if (yearBuilt) chips.push(`${locale === "tr" ? "Yapım" : "Bj."} ${yearBuilt}`);

  if (isTr && tr?.ada && tr?.parsel) {
    chips.push(`Ada ${tr.ada} · Parsel ${tr.parsel}`);
  }

  return chips;
}

export function getDachPurchaseLabels(
  listing: Listing,
  L: IAppTranslation["Listing"],
  locale: LocaleOption,
): {
  isCh: boolean;
  valueLabel: string;
  halfLabel: string;
  depositLabel: string;
  secondLimitLabel: string;
  secondLimitVal: (value: number, sevenTenths: number) => number;
} {
  const isAt = listing.country === "AT" || listing.key.startsWith("edikte-");
  const isCh = listing.country === "CH" || listing.key.startsWith("shab-");
  const isTr = locale === "tr";
  return {
    isCh,
    valueLabel: isAt
      ? isTr ? "Ekspertiz Değeri (§ 140 EO)" : "Schätzwert (§ 140 EO)"
      : isCh
        ? isTr ? "Tahmini Değer (SchKG)" : "Betreibungsamtliche Schätzung (SchKG)"
        : L.Value[listing.market],
    halfLabel: isAt
      ? isTr ? "Asgari Teklif (§ 151 EO)" : "Geringstes Gebot (§ 151 EO)"
      : isCh
        ? isTr ? "Tahmini Başlangıç (SchKG)" : "Richtwert Einstieg (SchKG)"
        : L.Half,
    depositLabel: isAt
      ? isTr ? "Teminat / Vadium (§ 147 EO)" : "Vadium (§ 147 EO · 10 %)"
      : isCh
        ? isTr ? "Teminat / Peşinat (SchKG)" : "Sicherheitsleistung / Anzahlung"
        : L.Deposit,
    secondLimitLabel: isAt
      ? isTr ? "3/4 Üst Teklif Sınırı (§ 195 EO)" : "3/4-Überbotsgrenze (§ 195 EO)"
      : L.SevenTenths,
    secondLimitVal: (value, sevenTenths) => (isAt ? Math.round(value * 0.75) : sevenTenths),
  };
}
