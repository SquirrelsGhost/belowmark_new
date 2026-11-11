import { SIGNUP_BANNER_COPY } from "@/lib/auth/signupBannerCopy";
import { LocaleOption } from "@/lib/constants";
import { PseoPreviewListing } from "@/types/pseo.types";

interface SignupContextBannerProps {
  lang: LocaleOption;
  previewListing?: PseoPreviewListing;
  targetCity?: string;
}

const LOCALE_FORMAT: Record<LocaleOption, string> = {
  de: "de-DE",
  tr: "tr-TR",
  en: "en-GB",
  it: "it-IT",
  es: "es-ES",
  fr: "fr-FR",
};

function formatCurrency(val: number | null, currency: "EUR" | "CHF" | "GBP" | "TRY", lang: LocaleOption): string {
  if (!val) return "—";
  return new Intl.NumberFormat(LOCALE_FORMAT[lang], {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(val);
}

export default function SignupContextBanner({ lang, previewListing, targetCity }: SignupContextBannerProps) {
  if (!previewListing && !targetCity) return null;
  const copy = SIGNUP_BANNER_COPY[lang] ?? SIGNUP_BANNER_COPY.de;
  const cityLabel = targetCity || previewListing?.place || "";

  if (previewListing) {
    return (
      <div className="mb-5 border-2 border-ink bg-paper-deep p-4">
        <span className="inline-block bg-signal px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-paper-bright">
          {copy.listingBadge}
        </span>
        <p className="mt-2 font-display text-lg leading-snug text-ink">{previewListing.title}</p>
        <p className="mt-0.5 font-mono text-xs text-ink-soft">
          {previewListing.postcode ? `${previewListing.postcode} ` : ""}
          {previewListing.place} · {previewListing.authority}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-b border-rule-strong py-2 font-mono text-xs">
          <div>
            <span className="block text-[10px] uppercase text-ink-soft">{copy.appraised}</span>
            <span className="font-semibold text-ink">
              {formatCurrency(previewListing.appraisedValue, previewListing.currency, lang)}
            </span>
          </div>
          <div>
            <span className="block text-[10px] uppercase text-ink-soft">{copy.minBid}</span>
            <span className="font-semibold text-signal">
              {formatCurrency(previewListing.minimumBid, previewListing.currency, lang)}
            </span>
          </div>
        </div>
        <p className="mt-2.5 font-serif text-xs leading-relaxed text-ink-soft">
          {copy.listingNote(cityLabel)}
        </p>
      </div>
    );
  }

  return (
    <div className="mb-5 border-2 border-ink bg-paper-deep p-4">
      <span className="inline-block bg-signal px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-paper-bright">
        {copy.alertBadge}
      </span>
      <p className="mt-2 font-display text-lg leading-snug text-ink">{copy.cityTitle(cityLabel)}</p>
      <p className="mt-1 font-serif text-xs leading-relaxed text-ink-soft">{copy.cityNote(cityLabel)}</p>
    </div>
  );
}
