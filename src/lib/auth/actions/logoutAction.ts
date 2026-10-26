"use server";

import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { SessionService } from "@/services/SessionService";

/** Server Action: end this session. */
export async function logoutAction(): Promise<void> {
  await SessionService.destroyCurrent();
  redirect(ROUTES.home);
}

/** Server Action: end every session of this account, this one included. */
export async function logoutEverywhereAction(): Promise<void> {
  const user = await SessionService.getCurrentUser();
  if (user) await SessionService.destroyAllForUser(user.id);
  await SessionService.destroyCurrent();
  redirect(ROUTES.home);
}
