"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { requestLocale } from "@/lib/auth/actionHelpers";
import { AUTH_PARAMS, AUTH_ROUTES, RATE_LIMITS } from "@/lib/auth/authConfig";
import { verifyLoginPoW } from "@/lib/auth/loginPow";
import { getRequestInfo } from "@/lib/auth/requestInfo";
import { field, nonDisposableEmailSchema } from "@/lib/auth/validation";
import { BILLING_ROUTES, isOfferId, MARKET_PARAM, OFFER_PARAM } from "@/lib/billing/billingConfig";
import { OrderFormState } from "@/lib/billing/billingForm.types";
import { isPricingCountry, MarketCode, PricingCountryCode, pricingCountryToMarket } from "@/lib/constants";
import { accountCountry } from "@/lib/listingCountry";
import { AuthService } from "@/services/AuthService";
import { BillingService } from "@/services/billing/BillingService";
import { RateLimitService } from "@/services/RateLimitService";
import { SessionService } from "@/services/SessionService";

/** "Zahlungspflichtig bestellen": records the order and sends the browser to Stripe Checkout. */
export async function placeOrderAction(_previous: OrderFormState, formData: FormData): Promise<OrderFormState> {
  const rawOffer = String(formData.get("offer") ?? "");
  const rawMarket = String(formData.get("market") ?? "").toUpperCase();
  const rawGuestEmail = field(formData, "guestEmail").trim();
  const fallbackMarket: PricingCountryCode = isPricingCountry(rawMarket) ? rawMarket : "DE";
  if (!isOfferId(rawOffer)) return { status: "error", code: "failed", market: fallbackMarket, guestEmail: rawGuestEmail };
  const offer = rawOffer;

  const orderUser = await SessionService.getCurrentUser();

  if (!orderUser) {
    if (!rawGuestEmail) {
      const query = `${OFFER_PARAM}=${offer}${isPricingCountry(rawMarket) ? `&${MARKET_PARAM}=${rawMarket}` : ""}`;
      redirect(`${AUTH_ROUTES.login}?${AUTH_PARAMS.next}=${encodeURIComponent(`${BILLING_ROUTES.order}?${query}`)}`);
    }

    const powCheck = verifyLoginPoW({
      honeypot: formData.get("honeypot"),
      powTs: formData.get("powTs"),
      powNonce: formData.get("powNonce"),
    });
    if (!powCheck.ok) {
      return { status: "error", code: "failed", offer, market: fallbackMarket, guestEmail: rawGuestEmail };
    }

    const { ip, userAgent } = await getRequestInfo();
    const { allowed: ipAllowed } = await RateLimitService.hit(`signup:ip:${ip}`, RATE_LIMITS.signupIp);
    if (!ipAllowed) {
      return { status: "error", code: "failed", offer, market: fallbackMarket, guestEmail: rawGuestEmail };
    }

    const parsedEmail = nonDisposableEmailSchema.safeParse(rawGuestEmail);
    if (!parsedEmail.success) {
      return { status: "error", code: "email_invalid", offer, market: fallbackMarket, guestEmail: rawGuestEmail };
    }

    const hardwareFingerprint = field(formData, "hardwareFingerprint").trim() || undefined;
    if (await AuthService.isHardwareBanned(hardwareFingerprint)) {
      return { status: "error", code: "blocked", offer, market: fallbackMarket, guestEmail: rawGuestEmail };
    }

    if (formData.get("consent") !== "on") {
      return { status: "error", code: "consent_required", offer, market: fallbackMarket, guestEmail: rawGuestEmail };
    }

    const ensured = await AuthService.ensureOrderAccount({
      email: parsedEmail.data,
      password: `${randomBytes(24).toString("base64url")}!9Aa`,
      market: pricingCountryToMarket(fallbackMarket),
      country: fallbackMarket,
      locale: await requestLocale(),
      hardwareFingerprint,
    });
    if (!ensured) {
      return { status: "error", code: "blocked", offer, market: fallbackMarket, guestEmail: rawGuestEmail };
    }

    if (ensured.isNew) {
      await SessionService.create(ensured.id, true, userAgent, { ip, hardwareFingerprint });
      RateLimitService.hit(`funnel:signup:order-guest:${fallbackMarket}`, {
        limit: 1_000_000,
        windowMs: 365 * 24 * 60 * 60 * 1000,
      }).catch(() => {});
    }

    const currentMarket: MarketCode = ensured.market === "TR" ? "TR" : "DE";
    const currentCountry: PricingCountryCode = accountCountry(ensured.country, currentMarket);
    const { allowed } = await RateLimitService.hit(`order:${ensured.id}`, RATE_LIMITS.order);
    if (!allowed) return { status: "error", code: "failed", offer, market: fallbackMarket, guestEmail: rawGuestEmail };

    let redirectUrl: string;
    try {
      ({ redirectUrl } = await BillingService.placeOrder(
        { id: ensured.id, email: ensured.email, market: fallbackMarket, locale: ensured.locale },
        offer,
        new Date(),
        currentCountry,
      ));
      RateLimitService.hit(`funnel:checkout:order-guest:${offer}:${fallbackMarket}`, {
        limit: 1_000_000,
        windowMs: 365 * 24 * 60 * 60 * 1000,
      }).catch(() => {});
    } catch (error) {
      console.error("[placeOrderAction:guest]", error);
      return {
        status: "error",
        code: String(error).includes("order blocked") ? "blocked" : "failed",
        offer,
        market: fallbackMarket,
        guestEmail: rawGuestEmail,
      };
    }
    redirect(redirectUrl);
  }

  const currentMarket: MarketCode = orderUser.market === "TR" ? "TR" : "DE";
  const currentCountry: PricingCountryCode = accountCountry(orderUser.country, currentMarket);
  const market: PricingCountryCode = isPricingCountry(rawMarket) ? rawMarket : currentCountry;

  if (formData.get("consent") !== "on") return { status: "error", code: "consent_required", offer, market };

  const { allowed } = await RateLimitService.hit(`order:${orderUser.id}`, RATE_LIMITS.order);
  if (!allowed) return { status: "error", code: "failed", offer, market };

  let redirectUrl: string;
  try {
    ({ redirectUrl } = await BillingService.placeOrder(
      { id: orderUser.id, email: orderUser.email, market, locale: orderUser.locale },
      offer,
      new Date(),
      currentCountry,
    ));
    const checkoutSrc = formData.get("source") === "listing-inline" ? "listing-inline" : "order-page";
    RateLimitService.hit(`funnel:checkout:${checkoutSrc}:${offer}:${market}`, {
      limit: 1_000_000,
      windowMs: 365 * 24 * 60 * 60 * 1000,
    }).catch(() => {});
  } catch (error) {
    console.error("[placeOrderAction]", error);
    return { status: "error", code: String(error).includes("order blocked") ? "blocked" : "failed", offer, market };
  }
  redirect(redirectUrl);
}
