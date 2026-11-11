import QuickOrderCheckoutForm from "@/components/app/listing/QuickOrderCheckoutForm";
import { TRIAL_COPY } from "@/lib/billing/trialCopy";
import { LocaleOption } from "@/lib/constants";
import { ListingCountry } from "@/types/listing.types";

interface FreeUnlockedNoticeProps {
  country: ListingCountry;
  locale: LocaleOption;
  stripeTrialEligible: boolean;
}

export default function FreeUnlockedNotice({
  country,
  locale,
  stripeTrialEligible,
}: FreeUnlockedNoticeProps) {
  const t = TRIAL_COPY[locale] ?? TRIAL_COPY.de;
  const copy = t.unlockedNotice;
  const unlockCopy = t.unlock;

  return (
    <section
      aria-label={copy.title}
      className="my-6 border-2 border-ink bg-paper p-5 sm:p-6 shadow-[4px_4px_0_0_var(--color-ink)]"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-verdict">
            {copy.kicker}
          </p>
          <h2 className="mt-1 font-display text-xl leading-snug text-ink sm:text-2xl">
            {copy.title}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
            {copy.body}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-stretch sm:items-start lg:items-end">
          <QuickOrderCheckoutForm
            country={country}
            locale={locale}
            stripeTrialEligible={stripeTrialEligible}
            submitLabel={stripeTrialEligible ? copy.ctaTrial : copy.ctaStandard}
            noteLabel={stripeTrialEligible ? copy.noteTrial : unlockCopy.primaryStandardNote}
          />
        </div>
      </div>
    </section>
  );
}
