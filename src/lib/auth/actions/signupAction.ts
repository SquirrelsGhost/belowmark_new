"use server";

import { cookies } from "next/headers";
import { limitOrNull, mayMail, requestLocale, unknownError } from "@/lib/auth/actionHelpers";
import { RATE_LIMITS } from "@/lib/auth/authConfig";
import { verifyLoginPoW } from "@/lib/auth/loginPow";
import { getRequestInfo } from "@/lib/auth/requestInfo";
import { saveSignupContextCookie } from "@/lib/auth/signupContext";
import { field, signupSchema, toFieldErrors } from "@/lib/auth/validation";
import { MARKET_COOKIE_NAME, pricingCountryToMarket, REGION_COOKIE_MAX_AGE } from "@/lib/constants";
import { AuthService } from "@/services/AuthService";
import { MailService } from "@/services/MailService";
import { RateLimitService } from "@/services/RateLimitService";
import { AuthFormState } from "@/types/auth.types";

const FUNNEL_YEAR = { limit: 1_000_000, windowMs: 365 * 24 * 60 * 60 * 1000 } as const;

/**
 * Server Action: create an account.
 * Hardened with Browser Micro-PoW + Honeypot, canonical e-mail normalization,
 * disposable e-mail block, and hardware fingerprint ban check (`HW-...`).
 */
export async function signupAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const { ip } = await getRequestInfo();
  const values = { email: field(formData, "email").trim(), market: field(formData, "market"), terms: formData.get("terms") === "on" };

  // 1. Browser Micro-PoW + Honeypot check before any database or scrypt work
  const powCheck = verifyLoginPoW({
    honeypot: formData.get("honeypot"),
    powTs: formData.get("powTs"),
    powNonce: formData.get("powNonce"),
  });
  if (!powCheck.ok) {
    return { status: "error", code: powCheck.reason, values };
  }

  const ipLimit = await limitOrNull(`signup:ip:${ip}`, RATE_LIMITS.signupIp, values);
  if (ipLimit) return ipLimit;

  const parsed = signupSchema.safeParse({
    email: field(formData, "email"),
    password: field(formData, "password"),
    market: field(formData, "market"),
    terms: formData.get("terms") === "on",
  });
  if (!parsed.success) return toFieldErrors(parsed.error, values);
  const { email, password, market } = parsed.data;
  const hardwareFingerprint = field(formData, "hardwareFingerprint").trim() || undefined;
  const targetKey = field(formData, "targetKey").trim().slice(0, 128) || undefined;
  const targetCity = field(formData, "targetCity").trim().slice(0, 80) || undefined;

  if (!MailService.isAvailable()) return { status: "error", code: "mail_unavailable", values };

  try {
    if (await AuthService.isHardwareBanned(hardwareFingerprint)) {
      return { status: "error", code: "device_banned", values };
    }
    if (await AuthService.isBreached(password)) {
      return { status: "error", fieldErrors: { password: "password_breached" }, values };
    }
    const canMail = await mayMail(email);
    await AuthService.signup(
      {
        email,
        password,
        market: pricingCountryToMarket(market),
        country: market,
        locale: await requestLocale(),
        hardwareFingerprint,
        signupCtx: { key: targetKey, city: targetCity, market },
      },
      canMail,
    );
    const cookieStore = await cookies();
    cookieStore.set(MARKET_COOKIE_NAME, market, { path: "/", maxAge: REGION_COOKIE_MAX_AGE, sameSite: "lax" });
    await saveSignupContextCookie({ key: targetKey, city: targetCity, market });
    const srcKind = targetKey ? "dossier-inline" : "direct";
    RateLimitService.hit(`funnel:signup:${srcKind}:${market}`, FUNNEL_YEAR).catch(() => {});
  } catch (error) {
    return unknownError("signupAction", error, values);
  }
  return { status: "success", values: { email, market } };
}
