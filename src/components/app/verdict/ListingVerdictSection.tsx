import LockedPanel from "@/components/app/listing/LockedPanel";
import ListingVerdictBody from "@/components/app/verdict/ListingVerdictBody";
import { LocaleOption } from "@/lib/constants";
import { getVerdictTranslation } from "@/translations/verdict/VerdictTranslations";
import { Listing } from "@/types/listing.types";

interface ListingVerdictSectionProps {
  listing: Listing;
  userId: string;
  locale: LocaleOption;
  /** Free plan: the verdict needs the bid limit and the Gutachten reader, both locked */
  isLocked: boolean;
  now: number;
  /** Text of the plan button in the locked panel */
  lockedCta: string;
}

/** The verdict "bid or leave it" at the top of the Aktenblatt — loads the user's Gutachten analysis itself. */
export default async function ListingVerdictSection({ listing, userId, locale, isLocked, now, lockedCta }: ListingVerdictSectionProps) {
  const labels = getVerdictTranslation(locale);
  const { Section } = labels;

  return (
    <section aria-label={Section.Title} className="mt-10 flex flex-col gap-6">
      <div>
        <p className="font-mono text-[11px] tracking-[0.16em] text-signal uppercase">{Section.Eyebrow}</p>
        <h2 className="font-display text-4xl sm:text-5xl">{Section.Title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{Section.Lead}</p>
      </div>
      {isLocked ? <LockedPanel title={labels.Locked.Title} body={labels.Locked.Body} cta={lockedCta} /> : <ListingVerdictBody listing={listing} userId={userId} locale={locale} now={now} />}
    </section>
  );
}
