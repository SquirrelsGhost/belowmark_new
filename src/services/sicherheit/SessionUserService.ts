import "server-only";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { SESSION_COOKIE_NAME } from "@/lib/auth/authConfig";
import { readCookieFromRequest, readSessionCookieToken } from "@/lib/auth/sessionToken";
import { effectiveUserPermissions, hasFullAppAccess } from "@/lib/permissions";
import { Sitzungswachdienst } from "@/services/sicherheit/Sitzungswachdienst";
import type { Permission } from "@/types/permissions.types";
import { activePlanSql } from "@/services/billing/activePlanSql";
import { TeamSeatService } from "@/services/team/TeamSeatService";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  market: string;
  locale: string;
  emailVerifiedAt: Date | null;
  trialEndsAt: Date | null;
  hasTrialEnded: boolean;
  plan: string | null;
  permissions: Permission[];
  hasFullAccess: boolean;
  /** Full access comes from a team seat, not from an own plan or trial */
  teamSeat: boolean;
  banned: boolean;
  banReason?: string;
  createdAt: Date;
  sessionId: string;
  sitzungsVersion: number;
  neuesTokenId?: string;
}

/**
 * Resolves a raw cookie token + User-Agent into a verified `SessionUser`.
 * Enforces real-time ban check (`gesperrtAm`), `sitzungsVersion` check,
 * and `Sitzungswachdienst` device-binding + token reuse detection.
 */
export async function resolveSessionToken(
  rawToken: string | undefined | null,
  userAgent?: string | null,
  erlaubeRotation = false,
): Promise<SessionUser | null> {
  const daten = readSessionCookieToken(rawToken, Date.now());
  if (!daten?.sessionId || !daten.tokenId) return null;

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      market: users.market,
      locale: users.locale,
      emailVerifiedAt: users.emailVerifiedAt,
      trialEndsAt: users.trialEndsAt,
      hasTrialEnded: sql<boolean>`coalesce(${users.trialEndsAt} < now(), false)`,
      plan: activePlanSql,
      permissions: users.permissions,
      sitzungsVersion: users.sitzungsVersion,
      gesperrtAm: users.gesperrtAm,
      sperrGrund: users.sperrGrund,
      createdAt: users.createdAt,
      // Read together with the user: one round trip instead of two
      sitzung: getTableColumns(sessions),
    })
    .from(users)
    .leftJoin(sessions, eq(sessions.id, daten.sessionId))
    .where(eq(users.id, daten.id));

  if (!user) return null;

  const displayName = user.name || user.email.split("@")[0] || "Nutzer";

  // Real-time ban check: returns banned: true so proxy.ts can return 403 or redirect
  if (user.gesperrtAm) {
    return {
      id: user.id,
      name: displayName,
      email: user.email,
      market: user.market,
      locale: user.locale,
      emailVerifiedAt: user.emailVerifiedAt,
      trialEndsAt: user.trialEndsAt,
      hasTrialEnded: user.hasTrialEnded,
      plan: user.plan,
      permissions: [],
      hasFullAccess: false,
      teamSeat: false,
      banned: true,
      banReason: user.sperrGrund ?? "Dieses Konto ist gesperrt.",
      createdAt: user.createdAt,
      sessionId: daten.sessionId,
      sitzungsVersion: user.sitzungsVersion,
    };
  }

  // Real-time password reset / security bump check
  if (user.sitzungsVersion !== daten.version) return null;

  const pruefung = await Sitzungswachdienst.pruefeUndAktualisiere(
    daten.sessionId,
    daten.tokenId,
    userAgent,
    erlaubeRotation,
    user.sitzung,
  );
  if (!pruefung.gueltig) return null;

  const ownPerms = effectiveUserPermissions({
    permissions: user.permissions,
    plan: user.plan,
    trialEndsAt: user.trialEndsAt,
    bannedAt: user.gesperrtAm,
  });
  // A team seat only matters when the account has no full access of its own
  const teamSeat = !hasFullAppAccess(ownPerms) && (await TeamSeatService.has(user.id));
  const effectivePerms = teamSeat ? effectiveUserPermissions({ permissions: user.permissions, plan: user.plan, bannedAt: user.gesperrtAm, teamSeat }) : ownPerms;

  return {
    id: user.id,
    name: displayName,
    email: user.email,
    market: user.market,
    locale: user.locale,
    emailVerifiedAt: user.emailVerifiedAt,
    trialEndsAt: user.trialEndsAt,
    hasTrialEnded: user.hasTrialEnded,
    plan: user.plan,
    permissions: effectivePerms,
    hasFullAccess: hasFullAppAccess(effectivePerms),
    teamSeat,
    banned: false,
    createdAt: user.createdAt,
    sessionId: daten.sessionId,
    sitzungsVersion: user.sitzungsVersion,
    neuesTokenId: pruefung.neuesTokenId,
  };
}

/**
 * Unified session resolution for the entire platform (`getSessionUser(req)`).
 * Reads the `__Host-bm_session` / `bm_session` cookie and validates it against PostgreSQL.
 */
export async function getSessionUser(req: Request, erlaubeRotation = false): Promise<SessionUser | null> {
  const ua = req.headers.get("user-agent");
  const rawToken =
    readCookieFromRequest(req, SESSION_COOKIE_NAME) ??
    readCookieFromRequest(req, "__Host-bm_session") ??
    readCookieFromRequest(req, "bm_session");

  if (!rawToken) return null;
  return resolveSessionToken(rawToken, ua, erlaubeRotation);
}
