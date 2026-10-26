import ClosingTeaser from "@/components/app/closing/ClosingTeaser";
import HearingResultForm from "@/components/app/closing/HearingResultForm";
import { lastHearingDate } from "@/lib/closing/closingListing";
import { LocaleOption } from "@/lib/constants";
import { ClosingCaseService } from "@/services/ClosingCaseService";
import { HearingResultService } from "@/services/HearingResultService";
import { getClosingTranslation } from "@/translations/closing/ClosingTranslations";
import { Listing } from "@/types/listing.types";

interface ListingClosingSectionProps {
  listing: Listing;
  userId: string;
  locale: LocaleOption;
  isLocked: boolean;
  now: number;
}

/** The after-hearing block of the Aktenblatt: report the result, and as buyer the way into the task list. */
export default async function ListingClosingSection({ listing, userId, locale, isLocked, now }: ListingClosingSectionProps) {
  const labels = getClosingTranslation(locale);
  const { Section } = labels;
  const hearingDate = lastHearingDate(listing, now);
  const [result, closingCase] = await Promise.all([HearingResultService.latest(userId, listing.key), ClosingCaseService.get(userId, listing.key)]);

  return (
    <section id="ergebnis" aria-label={Section.Title} className="mt-14 scroll-mt-24 flex flex-col gap-6 border-t-2 border-ink pt-8">
      <div>
        <p className="font-mono text-[11px] tracking-[0.16em] text-signal uppercase">{Section.Eyebrow}</p>
        <h2 className="font-display text-4xl sm:text-5xl">{Section.Title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{Section.Lead[listing.market]}</p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        {hearingDate ? (
          <HearingResultForm
            listingKey={listing.key}
            market={listing.market}
            appraisedValue={isLocked ? null : listing.appraisedValue}
            defaultHearingDate={result?.hearingDate ?? hearingDate}
            result={result}
            labels={labels.Result}
            locale={locale}
          />
        ) : (
          <p className="border border-dashed border-rule-strong p-5 text-sm text-ink-soft">{labels.Result.NotYet}</p>
        )}
        {(closingCase || result?.isBuyer) && (
          <ClosingTeaser listingKey={listing.key} market={listing.market} closingCase={closingCase} labels={labels} locale={locale} now={now} />
        )}
      </div>
    </section>
  );
}
