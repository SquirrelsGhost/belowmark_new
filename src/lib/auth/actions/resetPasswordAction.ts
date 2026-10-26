"use server";

import { redirect } from "next/navigation";
import { limitOrNull, unknownError } from "@/lib/auth/actionHelpers";
import { AUTH_PARAMS, AUTH_ROUTES, RATE_LIMITS } from "@/lib/auth/authConfig";
import { getRequestInfo } from "@/lib/auth/requestInfo";
import { field, resetSchema, toFieldErrors } from "@/lib/auth/validation";
import { AuthService } from "@/services/AuthService";
import { RateLimitService } from "@/services/RateLimitService";
import { SessionService } from "@/services/SessionService";
import { AuthFormState } from "@/types/auth.types";

/** Server Action: set a new password from a reset link, sign out everywhere, sign in here. */
export async function resetPasswordAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const { ip, userAgent } = await getRequestInfo();

  const ipLimit = await limitOrNull(`token:ip:${ip}`, RATE_LIMITS.tokenIp);
  if (ipLimit) return ipLimit;

  const parsed = resetSchema.safeParse({ token: field(formData, AUTH_PARAMS.token), password: field(formData, "password") });
  if (!parsed.success) return toFieldErrors(parsed.error);

  try {
    if (await AuthService.isBreached(parsed.data.password)) {
      return { status: "error", fieldErrors: { password: "password_breached" } };
    }
    const user = await AuthService.resetPassword(parsed.data.token, parsed.data.password);
    if (!user) return { status: "error", code: "token_invalid" };
    // Whoever reset via the inbox is the owner: lift a guessing pause on the account.
    await RateLimitService.reset(`login:acct:${user.email}`);
    await SessionService.destroyAllForUser(user.id);
    await SessionService.create(user.id, false, userAgent, { ip });
  } catch (error) {
    return unknownError("resetPasswordAction", error);
  }

  redirect(`${AUTH_ROUTES.account}?${AUTH_PARAMS.status}=password_reset`);
}
