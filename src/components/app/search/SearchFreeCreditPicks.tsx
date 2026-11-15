import FreeUnlockButton from "@/components/app/listing/FreeUnlockButton";
import { listingHref } from "@/lib/appConstants";
import { TRIAL_COPY } from "@/lib/billing/trialCopy";
import { LocaleOption } from "@/lib/constants";
import { Listing, ListingCountry } from "@/types/listing.types";

interface SearchFreeCreditPicksProps {
  listings: Listing[];
  country: ListingCountry;
  locale: LocaleOption;
}

const LOCALE_FORMAT: Record<LocaleOption, string> = {
  de: "de-DE",
  tr: "tr-TR",
  en: "en-GB",
  it: "it-IT",
  es: "es-ES",
  fr: "fr-FR",
};

const QUICK_OPEN_LABEL: Record<LocaleOption, string> = {
  de: "🔓 Dieses Dossier gratis öffnen →",
  tr: "🔓 Bu Dosyayı Ücretsiz Aç →",
  en: "🔓 Unlock This Dossier Free →",
  fr: "🔓 Ouvrir ce Dossier Gratuit →",
  es: "🔓 Abrir Este Expediente Gratis →",
  it: "🔓 Sblocca Questo Fascicolo Gratis →",
};

function defaultCurrency(country: ListingCountry): "EUR" | "CHF" | "GBP" | "TRY" {
  if (country === "CH") return "CHF";
  if (country === "GB") return "GBP";
  if (country === "TR") return "TRY";
  return "EUR";
}

export default function SearchFreeCreditPicks({ listings, country, locale }: SearchFreeCreditPicksProps) {
  if (listings.length === 0) return null;
  const c = (TRIAL_COPY[locale] ?? TRIAL_COPY.de).unlock;
  const numLoc = LOCALE_FORMAT[locale] ?? "de-DE";
  const fallbackCurr = defaultCurrency(country);
  const cta = QUICK_OPEN_LABEL[locale] ?? QUICK_OPEN_LABEL.de;

  return (
    <div className="mt-4 grid gap-3 border-t border-rule-strong pt-4 sm:grid-cols-3">
      {listings.map((item) => {
        const curr = item.currency ?? fallbackCurr;
        const val = item.appraisedValue
          ? new Intl.NumberFormat(numLoc, { style: "currency", currency: curr, maximumFractionDigits: 0 }).format(item.appraisedValue)
          : null;
        const place = `${item.postcode ? `${item.postcode} ` : ""}${item.place ?? item.region ?? country}`;
        return (
          <div key={item.key} className="flex flex-col justify-between border border-ink bg-paper p-3">
            <div>
              <p className="truncate font-mono text-[10px] font-semibold uppercase tracking-wider text-signal">
                {item.segmentLabel ?? item.authority}
              </p>
              <p className="mt-0.5 line-clamp-1 font-display text-sm text-ink">{place}</p>
              <p className="truncate font-mono text-[11px] text-ink-soft">
                {val ? `${val} · ` : ""}
                {item.authority}
              </p>
            </div>
            <div className="mt-2.5">
              <FreeUnlockButton
                listingKey={item.key}
                ctaLabel={cta}
                pendingLabel={c.claimFreePending}
                noteLabel=""
                errorUsedLabel={c.claimFreeErrorUsed}
                errorDeviceLabel={c.claimFreeErrorDevice}
                errorGenericLabel={c.claimFreeErrorGeneric}
                redirectHref={listingHref(item.key)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
