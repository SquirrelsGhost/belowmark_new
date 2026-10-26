// Needs useActionState for server-side errors and the success state
"use client";

import { useActionState, useRef } from "react";
import AuthErrorSummary from "@/components/auth/AuthErrorSummary";
import AuthField from "@/components/auth/AuthField";
import AuthNotice from "@/components/auth/AuthNotice";
import AuthSubmit from "@/components/auth/AuthSubmit";
import { useFocusFirstError } from "@/hooks/useFocusFirstError";
import { forgotPasswordAction } from "@/lib/auth/actions/forgotPasswordAction";
import { errorMessage } from "@/lib/auth/errorMessage";
import { fill } from "@/translations/auth/AuthTranslations";
import { IAuthTranslation } from "@/translations/auth/IAuthTranslation";
import { INITIAL_AUTH_STATE } from "@/types/auth.types";

interface ForgotPasswordFormProps {
  t: Pick<IAuthTranslation, "Fields" | "Errors" | "Forgot">;
}

/** Requests a reset link; the answer is identical for known and unknown addresses. */
export default function ForgotPasswordForm({ t }: ForgotPasswordFormProps) {
  const [state, formAction] = useActionState(forgotPasswordAction, INITIAL_AUTH_STATE);
  const formRef = useRef<HTMLFormElement>(null);
  useFocusFirstError(formRef, state);

  if (state.status === "success" && state.values?.email) {
    return (
      <AuthNotice
        stamp={t.Forgot.SuccessStamp}
        title={t.Forgot.SuccessTitle}
        body={fill(t.Forgot.SuccessBody, { email: state.values.email })}
        hint={t.Forgot.SuccessHint}
      />
    );
  }

  const emailError = state.fieldErrors?.email;
  return (
    <form ref={formRef} action={formAction} noValidate className="grid gap-5">
      {state.code && <AuthErrorSummary title={t.Errors.SummaryTitle} message={errorMessage(state.code, t.Errors, state.retryAfterMinutes)} />}
      <AuthField
        id="forgot-email"
        name="email"
        type="email"
        number="01"
        label={t.Fields.Email}
        placeholder={t.Fields.EmailPlaceholder}
        autoComplete="username"
        inputMode="email"
        defaultValue={state.values?.email}
        error={emailError ? t.Errors[emailError] : undefined}
      />
      <AuthSubmit label={t.Forgot.Submit} pendingLabel={t.Forgot.Pending} />
    </form>
  );
}
