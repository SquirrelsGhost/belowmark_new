import "server-only";
import { inArray } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { ALERT_ROUTES, ALERTS } from "@/lib/alerts/alertConfig";
import { matchesAlert } from "@/lib/alerts/alertMatch";
import { alertSearchPath, alertSummary } from "@/lib/alerts/alertSummary";
import { listingHref } from "@/lib/appConstants";
import { fill, formatHearing, formatMoney } from "@/lib/appFormat";
import { MarketCode, PricingCountryCode } from "@/lib/constants";
import { env } from "@/lib/env";
import { accountCountry, getListingCountry } from "@/lib/listingCountry";
import { getPlaceTitle } from "@/lib/listingLabels";
import { AlertMailItem, AlertMailSection, renderAlertMail } from "@/lib/mail/renderAlertMail";
import { effectiveUserPermissions, hasFullAppAccess } from "@/lib/permissions";
import { redactListingForFreePlan } from "@/lib/sicherheit/antiScrapingRules";
import { AlertService } from "@/services/AlertService";
import { CountryAccessService } from "@/services/CountryAccessService";
import { FreeUnlockService } from "@/services/FreeUnlockService";
import { MailService } from "@/services/MailService";
import { TranslationService } from "@/services/TranslationService";
import { AlertsTranslations } from "@/translations/alerts/AlertsTranslations";
import { AlertHit, AlertRunReport } from "@/types/alert.types";
import { Listing, ListingCountry } from "@/types/listing.types";
import { activePlanSql } from "@/services/billing/activePlanSql";
import { TeamSeatService } from "@/services/team/TeamSeatService";

type ActiveAlert = Awaited<ReturnType<typeof AlertService.listActive>>[number];

interface Recipient {
  id: string;
  email: string;
  locale: string;
  country: PricingCountryCode;
  hasFullAccess: boolean;
  unlockedListingKey: string | null;
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
  const [rows, seats, unlockedByUser] = await Promise.all([
    db
      .select({
        id: users.id,
        email: users.email,
        locale: users.locale,
        market: users.market,
        country: users.country,
        emailVerifiedAt: users.emailVerifiedAt,
        plan: activePlanSql,
        permissions: users.permissions,
        trialEndsAt: users.trialEndsAt,
        gesperrtAm: users.gesperrtAm,
      })
      .from(users)
      .where(inArray(users.id, userIds)),
    TeamSeatService.holders(userIds),
    FreeUnlockService.getUnlockedKeysByUsers(userIds),
  ]);

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
        const market: MarketCode = row.market === "TR" ? "TR" : "DE";
        return [
          row.id,
          {
            id: row.id,
            email: row.email,
            locale: row.locale,
            country: accountCountry(row.country, market),
            hasFullAccess: hasFullAppAccess(perms),
            unlockedListingKey: unlockedByUser.get(row.id) ?? null,
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

  const item = (hit: AlertHit, rawListing: Listing, market: MarketCode): AlertMailItem => {
    const listing =
      recipient.hasFullAccess || rawListing.key === recipient.unlockedListingKey
        ? rawListing
        : redactListingForFreePlan(rawListing);
    const date = (iso: string | null) => (iso ? formatHearing(iso, market, lang) : "—");
    const isMove = hit.kind === "rescheduled" || hit.kind === "reinstated";
    return {
      kind: M.Kinds[hit.kind],
      title: getPlaceTitle(listing),
      reference: `${listing.authority} · ${listing.fileNo}`,
      dateLine: isMove ? fill(M.Moved, { before: date(hit.before), after: date(hit.after) }) : fill(M.NextDate, { date: date(hit.kind === "cancelled" ? hit.before : hit.after) }),
      valueLine: listing.appraisedValue !== null ? `${M.Value[market]}: ${formatMoney(listing.appraisedValue, market, lang)}` : null,
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
  const upgradeBox = recipient.hasFullAccess
    ? null
    : {
        title: M.TrialTitle,
        body: M.TrialBody,
        cta: M.TrialCta,
        url: absolute(`/buchen?markt=${encodeURIComponent(recipient.country)}&tarif=investor-monat`),
      };

  return renderAlertMail({
    lang,
    subject: total === 1 ? M.SubjectOne : fill(M.Subject, { count: total }),
    preheader: M.Preheader,
    greeting: M.Greeting,
    intro: M.Intro,
    sections,
    openSearch: M.OpenSearch,
    note: recipient.hasFullAccess ? null : M.LockedValues,
    upgradeBox,
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

      // An alert only ever reports proceedings of the owner's own country
      const scopes = new Map<string, Promise<readonly ListingCountry[]>>();
      const countriesOf = (userId: string) => {
        if (!scopes.has(userId)) scopes.set(userId, CountryAccessService.forUserId(userId).then((access) => access?.countries ?? []));
        return scopes.get(userId) as Promise<readonly ListingCountry[]>;
      };

      const byUser = new Map<string, AlertResult[]>();
      for (const alert of alerts) {
        const market: MarketCode = alert.market === "TR" ? "TR" : "DE";
        const countries = await countriesOf(alert.userId);
        const matches = (await listingsOf(market)).filter((listing) => countries.includes(getListingCountry(listing)) && matchesAlert(listing, alert.filters, now));
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
