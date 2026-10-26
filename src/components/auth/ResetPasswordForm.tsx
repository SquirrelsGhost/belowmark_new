// Needs useActionState for server-side errors and focus management
"use client";

import { useActionState, useRef } from "react";
import AuthErrorSummary from "@/components/auth/AuthErrorSummary";
import AuthField from "@/components/auth/AuthField";
import AuthNotice from "@/components/auth/AuthNotice";
import AuthSubmit from "@/components/auth/AuthSubmit";
import AuthTextLink from "@/components/auth/AuthTextLink";
import PasswordField from "@/components/auth/PasswordField";
import { useFocusFirstError } from "@/hooks/useFocusFirstError";
import { resetPasswordAction } from "@/lib/auth/actions/resetPasswordAction";
import { AUTH_PARAMS, AUTH_ROUTES } from "@/lib/auth/authConfig";
import { errorMessage } from "@/lib/auth/errorMessage";
import { IAuthTranslation } from "@/translations/auth/IAuthTranslation";
import { INITIAL_AUTH_STATE } from "@/types/auth.types";

interface ResetPasswordFormProps {
  t: Pick<IAuthTranslation, "Fields" | "Errors" | "Reset">;
  token: string;
  /** Account address, shown read-only so password managers file the new password correctly */
  email: string;
}

/** New password from a reset link; on success the server signs in and redirects. */
export default function ResetPasswordForm({ t, token, email }: ResetPasswordFormProps) {
  const [state, formAction] = useActionState(resetPasswordAction, INITIAL_AUTH_STATE);
  const formRef = useRef<HTMLFormElement>(null);
  useFocusFirstError(formRef, state);

  if (state.code === "token_invalid") {
    return (
      <AuthNotice tone="signal" title={t.Reset.InvalidTitle} body={t.Reset.InvalidBody}>
        <AuthTextLink href={AUTH_ROUTES.forgotPassword} label={t.Reset.InvalidAction} />
      </AuthNotice>
    );
  }

  const passwordError = state.fieldErrors?.password;
  return (
    <form ref={formRef} action={formAction} noValidate className="grid gap-5">
      <input type="hidden" name={AUTH_PARAMS.token} value={token} />
      {state.code && <AuthErrorSummary title={t.Errors.SummaryTitle} message={errorMessage(state.code, t.Errors, state.retryAfterMinutes)} />}
      <AuthField id="reset-email" name="username" type="email" number="01" label={t.Fields.Email} autoComplete="username" defaultValue={email} readOnly />
      <PasswordField
        id="reset-password"
        name="password"
        number="02"
        label={t.Fields.NewPassword}
        autoComplete="new-password"
        fields={t.Fields}
        hint={t.Fields.PasswordHint}
        error={passwordError ? t.Errors[passwordError] : undefined}
        withStrength
      />
      <p className="text-sm text-muted">{t.Reset.SessionsNote}</p>
      <AuthSubmit label={t.Reset.Submit} pendingLabel={t.Reset.Pending} />
    </form>
  );
}
