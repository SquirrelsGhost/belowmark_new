"use server";

import { limitOrNull, mayMail, unknownError } from "@/lib/auth/actionHelpers";
import { RATE_LIMITS } from "@/lib/auth/authConfig";
import { verifyLoginPoW } from "@/lib/auth/loginPow";
import { getRequestInfo } from "@/lib/auth/requestInfo";
import { emailOnlySchema, field, toFieldErrors } from "@/lib/auth/validation";
import { AuthService } from "@/services/AuthService";
import { MailService } from "@/services/MailService";
import { AuthFormState } from "@/types/auth.types";

/**
 * Server Action: sends a 6-digit one-time login code + 1-click sign-in link
 * to an existing account without revealing whether the address is registered.
 */
export async function requestLoginCodeAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const { ip } = await getRequestInfo();
  const rawEmail = field(formData, "email").trim();
  const values = { email: rawEmail };

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

  const parsed = emailOnlySchema.safeParse({ email: rawEmail });
  if (!parsed.success) return toFieldErrors(parsed.error, values);
  const { email } = parsed.data;

  if (!MailService.isAvailable()) return { status: "error", code: "mail_unavailable", values };

  try {
    const hardwareFingerprint = field(formData, "hardwareFingerprint").trim() || undefined;
    if (await AuthService.isHardwareBanned(hardwareFingerprint)) {
      return { status: "error", code: "device_banned", values };
    }
    if (await mayMail(email)) {
      await AuthService.requestLoginCode(email);
    }
  } catch (error) {
    return unknownError("requestLoginCodeAction", error, values);
  }

  return { status: "success", values: { email } };
}
