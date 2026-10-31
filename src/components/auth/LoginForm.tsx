// Needs useActionState for server-side errors and focus management
"use client";

import { useActionState, useRef } from "react";
import AuthBotShield from "@/components/auth/AuthBotShield";
import AuthCheckbox from "@/components/auth/AuthCheckbox";
import AuthErrorSummary from "@/components/auth/AuthErrorSummary";
import AuthField from "@/components/auth/AuthField";
import AuthSubmit from "@/components/auth/AuthSubmit";
import AuthTextLink from "@/components/auth/AuthTextLink";
import PasswordField from "@/components/auth/PasswordField";
import ResendVerificationForm from "@/components/auth/ResendVerificationForm";
import VerifyOtpForm from "@/components/auth/VerifyOtpForm";
import { useFocusFirstError } from "@/hooks/useFocusFirstError";
import { loginAction } from "@/lib/auth/actions/loginAction";
import { AUTH_PARAMS, AUTH_ROUTES } from "@/lib/auth/authConfig";
import { errorMessage } from "@/lib/auth/errorMessage";
import { IAuthTranslation } from "@/translations/auth/IAuthTranslation";
import { INITIAL_AUTH_STATE } from "@/types/auth.types";

interface LoginFormProps {
  t: Pick<IAuthTranslation, "Fields" | "Errors" | "Login">;
  /** Already-sanitised path to return to after sign-in */
  next: string;
}

/** Sign-in: e-mail, password, "stay signed in". Works without JavaScript, too. */
export default function LoginForm({ t, next }: LoginFormProps) {
  const [state, formAction] = useActionState(loginAction, INITIAL_AUTH_STATE);
  const formRef = useRef<HTMLFormElement>(null);
  useFocusFirstError(formRef, state);

  const fieldError = (name: "email" | "password") => {
    const code = state.fieldErrors?.[name];
    return code ? t.Errors[code] : undefined;
  };

  return (
    <div className="grid gap-5">
      <form ref={formRef} action={formAction} noValidate className="grid gap-5">
        <input type="hidden" name={AUTH_PARAMS.next} value={next} />
        <AuthBotShield refreshKey={state} />
        {state.code && <AuthErrorSummary title={t.Errors.SummaryTitle} message={errorMessage(state.code, t.Errors, state.retryAfterMinutes)} />}
        <AuthField
          id="login-email"
          name="email"
          type="email"
          number="01"
          label={t.Fields.Email}
          placeholder={t.Fields.EmailPlaceholder}
          autoComplete="username"
          inputMode="email"
          defaultValue={state.values?.email}
          error={fieldError("email")}
        />
        <PasswordField
          id="login-password"
          name="password"
          number="02"
          label={t.Fields.Password}
          autoComplete="current-password"
          fields={t.Fields}
          error={fieldError("password")}
          aside={<AuthTextLink href={AUTH_ROUTES.forgotPassword} label={t.Login.Forgot} size="xs" />}
        />
        <AuthCheckbox id="login-remember" name="remember" defaultChecked={state.values?.remember ?? true}>
          {t.Fields.Remember} <span className="text-muted">· {t.Fields.RememberHint}</span>
        </AuthCheckbox>
        <AuthSubmit label={t.Login.Submit} pendingLabel={t.Login.Pending} />
      </form>
      {state.code === "unverified" && state.values?.email && (
        <div className="grid gap-3">
          <VerifyOtpForm
            email={state.values.email}
            errors={t.Errors}
            emailLabel={t.Fields.Email}
            emailPlaceholder={t.Fields.EmailPlaceholder}
          />
          <ResendVerificationForm email={state.values.email} label={t.Login.ResendVerification} sentLabel={t.Login.ResendSent} errors={t.Errors} />
        </div>
      )}
    </div>
  );
}
