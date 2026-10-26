import { daysBetween } from "@/lib/deadlines/deadlineDates";
import { DeadlineItem, DueReminder } from "@/types/deadline.types";

/**
 * Which reminders are due on `today` (court time). An entry is due once the
 * earliest of its offsets is reached and until its own day has passed; on each
 * run only the closest offset counts, so someone who starts following late gets
 * one mail per entry, not three. The sent key carries the date, so a moved
 * hearing reminds again.
 */
export function dueReminders(listingKey: string, items: DeadlineItem[], today: string, alreadySent: ReadonlySet<string>): DueReminder[] {
  return items.flatMap((item) => {
    const daysLeft = daysBetween(today, item.date);
    if (daysLeft < 0 || item.remindDays.length === 0) return [];
    const reached = item.remindDays.filter((offset) => offset >= daysLeft);
    if (reached.length === 0) return [];
    const offset = Math.min(...reached);
    const sentKey = `${item.id}@${item.date}#${offset}`;
    return alreadySent.has(sentKey) ? [] : [{ listingKey, item, daysLeft, sentKey }];
  });
}
