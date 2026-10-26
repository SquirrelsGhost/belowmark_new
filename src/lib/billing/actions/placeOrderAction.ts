"use server";

import { redirect } from "next/navigation";
import { AUTH_PARAMS, AUTH_ROUTES, RATE_LIMITS } from "@/lib/auth/authConfig";
import { BILLING_ROUTES, isOfferId, OFFER_PARAM } from "@/lib/billing/billingConfig";
import { OrderFormState } from "@/lib/billing/billingForm.types";
import { RateLimitService } from "@/services/RateLimitService";
import { BillingService } from "@/services/billing/BillingService";
import { SessionService } from "@/services/SessionService";

/** "Zahlungspflichtig bestellen": records the order and sends the browser to the payment page. */
export async function placeOrderAction(_previous: OrderFormState, formData: FormData): Promise<OrderFormState> {
  const offer = String(formData.get("offer") ?? "");
  const user = await SessionService.getCurrentUser();
  if (!user) redirect(`${AUTH_ROUTES.login}?${AUTH_PARAMS.next}=${encodeURIComponent(`${BILLING_ROUTES.order}?${OFFER_PARAM}=${offer}`)}`);
  if (!isOfferId(offer)) return { status: "error", code: "failed" };
  if (formData.get("consent") !== "on") return { status: "error", code: "consent_required", offer };

  const { allowed } = await RateLimitService.hit(`order:${user.id}`, RATE_LIMITS.order);
  if (!allowed) return { status: "error", code: "failed", offer };

  let redirectUrl: string;
  try {
    const market = user.market === "TR" ? "TR" : "DE";
    ({ redirectUrl } = await BillingService.placeOrder({ id: user.id, email: user.email, market, locale: user.locale }, offer, new Date()));
  } catch (error) {
    console.error("[placeOrderAction]", error);
    return { status: "error", code: String(error).includes("order blocked") ? "blocked" : "failed", offer };
  }
  redirect(redirectUrl);
}
