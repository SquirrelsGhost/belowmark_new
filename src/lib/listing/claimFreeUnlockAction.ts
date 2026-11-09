"use server";

import { revalidatePath } from "next/cache";
import { listingHref } from "@/lib/appConstants";
import { FreeUnlockService } from "@/services/FreeUnlockService";
import { RateLimitService } from "@/services/RateLimitService";
import { SessionService } from "@/services/SessionService";

export interface FreeUnlockActionState {
  status: "idle" | "unlocked" | "error";
  reason?: "unverified" | "already_used" | "device_used" | "not_found" | "rate_limited";
}

const FREE_UNLOCK_RATE_RULE = { limit: 10, windowMs: 15 * 60 * 1000 } as const;

export async function claimFreeUnlockAction(
  _prev: FreeUnlockActionState,
  formData: FormData,
): Promise<FreeUnlockActionState> {
  const listingKey = String(formData.get("listingKey") ?? "").trim();
  if (!listingKey || listingKey.length > 128) {
    return { status: "error", reason: "not_found" };
  }

  const user = await SessionService.getCurrentUser();
  if (!user) {
    return { status: "error", reason: "unverified" };
  }

  const { allowed } = await RateLimitService.hit(`free_unlock:${user.id}`, FREE_UNLOCK_RATE_RULE);
  if (!allowed) {
    return { status: "error", reason: "rate_limited" };
  }

  const result = await FreeUnlockService.claimFreeUnlock(user.id, listingKey);
  if (!result.ok) {
    return { status: "error", reason: result.reason };
  }

  revalidatePath(listingHref(listingKey));
  return { status: "unlocked" };
}
