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
import PageAside from "@/components/ui/PageAside";
import PageNote from "@/components/ui/PageNote";
import PageSplitGrid from "@/components/ui/PageSplitGrid";
import PageStack from "@/components/ui/PageStack";
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
  const { viewer, locale } = await getAppPageContext(DEADLINE_ROUTES.overview);
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
          <PageStack variant="rowWrap">
            <AlertsUsage label={fill(P.Count, { count: mine.length })} />
            {mine.length > 0 && <DeadlineCalendarLink href={DEADLINE_ROUTES.download} label={F.Download} />}
          </PageStack>
        }
      />

      <PageSplitGrid variant="wideLeft">
        <PageStack variant="min0">
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
                        <PageNote variant="monoMuted" text={listing?.cancelled ? S.Cancelled : P.NothingAhead} />
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
        </PageStack>
        <PageAside variant="stack">
          <DeadlineFeedPanel hasFeed={hasFeed} labels={P.Feed} />
        </PageAside>
      </PageSplitGrid>

      <AlertsNote text={P.HowItWorks} />
    </AppMain>
  );
}
