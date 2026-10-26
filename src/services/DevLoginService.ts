import "server-only";
import { db } from "@/db";
import { users } from "@/db/schema";
import { TRIAL_MS } from "@/lib/auth/authConfig";
import { DEV_PASSWORD, DevAccount } from "@/lib/auth/devLogin";
import { hashPassword } from "@/lib/auth/password";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * DevLoginService
 *
 * Creates or refreshes a development test account so a quick login always
 * lands in a known state: confirmed address, chosen market, a trial that is
 * either running (14 days from now) or ended yesterday, plus plan and role.
 */
export class DevLoginService {
  static ensureAccount = async (account: DevAccount): Promise<string> => {
    const now = Date.now();
    const trialEndsAt = new Date(account.trial === "ended" ? now - DAY_MS : now + TRIAL_MS);
    const state = {
      market: account.market,
      locale: account.locale,
      emailVerifiedAt: new Date(now),
      trialEndsAt,
      plan: account.plan,
      permissions: [...account.permissions],
      gesperrtAm: null,
    };

    const [row] = await db
      .insert(users)
      .values({ email: account.email, passwordHash: await hashPassword(DEV_PASSWORD), ...state })
      .onConflictDoUpdate({ target: users.email, set: { ...state, lastLoginAt: new Date(now) } })
      .returning({ id: users.id });
    return row.id;
  };
}
