"use server";

import { redirect } from "next/navigation";
import { AUTH_ROUTES, RATE_LIMITS } from "@/lib/auth/authConfig";
import { BillingProfileState, parseBillingProfile } from "@/lib/invoice/billingProfileForm";
import { InvoiceService } from "@/services/invoice/InvoiceService";
import { RateLimitService } from "@/services/RateLimitService";
import { SessionService } from "@/services/SessionService";

/** Server Action: saves the billing address of the signed-in account. */
export async function saveBillingProfileAction(_previous: BillingProfileState, formData: FormData): Promise<BillingProfileState> {
  const user = await SessionService.getCurrentUser();
  if (!user) redirect(AUTH_ROUTES.login);
  const { values, fields } = parseBillingProfile(formData);
  if (fields && Object.keys(fields).length) return { status: "error", fields, values };

  const { allowed } = await RateLimitService.hit(`billing-profile:user:${user.id}`, RATE_LIMITS.changePassword);
  if (!allowed) return { status: "error", code: "rate_limited", values };
  try {
    await InvoiceService.saveProfile(user.id, { name: values.name, address: values.address, vatId: values.vatId || null });
  } catch (error) {
    console.error("[saveBillingProfileAction]", error);
    return { status: "error", code: "unknown", values };
  }
  return { status: "saved", values };
}
