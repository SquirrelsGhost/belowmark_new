"use server";

import { redirect } from "next/navigation";
import { AUTH_ROUTES, RATE_LIMITS } from "@/lib/auth/authConfig";
import { BILLING_ACCOUNT_ANCHOR, BILLING_ACCOUNT_PARAM } from "@/lib/billing/billingRoutes";
import { DeleteAccountState } from "@/lib/billing/billingForm.types";
import { ROUTES } from "@/lib/constants";
import { AccountDataService } from "@/services/AccountDataService";
import { BillingService } from "@/services/billing/BillingService";
import { RateLimitService } from "@/services/RateLimitService";
import { SessionService } from "@/services/SessionService";
import { TranslationService } from "@/services/TranslationService";

/** Server Action: opens Stripe's customer portal (invoices, payment method, billing address). */
export async function openPortalAction(): Promise<void> {
  const user = await SessionService.getCurrentUser();
  if (!user) redirect(AUTH_ROUTES.login);
  let url: string | null = null;
  try {
    url = await BillingService.portalUrl(user.id, TranslationService.ToLocaleOption(await TranslationService.GetUserLocale()));
  } catch (error) {
    console.error("[openPortalAction]", error);
  }
  redirect(url ?? `${AUTH_ROUTES.account}?${BILLING_ACCOUNT_PARAM}=portal_failed#${BILLING_ACCOUNT_ANCHOR}`);
}

/** Server Action: deletes the account after password and confirmation (Art. 17 DSGVO). */
export async function deleteAccountAction(_previous: DeleteAccountState, formData: FormData): Promise<DeleteAccountState> {
  const user = await SessionService.getCurrentUser();
  if (!user) redirect(AUTH_ROUTES.login);
  if (formData.get("confirm") !== "on") return { status: "error", code: "confirm_required" };
  const { allowed } = await RateLimitService.hit(`delete:user:${user.id}`, RATE_LIMITS.deleteAccount);
  if (!allowed) return { status: "error", code: "rate_limited" };

  try {
    const deleted = await AccountDataService.delete(user.id, String(formData.get("password") ?? ""));
    if (!deleted) return { status: "error", code: "password_wrong" };
  } catch (error) {
    console.error("[deleteAccountAction]", error);
    return { status: "error", code: "unknown" };
  }
  // The sessions went with the account; this only clears the cookie
  await SessionService.destroyCurrent().catch(() => undefined);
  redirect(ROUTES.home);
}
