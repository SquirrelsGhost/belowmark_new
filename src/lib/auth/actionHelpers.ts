import "server-only";
import { RateLimitRule, RATE_LIMITS } from "@/lib/auth/authConfig";
import { RateLimitService } from "@/services/RateLimitService";
import { TranslationService } from "@/services/TranslationService";
import { AuthFormState } from "@/types/auth.types";

/** Counts a hit and returns a ready-made error state when the limit is reached. */
export async function limitOrNull(key: string, rule: RateLimitRule, values?: AuthFormState["values"]): Promise<AuthFormState | null> {
  const { allowed, retryAfterMinutes } = await RateLimitService.hit(key, rule);
  return allowed ? null : { status: "error", code: "rate_limited", retryAfterMinutes, values };
}

/**
 * Per-address mail cap. Returns false when exceeded — callers then skip the
 * mail but answer exactly as if it was sent, so the cap leaks nothing.
 */
export async function mayMail(email: string): Promise<boolean> {
  const { allowed } = await RateLimitService.hit(`mail:addr:${email}`, RATE_LIMITS.mailAccount);
  return allowed;
}

/** Lower-case UI locale of this request ("de" | "tr"), stored for e-mails. */
export async function requestLocale(): Promise<string> {
  return TranslationService.ToLocaleOption(await TranslationService.GetUserLocale());
}

export function unknownError(scope: string, error: unknown, values?: AuthFormState["values"]): AuthFormState {
  console.error(`[${scope}]`, error);
  return { status: "error", code: "unknown", values };
}
