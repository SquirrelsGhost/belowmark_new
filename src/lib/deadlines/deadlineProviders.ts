import "server-only";
import { closingDeadlines } from "@/lib/closing/closingDeadlines";
import { DeadlineContext, DeadlineItem } from "@/types/deadline.types";

/**
 * Entries after the award come from the modules that know the result of the
 * hearing (e.g. src/lib/closing). Each provider looks up its own data and
 * returns [] when there is nothing yet. Add one import + one array entry here.
 */
export type DeadlineProvider = (ctx: DeadlineContext) => Promise<DeadlineItem[]>;

export const AFTER_AWARD_PROVIDERS: DeadlineProvider[] = [closingDeadlines];
