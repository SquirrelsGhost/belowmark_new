// Needs useActionState for server-side errors and the success state
"use client";

import { useActionState, useRef } from "react";
import AuthBotShield from "@/components/auth/AuthBotShield";
import AuthErrorSummary from "@/components/auth/AuthErrorSummary";
import AuthField from "@/components/auth/AuthField";
import AuthNotice from "@/components/auth/AuthNotice";
import AuthSubmit from "@/components/auth/AuthSubmit";
import MarketPicker from "@/components/auth/MarketPicker";
import ResendVerificationForm from "@/components/auth/ResendVerificationForm";
import SignupOptionalPassword from "@/components/auth/SignupOptionalPassword";
import TermsConsent from "@/components/auth/TermsConsent";
import VerifyOtpForm from "@/components/auth/VerifyOtpForm";
import { useFocusFirstError } from "@/hooks/useFocusFirstError";
import { signupAction } from "@/lib/auth/actions/signupAction";
import { errorMessage } from "@/lib/auth/errorMessage";
import { isPricingCountry, PRICING_COUNTRIES, PricingCountryCode } from "@/lib/constants";
import { fill } from "@/translations/auth/AuthTranslations";
import { IAuthTranslation } from "@/translations/auth/IAuthTranslation";
import { AuthFieldName, INITIAL_AUTH_STATE } from "@/types/auth.types";

interface SignupFormProps {
  t: Pick<IAuthTranslation, "Fields" | "Errors" | "Signup">;
  /** Pre-selected from the visitor's region or pricing choice */
  defaultMarket: PricingCountryCode;
  initialEmail?: string;
  targetKey?: string;
  targetCity?: string;
  /** Hides the country selector when embedded inside a specific country's listing dossier */
  hideMarketPicker?: boolean;
}

/** Sign-up: 1-field passwordless quick entry (with optional password) -> 6-digit OTP / 1-click link. */
export default function SignupForm({
  t,
  defaultMarket,
  initialEmail,
  targetKey,
  targetCity,
  hideMarketPicker = false,
}: SignupFormProps) {
  const [state, formAction] = useActionState(signupAction, INITIAL_AUTH_STATE);
  const formRef = useRef<HTMLFormElement>(null);
  useFocusFirstError(formRef, state);

  if (state.status === "success" && state.values?.email) {
    return (
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
            targetCity={targetCity}
          />
          <ResendVerificationForm email={state.values.email} label={t.Signup.Resend} sentLabel={t.Signup.ResendSent} errors={t.Errors} />
        </div>
      </AuthNotice>
    );
  }

  const fieldError = (name: AuthFieldName) => {
    const code = state.fieldErrors?.[name];
    return code ? t.Errors[code] : undefined;
  };
  const rawMarket = state.values?.market;
  const market: PricingCountryCode = isPricingCountry(rawMarket) ? rawMarket : defaultMarket;

  return (
    <form ref={formRef} action={formAction} noValidate className="grid min-w-0 gap-4">
      <AuthBotShield refreshKey={state} />
      {targetKey && <input type="hidden" name="targetKey" value={targetKey} />}
      {targetCity && <input type="hidden" name="targetCity" value={targetCity} />}
      {state.code && <AuthErrorSummary title={t.Errors.SummaryTitle} message={errorMessage(state.code, t.Errors, state.retryAfterMinutes)} />}
      <AuthField
        id="signup-email"
        name="email"
        type="email"
        number="01"
        label={t.Fields.Email}
        placeholder={t.Fields.EmailPlaceholder}
        autoComplete="email"
        inputMode="email"
        defaultValue={state.values?.email ?? initialEmail}
        error={fieldError("email")}
      />
      {hideMarketPicker && !fieldError("market") ? (
        <input type="hidden" name="market" value={market} />
      ) : (
        <MarketPicker
          number="02"
          legend={t.Fields.Market}
          note={t.Fields.MarketNote}
          defaultValue={market}
          error={fieldError("market")}
          compactInitial={true}
          options={PRICING_COUNTRIES.map((code) => ({
            code,
            label: t.Fields.Markets[code].Label,
            hint: t.Fields.Markets[code].Hint,
          }))}
        />
      )}
      <SignupOptionalPassword fields={t.Fields} error={fieldError("password")} number={hideMarketPicker ? "02" : "03"} />
      <TermsConsent fields={t.Fields} defaultChecked={state.values?.terms ?? true} error={fieldError("terms")} />
      <AuthSubmit label={t.Signup.Submit} pendingLabel={t.Signup.Pending} variant="signal" />
    </form>
  );
}
