import "server-only";
import { eq } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { connection } from "next/server";
import { cache } from "react";
import { db } from "@/db";
import { users } from "@/db/schema";
import { SESSION_COOKIE_NAME, SESSION_TTL } from "@/lib/auth/authConfig";
import { createSessionCookieToken, readSessionCookieToken } from "@/lib/auth/sessionToken";
import { resolveSessionToken } from "@/services/sicherheit/SessionUserService";
import { Sitzungswachdienst } from "@/services/sicherheit/Sitzungswachdienst";
import { CurrentUser } from "@/types/auth.types";

const COOKIE_BASE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
} as const;

export interface CreateSessionOptions {
  ip?: string;
  hardwareFingerprint?: string;
}

/**
 * SessionService
 *
 * Stateful Server-Session & Anti-Theft Watchdog (`Sitzungswachdienst`):
 * The HttpOnly cookie (`__Host-bm_session` in production) holds only
 * `{ id, version, sessionId, tokenId, exp }.HMAC_SHA256` — never plaintext permissions.
 * Every session is bound to `userAgentHash` in PostgreSQL, rotates `tokenId` (`jti`)
 * every 15 minutes, and revokes all user sessions on token reuse.
 */
export class SessionService {
  /** Starts a fresh stateful session (new sessionId + tokenId every time). */
  static create = async (
    userId: string,
    remember: boolean,
    userAgent: string | null,
    options?: CreateSessionOptions,
  ): Promise<void> => {
    const [user] = await db
      .select({ id: users.id, sitzungsVersion: users.sitzungsVersion })
      .from(users)
      .where(eq(users.id, userId));
    if (!user) return;

    const ttlMs = remember ? SESSION_TTL.remember : SESSION_TTL.browser;
    const sitzung = await Sitzungswachdienst.erstelleSitzung({
      userId: user.id,
      ttlMs,
      userAgent,
      ip: options?.ip,
      hardwareFingerprint: options?.hardwareFingerprint,
    });

    const token = createSessionCookieToken(
      {
        id: user.id,
        version: user.sitzungsVersion,
        sessionId: sitzung.id,
        tokenId: sitzung.aktivesTokenId,
        exp: sitzung.expiresAt.getTime(),
      },
      ttlMs,
    );

    const cookieStore = await cookies();
    cookieStore.set(
      SESSION_COOKIE_NAME,
      token,
      remember ? { ...COOKIE_BASE, expires: sitzung.expiresAt } : COOKIE_BASE,
    );
  };

  /** The signed-in user for this request, or null. Deduplicated per request. */
  static getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
    await connection();
    const [cookieStore, hdrs] = await Promise.all([cookies(), headers()]);
    const rawToken =
      cookieStore.get(SESSION_COOKIE_NAME)?.value ??
      cookieStore.get("__Host-bm_session")?.value ??
      cookieStore.get("bm_session")?.value;
    if (!rawToken) return null;

    const ua = hdrs.get("user-agent");
    const sessionUser = await resolveSessionToken(rawToken, ua, true);
    if (!sessionUser || sessionUser.banned) return null;

    if (sessionUser.neuesTokenId) {
      try {
        const currentCookie = readSessionCookieToken(rawToken);
        const rotatedToken = createSessionCookieToken({
          id: sessionUser.id,
          version: sessionUser.sitzungsVersion,
          sessionId: sessionUser.sessionId,
          tokenId: sessionUser.neuesTokenId,
          exp: currentCookie?.exp,
        });
        cookieStore.set(SESSION_COOKIE_NAME, rotatedToken, COOKIE_BASE);
      } catch {
        // Ignored in read-only Server Component contexts; Server Actions & Route Handlers persist the rotated cookie
      }
    }

    return {
      id: sessionUser.id,
      name: sessionUser.name,
      email: sessionUser.email,
      market: sessionUser.market,
      locale: sessionUser.locale,
      emailVerifiedAt: sessionUser.emailVerifiedAt,
      trialEndsAt: sessionUser.trialEndsAt,
      hasTrialEnded: sessionUser.hasTrialEnded,
      plan: sessionUser.plan,
      permissions: sessionUser.permissions,
      hasFullAccess: sessionUser.hasFullAccess,
      teamSeat: sessionUser.teamSeat,
      createdAt: sessionUser.createdAt,
      sessionId: sessionUser.sessionId,
    };
  });

  /** Ends the current session and clears the cookie. */
  static destroyCurrent = async (): Promise<void> => {
    const cookieStore = await cookies();
    const rawToken =
      cookieStore.get(SESSION_COOKIE_NAME)?.value ??
      cookieStore.get("__Host-bm_session")?.value ??
      cookieStore.get("bm_session")?.value;
    const daten = readSessionCookieToken(rawToken);
    if (daten?.sessionId) {
      await Sitzungswachdienst.widerrufe(daten.sessionId, "Abmeldung durch Nutzer");
    }
    cookieStore.delete(SESSION_COOKIE_NAME);
  };

  /** Ends every session of a user, optionally keeping one (the current device). */
  static destroyAllForUser = async (userId: string, keepSessionId?: string): Promise<void> => {
    await Sitzungswachdienst.widerrufeAlleFuerInhaber(userId, "Alle Geräte abgemeldet", keepSessionId);
  };
}
