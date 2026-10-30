"use server";

import { redirect } from "next/navigation";
import { AUTH_PARAMS, AUTH_ROUTES, RATE_LIMITS } from "@/lib/auth/authConfig";
import { BILLING_ROUTES, isOfferId, MARKET_PARAM, OFFER_PARAM } from "@/lib/billing/billingConfig";
import { OrderFormState } from "@/lib/billing/billingForm.types";
import { isPricingCountry, MarketCode, PricingCountryCode } from "@/lib/constants";
import { RateLimitService } from "@/services/RateLimitService";
import { BillingService } from "@/services/billing/BillingService";
import { SessionService } from "@/services/SessionService";

/** "Zahlungspflichtig bestellen": records the order and sends the browser to the payment page. */
export async function placeOrderAction(_previous: OrderFormState, formData: FormData): Promise<OrderFormState> {
  const rawOffer = String(formData.get("offer") ?? "");
  const rawMarket = String(formData.get("market") ?? "").toUpperCase();
  const fallbackMarket: PricingCountryCode = isPricingCountry(rawMarket) ? rawMarket : "DE";
  if (!isOfferId(rawOffer)) return { status: "error", code: "failed", market: fallbackMarket };
  const offer = rawOffer;

  const user = await SessionService.getCurrentUser();
  if (!user) {
    const query = `${OFFER_PARAM}=${offer}${isPricingCountry(rawMarket) ? `&${MARKET_PARAM}=${rawMarket}` : ""}`;
    redirect(`${AUTH_ROUTES.login}?${AUTH_PARAMS.next}=${encodeURIComponent(`${BILLING_ROUTES.order}?${query}`)}`);
  }

  const currentMarket: MarketCode = user.market === "TR" ? "TR" : "DE";
  const market: PricingCountryCode = isPricingCountry(rawMarket) ? rawMarket : currentMarket;

  if (formData.get("consent") !== "on") return { status: "error", code: "consent_required", offer, market };

  const { allowed } = await RateLimitService.hit(`order:${user.id}`, RATE_LIMITS.order);
  if (!allowed) return { status: "error", code: "failed", offer, market };

  let redirectUrl: string;
  try {
    ({ redirectUrl } = await BillingService.placeOrder(
      { id: user.id, email: user.email, market, locale: user.locale },
      offer,
      new Date(),
      currentMarket,
    ));
  } catch (error) {
    console.error("[placeOrderAction]", error);
    return { status: "error", code: String(error).includes("order blocked") ? "blocked" : "failed", offer, market };
  }
  redirect(redirectUrl);
}
