"use server";

import { redirect } from "next/navigation";
import { limitOrNull, unknownError } from "@/lib/auth/actionHelpers";
import { AUTH_PARAMS, RATE_LIMITS } from "@/lib/auth/authConfig";
import { verifyLoginPoW } from "@/lib/auth/loginPow";
import { getRequestInfo } from "@/lib/auth/requestInfo";
import { safeRedirect } from "@/lib/auth/safeRedirect";
import { field, loginSchema, toFieldErrors } from "@/lib/auth/validation";
import { AuthService } from "@/services/AuthService";
import { RateLimitService } from "@/services/RateLimitService";
import { SessionService } from "@/services/SessionService";
import { AuthFormState } from "@/types/auth.types";

/**
 * Server Action: sign in.
 * Protected by Micro-Proof-of-Work (`verifyLoginPoW`) + Honeypot before scrypt,
 * hardware fingerprint check, and persistent exponential backoff per IP and e-mail.
 */
export async function loginAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const { ip, userAgent } = await getRequestInfo();
  const values = { email: field(formData, "email").trim(), remember: formData.get("remember") === "on" };

  // 1. Browser Micro-PoW + Honeypot check before any database or scrypt work
  const powCheck = verifyLoginPoW({
    honeypot: formData.get("honeypot"),
    powTs: formData.get("powTs"),
    powNonce: formData.get("powNonce"),
  });
  if (!powCheck.ok) {
    return { status: "error", code: powCheck.reason, values };
  }

  const ipLimit = await limitOrNull(`login:ip:${ip}`, RATE_LIMITS.loginIp, values);
  if (ipLimit) return ipLimit;

  const parsed = loginSchema.safeParse({
    email: field(formData, "email"),
    password: field(formData, "password"),
    remember: formData.get("remember") === "on",
  });
  if (!parsed.success) return toFieldErrors(parsed.error, values);
  const { email, password, remember } = parsed.data;
  const hardwareFingerprint = field(formData, "hardwareFingerprint").trim() || undefined;

  const ipBackoffKey = `login:backoff:ip:${ip}`;
  const accountKey = `login:acct:${email}`;
  try {
    const [ipBackoff, accountBackoff] = await Promise.all([
      RateLimitService.checkBackoff(ipBackoffKey),
      RateLimitService.checkBackoff(accountKey),
    ]);
    if (!ipBackoff.allowed || !accountBackoff.allowed) {
      const retryAfterMinutes = Math.max(ipBackoff.retryAfterMinutes, accountBackoff.retryAfterMinutes);
      return { status: "error", code: "rate_limited", retryAfterMinutes, values };
    }

    const result = await AuthService.login(email, password, hardwareFingerprint);
    if (!result.ok) {
      if (result.reason === "invalid_credentials") {
        await Promise.all([
          RateLimitService.recordFailure(ipBackoffKey),
          RateLimitService.recordFailure(accountKey),
        ]);
      }
      return { status: "error", code: result.reason, values: { ...values, email } };
    }
    await Promise.all([RateLimitService.reset(ipBackoffKey), RateLimitService.reset(accountKey)]);
    await SessionService.create(result.userId, remember, userAgent, { ip, hardwareFingerprint });
  } catch (error) {
    return unknownError("loginAction", error, values);
  }

  redirect(safeRedirect(formData.get(AUTH_PARAMS.next)));
}
