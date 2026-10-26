import { sql } from "drizzle-orm";
import { users } from "@/db/schema";

/**
 * The booked plan while it is still paid for: `users.plan`, or null once
 * `plan_ends_at` has passed. Evaluated in the database clock, like the trial
 * check, so an expired term never grants access — even if a webhook was lost.
 */
export const activePlanSql = sql<string | null>`case when ${users.planEndsAt} is null or ${users.planEndsAt} > now() then ${users.plan} end`;
