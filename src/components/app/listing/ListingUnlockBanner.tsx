import Link from "next/link";
import FreeUnlockButton from "@/components/app/listing/FreeUnlockButton";
import QuickOrderCheckoutForm from "@/components/app/listing/QuickOrderCheckoutForm";
import { APP_ROUTES, listingHref } from "@/lib/appConstants";
import { TRIAL_COPY } from "@/lib/billing/trialCopy";
import { LocaleOption } from "@/lib/constants";
import { Listing, ListingCountry } from "@/types/listing.types";

interface ListingUnlockBannerProps {
  listing: Listing;
  country: ListingCountry;
  locale: LocaleOption;
  canClaimFreeUnlock?: boolean;
  unlockedListingKey?: string | null;
  stripeTrialEligible?: boolean;
}

export default function ListingUnlockBanner({
  listing,
  country,
  locale,
  canClaimFreeUnlock = false,
  unlockedListingKey = null,
  stripeTrialEligible = true,
}: ListingUnlockBannerProps) {
  const c = (TRIAL_COPY[locale] ?? TRIAL_COPY.de).unlock;
  const orderHref = `${APP_ROUTES.order}?markt=${encodeURIComponent(country)}&tarif=investor-monat`;

  const kicker = canClaimFreeUnlock ? c.kickerCanClaim : c.kickerUsed;
  const title = canClaimFreeUnlock
    ? c.titleCanClaim
    : stripeTrialEligible
      ? c.titleTrial
      : c.titleStandard;
  const body = canClaimFreeUnlock
    ? c.bodyCanClaim
    : stripeTrialEligible
      ? c.bodyTrial
      : c.bodyStandard;

  return (
    <section
      id="free-unlock"
      aria-label={title}
      className="my-6 scroll-mt-6 border-2 border-ink bg-paper-dark p-5 sm:p-6 shadow-[4px_4px_0_0_var(--color-ink)]"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-verdict">
            {kicker} · {listing.authority} ({listing.fileNo})
          </p>
          <h2 className="mt-1.5 font-display text-2xl leading-snug text-ink sm:text-3xl">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {body}
          </p>
          <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {c.items.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs font-medium text-ink">
                <span aria-hidden="true" className="font-mono text-verdict">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {!canClaimFreeUnlock && unlockedListingKey && (
            <p className="mt-3 font-mono text-xs text-ink-soft">
              {c.viewUnlockedPrefix}{" "}
              <Link
                href={listingHref(unlockedListingKey)}
                className="font-semibold text-ink underline underline-offset-4 hover:text-signal"
              >
                {c.viewUnlockedLink}
              </Link>
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-2.5 sm:items-start lg:items-end">
          {canClaimFreeUnlock ? (
            <>
              <FreeUnlockButton
                listingKey={listing.key}
                ctaLabel={c.claimFreeCta}
                pendingLabel={c.claimFreePending}
                noteLabel={c.claimFreeNote}
                errorUsedLabel={c.claimFreeErrorUsed}
                errorDeviceLabel={c.claimFreeErrorDevice}
                errorGenericLabel={c.claimFreeErrorGeneric}
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
