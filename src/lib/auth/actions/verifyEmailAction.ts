"use server";

import { redirect } from "next/navigation";
import { limitOrNull, unknownError } from "@/lib/auth/actionHelpers";
import { AUTH_PARAMS, RATE_LIMITS } from "@/lib/auth/authConfig";
import { normalizeEmail } from "@/lib/auth/normalizeEmail";
import { getRequestInfo } from "@/lib/auth/requestInfo";
import { completePostSignupOnboarding } from "@/lib/auth/signupContext";
import { field } from "@/lib/auth/validation";
import { AuthService } from "@/services/AuthService";
import { SessionService } from "@/services/SessionService";
import { AuthFormState } from "@/types/auth.types";

/**
 * Server Action: confirm the e-mail address (via 1-click link token OR 6-digit OTP code),
 * sign in immediately, auto-activate the user's first search alert & watchlist item,
 * and redirect straight to their selected auction proceeding.
 */
export async function verifyEmailAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const { ip, userAgent } = await getRequestInfo();

  const ipLimit = await limitOrNull(`token:ip:${ip}`, RATE_LIMITS.tokenIp);
  if (ipLimit) return ipLimit;

  const token = field(formData, AUTH_PARAMS.token).trim();
  const emailRaw = field(formData, "email").trim();
  const codeRaw = field(formData, "code").trim();
  const targetKey = field(formData, "targetKey").trim().slice(0, 128) || undefined;
  const targetCity = field(formData, "targetCity").trim().slice(0, 80) || undefined;

  let destination = "/app";
  try {
    let userId: string | null = null;
    if (token) {
      userId = await AuthService.verifyEmail(token);
    } else if (emailRaw && codeRaw) {
      userId = await AuthService.verifyEmailByCode(normalizeEmail(emailRaw), codeRaw);
    }
    if (!userId) return { status: "error", code: "token_invalid", values: emailRaw ? { email: emailRaw } : undefined };
    await SessionService.create(userId, true, userAgent, { ip });
    destination = await completePostSignupOnboarding(userId, {
      key: targetKey,
      city: targetCity,
    });
  } catch (error) {
    return unknownError("verifyEmailAction", error);
  }

  redirect(destination);
}
