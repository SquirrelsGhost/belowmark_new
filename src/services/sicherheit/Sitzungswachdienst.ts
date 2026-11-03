import "server-only";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { and, eq, isNull, lt } from "drizzle-orm";
import { after } from "next/server";
import { db } from "@/db";
import { Session, sessions } from "@/db/schema";

const ROTATION_INTERVALL_MS = 15 * 60 * 1000; // Rotate tokenId (jti) every 15 minutes
const PARALLEL_TOLERANZ_MS = 60 * 1000; // 60s tolerance for concurrent requests after ACK confirmation
const AKTIVITAET_SCHREIB_INTERVALL_MS = 120 * 1000; // Throttle zuletztAktivAm DB writes to once per 2 min

const lastTouchBySession = new Map<string, number>();

function runInBackground(task: () => Promise<unknown>): void {
  const safe = () => task().catch((err: unknown) => console.error("[Sitzungswachdienst] background:", err));
  try {
    after(safe);
  } catch {
    void safe();
  }
}

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
 * Bound to `userAgentHash` in PostgreSQL (`sessions`), uses two-phase ACK-confirmed
 * 15-minute `tokenId` (`jti`) rotation so aborted mobile prefetches never lock out
 * legitimate users, and immediately revokes all sessions of the user once a confirmed
 * rotated token is replayed outside the 60s concurrent grace window.
 */
export class Sitzungswachdienst {
  static onInvalidate?: () => void;

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
        aktivesTokenBestaetigt: true,
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
    const sitzung =
      vorgeladen === undefined
        ? (await db.select().from(sessions).where(eq(sessions.id, sitzungId)))[0]
        : vorgeladen;
    if (!sitzung || !sitzung.id || !sitzung.expiresAt || sitzung.widerrufenAm) return { gueltig: false };

    const nowMs = Date.now();
    if (sitzung.expiresAt.getTime() <= nowMs) return { gueltig: false };

    // Device binding check (reject missing or mismatched User-Agent when userAgentHash is bound)
    if (sitzung.userAgentHash && (!userAgent || sitzung.userAgentHash !== uaFingerprint(userAgent))) {
      await Sitzungswachdienst.widerrufe(sitzung.id, "Geräte-Signatur abweichend");
      return { gueltig: false };
    }

    const istAktuell = tokenId === sitzung.aktivesTokenId;
    // Two-phase rotation: as long as the browser has never confirmed receiving `aktivesTokenId`
    // (`aktivesTokenBestaetigt === false`, e.g. aborted mobile navigation or dropped response),
    // `vorherigesTokenId` remains valid and re-delivers `aktivesTokenId`. Once `aktivesTokenBestaetigt`
    // is true, the strict 60-second concurrent grace window applies.
    const istVorherigesInToleranz =
      Boolean(sitzung.vorherigesTokenId) &&
      tokenId === sitzung.vorherigesTokenId &&
      (sitzung.aktivesTokenBestaetigt === false ||
        nowMs - sitzung.rotiertAm.getTime() <= PARALLEL_TOLERANZ_MS);

    if (!istAktuell && !istVorherigesInToleranz) {
      await Sitzungswachdienst.widerrufeAlleFuerInhaber(sitzung.userId, "Token-Wiederverwendung erkannt");
      console.warn(
        `[Sitzungswachdienst] Token reuse detected for user ${sitzung.userId} (session ${sitzung.id}). All sessions revoked.`,
      );
      return { gueltig: false, diebstahlErkannt: true };
    }

    const now = new Date(nowMs);
    const brauchtRotation =
      erlaubeRotation &&
      istAktuell &&
      sitzung.aktivesTokenBestaetigt !== false &&
      nowMs - sitzung.rotiertAm.getTime() >= ROTATION_INTERVALL_MS;

    // Phase 2 Confirmation: browser returned the newly rotated `aktivesTokenId` for the first time ->
    // flip `aktivesTokenBestaetigt = true` and start the 60s grace clock for any concurrent requests.
    if (istAktuell && sitzung.aktivesTokenBestaetigt === false && !brauchtRotation) {
      await db
        .update(sessions)
        .set({
          aktivesTokenBestaetigt: true,
          rotiertAm: now,
          zuletztAktivAm: now,
        })
        .where(and(eq(sessions.id, sitzung.id), eq(sessions.aktivesTokenId, tokenId)));

      return {
        gueltig: true,
        sitzung: { ...sitzung, aktivesTokenBestaetigt: true, rotiertAm: now, zuletztAktivAm: now },
      };
    }

    // Idempotent redelivery: if the browser still sent `vorherigesTokenId` and this caller can set cookies,
    // re-attach the already rotated `aktivesTokenId` so the browser converges onto the latest token.
    const erneuteZustellungTokenId =
      erlaubeRotation && !istAktuell && tokenId === sitzung.vorherigesTokenId
        ? sitzung.aktivesTokenId
        : undefined;

    if (!brauchtRotation) {
      const lastLocalTouch = lastTouchBySession.get(sitzung.id) ?? 0;
      if (nowMs - Math.max(sitzung.zuletztAktivAm.getTime(), lastLocalTouch) >= AKTIVITAET_SCHREIB_INTERVALL_MS) {
        if (lastTouchBySession.size > 2_000) lastTouchBySession.clear();
        lastTouchBySession.set(sitzung.id, nowMs);
        runInBackground(() =>
          db.update(sessions).set({ zuletztAktivAm: now }).where(eq(sessions.id, sitzung.id)),
        );
      }
      return {
        gueltig: true,
        sitzung: { ...sitzung, zuletztAktivAm: now },
        neuesTokenId: erneuteZustellungTokenId,
      };
    }

    const neuesTokenId = randomBytes(16).toString("base64url");
    const aktualisiert = await db
      .update(sessions)
      .set({
        zuletztAktivAm: now,
        aktivesTokenId: neuesTokenId,
        aktivesTokenBestaetigt: false,
        vorherigesTokenId: sitzung.aktivesTokenId,
        rotiertAm: now,
      })
      .where(and(eq(sessions.id, sitzung.id), eq(sessions.aktivesTokenId, sitzung.aktivesTokenId)))
      .returning({ id: sessions.id });

    // If a concurrent request won the atomic rotation race, read and re-deliver that winning token
    if (aktualisiert.length === 0) {
      const [frisch] = await db.select().from(sessions).where(eq(sessions.id, sitzung.id));
      return {
        gueltig: true,
        sitzung: frisch ?? sitzung,
        neuesTokenId: frisch?.aktivesTokenId,
      };
    }

    return {
      gueltig: true,
      sitzung: {
        ...sitzung,
        zuletztAktivAm: now,
        aktivesTokenId: neuesTokenId,
        aktivesTokenBestaetigt: false,
        vorherigesTokenId: sitzung.aktivesTokenId,
        rotiertAm: now,
      },
      neuesTokenId,
    };
  }

  static async widerrufe(sitzungId: string, grund = "Manuell abgemeldet"): Promise<void> {
    Sitzungswachdienst.onInvalidate?.();
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
    Sitzungswachdienst.onInvalidate?.();
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
