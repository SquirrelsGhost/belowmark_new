import "server-only";
import { and, desc, eq, inArray, isNotNull, sql } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/db";
import { freeListingUnlocks, sessions, users } from "@/db/schema";
import { redactListingForFreePlan } from "@/lib/sicherheit/antiScrapingRules";
import { CountryAccessService } from "@/services/CountryAccessService";
import { ListingService } from "@/services/ListingService";
import { Listing } from "@/types/listing.types";

const HARDWARE_FP_REGEX = /^HW-[0-9a-f]{32}$/;

export interface FreeUnlockStatus {
  unlockedListingKey: string | null;
  isCurrentListingUnlocked: boolean;
  canClaimFreeUnlock: boolean;
  deviceAlreadyClaimed: boolean;
}

export type ClaimFreeUnlockResult =
  | { ok: true; listingKey: string }
  | { ok: false; reason: "unverified" | "already_used" | "device_used" | "not_found" };

/**
 * Resolves the verified hardware fingerprint (`HW-...`) for a user from either
 * `users.hardware_fingerprint` or their latest stateful session row, backfilling
 * `users.hardware_fingerprint` if missing.
 */
export async function resolveUserHardwareFingerprint(userId: string): Promise<string | null> {
  const [userRow] = await db
    .select({ hw: users.hardwareFingerprint })
    .from(users)
    .where(eq(users.id, userId));
  if (userRow?.hw && HARDWARE_FP_REGEX.test(userRow.hw)) {
    return userRow.hw;
  }

  const [sessionRow] = await db
    .select({ hw: sessions.hardwareFingerprint })
    .from(sessions)
    .where(and(eq(sessions.userId, userId), isNotNull(sessions.hardwareFingerprint)))
    .orderBy(desc(sessions.createdAt))
    .limit(1);

  if (sessionRow?.hw && HARDWARE_FP_REGEX.test(sessionRow.hw)) {
    await db
      .update(users)
      .set({ hardwareFingerprint: sessionRow.hw })
      .where(eq(users.id, userId))
      .catch(() => undefined);
    return sessionRow.hw;
  }

  return null;
}

/**
 * FreeUnlockService ("1 Gratis-Dossier")
 *
 * Allows every email-verified user to unlock exactly ONE proceeding dossier
 * completely free (unredacted file number, street address, appraised value,
 * official court PDFs, AI report analysis, bidder & bank dossiers), bounded
 * once per user account AND once per hardware fingerprint (`HW-...`).
 */
export class FreeUnlockService {
  /** Fast per-request cached check whether `listingKey` is unlocked for `userId`. */
  static isListingUnlockedForUser = cache(async (userId: string, listingKey: string): Promise<boolean> => {
    if (!userId || !listingKey) return false;
    const [row] = await db
      .select({ key: freeListingUnlocks.listingKey })
      .from(freeListingUnlocks)
      .where(and(eq(freeListingUnlocks.userId, userId), eq(freeListingUnlocks.listingKey, listingKey)));
    return Boolean(row);
  });

  /** Batch lookup of unlocked free dossier keys per user (used by alert & deadline runners). */
  static getUnlockedKeysByUsers = async (userIds: string[]): Promise<Map<string, string>> => {
    if (userIds.length === 0) return new Map();
    const rows = await db
      .select({ userId: freeListingUnlocks.userId, listingKey: freeListingUnlocks.listingKey })
      .from(freeListingUnlocks)
      .where(inArray(freeListingUnlocks.userId, userIds));
    return new Map(rows.map((row) => [row.userId, row.listingKey]));
  };

  /** Redacts every listing for a free viewer EXCEPT their 1 unlocked free dossier. */
  static redactForViewer = async (userId: string, isFreePlan: boolean, listings: Listing[]): Promise<Listing[]> => {
    if (!isFreePlan || listings.length === 0) return listings;
    const status = await FreeUnlockService.getStatus(userId);
    return listings.map((listing) =>
      listing.key === status.unlockedListingKey ? listing : redactListingForFreePlan(listing),
    );
  };

  /** Full status for rendering `ListingUnlockBanner` / `FreeUnlockedNotice` in a single DB round-trip. */
  static getStatus = cache(async (userId: string, currentListingKey?: string): Promise<FreeUnlockStatus> => {
    const [row] = await db
      .select({
        ownUnlockKey: freeListingUnlocks.listingKey,
        emailVerifiedAt: users.emailVerifiedAt,
        gesperrtAm: users.gesperrtAm,
        userHw: users.hardwareFingerprint,
        sessionHw: sql<string | null>`(
          select s.hardware_fingerprint
          from sessions s
          where s.user_id = ${users.id} and s.hardware_fingerprint is not null
          order by s.created_at desc
          limit 1
        )`,
      })
      .from(users)
      .leftJoin(freeListingUnlocks, eq(freeListingUnlocks.userId, users.id))
      .where(eq(users.id, userId));

    if (!row) {
      return {
        unlockedListingKey: null,
        isCurrentListingUnlocked: false,
        canClaimFreeUnlock: false,
        deviceAlreadyClaimed: false,
      };
    }

    if (row.ownUnlockKey) {
      return {
        unlockedListingKey: row.ownUnlockKey,
        isCurrentListingUnlocked: Boolean(currentListingKey && row.ownUnlockKey === currentListingKey),
        canClaimFreeUnlock: false,
        deviceAlreadyClaimed: false,
      };
    }

    if (row.gesperrtAm || !row.emailVerifiedAt) {
      return {
        unlockedListingKey: null,
        isCurrentListingUnlocked: false,
        canClaimFreeUnlock: false,
        deviceAlreadyClaimed: false,
      };
    }

    const hw =
      row.userHw && HARDWARE_FP_REGEX.test(row.userHw)
        ? row.userHw
        : row.sessionHw && HARDWARE_FP_REGEX.test(row.sessionHw)
          ? row.sessionHw
          : null;

    if (hw) {
      if (!row.userHw && row.sessionHw === hw) {
        void db
          .update(users)
          .set({ hardwareFingerprint: hw })
          .where(eq(users.id, userId))
          .catch(() => undefined);
      }

      const [otherDeviceClaim] = await db
        .select({ userId: freeListingUnlocks.userId })
        .from(freeListingUnlocks)
        .innerJoin(users, eq(users.id, freeListingUnlocks.userId))
        .where(
          sql`${freeListingUnlocks.userId} <> ${userId} and (${freeListingUnlocks.hardwareFingerprint} = ${hw} or ${users.hardwareFingerprint} = ${hw})`,
        )
        .limit(1);

      if (otherDeviceClaim) {
        return {
          unlockedListingKey: null,
          isCurrentListingUnlocked: false,
          canClaimFreeUnlock: false,
          deviceAlreadyClaimed: true,
        };
      }
    }

    return {
      unlockedListingKey: null,
      isCurrentListingUnlocked: false,
      canClaimFreeUnlock: true,
      deviceAlreadyClaimed: false,
    };
  });

  /** Claims the one-time free dossier unlock for `listingKey`. */
  static claimFreeUnlock = async (userId: string, listingKey: string): Promise<ClaimFreeUnlockResult> => {
    const status = await FreeUnlockService.getStatus(userId, listingKey);
    if (status.isCurrentListingUnlocked) {
      return { ok: true, listingKey };
    }
    if (status.unlockedListingKey) {
      return { ok: false, reason: "already_used" };
    }
    if (status.deviceAlreadyClaimed) {
      return { ok: false, reason: "device_used" };
    }
    if (!status.canClaimFreeUnlock) {
      return { ok: false, reason: "unverified" };
    }

    const countryAccess = await CountryAccessService.forUserId(userId);
    if (!countryAccess) return { ok: false, reason: "unverified" };

    const listing = await ListingService.getByKey(countryAccess.countries, listingKey);
    if (!listing) return { ok: false, reason: "not_found" };

    const hw = await resolveUserHardwareFingerprint(userId);
    const [inserted] = await db
      .insert(freeListingUnlocks)
      .values({
        userId,
        listingKey: listing.key,
        market: listing.market,
        hardwareFingerprint: hw,
      })
      .onConflictDoNothing({ target: freeListingUnlocks.userId })
      .returning({ listingKey: freeListingUnlocks.listingKey });

    if (!inserted) {
      const [existing] = await db
        .select({ listingKey: freeListingUnlocks.listingKey })
        .from(freeListingUnlocks)
        .where(eq(freeListingUnlocks.userId, userId));
      if (existing?.listingKey === listing.key) {
        return { ok: true, listingKey: existing.listingKey };
      }
      return { ok: false, reason: "already_used" };
    }

    return { ok: true, listingKey: inserted.listingKey };
  };
}
