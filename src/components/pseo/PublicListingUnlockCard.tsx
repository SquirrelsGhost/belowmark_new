import Link from "next/link";
import FreeUnlockButton from "@/components/app/listing/FreeUnlockButton";
import SignupForm from "@/components/auth/SignupForm";
import { AUTH_ROUTES } from "@/lib/auth/authConfig";
import { listingHref } from "@/lib/appConstants";
import { TRIAL_COPY } from "@/lib/billing/trialCopy";
import { PUBLIC_LISTING_LABELS } from "@/lib/pseo/publicListingCopy";
import { PublicListingResolved } from "@/services/PublicListingService";
import { AuthTranslations } from "@/translations/auth/AuthTranslations";
import { Locale } from "@/translations/Translations";
import { PseoLocale } from "@/types/pseo.types";

interface PublicListingUnlockCardProps {
  item: PublicListingResolved;
  isSignedIn: boolean;
  canClaimFreeUnlock?: boolean;
}

const LOCALE_MAP: Record<PseoLocale, Locale> = {
  de: Locale.DE,
  tr: Locale.TR,
  en: Locale.EN,
  it: Locale.IT,
  es: Locale.ES,
  fr: Locale.FR,
};

export default function PublicListingUnlockCard({
  item,
  isSignedIn,
  canClaimFreeUnlock = false,
}: PublicListingUnlockCardProps) {
  const L = PUBLIC_LISTING_LABELS[item.locale];
  const authT = AuthTranslations[LOCALE_MAP[item.locale]];
  const unlockCopy = (TRIAL_COPY[item.locale] ?? TRIAL_COPY.de).unlock;
  const appListingUrl = listingHref(item.key);

  if (isSignedIn) {
    return (
      <aside id="unlock-dossier" className="border-2 border-ink bg-paper-bright p-6 shadow-[4px_4px_0_0_var(--color-ink)]">
        <span className="inline-block bg-verdict px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-paper-bright">
          {canClaimFreeUnlock ? `🎁 ${unlockCopy.kickerCanClaim}` : "✓ ACCOUNT ACTIVE"}
        </span>
        <h2 className="mt-3 font-display text-2xl leading-snug text-ink">
          {canClaimFreeUnlock ? unlockCopy.titleCanClaim : L.signedInTitle}
        </h2>
        <p className="mt-2 font-serif text-base leading-relaxed text-ink-soft">
          {canClaimFreeUnlock ? unlockCopy.bodyCanClaim : L.signedInLead}
        </p>
        {canClaimFreeUnlock ? (
          <div className="mt-5">
            <FreeUnlockButton
              listingKey={item.key}
              ctaLabel={unlockCopy.claimFreeCta}
              pendingLabel={unlockCopy.claimFreePending}
              noteLabel={unlockCopy.claimFreeNote}
              errorUsedLabel={unlockCopy.claimFreeErrorUsed}
              errorDeviceLabel={unlockCopy.claimFreeErrorDevice}
              errorGenericLabel={unlockCopy.claimFreeErrorGeneric}
              redirectHref={appListingUrl}
            />
          </div>
        ) : (
          <Link
            href={appListingUrl}
            className="mt-5 inline-flex w-full items-center justify-center bg-signal px-5 py-3.5 text-center font-narrow text-sm font-semibold uppercase tracking-wider text-paper-bright transition-colors hover:bg-ink"
          >
            {L.signedInCta}
          </Link>
        )}
      </aside>
    );
  }

  return (
    <aside id="unlock-dossier" className="border-2 border-ink bg-paper-bright p-5 sm:p-6 shadow-[4px_4px_0_0_var(--color-ink)]">
      <span className="inline-block bg-signal px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-paper-bright">
        {L.unlockBadge}
      </span>
      <h2 className="mt-3 font-display text-2xl leading-snug text-ink">{L.unlockTitle}</h2>
      <p className="mt-1.5 mb-5 font-serif text-sm leading-relaxed text-ink-soft">{L.unlockLead}</p>

      <SignupForm
        t={{ Fields: authT.Fields, Errors: authT.Errors, Signup: authT.Signup }}
        defaultMarket={item.country}
        targetKey={item.key}
        targetCity={item.cleanCity}
      />

      <p className="mt-4 border-t border-rule pt-3 text-center font-mono text-xs text-ink-soft">
        {authT.Signup.HaveAccount}{" "}
        <Link
          href={`${AUTH_ROUTES.login}?weiter=${encodeURIComponent(appListingUrl)}`}
          className="font-semibold text-ink underline underline-offset-4 hover:text-signal"
        >
          {authT.Signup.LoginLink}
        </Link>
      </p>
    </aside>
  );
}
