// Needs useActionState to verify the 6-digit OTP code and display inline validation feedback
"use client";

import { useActionState } from "react";
import AuthSubmit from "@/components/auth/AuthSubmit";
import { verifyEmailAction } from "@/lib/auth/actions/verifyEmailAction";
import { errorMessage } from "@/lib/auth/errorMessage";
import { FIELD_INPUT_CLASSES, FIELD_LABEL_CLASSES } from "@/lib/auth/fieldStyles";
import { IAuthTranslation } from "@/translations/auth/IAuthTranslation";
import { INITIAL_AUTH_STATE } from "@/types/auth.types";

interface VerifyOtpFormProps {
  /** Pre-filled e-mail address when known (e.g. right after sign-up or login attempt) */
  email?: string;
  errors: IAuthTranslation["Errors"];
  emailLabel: string;
  emailPlaceholder: string;
}

const BOX_CLASSES = "grid gap-3 border border-rule bg-paper-bright p-4";
const CODE_INPUT_CLASSES = `${FIELD_INPUT_CLASSES} tracking-[0.35em] font-bold text-center text-lg`;
const ERROR_CLASSES = "text-xs font-medium text-signal-deep";

const OTP_COPY = {
  de: {
    label: "6-stelliger Bestätigungscode aus der E-Mail",
    placeholder: "000 000",
    submit: "Mit Code bestätigen",
    pending: "Wird geprüft …",
  },
  tr: {
    label: "E-postadaki 6 haneli doğrulama kodu",
    placeholder: "000 000",
    submit: "Kod ile doğrula",
    pending: "Doğrulanıyor …",
  },
} as const;

export default function VerifyOtpForm({ email, errors, emailLabel, emailPlaceholder }: VerifyOtpFormProps) {
  const [state, formAction] = useActionState(verifyEmailAction, INITIAL_AUTH_STATE);
  const isTr = emailLabel.toLowerCase().includes("posta");
  const copy = isTr ? OTP_COPY.tr : OTP_COPY.de;

  return (
    <form action={formAction} className={BOX_CLASSES}>
      {email ? (
        <input type="hidden" name="email" value={email} />
      ) : (
        <div className="grid gap-1.5">
          <label htmlFor="verify-otp-email" className={FIELD_LABEL_CLASSES}>
            {emailLabel}
          </label>
          <input
            id="verify-otp-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder={emailPlaceholder}
            defaultValue={state.values?.email ?? ""}
            className={FIELD_INPUT_CLASSES}
          />
        </div>
      )}
      <div className="grid gap-1.5">
        <label htmlFor="verify-otp-code" className={FIELD_LABEL_CLASSES}>
          {copy.label}
        </label>
        <input
          id="verify-otp-code"
          name="code"
          type="text"
          required
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={7}
          placeholder={copy.placeholder}
          className={CODE_INPUT_CLASSES}
        />
      </div>
      {state.code && (
        <p role="alert" className={ERROR_CLASSES}>
          {errorMessage(state.code, errors, state.retryAfterMinutes)}
        </p>
      )}
      <AuthSubmit label={copy.submit} pendingLabel={copy.pending} variant="signal" />
    </form>
  );
}
