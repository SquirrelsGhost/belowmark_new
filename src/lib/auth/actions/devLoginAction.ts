"use server";

import { notFound, redirect } from "next/navigation";
import { AUTH_PARAMS } from "@/lib/auth/authConfig";
import { findDevAccount, isDevLoginEnabled, isLocalRequest } from "@/lib/auth/devLogin";
import { getRequestInfo } from "@/lib/auth/requestInfo";
import { safeRedirect } from "@/lib/auth/safeRedirect";
import { DevLoginService } from "@/services/DevLoginService";
import { SessionService } from "@/services/SessionService";

/**
 * Server Action: one-click sign-in as a test account — development only.
 * Refuses (404) in production builds, when AUTH_DEV_LOGIN=off, for any
 * request not addressed to localhost, and for unknown account keys.
 */
export async function devLoginAction(formData: FormData): Promise<void> {
  if (!isDevLoginEnabled() || !(await isLocalRequest())) notFound();
  const account = findDevAccount(formData.get("account"));
  if (!account) notFound();

  const { ip, userAgent } = await getRequestInfo();
  const userId = await DevLoginService.ensureAccount(account);
  await SessionService.destroyCurrent();
  await SessionService.create(userId, true, userAgent, { ip });
  redirect(safeRedirect(formData.get(AUTH_PARAMS.next)));
}
