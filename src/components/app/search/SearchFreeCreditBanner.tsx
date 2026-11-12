import Link from "next/link";
import FreeUnlockButton from "@/components/app/listing/FreeUnlockButton";
import QuickOrderCheckoutForm from "@/components/app/listing/QuickOrderCheckoutForm";
import { APP_ROUTES, listingHref } from "@/lib/appConstants";
import { TRIAL_COPY } from "@/lib/billing/trialCopy";
import { LocaleOption } from "@/lib/constants";
import { Listing, ListingCountry } from "@/types/listing.types";

interface SearchFreeCreditBannerProps {
  country: ListingCountry;
  locale: LocaleOption;
  canClaimFreeUnlock: boolean;
  unlockedListingKey: string | null;
  suggestedListing: Listing | null;
  stripeTrialEligible: boolean;
}

export default function SearchFreeCreditBanner({
  country,
  locale,
  canClaimFreeUnlock,
  unlockedListingKey,
  suggestedListing,
  stripeTrialEligible,
}: SearchFreeCreditBannerProps) {
  const c = (TRIAL_COPY[locale] ?? TRIAL_COPY.de).unlock;
  const orderHref = `${APP_ROUTES.order}?markt=${encodeURIComponent(country)}&tarif=investor-monat`;

  if (!canClaimFreeUnlock && !unlockedListingKey && !stripeTrialEligible) {
    return null;
  }

  const targetHref = suggestedListing ? listingHref(suggestedListing.key) : null;
  const placeLabel = suggestedListing
    ? `${suggestedListing.postcode ? `${suggestedListing.postcode} ` : ""}${suggestedListing.place} · ${suggestedListing.authority}`
    : null;

  return (
    <section
      aria-label={canClaimFreeUnlock ? c.titleCanClaim : c.titleTrial}
      className="mb-5 border-2 border-ink bg-paper-bright p-4 sm:p-5 shadow-[4px_4px_0_0_var(--color-ink)]"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <span className="inline-block bg-verdict px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-paper-bright">
            {canClaimFreeUnlock ? `🎁 ${c.kickerCanClaim}` : c.kickerUsed}
          </span>
          <h2 className="mt-2 font-display text-xl leading-snug text-ink sm:text-2xl">
            {canClaimFreeUnlock
              ? c.titleCanClaim
              : stripeTrialEligible
                ? c.titleTrial
                : c.titleStandard}
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-ink-soft sm:text-sm">
            {canClaimFreeUnlock
              ? c.bodyCanClaim
              : stripeTrialEligible
                ? c.bodyTrial
                : c.bodyStandard}
          </p>
          {canClaimFreeUnlock && placeLabel && (
            <p className="mt-2 font-mono text-[11px] font-semibold text-ink">
              → {placeLabel}
            </p>
          )}
          {!canClaimFreeUnlock && unlockedListingKey && (
            <p className="mt-2 font-mono text-xs text-ink-soft">
              {c.viewUnlockedPrefix}{" "}
              <Link
                href={listingHref(unlockedListingKey)}
                className="font-semibold text-ink underline underline-offset-4 hover:text-signal"
              >
                {c.viewUnlockedLink} →
              </Link>
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-start lg:items-end">
          {canClaimFreeUnlock && suggestedListing && targetHref ? (
            <>
              <FreeUnlockButton
                listingKey={suggestedListing.key}
                ctaLabel={c.claimFreeCta}
                pendingLabel={c.claimFreePending}
                noteLabel={c.claimFreeNote}
                errorUsedLabel={c.claimFreeErrorUsed}
                errorDeviceLabel={c.claimFreeErrorDevice}
                errorGenericLabel={c.claimFreeErrorGeneric}
                redirectHref={targetHref}
              />
              {stripeTrialEligible && (
                <Link
                  href={orderHref}
                  className="font-mono text-[11px] font-semibold text-ink underline underline-offset-4 hover:text-signal"
                >
                  {c.secondaryTrialCta}
                </Link>
              )}
            </>
          ) : (
            <QuickOrderCheckoutForm
              country={country}
              locale={locale}
              stripeTrialEligible={stripeTrialEligible}
              submitLabel={stripeTrialEligible ? c.primaryTrialCta : c.primaryStandardCta}
              noteLabel={stripeTrialEligible ? c.primaryTrialNote : c.primaryStandardNote}
            />
          )}
        </div>
      </div>
    </section>
  );
}
