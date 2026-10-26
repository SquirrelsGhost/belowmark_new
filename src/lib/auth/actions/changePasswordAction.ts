"use server";

import { redirect } from "next/navigation";
import { limitOrNull, unknownError } from "@/lib/auth/actionHelpers";
import { AUTH_PARAMS, AUTH_ROUTES, RATE_LIMITS } from "@/lib/auth/authConfig";
import { getRequestInfo } from "@/lib/auth/requestInfo";
import { changePasswordSchema, field, toFieldErrors } from "@/lib/auth/validation";
import { AuthService } from "@/services/AuthService";
import { SessionService } from "@/services/SessionService";
import { AuthFormState } from "@/types/auth.types";

/** Server Action: change the password while signed in; other devices are signed out. */
export async function changePasswordAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const user = await SessionService.getCurrentUser();
  if (!user) redirect(AUTH_ROUTES.login);

  const limited = await limitOrNull(`password:user:${user.id}`, RATE_LIMITS.changePassword);
  if (limited) return limited;

  const parsed = changePasswordSchema.safeParse({
    currentPassword: field(formData, "currentPassword"),
    password: field(formData, "password"),
  });
  if (!parsed.success) return toFieldErrors(parsed.error);
  const { currentPassword, password } = parsed.data;
  if (password.toLowerCase().includes(user.email)) return { status: "error", fieldErrors: { password: "password_same_as_email" } };

  const { ip, userAgent } = await getRequestInfo();
  try {
    if (await AuthService.isBreached(password)) return { status: "error", fieldErrors: { password: "password_breached" } };
    const changed = await AuthService.changePassword(user.id, currentPassword, password);
    if (!changed) return { status: "error", fieldErrors: { currentPassword: "password_wrong" } };
    await SessionService.destroyAllForUser(user.id);
    await SessionService.create(user.id, true, userAgent, { ip });
  } catch (error) {
    return unknownError("changePasswordAction", error);
  }

  redirect(`${AUTH_ROUTES.account}?${AUTH_PARAMS.status}=password_changed`);
}
