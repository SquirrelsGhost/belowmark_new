// Needs useActionState, useRef and synced e-mail state for server-side errors, autofill and 1-click OTP
"use client";

import { useActionState, useCallback, useRef } from "react";
import AuthBotShield from "@/components/auth/AuthBotShield";
import AuthCheckbox from "@/components/auth/AuthCheckbox";
import AuthErrorSummary from "@/components/auth/AuthErrorSummary";
import AuthField from "@/components/auth/AuthField";
import AuthSubmit from "@/components/auth/AuthSubmit";
import AuthTextLink from "@/components/auth/AuthTextLink";
import LoginCodeBox from "@/components/auth/LoginCodeBox";
import PasswordField from "@/components/auth/PasswordField";
import ResendVerificationForm from "@/components/auth/ResendVerificationForm";
import VerifyOtpForm from "@/components/auth/VerifyOtpForm";
import { useFocusFirstError } from "@/hooks/useFocusFirstError";
import { useSyncedEmailField } from "@/hooks/useSyncedEmailField";
import { loginAction } from "@/lib/auth/actions/loginAction";
import { AUTH_PARAMS, AUTH_ROUTES } from "@/lib/auth/authConfig";
import { errorMessage } from "@/lib/auth/errorMessage";
import { IAuthTranslation } from "@/translations/auth/IAuthTranslation";
import { INITIAL_AUTH_STATE } from "@/types/auth.types";

interface LoginFormProps {
  t: Pick<IAuthTranslation, "Fields" | "Errors" | "Login">;
  /** Already-sanitised path to return to after sign-in */
  next: string;
  initialEmail?: string;
  preferCode?: boolean;
}

/** Sign-in: e-mail, password, "stay signed in" + passwordless 6-digit code fallback sharing the same e-mail. */
export default function LoginForm({ t, next, initialEmail, preferCode = false }: LoginFormProps) {
  const [state, formAction] = useActionState(loginAction, INITIAL_AUTH_STATE);
  const formRef = useRef<HTMLFormElement>(null);
  useFocusFirstError(formRef, state);
  const { email, setEmail, readLiveEmail } = useSyncedEmailField(formRef, initialEmail, state.values?.email);

  const focusEmailInput = useCallback(() => {
    const el = formRef.current?.elements.namedItem("email");
    if (el instanceof HTMLInputElement) {
      el.focus();
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const fieldError = (name: "email" | "password") => {
    const code = state.fieldErrors?.[name];
    return code ? t.Errors[code] : undefined;
  };

  const trimmedEmail = email.trim();
  const forgotHref = trimmedEmail
    ? `${AUTH_ROUTES.forgotPassword}?email=${encodeURIComponent(trimmedEmail)}`
    : AUTH_ROUTES.forgotPassword;
  const activeEmail = trimmedEmail || state.values?.email || "";

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
          value={email}
          onValueChange={setEmail}
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
          aside={<AuthTextLink href={forgotHref} label={t.Login.Forgot} size="xs" />}
        />
        <AuthCheckbox id="login-remember" name="remember" defaultChecked={state.values?.remember ?? true}>
          {t.Fields.Remember} <span className="text-muted">· {t.Fields.RememberHint}</span>
        </AuthCheckbox>
        <AuthSubmit label={t.Login.Submit} pendingLabel={t.Login.Pending} />
      </form>
      {state.code === "unverified" && activeEmail && (
        <div className="grid gap-3">
          <VerifyOtpForm
            email={activeEmail}
            errors={t.Errors}
            emailLabel={t.Fields.Email}
            emailPlaceholder={t.Fields.EmailPlaceholder}
            next={next}
          />
          <ResendVerificationForm email={activeEmail} label={t.Login.ResendVerification} sentLabel={t.Login.ResendSent} errors={t.Errors} />
        </div>
      )}
      <LoginCodeBox
        fields={t.Fields}
        errors={t.Errors}
        next={next}
        email={email}
        onEmailChange={setEmail}
        readLiveEmail={readLiveEmail}
        focusEmailInput={focusEmailInput}
        defaultOpen={preferCode}
      />
    </div>
  );
}
