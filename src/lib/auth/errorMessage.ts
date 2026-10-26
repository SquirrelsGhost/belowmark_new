import { fill } from "@/translations/auth/AuthTranslations";
import { IAuthTranslation } from "@/translations/auth/IAuthTranslation";
import { AuthErrorCode } from "@/types/auth.types";

/** Translated text for an error code, with the wait time appended for rate limits. */
export function errorMessage(code: AuthErrorCode, errors: IAuthTranslation["Errors"], retryAfterMinutes?: number): string {
  const text = errors[code] ?? errors.unknown;
  if (code === "rate_limited" && retryAfterMinutes) return `${text} ${fill(errors.RetryIn, { minutes: retryAfterMinutes })}`;
  return text;
}
