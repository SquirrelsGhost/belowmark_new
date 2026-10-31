import "server-only";
import { inArray } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { ALERT_ROUTES, ALERTS } from "@/lib/alerts/alertConfig";
import { matchesAlert } from "@/lib/alerts/alertMatch";
import { alertSearchPath, alertSummary } from "@/lib/alerts/alertSummary";
import { listingHref } from "@/lib/appConstants";
import { fill, formatHearing, formatMoney } from "@/lib/appFormat";
import { MarketCode } from "@/lib/constants";
import { env } from "@/lib/env";
import { getPlaceTitle } from "@/lib/listingLabels";
import { AlertMailItem, AlertMailSection, renderAlertMail } from "@/lib/mail/renderAlertMail";
import { effectiveUserPermissions, hasFullAppAccess } from "@/lib/permissions";
import { AlertService } from "@/services/AlertService";
import { MailService } from "@/services/MailService";
import { TranslationService } from "@/services/TranslationService";
import { AlertsTranslations } from "@/translations/alerts/AlertsTranslations";
import { AlertHit, AlertRunReport } from "@/types/alert.types";
import { Listing } from "@/types/listing.types";
import { activePlanSql } from "@/services/billing/activePlanSql";
import { TeamSeatService } from "@/services/team/TeamSeatService";

type ActiveAlert = Awaited<ReturnType<typeof AlertService.listActive>>[number];

interface Recipient {
  id: string;
  email: string;
  locale: string;
  hasFullAccess: boolean;
}

interface AlertResult {
  alert: ActiveAlert;
  matches: Listing[];
  hits: AlertHit[];
}

const absolute = (path: string): string => new URL(path, env.appUrl).toString();

const globalForAlerts = globalThis as unknown as { alertRunActive: boolean | undefined };

async function recipients(userIds: string[]): Promise<Map<string, Recipient>> {
  if (userIds.length === 0) return new Map();
  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      locale: users.locale,
      emailVerifiedAt: users.emailVerifiedAt,
      plan: activePlanSql,
      permissions: users.permissions,
      trialEndsAt: users.trialEndsAt,
      gesperrtAm: users.gesperrtAm,
    })
    .from(users)
    .where(inArray(users.id, userIds));
    const seats = await TeamSeatService.holders(userIds);

  return new Map(
    rows
      .filter((row) => !row.gesperrtAm && Boolean(row.emailVerifiedAt))
      .map((row) => {
        const perms = effectiveUserPermissions({
          permissions: row.permissions,
          plan: row.plan,
          trialEndsAt: row.trialEndsAt,
          bannedAt: row.gesperrtAm,
          teamSeat: seats.has(row.id),
        });
        return [
          row.id,
          {
            id: row.id,
            email: row.email,
            locale: row.locale,
            hasFullAccess: hasFullAppAccess(perms),
          },
        ];
      }),
  );
}

/** Only what the alert asked for: new proceedings, date changes, or both. */
const wanted = (alert: ActiveAlert, hits: AlertHit[]): AlertHit[] =>
  hits.filter((hit) => (hit.kind === "new" ? alert.notifyNew : alert.notifyChanges));

function mailFor(recipient: Recipient, results: AlertResult[]) {
  const locale = TranslationService.NormalizeLocale(recipient.locale);
  const lang = TranslationService.ToLocaleOption(locale);
  const M = AlertsTranslations[locale].Mail;
  const summaryLabels = AlertsTranslations[locale].Summary;
  const segments = TranslationService.GetTranslations(locale).App.Segments;
  const total = results.reduce((sum, result) => sum + result.hits.length, 0);

  const item = (hit: AlertHit, listing: Listing, market: MarketCode): AlertMailItem => {
    const date = (iso: string | null) => (iso ? formatHearing(iso, market, lang) : "—");
    const isMove = hit.kind === "rescheduled" || hit.kind === "reinstated";
    return {
      kind: M.Kinds[hit.kind],
      title: getPlaceTitle(listing),
      reference: `${listing.authority} · ${listing.fileNo}`,
      dateLine: isMove ? fill(M.Moved, { before: date(hit.before), after: date(hit.after) }) : fill(M.NextDate, { date: date(hit.kind === "cancelled" ? hit.before : hit.after) }),
      valueLine: recipient.hasFullAccess && listing.appraisedValue !== null ? `${M.Value[market]}: ${formatMoney(listing.appraisedValue, market, lang)}` : null,
      url: absolute(listingHref(listing.key)),
    };
  };

  const sections: AlertMailSection[] = results.map(({ alert, matches, hits }) => {
    const market: MarketCode = alert.market === "TR" ? "TR" : "DE";
    const byKey = new Map(matches.map((listing) => [listing.key, listing]));
    const shown = hits.slice(0, ALERTS.maxHitsPerMail);
    const summary = alertSummary(alert.filters, market, segments, summaryLabels, lang).join(" · ");
    return {
      name: alert.name,
      // A name taken over from the suggestion would only repeat the filters
      summary: summary === alert.name ? "" : summary,
      items: shown.flatMap((hit) => {
        const listing = byKey.get(hit.listingKey);
        return listing ? [item(hit, listing, market)] : [];
      }),
      more: hits.length > shown.length ? fill(M.More, { count: hits.length - shown.length }) : null,
      searchUrl: absolute(alertSearchPath(alert.filters)),
    };
  });

  const markets = [...new Set(results.map(({ alert }) => (alert.market === "TR" ? "TR" : "DE") as MarketCode))];
  return renderAlertMail({
    lang,
    subject: total === 1 ? M.SubjectOne : fill(M.Subject, { count: total }),
    preheader: M.Preheader,
    greeting: M.Greeting,
    intro: M.Intro,
    sections,
    openSearch: M.OpenSearch,
    note: recipient.hasFullAccess ? null : M.LockedValues,
    source: markets.map((market) => M.Source[market]).join(" · "),
    manage: M.Manage,
    manageUrl: absolute(ALERT_ROUTES.manage),
    signature: M.Signature,
    footer: M.Footer,
  });
}

/**
 * AlertRunService
 *
 * One pass over every active alert: match the current snapshot, compare with
 * what each alert remembered, send one digest mail per user, then remember
 * the new state. The state is only stored after the mail went out, so a
 * failed send is retried on the next run instead of being lost.
 */
export class AlertRunService {
  static run = async (now: number): Promise<AlertRunReport> => {
    const report: AlertRunReport = { checked: 0, mailed: 0, newHits: 0, changeHits: 0, failed: 0 };
    if (globalForAlerts.alertRunActive) return report;
    globalForAlerts.alertRunActive = true;
    try {
      const alerts = await AlertService.listActive();
      const people = await recipients([...new Set(alerts.map((alert) => alert.userId))]);
      const snapshots = new Map<MarketCode, Promise<Listing[]>>();
      const listingsOf = (market: MarketCode) => {
        if (!snapshots.has(market)) snapshots.set(market, AlertService.readListings(market));
        return snapshots.get(market) as Promise<Listing[]>;
      };

      const byUser = new Map<string, AlertResult[]>();
      for (const alert of alerts) {
        const market: MarketCode = alert.market === "TR" ? "TR" : "DE";
        const matches = (await listingsOf(market)).filter((listing) => matchesAlert(listing, alert.filters, now));
        const hits = wanted(alert, await AlertService.diff(alert.id, matches, now));
        byUser.set(alert.userId, [...(byUser.get(alert.userId) ?? []), { alert, matches, hits }]);
        report.checked += 1;
      }

      for (const [userId, results] of byUser) {
        const recipient = people.get(userId);
        const withHits = results.filter((result) => result.hits.length > 0);
        try {
          if (recipient && withHits.length > 0) {
            await MailService.send({
              to: recipient.email,
              unsubscribeUrl: absolute(ALERT_ROUTES.manage),
              ...mailFor(recipient, withHits),
            });
            report.mailed += 1;
            for (const { hits } of withHits) {
              report.newHits += hits.filter((hit) => hit.kind === "new").length;
              report.changeHits += hits.filter((hit) => hit.kind !== "new").length;
            }
          }
          for (const { alert, matches } of results) await AlertService.remember(alert.id, matches);
          await AlertService.markChecked(results.map(({ alert }) => alert.id), withHits.length > 0 && Boolean(recipient), now);
        } catch (error) {
          console.error("[AlertRunService.run]", userId, error);
          report.failed += 1;
        }
      }
      return report;
    } finally {
      globalForAlerts.alertRunActive = false;
    }
  };
}
