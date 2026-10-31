import { z } from "zod";
import { EMAIL_MAX_LENGTH, PASSWORD_RULES } from "@/lib/auth/authConfig";
import { isDisposableEmail, normalizeEmail } from "@/lib/auth/normalizeEmail";
import { MIN_PASSWORD_SCORE, scorePassword } from "@/lib/auth/passwordStrength";
import { PRICING_COUNTRIES } from "@/lib/constants";
import { AuthErrorCode, AuthFieldName, AuthFormState } from "@/types/auth.types";

/**
 * Form schemas. Every message is an AuthErrorCode — the form translates it.
 */

const email = z
  .string()
  .transform(normalizeEmail)
  .pipe(
    z
      .string()
      .min(1, "email_required")
      .max(EMAIL_MAX_LENGTH, "email_invalid")
      .pipe(z.email({ message: "email_invalid" })),
  );

const nonDisposableEmail = email.refine((val) => !isDisposableEmail(val), {
  message: "email_disposable",
});

const anyPassword = z.string().min(1, "password_required").max(PASSWORD_RULES.maxLength, "password_long");

const newPassword = z
  .string()
  .min(1, "password_required")
  .min(PASSWORD_RULES.minLength, "password_short")
  .max(PASSWORD_RULES.maxLength, "password_long")
  .refine((value) => scorePassword(value) >= MIN_PASSWORD_SCORE, "password_weak");

/** Rejects passwords that contain the full e-mail address. */
function notEmail<T extends { email: string; password: string }>(schema: z.ZodType<T>) {
  return schema.refine(
    ({ email: mail, password }) => {
      const lower = password.toLowerCase();
      return !lower.includes(mail.toLowerCase());
    },
    { message: "password_same_as_email", path: ["password"] },
  );
}

export const loginSchema = z.object({
  email,
  password: anyPassword,
  remember: z.boolean(),
});

export const signupSchema = notEmail(
  z.object({
    email: nonDisposableEmail,
    password: newPassword,
    market: z.enum(PRICING_COUNTRIES, { message: "market_invalid" }),
    terms: z.literal(true, { message: "terms_required" }),
  }),
);

export const emailOnlySchema = z.object({ email });

export const resetSchema = z.object({
  token: z.string().min(16, "token_invalid").max(128, "token_invalid"),
  password: newPassword,
});

export const changePasswordSchema = z.object({
  currentPassword: anyPassword,
  password: newPassword,
});

const FIELD_NAMES: readonly AuthFieldName[] = ["email", "password", "currentPassword", "terms", "market"];

/** Turns a Zod error into the form state — first problem per field wins. */
export function toFieldErrors(error: z.ZodError, values?: AuthFormState["values"]): AuthFormState {
  const fieldErrors: AuthFormState["fieldErrors"] = {};
  let code: AuthErrorCode | undefined;
  for (const issue of error.issues) {
    const field = issue.path[0];
    const message = issue.message as AuthErrorCode;
    if (typeof field === "string" && (FIELD_NAMES as readonly string[]).includes(field)) {
      fieldErrors[field as AuthFieldName] ??= message;
    } else {
      code ??= message;
    }
  }
  return { status: "error", code, fieldErrors, values };
}

/** Reads a text field from FormData without trusting its type. */
export function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}
