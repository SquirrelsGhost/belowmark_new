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
  targetKey?: string;
  targetCity?: string;
}

const BOX_CLASSES = "grid gap-3 border border-rule bg-paper-bright p-4";
const CODE_INPUT_CLASSES = `${FIELD_INPUT_CLASSES} tracking-[0.35em] font-bold text-center text-lg`;
const ERROR_CLASSES = "text-xs font-medium text-signal-deep";

const OTP_COPY = {
  de: {
    label: "6-stelliger Bestätigungscode aus der E-Mail",
    placeholder: "000 000",
    submit: "Mit Code bestätigen & Dossier öffnen",
    pending: "Wird geprüft …",
  },
  tr: {
    label: "E-postadaki 6 haneli doğrulama kodu",
    placeholder: "000 000",
    submit: "Kod ile doğrula ve dosyayı aç",
    pending: "Doğrulanıyor …",
  },
  en: {
    label: "6-digit verification code from your email",
    placeholder: "000 000",
    submit: "Confirm code & unlock dossier",
    pending: "Verifying …",
  },
  fr: {
    label: "Code de vérification à 6 chiffres reçu par e-mail",
    placeholder: "000 000",
    submit: "Valider le code & ouvrir le dossier",
    pending: "Vérification …",
  },
  es: {
    label: "Código de 6 dígitos enviado a tu correo",
    placeholder: "000 000",
    submit: "Confirmar código y abrir expediente",
    pending: "Verificando …",
  },
  it: {
    label: "Codice di verifica a 6 cifre ricevuto via e-mail",
    placeholder: "000 000",
    submit: "Conferma codice e apri fascicolo",
    pending: "Verifica in corso …",
  },
} as const;

function detectOtpLang(emailLabel: string): keyof typeof OTP_COPY {
  const low = emailLabel.toLowerCase();
  if (low.includes("posta")) return "tr";
  if (low.includes("correo")) return "es";
  if (low.includes("indirizzo")) return "it";
  if (low.includes("adresse e-mail") || low.includes("courriel")) return "fr";
  if (low.includes("email address") || low.includes("e-mail address")) return "en";
  return "de";
}

export default function VerifyOtpForm({
  email,
  errors,
  emailLabel,
  emailPlaceholder,
  targetKey,
  targetCity,
}: VerifyOtpFormProps) {
  const [state, formAction] = useActionState(verifyEmailAction, INITIAL_AUTH_STATE);
  const copy = OTP_COPY[detectOtpLang(emailLabel)];

  return (
    <form action={formAction} className={BOX_CLASSES}>
      {targetKey && <input type="hidden" name="targetKey" value={targetKey} />}
      {targetCity && <input type="hidden" name="targetCity" value={targetCity} />}
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
