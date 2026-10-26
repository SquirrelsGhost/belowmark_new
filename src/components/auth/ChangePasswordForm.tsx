// Needs useActionState for server-side errors and focus management
"use client";

import { useActionState, useRef } from "react";
import AuthErrorSummary from "@/components/auth/AuthErrorSummary";
import AuthSubmit from "@/components/auth/AuthSubmit";
import PasswordField from "@/components/auth/PasswordField";
import { useFocusFirstError } from "@/hooks/useFocusFirstError";
import { changePasswordAction } from "@/lib/auth/actions/changePasswordAction";
import { errorMessage } from "@/lib/auth/errorMessage";
import { IAuthTranslation } from "@/translations/auth/IAuthTranslation";
import { INITIAL_AUTH_STATE } from "@/types/auth.types";

interface ChangePasswordFormProps {
  t: Pick<IAuthTranslation, "Fields" | "Errors">;
  labels: IAuthTranslation["Account"]["Password"];
  /** For password managers (hidden username field) */
  email: string;
}

/** Current + new password; other devices are signed out on success. */
export default function ChangePasswordForm({ t, labels, email }: ChangePasswordFormProps) {
  const [state, formAction] = useActionState(changePasswordAction, INITIAL_AUTH_STATE);
  const formRef = useRef<HTMLFormElement>(null);
  useFocusFirstError(formRef, state);

  const fieldError = (name: "currentPassword" | "password") => {
    const code = state.fieldErrors?.[name];
    return code ? t.Errors[code] : undefined;
  };

  return (
    <form ref={formRef} action={formAction} noValidate className="grid gap-5">
      <input type="email" name="username" autoComplete="username" value={email} readOnly hidden />
      {state.code && <AuthErrorSummary title={t.Errors.SummaryTitle} message={errorMessage(state.code, t.Errors, state.retryAfterMinutes)} />}
      <PasswordField
        id="change-current"
        name="currentPassword"
        number="01"
        label={t.Fields.CurrentPassword}
        autoComplete="current-password"
        fields={t.Fields}
        error={fieldError("currentPassword")}
      />
      <PasswordField
        id="change-new"
        name="password"
        number="02"
        label={t.Fields.NewPassword}
        autoComplete="new-password"
        fields={t.Fields}
        hint={t.Fields.PasswordHint}
        error={fieldError("password")}
        withStrength
      />
      <AuthSubmit label={labels.Submit} pendingLabel={labels.Pending} />
    </form>
  );
}
