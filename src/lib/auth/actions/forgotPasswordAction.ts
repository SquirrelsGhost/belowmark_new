"use server";

import { limitOrNull, mayMail, unknownError } from "@/lib/auth/actionHelpers";
import { RATE_LIMITS } from "@/lib/auth/authConfig";
import { getRequestInfo } from "@/lib/auth/requestInfo";
import { emailOnlySchema, field, toFieldErrors } from "@/lib/auth/validation";
import { AuthService } from "@/services/AuthService";
import { MailService } from "@/services/MailService";
import { AuthFormState } from "@/types/auth.types";

/**
 * Server Action: request a reset link.
 * The answer never says whether the address has an account.
 */
export async function forgotPasswordAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const { ip } = await getRequestInfo();
  const values = { email: field(formData, "email").trim() };

  const ipLimit = await limitOrNull(`mail:ip:${ip}`, RATE_LIMITS.mailIp, values);
  if (ipLimit) return ipLimit;

  const parsed = emailOnlySchema.safeParse({ email: field(formData, "email") });
  if (!parsed.success) return toFieldErrors(parsed.error, values);
  if (!MailService.isAvailable()) return { status: "error", code: "mail_unavailable", values };

  try {
    if (await mayMail(parsed.data.email)) await AuthService.requestPasswordReset(parsed.data.email);
  } catch (error) {
    return unknownError("forgotPasswordAction", error, values);
  }
  return { status: "success", values: { email: parsed.data.email } };
}
