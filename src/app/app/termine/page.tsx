import { Metadata } from "next";
import AlertsNote from "@/components/app/alerts/AlertsNote";
import DeadlineCalendarLink from "@/components/app/deadlines/DeadlineCalendarLink";
import DeadlineFeedPanel from "@/components/app/deadlines/DeadlineFeedPanel";
import DeadlineFollowButton from "@/components/app/deadlines/DeadlineFollowButton";
import DeadlineFollowCard from "@/components/app/deadlines/DeadlineFollowCard";
import DeadlineFollowList from "@/components/app/deadlines/DeadlineFollowList";
import DeadlineMailSwitch from "@/components/app/deadlines/DeadlineMailSwitch";
import DeadlineNextLine from "@/components/app/deadlines/DeadlineNextLine";
import AppMain from "@/components/app/shell/AppMain";
import AppPageHeader from "@/components/app/shell/AppPageHeader";
import WatchlistEmpty from "@/components/app/watchlist/WatchlistEmpty";
import AlertsUsage from "@/components/app/alerts/AlertsUsage";
import { APP_MAIN_ID, listingHref } from "@/lib/appConstants";
import { fill } from "@/lib/appFormat";
import { getAppPageContext } from "@/lib/appPage";
import { DEADLINE_ANCHOR, DEADLINE_ROUTES } from "@/lib/deadlines/deadlineConstants";
import { formatDeadlineDistance, formatDeadlineWhen, isDeadlinePast, marketToday } from "@/lib/deadlines/deadlineFormat";
import { getPlaceTitle } from "@/lib/listingLabels";
import { DeadlineService } from "@/services/DeadlineService";
import { DeadlineTimelineService } from "@/services/DeadlineTimelineService";
import { ListingService } from "@/services/ListingService";
import { MetaTagService } from "@/services/MetaTagService";
import { TranslationService } from "@/services/TranslationService";
import { DeadlineTranslations, getDeadlineTranslation } from "@/translations/deadlines/DeadlineTranslations";

// Reads the session cookie on every request.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const { MetaTags } = DeadlineTranslations[await TranslationService.GetUserLocale()];
  return { ...MetaTagService.CreateMetaTags(MetaTags), robots: { index: false, follow: false } };
}

export default async function DeadlinesPage() {
  const { viewer, app, locale } = await getAppPageContext(DEADLINE_ROUTES.overview);
  const labels = getDeadlineTranslation(locale);
  const { Page: P, Follow: F, Section: S } = labels;
  const hideAmounts = viewer.plan === "free";

  const [follows, hasFeed] = await Promise.all([DeadlineService.list(viewer.id), DeadlineService.hasFeed(viewer.id)]);
  const mine = follows.filter((follow) => follow.market === viewer.market);
  const listings = new Map((await ListingService.getMany(viewer.market, mine.map((follow) => follow.listingKey))).map((listing) => [listing.key, listing]));
  const today = marketToday(viewer.market, viewer.now);
  const nextOf = new Map(
    await Promise.all(
      [...listings.values()].map(async (listing) => {
        const items = await DeadlineTimelineService.forListing({ userId: viewer.id, listing, locale, now: viewer.now, hideAmounts });
        return [listing.key, items.find((item) => !isDeadlinePast(item, today, viewer.now) && item.kind !== "info") ?? null] as const;
      }),
    ),
  );

  return (
    <AppMain id={APP_MAIN_ID}>
      <AppPageHeader
        eyebrow={P.Eyebrow}
        title={P.Title}
        lead={P.Lead}
        aside={
          <div className="flex flex-wrap items-center gap-3">
            <AlertsUsage label={fill(P.Count, { count: mine.length })} />
            {mine.length > 0 && <DeadlineCalendarLink href={DEADLINE_ROUTES.download} label={F.Download} />}
          </div>
        }
      />

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
        <div className="min-w-0">
          {mine.length === 0 ? (
            <WatchlistEmpty title={P.Empty.Title} body={P.Empty.Body} cta={P.Empty.Cta} />
          ) : (
            <DeadlineFollowList label={P.Title}>
              {mine.map((follow) => {
                const listing = listings.get(follow.listingKey);
                const next = nextOf.get(follow.listingKey) ?? null;
                return (
                  <DeadlineFollowCard
                    key={follow.listingKey}
                    title={listing ? getPlaceTitle(listing) : follow.listingKey}
                    reference={listing ? `${listing.authority} · ${listing.fileNo}` : P.Missing}
                    href={listing ? `${listingHref(listing.key)}#${DEADLINE_ANCHOR}` : null}
                    openLabel={P.OpenListing}
                    next={
                      next && listing ? (
                        <DeadlineNextLine
                          label={P.Next}
                          when={formatDeadlineWhen(next, listing.market, locale)}
                          distance={formatDeadlineDistance(next, today, viewer.now, labels.Status)}
                          title={next.title}
                          source={next.law?.label ?? null}
                        />
                      ) : (
                        <p className="font-mono text-[11px] text-muted">{listing?.cancelled ? S.Cancelled : P.NothingAhead}</p>
                      )
                    }
                  >
                    <DeadlineMailSwitch listingKey={follow.listingKey} isOn={follow.mailEnabled} onLabel={F.MailOn} offLabel={F.MailOff} errorLabel={F.Error} />
                    <DeadlineFollowButton listingKey={follow.listingKey} isFollowing followLabel={F.Start} unfollowLabel={F.Stop} errorLabel={F.Error} />
                  </DeadlineFollowCard>
                );
              })}
            </DeadlineFollowList>
          )}
        </div>
        <aside className="flex flex-col gap-6">
          <DeadlineFeedPanel hasFeed={hasFeed} labels={P.Feed} />
        </aside>
      </div>

      <AlertsNote text={P.HowItWorks} />
    </AppMain>
  );
}
