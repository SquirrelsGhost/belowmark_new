import "server-only";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { and, eq, isNull, lt } from "drizzle-orm";
import { db } from "@/db";
import { Session, sessions } from "@/db/schema";

const ROTATION_INTERVALL_MS = 15 * 60 * 1000; // Rotate tokenId (jti) every 15 minutes
const PARALLEL_TOLERANZ_MS = 60 * 1000; // 60 seconds tolerance for concurrent browser requests

export function browserFamily(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes("edg/")) return "Edge";
  if (ua.includes("opr/") || ua.includes("opera")) return "Opera";
  if (ua.includes("firefox/")) return "Firefox";
  if (ua.includes("chrome/") && !ua.includes("edg/")) return "Chrome";
  if (ua.includes("safari/") && !ua.includes("chrome/")) return "Safari";
  return "Browser";
}

export function uaFingerprint(userAgent: string): string {
  const family = browserFamily(userAgent);
  return createHash("sha256").update(`ec-ua:${family}`, "utf8").digest("base64url").slice(0, 16);
}

export function shortenIp(ip: string): string {
  const trimmed = ip.trim();
  if (trimmed.includes(".")) {
    const parts = trimmed.split(".");
    if (parts.length === 4) return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
  }
  if (trimmed.includes(":")) {
    return `${trimmed.split(":").slice(0, 3).join(":")}::`;
  }
  return trimmed.slice(0, 32);
}

export interface SitzungPruefErgebnis {
  gueltig: boolean;
  sitzung?: Session;
  neuesTokenId?: string;
  diebstahlErkannt?: boolean;
}

/**
 * Stateful Server-Session & Anti-Theft Watchdog (`Sitzungswachdienst`):
 * Bound to `userAgentHash` in PostgreSQL (`sessions`), rotates `tokenId` (`jti`)
 * every 15 minutes (with 60s parallel tolerance), and immediately revokes all
 * sessions of the user if token reuse (cookie theft) is detected.
 */
export class Sitzungswachdienst {
  static async erstelleSitzung(params: {
    userId: string;
    ttlMs: number;
    userAgent: string | null;
    ip?: string;
    hardwareFingerprint?: string;
  }): Promise<Session> {
    const now = new Date();
    const ua = params.userAgent ?? "";
    const sessionId = randomUUID();
    const aktivesTokenId = randomBytes(16).toString("base64url");
    const expiresAt = new Date(now.getTime() + params.ttlMs);

    const [created] = await db
      .insert(sessions)
      .values({
        id: sessionId,
        userId: params.userId,
        aktivesTokenId,
        rotiertAm: now,
        zuletztAktivAm: now,
        expiresAt,
        userAgentHash: uaFingerprint(ua),
        userAgent: ua.slice(0, 255) || browserFamily(ua),
        ipKuerzel: params.ip ? shortenIp(params.ip) : "lokal",
        hardwareFingerprint: params.hardwareFingerprint?.slice(0, 64),
      })
      .returning();

    await Sitzungswachdienst.bereinigeAbgelaufene(params.userId);
    return created;
  }

  /**
   * `vorgeladen` is the session row when the caller already read it (joined with
   * the user, one round trip less); `undefined` reads it here.
   */
  static async pruefeUndAktualisiere(
    sitzungId: string,
    tokenId: string,
    userAgent?: string | null,
    erlaubeRotation = false,
    vorgeladen?: Session | null,
  ): Promise<SitzungPruefErgebnis> {
    const sitzung = vorgeladen === undefined ? (await db.select().from(sessions).where(eq(sessions.id, sitzungId)))[0] : vorgeladen;
    if (!sitzung || !sitzung.id || !sitzung.expiresAt || sitzung.widerrufenAm) return { gueltig: false };

    const nowMs = Date.now();
    if (sitzung.expiresAt.getTime() <= nowMs) return { gueltig: false };

    // Device binding check (reject missing or mismatched User-Agent when userAgentHash is bound)
    if (sitzung.userAgentHash && (!userAgent || sitzung.userAgentHash !== uaFingerprint(userAgent))) {
      await Sitzungswachdienst.widerrufe(sitzung.id, "Geräte-Signatur abweichend");
      return { gueltig: false };
    }

    const istAktuell = tokenId === sitzung.aktivesTokenId;
    const istVorherigesInToleranz =
      Boolean(sitzung.vorherigesTokenId) &&
      tokenId === sitzung.vorherigesTokenId &&
      nowMs - sitzung.rotiertAm.getTime() <= PARALLEL_TOLERANZ_MS;

    // Anti-Theft Reuse Detection: if an outdated tokenId is presented outside the 60s grace window,
    // revoke ALL active sessions of this user immediately.
    if (!istAktuell && !istVorherigesInToleranz) {
      await Sitzungswachdienst.widerrufeAlleFuerInhaber(sitzung.userId, "Token-Wiederverwendung erkannt");
      console.warn(`[Sitzungswachdienst] Token reuse detected for user ${sitzung.userId} (session ${sitzung.id}). All sessions revoked.`);
      return { gueltig: false, diebstahlErkannt: true };
    }

    const brauchtRotation =
      erlaubeRotation && istAktuell && nowMs - sitzung.rotiertAm.getTime() >= ROTATION_INTERVALL_MS;
    const neuesTokenId = brauchtRotation ? randomBytes(16).toString("base64url") : undefined;
    const now = new Date(nowMs);

    // Without a rotation only the "last active" time changes. Nothing in this
    // request depends on it, so the write runs alongside instead of making
    // every page wait one more database round trip.
    if (!neuesTokenId) {
      db.update(sessions)
        .set({ zuletztAktivAm: now })
        .where(eq(sessions.id, sitzung.id))
        .catch((err: unknown) => console.error("[Sitzungswachdienst] zuletztAktivAm:", err));
      return { gueltig: true, sitzung: { ...sitzung, zuletztAktivAm: now } };
    }

    const aktualisiert = await db
      .update(sessions)
      .set({
        zuletztAktivAm: now,
        aktivesTokenId: neuesTokenId,
        vorherigesTokenId: sitzung.aktivesTokenId,
        rotiertAm: now,
      })
      .where(and(eq(sessions.id, sitzung.id), eq(sessions.aktivesTokenId, sitzung.aktivesTokenId)))
      .returning({ id: sessions.id });

    if (aktualisiert.length === 0) {
      return { gueltig: true, sitzung };
    }

    return {
      gueltig: true,
      sitzung: {
        ...sitzung,
        zuletztAktivAm: now,
        aktivesTokenId: neuesTokenId,
        vorherigesTokenId: sitzung.aktivesTokenId,
        rotiertAm: now,
      },
      neuesTokenId,
    };
  }

  static async widerrufe(sitzungId: string, grund = "Manuell abgemeldet"): Promise<void> {
    await db
      .update(sessions)
      .set({ widerrufenAm: new Date(), widerrufGrund: grund })
      .where(eq(sessions.id, sitzungId));
  }

  static async widerrufeAlleFuerInhaber(
    userId: string,
    grund = "Alle Geräte abgemeldet",
    ausnahmeSitzungId?: string,
  ): Promise<void> {
    const rows = await db
      .select({ id: sessions.id })
      .from(sessions)
      .where(and(eq(sessions.userId, userId), isNull(sessions.widerrufenAm)));

    for (const row of rows) {
      if (row.id !== ausnahmeSitzungId) {
        await Sitzungswachdienst.widerrufe(row.id, grund);
      }
    }
  }

  static async bereinigeAbgelaufene(userId?: string): Promise<void> {
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    if (userId) {
      await db.delete(sessions).where(and(eq(sessions.userId, userId), lt(sessions.expiresAt, cutoff)));
    } else {
      await db.delete(sessions).where(lt(sessions.expiresAt, cutoff));
    }
  }
}
