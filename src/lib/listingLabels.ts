import { fill, formatArea, formatMoney } from "@/lib/appFormat";
import { LocaleOption } from "@/lib/constants";
import { METRIC_CHIP_COPY } from "@/lib/listingDetailsCopy";
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
  const countryMap: Record<string, string> = {
    AT: "Österreich",
    CH: "Schweiz",
    IT: "Italia",
    ES: "España",
    FR: "France",
    GB: "United Kingdom",
    NL: "Nederland",
    PL: "Polska",
    CZ: "Česko",
    SE: "Sverige",
    DE: "Deutschland",
  };
  const countryName = countryMap[listing.country ?? "DE"] ?? "Deutschland";
  return [getAddressLine(listing), countryName].filter(Boolean).join(", ");
}

export function getListingSourceTag(listing: Listing): string | null {
  if (listing.market === "TR") {
    return listing.tr?.adType && listing.tr.adType !== "İCRA" ? listing.tr.adType : null;
  }
  if (listing.country === "AT" || listing.key.startsWith("edikte-")) return "AT · Ediktsdatei";
  if (listing.country === "CH" || listing.key.startsWith("shab-")) return "CH · SHAB";
  if (listing.country === "IT" || listing.key.startsWith("it-aste-")) return "IT · Aste Giudiziarie";
  if (listing.country === "ES" || listing.key.startsWith("es-boe-")) return "ES · Portal BOE";
  if (listing.country === "FR" || listing.key.startsWith("fr-")) {
    if (listing.key.startsWith("fr-notaires-")) return "FR · Notaires Enchères";
    return listing.key.startsWith("fr-avo-") ? "FR · Avoventes TJ" : "FR · Licitor TJ";
  }
  if (listing.country === "GB" || listing.key.startsWith("gb-")) return "UK · Property Auction";
  if (listing.country === "NL" || listing.key.startsWith("nl-")) return "NL · Executieveiling";
  if (listing.country === "PL" || listing.key.startsWith("pl-")) return "PL · Licytacje KRK";
  if (listing.country === "CZ" || listing.key.startsWith("cz-")) {
    return listing.key.startsWith("cz-okd-") ? "CZ · OKdražby" : "CZ · Portál dražeb EKČR";
  }
  if (listing.country === "SE" || listing.key.startsWith("se-")) return "SE · Kronofogden";
  if (listing.sourcePortal === "zvg.com" || listing.key.startsWith("zvgcom-")) return "zvg.com";
  return null;
}

/** Compact area, €/m², room, and parcel badges for search list rows. */
export function getPropertyMetricsChips(listing: Listing, locale: LocaleOption): string[] {
  const chips: string[] = [];
  const isTr = listing.market === "TR";
  const tr = listing.tr;
  const m = METRIC_CHIP_COPY[locale] ?? METRIC_CHIP_COPY.en;

  const living = listing.livingAreaM2 ?? tr?.buildingAreaM2 ?? null;
  const net = tr?.netAreaM2 ?? null;
  const usable = listing.usableAreaM2 ?? null;
  const land = listing.landAreaM2 ?? tr?.landAreaM2 ?? null;

  if (living && living > 0) {
    chips.push(`${isTr ? m.building : m.living} ${formatArea(living, locale)}`);
  }
  if (net && net > 0 && net !== living) {
    chips.push(`${m.net} ${formatArea(net, locale)}`);
  }
  if (usable && usable > 0 && usable !== living) {
    chips.push(`${m.usable} ${formatArea(usable, locale)}`);
  }
  if (land && land > 0 && land !== living) {
    chips.push(`${m.land} ${formatArea(land, locale)}`);
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
  if (yearBuilt) chips.push(`${m.yearBuilt} ${yearBuilt}`);

  if (isTr && tr?.ada && tr?.parsel) {
    chips.push(`Ada ${tr.ada} · Parsel ${tr.parsel}`);
  }

  return chips;
}

interface PurchaseTermSet {
  valuation: string;
  marketRef: string;
  minBid: string;
  openingPrice: string;
  guidePrice: string;
  deposit: string;
  limit75: string;
  limit70: string;
  limit67: string;
  basePrice100: string;
}

const PURCHASE_TERMS: Record<LocaleOption, PurchaseTermSet> = {
  de: {
    valuation: "Schätzwert",
    marketRef: "Marktreferenzwert",
    minBid: "Geringstes Gebot",
    openingPrice: "Ausrufpreis",
    guidePrice: "Auktions-Richtpreis",
    deposit: "Sicherheitsleistung",
    limit75: "3/4-Grenze (75 %)",
    limit70: "70-%-Zuschlagsschwelle",
    limit67: "1. Termin 2/3-Grenze",
    basePrice100: "Prezzo Base (100 %)",
  },
  tr: {
    valuation: "Ekspertiz Değeri",
    marketRef: "Piyasa Referans Değeri",
    minBid: "Asgari Teklif",
    openingPrice: "Açılış Fiyatı",
    guidePrice: "Katalog Başlangıç",
    deposit: "İhale Teminatı",
    limit75: "3/4 Sınırı (%75)",
    limit70: "%70 İhale Sınırı",
    limit67: "I. İhale Sınırı (2/3)",
    basePrice100: "Mahkeme Baz Değeri (%100)",
  },
  en: {
    valuation: "Appraised Value",
    marketRef: "Market Reference Value",
    minBid: "Minimum Bid",
    openingPrice: "Opening Price",
    guidePrice: "Guide Price",
    deposit: "Auction Deposit",
    limit75: "75% Threshold",
    limit70: "70% Award Threshold",
    limit67: "1st Round 2/3 Threshold",
    basePrice100: "Base Price (100%)",
  },
  it: {
    valuation: "Valore di Stima",
    marketRef: "Valore di Riferimento",
    minBid: "Offerta Minima",
    openingPrice: "Prezzo di Partenza",
    guidePrice: "Prezzo Indicativo",
    deposit: "Deposito Cauzionale",
    limit75: "Soglia 3/4 (75%)",
    limit70: "Soglia Aggiudicazione (70%)",
    limit67: "1° Esperimento 2/3",
    basePrice100: "Prezzo Base (100%)",
  },
  es: {
    valuation: "Valor de Tasación",
    marketRef: "Valor de Referencia",
    minBid: "Puja Mínima",
    openingPrice: "Precio de Salida",
    guidePrice: "Precio Orientativo",
    deposit: "Depósito Judicial",
    limit75: "Umbral 3/4 (75%)",
    limit70: "Umbral de Adjudicación (70%)",
    limit67: "1.ª Subasta 2/3",
    basePrice100: "Precio Base (100%)",
  },
  fr: {
    valuation: "Valeur d'Estimation",
    marketRef: "Référence de Marché",
    minBid: "Enchère Minimale",
    openingPrice: "Mise à Prix",
    guidePrice: "Prix Indicatif",
    deposit: "Consignation / Caution",
    limit75: "Seuil 3/4 (75 %)",
    limit70: "Seuil d'Adjudication (70 %)",
    limit67: "1re Audience 2/3",
    basePrice100: "Prix de Base (100 %)",
  },
  pl: {
    valuation: "Suma Oszacowania",
    marketRef: "Wartość Referencyjna",
    minBid: "Cena Wywołania",
    openingPrice: "Cena Wywołania",
    guidePrice: "Cena Orientacyjna",
    deposit: "Rękojmia / Wadium",
    limit75: "I Licytacja (3/4 = 75%)",
    limit70: "Próg Przybicia (70%)",
    limit67: "I Termin (2/3)",
    basePrice100: "Cena Bazowa (100%)",
  },
  cs: {
    valuation: "Odhadní Cena",
    marketRef: "Tržní Referenční Cena",
    minBid: "Nejnižší Podání",
    openingPrice: "Vyvolávací Cena",
    guidePrice: "Orientační Cena",
    deposit: "Dražební Jistota",
    limit75: "Hranice 3/4 (75 %)",
    limit70: "Hranice Příklepu (70 %)",
    limit67: "1. Kolo (2/3)",
    basePrice100: "Základní Cena (100 %)",
  },
  nl: {
    valuation: "Taxatiewaarde",
    marketRef: "Marktreferentiewaarde",
    minBid: "Minimumbod",
    openingPrice: "Inzetprijs",
    guidePrice: "Richtprijs",
    deposit: "Waarborgsom",
    limit75: "3/4-Grens (75%)",
    limit70: "70%-Gunningsgrens",
    limit67: "1e Ronde 2/3-Grens",
    basePrice100: "Basisprijs (100%)",
  },
  sv: {
    valuation: "Värderat Marknadsvärde",
    marketRef: "Marknadsreferens",
    minBid: "Lägsta Bud",
    openingPrice: "Utgångspris",
    guidePrice: "Riktpris",
    deposit: "Handpenning",
    limit75: "3/4-Gräns (75 %)",
    limit70: "70 %-Tröskel",
    limit67: "1:a Utrop 2/3-Gräns",
    basePrice100: "Baspris (100 %)",
  },
};

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
  const isIt = listing.country === "IT" || listing.key.startsWith("it-aste-");
  const isEs = listing.country === "ES" || listing.key.startsWith("es-boe-");
  const isFr = listing.country === "FR" || listing.key.startsWith("fr-");
  const isGb = listing.country === "GB" || listing.key.startsWith("gb-");
  const isNl = listing.country === "NL" || listing.key.startsWith("nl-");
  const isPl = listing.country === "PL" || listing.key.startsWith("pl-");
  const isCz = listing.country === "CZ" || listing.key.startsWith("cz-");
  const isSe = listing.country === "SE" || listing.key.startsWith("se-");
  const t = PURCHASE_TERMS[locale] ?? PURCHASE_TERMS.en;

  return {
    isCh: isCh || isFr || isGb || isNl || isSe,
    valueLabel: isAt
      ? `${t.valuation} (§ 140 EO)`
      : isCh
        ? `${t.valuation} (SchKG)`
        : isIt
          ? `${t.valuation} (Prezzo Base)`
          : isEs
            ? `${t.valuation} (BOE)`
            : isFr
              ? `${t.marketRef} (DVF/m²)`
              : isGb
                ? `${t.marketRef} (RICS)`
                : isNl
                  ? `${t.marketRef} (Kadaster)`
                  : isPl
                    ? `${t.valuation} (KPC)`
                    : isCz
                      ? `${t.valuation} (OSŘ)`
                      : isSe
                        ? `${t.valuation} (Kronofogden)`
                        : L.Value[listing.market],
    halfLabel: isAt
      ? `${t.minBid} (§ 151 EO)`
      : isCh
        ? `${t.guidePrice} (SchKG)`
        : isIt
          ? `${t.minBid} (75 %)`
          : isEs
            ? `${t.minBid} (70 % LEC)`
            : isFr
              ? `${t.openingPrice} (Mise à prix)`
              : isGb
                ? `${t.guidePrice} (UK)`
                : isNl
                  ? `${t.openingPrice} (Art. 3:268 BW)`
                  : isPl
                    ? `${t.openingPrice} (3/4 · 2/3 KPC)`
                    : isCz
                      ? `${t.minBid} (2/3 · § 336e OSŘ)`
                      : isSe
                        ? `${t.guidePrice} (12 kap. UB)`
                        : L.Half,
    depositLabel: isAt
      ? `${t.deposit} (§ 147 EO · 10 %)`
      : isCh
        ? `${t.deposit} (SchKG)`
        : isIt
          ? `${t.deposit} (10 %)`
          : isEs
            ? `${t.deposit} (BOE · 5 %)`
            : isFr
              ? `${t.deposit} (Consignation)`
              : isGb
                ? `${t.deposit} (10 %)`
                : isNl
                  ? `${t.deposit} (10 %)`
                  : isPl
                    ? `${t.deposit} (Art. 962 KPC · 10 %)`
                    : isCz
                      ? `${t.deposit} (§ 336e OSŘ)`
                      : isSe
                        ? `${t.deposit} (10 %)`
                        : L.Deposit,
    secondLimitLabel: isAt
      ? `${t.limit75} (§ 195 EO)`
      : isIt
        ? t.basePrice100
        : isEs
          ? `${t.limit70} (Art. 670 LEC)`
          : isPl
            ? `${t.limit75} (Art. 965 KPC)`
            : isCz
              ? `${t.limit67} (§ 336e OSŘ)`
              : L.SevenTenths,
    secondLimitVal: (value, sevenTenths) =>
      isAt || isPl ? Math.round(value * 0.75) : isCz ? Math.round((value * 2) / 3) : isIt ? value : isEs ? Math.round(value * 0.7) : sevenTenths,
  };
}
