import { formatArea, formatMoney } from "@/lib/appFormat";
import { LocaleOption } from "@/lib/constants";
import { getEntryBid } from "@/lib/listingMath";
import { Listing, OfficialPortalDetails } from "@/types/listing.types";

interface ListingOfficialDetailsProps {
  listing: Listing;
  details: OfficialPortalDetails;
  locale: LocaleOption;
  isLocked?: boolean;
}

const SECTION_CLASSES = "border-t-2 border-ink pt-4";
const GRID_CLASSES = "mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2";
const CARD_CLASSES = "border border-rule bg-paper-bright p-3.5";
const LABEL_CLASSES = "font-narrow text-[11px] font-semibold tracking-[0.14em] text-muted uppercase";
const VALUE_CLASSES = "mt-1 text-sm leading-relaxed text-ink";
const MONO_VALUE_CLASSES = "mt-1 font-mono text-xs leading-relaxed text-ink";

const LABELS = {
  tr: { title: "Resmî İlan, Yüzölçümü & Tapu Detayları", description: "Taşınmaz & Bilirkişi Özeti", area: "Yüzölçümü & m² Değerleri", meta: "Bağımsız Bölüm & Yapı Bilgileri", grundbuch: "Tapu / Ada & Parsel", proceeding: "Satış Türü", hearingPlace: "İhale Mecrası", zoning: "İmar Durumu", creditor: "Alacaklı / Kurum" },
  de: { title: "Amtliche Bekanntmachung, Flächen & Gerichtsdaten", description: "Amtliche Objektbeschreibung", area: "Flächenangaben & Richtwerte / m²", meta: "Objektmerkmale & Ausstattung", grundbuch: "Grundbuch & Flurstück", proceeding: "Art der Versteigerung", hearingPlace: "Versteigerungsort & Saal", zoning: "Bauplanungsrecht", creditor: "Gläubiger / Ansprechpartner" },
} as const;

export default function ListingOfficialDetails({ listing, details, locale, isLocked = false }: ListingOfficialDetailsProps) {
  const isTr = locale === "tr";
  const L = isTr ? LABELS.tr : LABELS.de;
  const living = details.livingAreaM2 ?? listing.livingAreaM2 ?? listing.tr?.buildingAreaM2 ?? null;
  const net = details.netAreaM2 ?? listing.tr?.netAreaM2 ?? null;
  const usable = details.usableAreaM2 ?? listing.usableAreaM2 ?? null;
  const land = details.landAreaM2 ?? listing.landAreaM2 ?? listing.tr?.landAreaM2 ?? null;
  const primaryArea = living ?? net ?? usable ?? listing.tr?.areaM2 ?? listing.areaM2 ?? land ?? null;

  const pricePerM2 = !isLocked && primaryArea && primaryArea > 0 && listing.appraisedValue && listing.appraisedValue > 0 ? Math.round(listing.appraisedValue / primaryArea) : null;
  const entry = getEntryBid(listing);
  const entryPerM2 = !isLocked && primaryArea && primaryArea > 0 && entry && entry > 0 ? Math.round(entry / primaryArea) : null;

  const rooms = details.rooms ?? listing.rooms ?? listing.tr?.rooms ?? null;
  const floor = details.floor ?? listing.tr?.floor ?? null;
  const yearBuilt = details.yearBuilt ?? listing.yearBuilt ?? listing.tr?.yearBuilt ?? null;
  const unitNo = details.unitNo ?? listing.tr?.unitNo ?? null;
  const arsaPayi = details.arsaPayi ?? listing.tr?.arsaPayi ?? null;

  const areaLines = [
    living ? `${isTr ? "Brüt / Bina Alanı" : "Wohnfläche"}: ${formatArea(living, locale)}` : null,
    net && net !== living ? `${isTr ? "Net Alan" : "Nettofläche"}: ${formatArea(net, locale)}` : null,
    usable && usable !== living ? `${isTr ? "Kullanım Alanı" : "Nutz-/Gewerbefläche"}: ${formatArea(usable, locale)}` : null,
    land ? `${isTr ? "Arsa Yüzölçümü" : "Grundstücksfläche"}: ${formatArea(land, locale)}` : null,
    pricePerM2 ? `${isTr ? "Muhammen / m²" : "Verkehrswert / m²"}: ${formatMoney(pricePerM2, listing.market, locale, listing.currency)}/m²` : null,
    entryPerM2 ? `${isTr ? "Başlangıç / m²" : "5/10-Grenze / m²"}: ${formatMoney(entryPerM2, listing.market, locale, listing.currency)}/m²` : null,
  ].filter(Boolean);

  const objectMetaLines = [
    rooms ? `${isTr ? "Oda Sayısı" : "Zimmer"}: ${rooms}` : null,
    floor ? `${isTr ? "Bulunduğu Kat" : "Etage"}: ${floor}` : null,
    yearBuilt ? `${isTr ? "Yapım Yılı" : "Baujahr"}: ${yearBuilt}` : null,
    unitNo ? `${isTr ? "Bağımsız Bölüm No" : "Einheit Nr."}: ${unitNo}` : null,
    arsaPayi ? `${isTr ? "Arsa Payı" : "Miteigentumsanteil"}: ${arsaPayi}` : null,
    details.ownershipShare ? `${isTr ? "Hisse Oranı" : "Eigentumsanteil"}: ${details.ownershipShare}` : null,
  ].filter(Boolean);

  const hasContent = Boolean(details.description || details.grundbuch || details.hearingPlace || details.proceedingKind || details.creditor) || areaLines.length > 0 || objectMetaLines.length > 0;
  if (!hasContent) return null;

  const sub = isTr ? `Kaynak: ${details.sourcePortal} · Resmî satış şartnamesi verileri` : `Direktabruf: ${details.sourcePortal} · ${listing.authority}`;

  return (
    <section className={SECTION_CLASSES}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-narrow text-xs font-bold tracking-[0.16em] text-ink uppercase">{L.title}</h2>
        <span className="font-mono text-[11px] text-muted">{sub}</span>
      </div>

      {details.description && (
        <div className="mt-3 border border-ink/20 bg-paper-warm/40 p-4">
          <p className={LABEL_CLASSES}>{L.description}</p>
          <p className="mt-1.5 whitespace-pre-line font-serif text-sm leading-relaxed text-ink">{details.description}</p>
        </div>
      )}

      <div className={GRID_CLASSES}>
        {areaLines.length > 0 && (
          <div className={CARD_CLASSES}>
            <p className={LABEL_CLASSES}>{L.area}</p>
            <p className={MONO_VALUE_CLASSES}>{areaLines.join(" · ")}</p>
          </div>
        )}

        {objectMetaLines.length > 0 && (
          <div className={CARD_CLASSES}>
            <p className={LABEL_CLASSES}>{L.meta}</p>
            <p className={MONO_VALUE_CLASSES}>{objectMetaLines.join(" · ")}</p>
          </div>
        )}

        {details.grundbuch && (
          <div className={CARD_CLASSES}>
            <p className={LABEL_CLASSES}>{L.grundbuch}</p>
            <p className={MONO_VALUE_CLASSES}>{details.grundbuch}</p>
          </div>
        )}

        {details.proceedingKind && (
          <div className={CARD_CLASSES}>
            <p className={LABEL_CLASSES}>{L.proceeding}</p>
            <p className={VALUE_CLASSES}>{details.proceedingKind}</p>
          </div>
        )}

        {details.hearingPlace && (
          <div className={CARD_CLASSES}>
            <p className={LABEL_CLASSES}>{L.hearingPlace}</p>
            <p className={VALUE_CLASSES}>{details.hearingPlace}</p>
          </div>
        )}

        {details.zoning && (
          <div className={CARD_CLASSES}>
            <p className={LABEL_CLASSES}>{L.zoning}</p>
            <p className={VALUE_CLASSES}>{details.zoning}</p>
          </div>
        )}

        {details.creditor && (
          <div className={`${CARD_CLASSES} sm:col-span-2`}>
            <p className={LABEL_CLASSES}>{L.creditor}</p>
            <p className={VALUE_CLASSES}>{details.creditor}</p>
          </div>
        )}
      </div>
    </section>
  );
}
