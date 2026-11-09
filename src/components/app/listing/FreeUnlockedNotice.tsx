import Button from "@/components/ui/Button";
import { APP_ROUTES } from "@/lib/appConstants";
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
  const copy = (TRIAL_COPY[locale] ?? TRIAL_COPY.de).unlockedNotice;
  const href = `${APP_ROUTES.order}?markt=${encodeURIComponent(country)}&tarif=investor-monat`;

  return (
    <section
      aria-label={copy.title}
      className="my-6 border-2 border-ink bg-paper p-5 sm:p-6 shadow-[4px_4px_0_0_var(--color-ink)]"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
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
        <div className="flex shrink-0 flex-col items-stretch gap-1.5 sm:items-start lg:items-end">
          <Button
            label={stripeTrialEligible ? copy.ctaTrial : copy.ctaStandard}
            href={href}
            variant="signal"
            withArrow
          />
          {stripeTrialEligible && (
            <p className="font-mono text-[11px] text-ink-muted">{copy.noteTrial}</p>
          )}
        </div>
      </div>
    </section>
  );
}
