// Needs useActionState for server-side errors and the success state
"use client";

import { useActionState, useRef } from "react";
import AuthBotShield from "@/components/auth/AuthBotShield";
import AuthErrorSummary from "@/components/auth/AuthErrorSummary";
import AuthField from "@/components/auth/AuthField";
import AuthNotice from "@/components/auth/AuthNotice";
import AuthSubmit from "@/components/auth/AuthSubmit";
import MarketPicker from "@/components/auth/MarketPicker";
import PasswordField from "@/components/auth/PasswordField";
import ResendVerificationForm from "@/components/auth/ResendVerificationForm";
import TermsConsent from "@/components/auth/TermsConsent";
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
}

/** Sign-up: e-mail, password, market, consent — then "check your inbox". */
export default function SignupForm({ t, defaultMarket }: SignupFormProps) {
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
        <ResendVerificationForm email={state.values.email} label={t.Signup.Resend} sentLabel={t.Signup.ResendSent} errors={t.Errors} />
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
    <form ref={formRef} action={formAction} noValidate className="grid min-w-0 gap-5">
      <AuthBotShield refreshKey={state} />
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
        defaultValue={state.values?.email}
        error={fieldError("email")}
      />
      <PasswordField
        id="signup-password"
        name="password"
        number="02"
        label={t.Fields.Password}
        autoComplete="new-password"
        fields={t.Fields}
        hint={t.Fields.PasswordHint}
        error={fieldError("password")}
        withStrength
      />
      <MarketPicker
        number="03"
        legend={t.Fields.Market}
        note={t.Fields.MarketNote}
        defaultValue={market}
        error={fieldError("market")}
        options={PRICING_COUNTRIES.map((code) => ({
          code,
          label: t.Fields.Markets[code].Label,
          hint: t.Fields.Markets[code].Hint,
        }))}
      />
      <TermsConsent fields={t.Fields} defaultChecked={state.values?.terms} error={fieldError("terms")} />
      <AuthSubmit label={t.Signup.Submit} pendingLabel={t.Signup.Pending} variant="signal" />
    </form>
  );
}
