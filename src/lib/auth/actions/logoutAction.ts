"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { SESSION_COOKIE_CANDIDATES, SessionService } from "@/services/SessionService";

/** Server Action: end this session and delete all candidate session cookies. */
export async function logoutAction(): Promise<void> {
  await SessionService.destroyCurrent();
  const cookieStore = await cookies();
  for (const name of SESSION_COOKIE_CANDIDATES) {
    cookieStore.delete(name);
  }
  redirect(ROUTES.home);
}

/** Server Action: end every session of this account, this one included. */
export async function logoutEverywhereAction(): Promise<void> {
  const user = await SessionService.getCurrentUser();
  if (user) await SessionService.destroyAllForUser(user.id);
  await SessionService.destroyCurrent();
  const cookieStore = await cookies();
  for (const name of SESSION_COOKIE_CANDIDATES) {
    cookieStore.delete(name);
  }
  redirect(ROUTES.home);
}
