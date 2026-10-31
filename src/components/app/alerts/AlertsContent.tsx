import AlertActionButton from "@/components/app/alerts/AlertActionButton";
import AlertCard from "@/components/app/alerts/AlertCard";
import AlertList from "@/components/app/alerts/AlertList";
import AlertsNote from "@/components/app/alerts/AlertsNote";
import WatchlistEmpty from "@/components/app/watchlist/WatchlistEmpty";
import { alertSearchPath, alertSummary, toListingFilters } from "@/lib/alerts/alertSummary";
import { fill } from "@/lib/appFormat";
import { LocaleOption } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { AlertService } from "@/services/AlertService";
import { AppViewer } from "@/services/AppSessionService";
import { ListingService } from "@/services/ListingService";
import { IAlertsTranslation } from "@/translations/alerts/IAlertsTranslation";
import { IAppTranslation } from "@/translations/app/IAppTranslation";

interface AlertsContentProps {
  viewer: AppViewer;
  segments: IAppTranslation["Segments"];
  locale: LocaleOption;
  labels: IAlertsTranslation;
}

/**
 * Streams the user's saved search alerts and their live match counts.
 */
export default async function AlertsContent({ viewer, segments, locale, labels }: AlertsContentProps) {
  const { Page, Card, Summary } = labels;
  const alerts = await AlertService.list(viewer.id);
  const totals = await Promise.all(
    alerts.map(async (alert) => (await ListingService.search(viewer.country, toListingFilters(alert.filters), viewer.now)).total),
  );
  const date = (value: Date) => formatDate(value.toISOString(), locale);

  return (
    <>
      {alerts.length === 0 ? (
        <WatchlistEmpty title={Page.Empty.Title} body={Page.Empty.Body} cta={Page.Empty.Cta} />
      ) : (
        <AlertList label={Page.Title}>
          {alerts.map((alert, index) => (
            <AlertCard
              key={alert.id}
              name={alert.name}
              summary={alertSummary(alert.filters, alert.market, segments, Summary, locale)}
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
    </>
  );
}
