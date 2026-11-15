// Needs useActionState for direct 1-step passwordless signup + inline OTP verification on pSEO hubs
"use client";

import { useActionState } from "react";
import AuthBotShield from "@/components/auth/AuthBotShield";
import AuthNotice from "@/components/auth/AuthNotice";
import AuthSubmit from "@/components/auth/AuthSubmit";
import ResendVerificationForm from "@/components/auth/ResendVerificationForm";
import TermsConsent from "@/components/auth/TermsConsent";
import VerifyOtpForm from "@/components/auth/VerifyOtpForm";
import { signupAction } from "@/lib/auth/actions/signupAction";
import { errorMessage } from "@/lib/auth/errorMessage";
import { PricingCountryCode } from "@/lib/constants";
import { fill } from "@/translations/auth/AuthTranslations";
import { IAuthTranslation } from "@/translations/auth/IAuthTranslation";
import { INITIAL_AUTH_STATE } from "@/types/auth.types";

interface PseoInlineSignupFormProps {
  t: Pick<IAuthTranslation, "Fields" | "Errors" | "Signup">;
  marketCode: PricingCountryCode;
  locationName: string;
  targetKey?: string;
  placeholder: string;
  buttonLabel: string;
}

export default function PseoInlineSignupForm({
  t,
  marketCode,
  locationName,
  targetKey,
  placeholder,
  buttonLabel,
}: PseoInlineSignupFormProps) {
  const [state, formAction] = useActionState(signupAction, INITIAL_AUTH_STATE);

  if (state.status === "success" && state.values?.email) {
    return (
      <div className="w-full lg:max-w-lg">
        <AuthNotice
          stamp={t.Signup.SuccessStamp}
          title={t.Signup.SuccessTitle}
          body={fill(t.Signup.SuccessBody, { email: state.values.email })}
          hint={t.Signup.SuccessHint}
        >
          <div className="grid gap-3">
            <VerifyOtpForm
              email={state.values.email}
              errors={t.Errors}
              emailLabel={t.Fields.Email}
              emailPlaceholder={t.Fields.EmailPlaceholder}
              targetKey={targetKey}
              targetCity={locationName}
            />
            <ResendVerificationForm
              email={state.values.email}
              label={t.Signup.Resend}
              sentLabel={t.Signup.ResendSent}
              errors={t.Errors}
            />
          </div>
        </AuthNotice>
      </div>
    );
  }

  const emailErrCode = state.fieldErrors?.email;
  const termsErrCode = state.fieldErrors?.terms;
  const errText = emailErrCode
    ? t.Errors[emailErrCode]
    : state.code
      ? errorMessage(state.code, t.Errors, state.retryAfterMinutes)
      : null;

  return (
    <form action={formAction} noValidate className="grid w-full gap-2.5 lg:w-auto lg:min-w-[440px]">
      <AuthBotShield refreshKey={state} />
      <input type="hidden" name="market" value={marketCode} />
      <input type="hidden" name="passwordless" value="1" />
      <input type="hidden" name="signupSource" value="hub-inline" />
      <input type="hidden" name="targetCity" value={locationName} />
      {targetKey && <input type="hidden" name="targetKey" value={targetKey} />}

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          inputMode="email"
          defaultValue={state.values?.email}
          placeholder={placeholder}
          aria-label={placeholder}
          aria-invalid={Boolean(errText)}
          className="h-11 flex-1 border-2 border-ink bg-paper px-3.5 font-mono text-xs text-ink placeholder:text-ink-muted focus:border-signal focus:outline-none"
        />
        <div className="shrink-0">
          <AuthSubmit label={buttonLabel} pendingLabel={t.Signup.Pending} variant="signal" />
        </div>
      </div>

      <TermsConsent
        fields={t.Fields}
        defaultChecked={state.values?.terms ?? true}
        error={termsErrCode ? t.Errors[termsErrCode] : undefined}
      />

      {errText && (
        <p role="alert" className="font-mono text-[11px] font-semibold text-signal-deep">
          {errText}
        </p>
      )}
    </form>
  );
}
