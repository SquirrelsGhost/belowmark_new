import { LocaleOption } from "@/lib/constants";
import { Listing } from "@/types/listing.types";

/** Where a date on the timeline comes from — shown next to every entry. */
export type DeadlineBasis = "law" | "notice" | "user" | "rule";

/** Before the hearing, the hearing itself (DE Termin / TR artırma), after the award. */
export type DeadlinePhase = "before" | "hearing" | "after";

/** deadline = must be done by; appointment = happens then; task = do it from then; info = for orientation only. */
export type DeadlineKind = "deadline" | "appointment" | "task" | "info";

export interface DeadlineLaw {
  /** e.g. "§ 69 Abs. 4 ZVG" or "ESY m.13/1" */
  label: string;
  href: string;
}

/**
 * One dated entry of the Termin-Begleiter. Other modules (closing tasks after
 * the award) deliver the same shape through AFTER_AWARD_PROVIDERS, already
 * translated. Dates are calendar days in the court's time zone.
 */
export interface DeadlineItem {
  /** Stable across runs — reminders remember it. Prefix per module, e.g. "de.", "tr.", "closing." */
  id: string;
  /** yyyy-mm-dd, court time zone */
  date: string;
  /** Exact instant (ISO) when there is a time of day */
  time?: string;
  title: string;
  detail: string;
  law: DeadlineLaw | null;
  basis: DeadlineBasis;
  phase: DeadlinePhase;
  kind: DeadlineKind;
  /** Days before `date` on which to remind; 0 = on the day itself */
  remindDays: number[];
  /** Optional link inside belowmark that helps with this step */
  href?: string;
}

export interface DeadlineContext {
  userId: string;
  listing: Listing;
  locale: LocaleOption;
  now: number;
  /** Free plan: amounts are left out of the texts */
  hideAmounts: boolean;
}

/** One step of the preparation list; done state lives in the browser, auto steps are known on the server. */
export interface DeadlineChecklistStep {
  id: string;
  label: string;
  hint: string;
  href: string | null;
  /** Already known as done on the server (e.g. Gutachten uploaded) */
  autoDone: boolean;
}

/** A reminder that is due on a run: the entry plus the offset that triggered it. */
export interface DueReminder {
  listingKey: string;
  item: DeadlineItem;
  /** Days left until the entry's date (0 = today) */
  daysLeft: number;
  /** What the run stores so the same reminder is not sent twice */
  sentKey: string;
}

export interface DeadlineRunReport {
  follows: number;
  mailed: number;
  reminders: number;
  failed: number;
}
