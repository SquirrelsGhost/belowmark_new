import { Metadata } from "next";
import AlertActionButton from "@/components/app/alerts/AlertActionButton";
import AlertCard from "@/components/app/alerts/AlertCard";
import AlertList from "@/components/app/alerts/AlertList";
import AlertsNote from "@/components/app/alerts/AlertsNote";
import AlertsUsage from "@/components/app/alerts/AlertsUsage";
import AppMain from "@/components/app/shell/AppMain";
import AppPageHeader from "@/components/app/shell/AppPageHeader";
import WatchlistEmpty from "@/components/app/watchlist/WatchlistEmpty";
import { ALERT_ROUTES, ALERTS } from "@/lib/alerts/alertConfig";
import { alertSearchPath, alertSummary, toListingFilters } from "@/lib/alerts/alertSummary";
import { APP_MAIN_ID } from "@/lib/appConstants";
import { fill } from "@/lib/appFormat";
import { getAppPageContext } from "@/lib/appPage";
import { formatDate } from "@/lib/format";
import { AlertService } from "@/services/AlertService";
import { ListingService } from "@/services/ListingService";
import { MetaTagService } from "@/services/MetaTagService";
import { TranslationService } from "@/services/TranslationService";
import { AlertsTranslations } from "@/translations/alerts/AlertsTranslations";

// Reads the session cookie on every request.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const { MetaTags } = AlertsTranslations[await TranslationService.GetUserLocale()];
  return { ...MetaTagService.CreateMetaTags(MetaTags), robots: { index: false, follow: false } };
}

export default async function AlertsPage() {
  const { viewer, app, locale } = await getAppPageContext(ALERT_ROUTES.manage);
  const { Page, Card, Summary } = AlertsTranslations[await TranslationService.GetUserLocale()];
  const alerts = await AlertService.list(viewer.id);
  const totals = await Promise.all(alerts.map(async (alert) => (await ListingService.search(alert.market, toListingFilters(alert.filters), viewer.now)).total));
  const date = (value: Date) => formatDate(value.toISOString(), locale);

  return (
    <AppMain id={APP_MAIN_ID}>
      <AppPageHeader
        eyebrow={Page.Eyebrow}
        title={Page.Title}
        lead={Page.Lead}
        aside={<AlertsUsage label={fill(Page.Usage, { count: alerts.length, max: ALERTS.maxPerUser })} />}
      />

      {alerts.length === 0 ? (
        <WatchlistEmpty title={Page.Empty.Title} body={Page.Empty.Body} cta={Page.Empty.Cta} />
      ) : (
        <AlertList label={Page.Title}>
          {alerts.map((alert, index) => (
            <AlertCard
              key={alert.id}
              name={alert.name}
              summary={alertSummary(alert.filters, alert.market, app.Segments, Summary, locale)}
              isActive={alert.isActive}
              statusLabel={alert.isActive ? Card.Active : Card.Paused}
              matches={totals[index] === 1 ? Card.MatchesOne : fill(Card.Matches, { count: new Intl.NumberFormat(locale).format(totals[index]) })}
              notifies={[alert.notifyNew && Card.NotifyNew, alert.notifyChanges && Card.NotifyChanges].filter(Boolean).join(" · ")}
              meta={[
                alert.lastSentAt ? fill(Card.LastSent, { date: date(alert.lastSentAt) }) : Card.NeverSent,
                alert.lastCheckedAt && fill(Card.LastChecked, { date: date(alert.lastCheckedAt) }),
              ]
                .filter(Boolean)
                .join(" · ")}
              searchHref={alertSearchPath(alert.filters)}
              searchLabel={Card.OpenSearch}
            >
              <AlertActionButton alertId={alert.id} intent={alert.isActive ? "pause" : "resume"} label={alert.isActive ? Card.Pause : Card.Resume} errorLabel={Card.Error} />
              <AlertActionButton alertId={alert.id} intent="delete" label={Card.Delete} errorLabel={Card.Error} />
            </AlertCard>
          ))}
        </AlertList>
      )}

      <AlertsNote text={Page.HowItWorks} />
    </AppMain>
  );
}
