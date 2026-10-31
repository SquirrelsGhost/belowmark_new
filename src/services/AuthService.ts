import "server-only";
import { and, eq, gt, inArray, isNotNull, sql } from "drizzle-orm";
import { db } from "@/db";
import { authTokens, users } from "@/db/schema";
import { TOKEN_PURPOSE, TOKEN_TTL, TokenPurpose, TRIAL_MS } from "@/lib/auth/authConfig";
import { hashPassword, needsRehash, simulatePasswordCheck, verifyPassword } from "@/lib/auth/password";
import { isBreachedPassword } from "@/lib/auth/passwordBreach";
import { generateToken, generateVerificationCode, hashToken, hashVerificationCode } from "@/lib/auth/tokens";
import { MarketCode } from "@/lib/constants";
import { AuthMailService } from "@/services/AuthMailService";

export type LoginResult =
  | { ok: true; userId: string }
  | { ok: false; reason: "invalid_credentials" | "unverified" | "account_banned" | "device_banned" };

export interface SignupInput {
  email: string;
  password: string;
  market: MarketCode;
  locale: string;
  hardwareFingerprint?: string;
}

async function issueToken(userId: string, purpose: TokenPurpose): Promise<string> {
  const token = generateToken();
  const ttl = purpose === TOKEN_PURPOSE.verifyEmail ? TOKEN_TTL.verifyEmail : TOKEN_TTL.resetPassword;
  await db.transaction(async (tx) => {
    // At most one open link per purpose: a new request voids the old one.
    await tx.delete(authTokens).where(and(eq(authTokens.userId, userId), eq(authTokens.purpose, purpose)));
    await tx.insert(authTokens).values({ id: hashToken(token), userId, purpose, expiresAt: new Date(Date.now() + ttl) });
  });
  return token;
}

/** Issues both a 256-bit 1-click verification link token and a 6-digit OTP verification code. */
async function issueVerificationCredentials(userId: string): Promise<{ token: string; code: string }> {
  const token = generateToken();
  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + TOKEN_TTL.verifyEmail);
  await db.transaction(async (tx) => {
    await tx
      .delete(authTokens)
      .where(
        and(
          eq(authTokens.userId, userId),
          inArray(authTokens.purpose, [TOKEN_PURPOSE.verifyEmail, TOKEN_PURPOSE.verifyEmailCode]),
        ),
      );
    await tx.insert(authTokens).values([
      { id: hashToken(token), userId, purpose: TOKEN_PURPOSE.verifyEmail, expiresAt },
      { id: hashVerificationCode(userId, code), userId, purpose: TOKEN_PURPOSE.verifyEmailCode, expiresAt },
    ]);
  });
  return { token, code };
}

/** Consumes a link: valid only once, only for its purpose, only before expiry. */
async function consumeToken(token: string, purpose: TokenPurpose): Promise<string | null> {
  const [row] = await db
    .delete(authTokens)
    .where(and(eq(authTokens.id, hashToken(token)), eq(authTokens.purpose, purpose), gt(authTokens.expiresAt, new Date())))
    .returning({ userId: authTokens.userId });
  return row?.userId ?? null;
}

async function activateVerifiedUser(userId: string): Promise<string | null> {
  const [user] = await db
    .select({
      email: users.email,
      locale: users.locale,
      verified: users.emailVerifiedAt,
      gesperrtAm: users.gesperrtAm,
    })
    .from(users)
    .where(eq(users.id, userId));
  if (!user || user.gesperrtAm) return null;

  await db
    .delete(authTokens)
    .where(
      and(
        eq(authTokens.userId, userId),
        inArray(authTokens.purpose, [TOKEN_PURPOSE.verifyEmail, TOKEN_PURPOSE.verifyEmailCode]),
      ),
    );

  if (!user.verified) {
    const now = new Date();
    const trialEndsAt = new Date(now.getTime() + TRIAL_MS);
    await db
      .update(users)
      .set({ emailVerifiedAt: now, trialEndsAt })
      .where(eq(users.id, userId));
    await AuthMailService.sendWelcomeTrial({ email: user.email, locale: user.locale }, trialEndsAt).catch((err) =>
      console.error("[AuthService.activateVerifiedUser] welcome mail failed", err),
    );
  }
  return userId;
}

async function findByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user ?? null;
}

const HARDWARE_FP_REGEX = /^HW-[0-9a-f]{32}$/;

/** Checks if a hardware fingerprint (`HW-...`) belongs to any banned user account. */
export async function isHardwareBanned(hardwareFingerprint: string | undefined): Promise<boolean> {
  if (!hardwareFingerprint || !HARDWARE_FP_REGEX.test(hardwareFingerprint)) return false;
  const [banned] = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.hardwareFingerprint, hardwareFingerprint), isNotNull(users.gesperrtAm)));
  return Boolean(banned);
}

/**
 * AuthService
 *
 * Account logic without any knowledge of forms or cookies. Designed so that
 * no response reveals whether an e-mail address is registered: sign-up and
 * reset requests always answer the same, and failed logins take as long
 * with or without an account.
 */
export class AuthService {
  static isBreached = isBreachedPassword;
  static isHardwareBanned = isHardwareBanned;

  /** Creates the account (or re-sends mail if it exists) — same outcome either way. */
  static signup = async (
    { email, password, market, locale, hardwareFingerprint }: SignupInput,
    allowExistingMail = true,
  ): Promise<void> => {
    const passwordHash = await hashPassword(password);
    const hw = hardwareFingerprint && HARDWARE_FP_REGEX.test(hardwareFingerprint) ? hardwareFingerprint : null;
    const [created] = await db
      .insert(users)
      .values({ email, passwordHash, market, locale, hardwareFingerprint: hw })
      .onConflictDoNothing({ target: users.email })
      .returning({ id: users.id });

    if (created) {
      const { token, code } = await issueVerificationCredentials(created.id);
      await AuthMailService.sendVerification({ email, locale }, token, code);
      return;
    }
    const existing = await findByEmail(email);
    if (!existing || existing.gesperrtAm) return;
    if (existing.emailVerifiedAt) {
      if (allowExistingMail) await AuthMailService.sendAccountExists(existing);
      return;
    }
    // Unverified account re-registering: update password, market and locale so the user's latest entry applies
    await db
      .update(users)
      .set({
        passwordHash,
        market,
        locale,
        ...(hw ? { hardwareFingerprint: hw } : {}),
      })
      .where(eq(users.id, existing.id));
    if (allowExistingMail) {
      const { token, code } = await issueVerificationCredentials(existing.id);
      await AuthMailService.sendVerification({ email, locale }, token, code);
    }
  };

  static login = async (email: string, password: string, hardwareFingerprint?: string): Promise<LoginResult> => {
    if (await isHardwareBanned(hardwareFingerprint)) {
      return { ok: false, reason: "device_banned" };
    }
    const user = await findByEmail(email);
    if (!user) {
      await simulatePasswordCheck(password);
      return { ok: false, reason: "invalid_credentials" };
    }
    if (!(await verifyPassword(password, user.passwordHash))) return { ok: false, reason: "invalid_credentials" };
    if (user.gesperrtAm) return { ok: false, reason: "account_banned" };
    if (!user.emailVerifiedAt) return { ok: false, reason: "unverified" };

    const update: Partial<typeof users.$inferInsert> = { lastLoginAt: new Date() };
    if (hardwareFingerprint && HARDWARE_FP_REGEX.test(hardwareFingerprint)) {
      update.hardwareFingerprint = hardwareFingerprint;
    }
    // Old immo hashes (N=16384) are upgraded silently on the next login.
    if (needsRehash(user.passwordHash)) update.passwordHash = await hashPassword(password);
    await db.update(users).set(update).where(eq(users.id, user.id));
    return { ok: true, userId: user.id };
  };

  /** Re-sends the confirmation link + 6-digit OTP code for unconfirmed accounts. */
  static resendVerification = async (email: string): Promise<void> => {
    const user = await findByEmail(email);
    if (!user || user.emailVerifiedAt || user.gesperrtAm) return;
    const { token, code } = await issueVerificationCredentials(user.id);
    await AuthMailService.sendVerification(user, token, code);
  };

  static verifyEmail = async (token: string): Promise<string | null> => {
    const userId = await consumeToken(token, TOKEN_PURPOSE.verifyEmail);
    if (!userId) return null;
    return activateVerifiedUser(userId);
  };

  /** Verifies an e-mail address using the 6-digit OTP code sent in the verification e-mail. */
  static verifyEmailByCode = async (email: string, code: string): Promise<string | null> => {
    const user = await findByEmail(email);
    if (!user || user.gesperrtAm) return null;
    const cleanCode = code.replace(/\D/g, "");
    if (cleanCode.length !== 6) return null;

    const [row] = await db
      .delete(authTokens)
      .where(
        and(
          eq(authTokens.id, hashVerificationCode(user.id, cleanCode)),
          eq(authTokens.userId, user.id),
          eq(authTokens.purpose, TOKEN_PURPOSE.verifyEmailCode),
          gt(authTokens.expiresAt, new Date()),
        ),
      )
      .returning({ userId: authTokens.userId });
    if (!row) return null;
    return activateVerifiedUser(user.id);
  };

  static requestPasswordReset = async (email: string): Promise<void> => {
    const user = await findByEmail(email);
    if (!user || user.gesperrtAm) return;
    await AuthMailService.sendPasswordReset(user, await issueToken(user.id, TOKEN_PURPOSE.resetPassword));
  };

  /**
   * The address a still-valid reset link belongs to — without using it up.
   * Shown on the form so password managers save the new password correctly.
   */
  static getResetEmail = async (token: string): Promise<string | null> => {
    const [row] = await db
      .select({ email: users.email })
      .from(authTokens)
      .innerJoin(users, eq(users.id, authTokens.userId))
      .where(and(eq(authTokens.id, hashToken(token)), eq(authTokens.purpose, TOKEN_PURPOSE.resetPassword), gt(authTokens.expiresAt, sql`now()`)));
    return row?.email ?? null;
  };

  /** Sets the new password, increments `sitzungsVersion`, and proves inbox ownership. */
  static resetPassword = async (token: string, password: string): Promise<{ id: string; email: string } | null> => {
    const userId = await consumeToken(token, TOKEN_PURPOSE.resetPassword);
    if (!userId) return null;
    const now = new Date();
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user || user.gesperrtAm) return null;
    await db
      .update(users)
      .set({
        passwordHash: await hashPassword(password),
        passwordChangedAt: now,
        sitzungsVersion: sql`${users.sitzungsVersion} + 1`,
        emailVerifiedAt: user.emailVerifiedAt ?? now,
        trialEndsAt: user.trialEndsAt ?? new Date(now.getTime() + TRIAL_MS),
      })
      .where(eq(users.id, userId));
    await AuthMailService.sendPasswordChanged(user);
    return { id: user.id, email: user.email };
  };

  static changePassword = async (userId: string, currentPassword: string, password: string): Promise<boolean> => {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user || user.gesperrtAm || !(await verifyPassword(currentPassword, user.passwordHash))) return false;
    await db
      .update(users)
      .set({
        passwordHash: await hashPassword(password),
        passwordChangedAt: new Date(),
        sitzungsVersion: sql`${users.sitzungsVersion} + 1`,
      })
      .where(eq(users.id, userId));
    await AuthMailService.sendPasswordChanged(user);
    return true;
  };
}
