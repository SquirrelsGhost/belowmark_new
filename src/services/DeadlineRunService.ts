import "server-only";
import { listingHref } from "@/lib/appConstants";
import { fill } from "@/lib/appFormat";
import { MarketCode } from "@/lib/constants";
import { DEADLINE_ANCHOR, DEADLINE_ROUTES } from "@/lib/deadlines/deadlineConstants";
import { formatDeadlineWhen, marketToday } from "@/lib/deadlines/deadlineFormat";
import { dueReminders } from "@/lib/deadlines/deadlineReminders";
import { env } from "@/lib/env";
import { getPlaceTitle } from "@/lib/listingLabels";
import { DeadlineMailSection, renderDeadlineMail } from "@/lib/mail/renderDeadlineMail";
import { DeadlineService } from "@/services/DeadlineService";
import { DeadlineRecipient, DeadlineTimelineService } from "@/services/DeadlineTimelineService";
import { ListingService } from "@/services/ListingService";
import { MailService } from "@/services/MailService";
import { getDeadlineTranslation } from "@/translations/deadlines/DeadlineTranslations";
import { DeadlineRunReport, DueReminder } from "@/types/deadline.types";
import { Listing } from "@/types/listing.types";

const absolute = (path: string): string => new URL(path, env.appUrl).toString();

const globalForDeadlines = globalThis as unknown as { deadlineRunActive: boolean | undefined };

interface ListingReminders {
  listing: Listing;
  due: DueReminder[];
}

function mailFor(recipient: DeadlineRecipient, groups: ListingReminders[]) {
  const t = getDeadlineTranslation(recipient.locale);
  const M = t.Mail;
  const total = groups.reduce((sum, group) => sum + group.due.length, 0);
  const when = (daysLeft: number) => (daysLeft === 0 ? M.Today : daysLeft === 1 ? M.Tomorrow : fill(M.InDays, { days: daysLeft }));

  const sections: DeadlineMailSection[] = groups.map(({ listing, due }) => ({
    title: getPlaceTitle(listing),
    reference: `${listing.authority} · ${listing.fileNo}`,
    url: absolute(`${listingHref(listing.key)}#${DEADLINE_ANCHOR}`),
    items: due.map(({ item, daysLeft }) => ({
      when: when(daysLeft),
      date: formatDeadlineWhen(item, listing.market, recipient.locale),
      title: item.title,
      detail: item.detail,
      source: item.law ? `${M.Source}: ${item.law.label}` : null,
    })),
  }));

  return renderDeadlineMail({
    lang: recipient.locale,
    subject: total === 1 ? M.SubjectOne : fill(M.Subject, { count: total }),
    preheader: M.Preheader,
    greeting: M.Greeting,
    intro: M.Intro,
    sections,
    openListing: M.OpenListing,
    manage: M.Manage,
    manageUrl: absolute(DEADLINE_ROUTES.overview),
    signature: M.Signature,
    footer: M.Footer,
  });
}

/**
 * DeadlineRunService
 *
 * One pass over every followed proceeding with mail switched on: compute the
 * timeline, pick the reminders due today, send one digest per user, then
 * remember what was sent. Remembered only after the mail went out, so a failed
 * send is retried on the next run. Run it once a day in the morning.
 */
export class DeadlineRunService {
  static run = async (now: number): Promise<DeadlineRunReport> => {
    const report: DeadlineRunReport = { follows: 0, mailed: 0, reminders: 0, failed: 0 };
    if (globalForDeadlines.deadlineRunActive) return report;
    globalForDeadlines.deadlineRunActive = true;
    try {
      const follows = await DeadlineService.listMailing();
      report.follows = follows.length;
      const userIds = [...new Set(follows.map((follow) => follow.userId))];
      const [people, sent] = await Promise.all([DeadlineTimelineService.recipients(userIds), DeadlineService.sentKeys(userIds)]);

      for (const userId of userIds) {
        const recipient = people.get(userId);
        if (!recipient) continue;
        const mine = follows.filter((follow) => follow.userId === userId);
        try {
          const groups: ListingReminders[] = [];
          for (const market of ["DE", "TR"] as MarketCode[]) {
            const keys = mine.filter((follow) => follow.market === market).map((follow) => follow.listingKey);
            if (keys.length === 0) continue;
            const today = marketToday(market, now);
            for (const listing of await ListingService.getMany(market, keys)) {
              const items = await DeadlineTimelineService.forListing({ userId, listing, locale: recipient.locale, now, hideAmounts: !recipient.hasFullAccess });
              const mineSent = sent.get(DeadlineService.sentGroup(userId, listing.key)) ?? new Set<string>();
              const due = dueReminders(listing.key, items, today, mineSent).filter(({ item }) => !item.time || Date.parse(item.time) >= now);
              if (due.length > 0) groups.push({ listing, due });
            }
          }
          if (groups.length === 0) continue;
          await MailService.send({ to: recipient.email, ...mailFor(recipient, groups) });
          await DeadlineService.markSent(
            userId,
            groups.flatMap(({ due }) => due.map(({ listingKey, sentKey }) => ({ listingKey, sentKey }))),
          );
          report.mailed += 1;
          report.reminders += groups.reduce((sum, group) => sum + group.due.length, 0);
        } catch (error) {
          console.error("[DeadlineRunService.run]", userId, error);
          report.failed += 1;
        }
      }
      return report;
    } finally {
      globalForDeadlines.deadlineRunActive = false;
    }
  };
}
