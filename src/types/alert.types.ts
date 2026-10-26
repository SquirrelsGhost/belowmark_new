import { MarketCode } from "@/lib/constants";
import { StoredAlertFilters } from "@/db/schema";

export type { StoredAlertFilters };

/** Dates of a proceeding as an alert remembers them. */
export interface AlertSchedule {
  hearingAt: string | null;
  /** "start/end" per round, in order */
  rounds: string[];
  cancelled: boolean;
}

/** What changed about a known match since the last run. */
export type AlertChangeKind = "cancelled" | "reinstated" | "rescheduled";

export interface AlertHit {
  listingKey: string;
  kind: "new" | AlertChangeKind;
  /** Next date before (changes only) and now, ISO */
  before: string | null;
  after: string | null;
}

/** One alert as the management page shows it. */
export interface AlertView {
  id: string;
  market: MarketCode;
  name: string;
  filters: StoredAlertFilters;
  notifyNew: boolean;
  notifyChanges: boolean;
  isActive: boolean;
  lastCheckedAt: Date | null;
  lastSentAt: Date | null;
  createdAt: Date;
}

/** Result of one run over all alerts — returned by the cron route. */
export interface AlertRunReport {
  checked: number;
  mailed: number;
  newHits: number;
  changeHits: number;
  failed: number;
}
