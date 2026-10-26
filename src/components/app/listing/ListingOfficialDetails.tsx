import { formatArea, formatMoney } from "@/lib/appFormat";
import { LocaleOption } from "@/lib/constants";
import { Listing, OfficialPortalDetails } from "@/types/listing.types";

interface ListingOfficialDetailsProps {
  listing: Listing;
  details: OfficialPortalDetails;
  locale: LocaleOption;
}

const SECTION_CLASSES = "border-t-2 border-ink pt-4";
const GRID_CLASSES = "mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2";
const CARD_CLASSES = "border border-rule bg-paper-bright p-3.5";
const LABEL_CLASSES = "font-narrow text-[11px] font-semibold tracking-[0.14em] text-muted uppercase";
const VALUE_CLASSES = "mt-1 text-sm leading-relaxed text-ink";

export default function ListingOfficialDetails({
  listing,
  details,
  locale,
}: ListingOfficialDetailsProps) {
  const isTr = listing.market === "TR";
  const area = details.livingAreaM2 ?? details.landAreaM2 ?? listing.tr?.areaM2 ?? null;
  const pricePerM2 =
    area && area > 0 && listing.appraisedValue && listing.appraisedValue > 0
      ? Math.round(listing.appraisedValue / area)
      : null;

  const hasContent =
    Boolean(details.description) ||
    Boolean(details.grundbuch) ||
    Boolean(details.hearingPlace) ||
    Boolean(details.proceedingKind) ||
    Boolean(details.creditor) ||
    Boolean(details.livingAreaM2) ||
    Boolean(details.landAreaM2);

  if (!hasContent) return null;

  const title = isTr ? "Resmî İlan & Tapu Kayıt Detayları" : "Amtliche Bekanntmachung & Gerichtsdaten (Live)";
  const sub = isTr
    ? `Kaynak: ${details.sourcePortal} · Resmî satış şartnamesi verileri`
    : `Direktabruf: ${details.sourcePortal} · ${listing.authority}`;

  return (
    <section className={SECTION_CLASSES}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-narrow text-xs font-bold tracking-[0.16em] text-ink uppercase">{title}</h2>
        <span className="font-mono text-[11px] text-muted">{sub}</span>
      </div>

      {details.description && (
        <div className="mt-3 border border-ink/20 bg-paper-warm/40 p-4">
          <p className={LABEL_CLASSES}>{isTr ? "Taşınmaz & İmar Özeti" : "Amtliche Objektbeschreibung"}</p>
          <p className="mt-1.5 whitespace-pre-line font-serif text-sm leading-relaxed text-ink">
            {details.description}
          </p>
        </div>
      )}

      <div className={GRID_CLASSES}>
        {details.proceedingKind && (
          <div className={CARD_CLASSES}>
            <p className={LABEL_CLASSES}>{isTr ? "Satış Türü" : "Art der Versteigerung"}</p>
            <p className={VALUE_CLASSES}>{details.proceedingKind}</p>
          </div>
        )}

        {details.grundbuch && (
          <div className={CARD_CLASSES}>
            <p className={LABEL_CLASSES}>{isTr ? "Tapu / Ada & Parsel" : "Grundbuchblatt"}</p>
            <p className="mt-1 font-mono text-xs leading-relaxed text-ink">{details.grundbuch}</p>
          </div>
        )}

        {details.hearingPlace && (
          <div className={CARD_CLASSES}>
            <p className={LABEL_CLASSES}>{isTr ? "İhale Mecrası" : "Versteigerungsort & Saal"}</p>
            <p className={VALUE_CLASSES}>{details.hearingPlace}</p>
          </div>
        )}

        {(details.livingAreaM2 || details.landAreaM2 || pricePerM2) && (
          <div className={CARD_CLASSES}>
            <p className={LABEL_CLASSES}>{isTr ? "Yüzölçümü & m² Değeri" : "Flächen & Richtwert / m²"}</p>
            <p className="mt-1 font-mono text-xs leading-relaxed text-ink">
              {[
                details.livingAreaM2
                  ? `${isTr ? "Brüt/Net" : "Wohn-/Nutzfläche"}: ${formatArea(details.livingAreaM2, locale)}`
                  : null,
                details.landAreaM2
                  ? `${isTr ? "Arsa" : "Grundstück"}: ${formatArea(details.landAreaM2, locale)}`
                  : null,
                pricePerM2
                  ? `${formatMoney(pricePerM2, listing.market, locale)} / m²`
                  : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
        )}

        {details.creditor && (
          <div className={`${CARD_CLASSES} sm:col-span-2`}>
            <p className={LABEL_CLASSES}>{isTr ? "Alacaklı / Kurum" : "Gläubiger / Vertretung"}</p>
            <p className={VALUE_CLASSES}>{details.creditor}</p>
          </div>
        )}
      </div>
    </section>
  );
}
