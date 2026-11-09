import "server-only";
import { and, desc, eq, isNotNull, ne, or } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/db";
import { freeListingUnlocks, sessions, users } from "@/db/schema";
import { CountryAccessService } from "@/services/CountryAccessService";
import { ListingService } from "@/services/ListingService";

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

  /** Full status for rendering `ListingUnlockBanner` / `FreeUnlockedNotice`. */
  static getStatus = cache(async (userId: string, currentListingKey?: string): Promise<FreeUnlockStatus> => {
    const [ownUnlock] = await db
      .select({ listingKey: freeListingUnlocks.listingKey })
      .from(freeListingUnlocks)
      .where(eq(freeListingUnlocks.userId, userId));

    if (ownUnlock) {
      return {
        unlockedListingKey: ownUnlock.listingKey,
        isCurrentListingUnlocked: Boolean(currentListingKey && ownUnlock.listingKey === currentListingKey),
        canClaimFreeUnlock: false,
        deviceAlreadyClaimed: false,
      };
    }

    const [user] = await db
      .select({
        emailVerifiedAt: users.emailVerifiedAt,
        gesperrtAm: users.gesperrtAm,
      })
      .from(users)
      .where(eq(users.id, userId));

    if (!user || user.gesperrtAm || !user.emailVerifiedAt) {
      return {
        unlockedListingKey: null,
        isCurrentListingUnlocked: false,
        canClaimFreeUnlock: false,
        deviceAlreadyClaimed: false,
      };
    }

    const hw = await resolveUserHardwareFingerprint(userId);
    if (hw) {
      const [otherDeviceClaim] = await db
        .select({ userId: freeListingUnlocks.userId })
        .from(freeListingUnlocks)
        .innerJoin(users, eq(users.id, freeListingUnlocks.userId))
        .where(
          and(
            ne(freeListingUnlocks.userId, userId),
            or(eq(freeListingUnlocks.hardwareFingerprint, hw), eq(users.hardwareFingerprint, hw)),
          ),
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
