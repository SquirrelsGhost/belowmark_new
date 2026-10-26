"use server";

import { revalidatePath } from "next/cache";
import { APP_ROUTES, listingHref } from "@/lib/appConstants";
import { DEADLINE_ROUTES } from "@/lib/deadlines/deadlineConstants";
import { env } from "@/lib/env";
import { DeadlineRunService } from "@/services/DeadlineRunService";
import { DeadlineService } from "@/services/DeadlineService";
import { ListingService } from "@/services/ListingService";
import { SessionService } from "@/services/SessionService";

/** Result of a Termin-Begleiter action; the UI shows its own error text. */
export interface DeadlineActionState {
  ok: boolean;
  /** Only after renewing the feed: the new address, shown once */
  feedUrl?: string;
}

const MAX_KEY_LENGTH = 128;

async function signedInUser() {
  const user = await SessionService.getCurrentUser();
  if (!user) return null;
  return { id: user.id, market: user.market === "TR" ? ("TR" as const) : ("DE" as const) };
}

const keyOf = (formData: FormData): string => String(formData.get("listingKey") ?? "").slice(0, MAX_KEY_LENGTH);

function refresh(listingKey: string) {
  revalidatePath(listingHref(listingKey));
  revalidatePath(DEADLINE_ROUTES.overview);
  revalidatePath(APP_ROUTES.watchlist);
}

/** Server Action: starts or ends following a proceeding (intent = follow | unfollow). */
export async function toggleFollowAction(_: DeadlineActionState, formData: FormData): Promise<DeadlineActionState> {
  const user = await signedInUser();
  const listingKey = keyOf(formData);
  if (!user || !listingKey) return { ok: false };
  try {
    if (formData.get("intent") === "unfollow") {
      await DeadlineService.unfollow(user.id, listingKey);
    } else {
      // Only proceedings of the user's market that exist in the data
      if (!(await ListingService.getByKey(user.market, listingKey))) return { ok: false };
      if (!(await DeadlineService.follow(user.id, listingKey, user.market))) return { ok: false };
      void DeadlineRunService.run(Date.now()).catch((err) => console.error("[toggleFollowAction:run]", err));
    }
  } catch (error) {
    console.error("[toggleFollowAction]", error);
    return { ok: false };
  }
  refresh(listingKey);
  return { ok: true };
}

/** Server Action: switches the mail reminders of one followed proceeding (auto-follows if turned on from watchlist). */
export async function setDeadlineMailAction(_: DeadlineActionState, formData: FormData): Promise<DeadlineActionState> {
  const user = await signedInUser();
  const listingKey = keyOf(formData);
  if (!user || !listingKey) return { ok: false };
  const mailOn = formData.get("mail") === "1";
  try {
    if (mailOn) {
      if (!(await ListingService.getByKey(user.market, listingKey))) return { ok: false };
      const existing = await DeadlineService.get(user.id, listingKey);
      if (!existing && !(await DeadlineService.follow(user.id, listingKey, user.market))) return { ok: false };
    }
    await DeadlineService.setMail(user.id, listingKey, mailOn);
    if (mailOn) {
      void DeadlineRunService.run(Date.now()).catch((err) => console.error("[setDeadlineMailAction:run]", err));
    }
  } catch (error) {
    console.error("[setDeadlineMailAction]", error);
    return { ok: false };
  }
  refresh(listingKey);
  return { ok: true };
}

/** Server Action: creates a new calendar feed address; the previous one stops working. */
export async function renewFeedAction(): Promise<DeadlineActionState> {
  const user = await signedInUser();
  if (!user) return { ok: false };
  try {
    const token = await DeadlineService.renewFeed(user.id);
    return { ok: true, feedUrl: new URL(`${DEADLINE_ROUTES.feed}/${token}.ics`, env.appUrl).toString() };
  } catch (error) {
    console.error("[renewFeedAction]", error);
    return { ok: false };
  }
}
