"use server";

import { redirect } from "next/navigation";
import { AUTH_PARAMS, AUTH_ROUTES, RATE_LIMITS } from "@/lib/auth/authConfig";
import { BILLING_ROUTES } from "@/lib/billing/billingConfig";
import { OrderFormState } from "@/lib/billing/billingForm.types";
import { MarketCode } from "@/lib/constants";
import { BillingUpgradeService } from "@/services/billing/BillingUpgradeService";
import { RateLimitService } from "@/services/RateLimitService";
import { SessionService } from "@/services/SessionService";

/** "Zahlungspflichtig upgraden": records the upgrade and sends the browser to pay the difference. */
export async function upgradeAction(_previous: OrderFormState, formData: FormData): Promise<OrderFormState> {
  const user = await SessionService.getCurrentUser();
  if (!user) redirect(`${AUTH_ROUTES.login}?${AUTH_PARAMS.next}=${encodeURIComponent(BILLING_ROUTES.upgrade)}`);
  if (formData.get("consent") !== "on") return { status: "error", code: "consent_required" };

  const { allowed } = await RateLimitService.hit(`order:${user.id}`, RATE_LIMITS.order);
  if (!allowed) return { status: "error", code: "failed" };

  const market: MarketCode = user.market === "TR" ? "TR" : "DE";
  let redirectUrl: string;
  try {
    ({ redirectUrl } = await BillingUpgradeService.place({ id: user.id, email: user.email, market, locale: user.locale }, new Date()));
  } catch (error) {
    console.error("[upgradeAction]", error);
    return { status: "error", code: String(error).includes("order blocked") ? "blocked" : "failed" };
  }
  redirect(redirectUrl);
}
