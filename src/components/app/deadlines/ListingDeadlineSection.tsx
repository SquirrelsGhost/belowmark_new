import DeadlineCalendarLink from "@/components/app/deadlines/DeadlineCalendarLink";
import DeadlineChecklist from "@/components/app/deadlines/DeadlineChecklist";
import DeadlineFollowBar from "@/components/app/deadlines/DeadlineFollowBar";
import DeadlineFollowButton from "@/components/app/deadlines/DeadlineFollowButton";
import DeadlineMailSwitch from "@/components/app/deadlines/DeadlineMailSwitch";
import DeadlineNote from "@/components/app/deadlines/DeadlineNote";
import DeadlineTimeline from "@/components/app/deadlines/DeadlineTimeline";
import { LocaleOption } from "@/lib/constants";
import { DEADLINE_ANCHOR, DEADLINE_ROUTES } from "@/lib/deadlines/deadlineConstants";
import { marketToday } from "@/lib/deadlines/deadlineFormat";
import { deadlineSteps } from "@/lib/deadlines/deadlineSteps";
import { DeadlineService } from "@/services/DeadlineService";
import { DeadlineTimelineService } from "@/services/DeadlineTimelineService";
import { ReportService } from "@/services/ReportService";
import { getDeadlineTranslation } from "@/translations/deadlines/DeadlineTranslations";
import { Listing } from "@/types/listing.types";

interface ListingDeadlineSectionProps {
  listing: Listing;
  userId: string;
  locale: LocaleOption;
  /** Free plan: reminders and the computed deadlines are part of the paid plan */
  isLocked: boolean;
  now: number;
  lockedCta: string;
}

/** "Fristen & Fahrplan" on the Aktenblatt — loads the follow state and the timeline itself. */
export default async function ListingDeadlineSection({ listing, userId, locale, isLocked, now, lockedCta }: ListingDeadlineSectionProps) {
  const labels = getDeadlineTranslation(locale);
  const { Section: S, Follow: F, Checklist: C } = labels;
  const market = listing.market;

  const header = (
    <div>
      <p className="font-mono text-[11px] tracking-[0.16em] text-signal uppercase">{S.Eyebrow}</p>
      <h2 className="font-display text-3xl sm:text-4xl">{S.Title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{S.Lead[market]}</p>
    </div>
  );

  const [follow, items, report] = await Promise.all([
    DeadlineService.get(userId, listing.key),
    DeadlineTimelineService.forListing({ userId, listing, locale, now, hideAmounts: isLocked }),
    ReportService.get(userId, listing.key),
  ]);
  const today = marketToday(market, now);
  const hasDates = items.some((item) => item.phase !== "before" || item.kind !== "info");

  return (
    <section id={DEADLINE_ANCHOR} aria-label={S.Title} className="mt-12 flex scroll-mt-24 flex-col gap-6 border-t border-ink pt-6">
      {header}
      <DeadlineFollowBar status={follow ? F.Following : F.NotFollowing} isFollowing={follow !== null}>
        {follow && <DeadlineMailSwitch listingKey={listing.key} isOn={follow.mailEnabled} onLabel={F.MailOn} offLabel={F.MailOff} errorLabel={F.Error} />}
        {hasDates && <DeadlineCalendarLink href={`${DEADLINE_ROUTES.download}?key=${encodeURIComponent(listing.key)}`} label={F.Download} />}
        <DeadlineFollowButton listingKey={listing.key} isFollowing={follow !== null} followLabel={F.Start} unfollowLabel={F.Stop} errorLabel={F.Error} />
      </DeadlineFollowBar>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="flex min-w-0 flex-col gap-4">
          {listing.cancelled && <DeadlineNote text={S.Cancelled} tone="hatch" />}
          {!listing.cancelled && !hasDates && <DeadlineNote text={S.NoDates} tone="hatch" />}
          {hasDates && <DeadlineTimeline items={items} market={market} locale={locale} today={today} now={now} labels={labels} />}
          <DeadlineNote text={S.Disclaimer} />
          {follow && (
            <a href={DEADLINE_ROUTES.overview} className="font-narrow text-xs font-semibold tracking-[0.1em] uppercase underline-offset-4 hover:underline">
              {F.Overview} →
            </a>
          )}
        </div>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <DeadlineChecklist listingKey={listing.key} title={C.Title} hint={C.Hint} progressTemplate={C.Progress} autoLabel={C.Auto} steps={deadlineSteps(listing, C.Steps[market], report !== null)} />
        </div>
      </div>
    </section>
  );
}
