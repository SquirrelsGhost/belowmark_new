"use server";

import { redirect } from "next/navigation";
import { limitOrNull, unknownError } from "@/lib/auth/actionHelpers";
import { AUTH_PARAMS, AUTH_ROUTES, RATE_LIMITS } from "@/lib/auth/authConfig";
import { getRequestInfo } from "@/lib/auth/requestInfo";
import { field } from "@/lib/auth/validation";
import { AuthService } from "@/services/AuthService";
import { SessionService } from "@/services/SessionService";
import { AuthFormState } from "@/types/auth.types";

/**
 * Server Action: confirm the e-mail address and sign in.
 * A button press instead of a plain GET, so mail scanners that open every
 * link cannot use the token up before the person clicks it.
 */
export async function verifyEmailAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const { ip, userAgent } = await getRequestInfo();

  const ipLimit = await limitOrNull(`token:ip:${ip}`, RATE_LIMITS.tokenIp);
  if (ipLimit) return ipLimit;

  const token = field(formData, AUTH_PARAMS.token);
  try {
    const userId = token ? await AuthService.verifyEmail(token) : null;
    if (!userId) return { status: "error", code: "token_invalid" };
    await SessionService.create(userId, true, userAgent, { ip });
  } catch (error) {
    return unknownError("verifyEmailAction", error);
  }

  redirect(`${AUTH_ROUTES.account}?${AUTH_PARAMS.status}=verified`);
}
