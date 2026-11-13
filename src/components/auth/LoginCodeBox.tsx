// Needs useState & useActionState for passwordless 6-digit email code sign-in
"use client";

import { useActionState, useState } from "react";
import AuthBotShield from "@/components/auth/AuthBotShield";
import AuthSubmit from "@/components/auth/AuthSubmit";
import VerifyOtpForm from "@/components/auth/VerifyOtpForm";
import { requestLoginCodeAction } from "@/lib/auth/actions/requestLoginCodeAction";
import { errorMessage } from "@/lib/auth/errorMessage";
import { FIELD_INPUT_CLASSES, FIELD_LABEL_CLASSES } from "@/lib/auth/fieldStyles";
import { IAuthTranslation } from "@/translations/auth/IAuthTranslation";
import { INITIAL_AUTH_STATE } from "@/types/auth.types";

interface LoginCodeBoxProps {
  fields: IAuthTranslation["Fields"];
  errors: IAuthTranslation["Errors"];
  next: string;
  initialEmail?: string;
  defaultOpen?: boolean;
}

const COPY = {
  de: {
    toggle: "Ohne Passwort anmelden (6-Stellen-Code per E-Mail) →",
    hide: "Zurück zur Passwort-Anmeldung",
    send: "6-Stellen-Code an E-Mail senden",
    sending: "Code wird gesendet …",
    sentHint: "Falls ein Konto existiert, wurde ein 6-stelliger Zugangs-Code gesendet:",
  },
  tr: {
    toggle: "Şifresiz giriş yap (E-posta ile 6 haneli kod) →",
    hide: "Şifre ile girişe dön",
    send: "6 Haneli Giriş Kodu Gönder",
    sending: "Kod gönderiliyor …",
    sentHint: "Hesap mevcutsa 6 haneli giriş kodu e-posta adresinize gönderildi:",
  },
  en: {
    toggle: "Sign in without password (6-digit email code) →",
    hide: "Back to password sign-in",
    send: "Send 6-digit login code",
    sending: "Sending code …",
    sentHint: "If an account exists, we sent a 6-digit sign-in code to your email:",
  },
  fr: {
    toggle: "Connexion sans mot de passe (code à 6 chiffres) →",
    hide: "Retour au mot de passe",
    send: "Envoyer le code à 6 chiffres",
    sending: "Envoi en cours …",
    sentHint: "Si un compte existe, un code à 6 chiffres vient d'être envoyé :",
  },
  es: {
    toggle: "Entrar sin contraseña (código de 6 dígitos) →",
    hide: "Volver a contraseña",
    send: "Enviar código de 6 dígitos",
    sending: "Enviando código …",
    sentHint: "Si existe una cuenta, hemos enviado un código de 6 dígitos a tu correo:",
  },
  it: {
    toggle: "Accedi senza password (codice a 6 cifre) →",
    hide: "Torna alla password",
    send: "Invia codice a 6 cifre",
    sending: "Invio in corso …",
    sentHint: "Se esiste un account, abbiamo inviato un codice a 6 cifre via e-mail:",
  },
} as const;

function detectLang(emailLabel: string): keyof typeof COPY {
  const low = emailLabel.toLowerCase();
  if (low.includes("posta")) return "tr";
  if (low.includes("correo")) return "es";
  if (low.includes("indirizzo")) return "it";
  if (low.includes("adresse e-mail") || low.includes("courriel")) return "fr";
  if (low.includes("email address") || low.includes("e-mail address")) return "en";
  return "de";
}

export default function LoginCodeBox({ fields, errors, next, initialEmail, defaultOpen = false }: LoginCodeBoxProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [state, action] = useActionState(requestLoginCodeAction, INITIAL_AUTH_STATE);
  const copy = COPY[detectLang(fields.Email)];

  if (!open) {
    return (
      <div className="border-t border-rule pt-4 text-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="font-mono text-xs font-semibold text-ink underline underline-offset-4 hover:text-signal"
        >
          {copy.toggle}
        </button>
      </div>
    );
  }

  if (state.status === "success" && state.values?.email) {
    return (
      <div className="grid gap-3 border-t border-rule pt-4">
        <p className="font-mono text-xs text-ink-soft">{copy.sentHint}</p>
        <VerifyOtpForm
          email={state.values.email}
          errors={errors}
          emailLabel={fields.Email}
          emailPlaceholder={fields.EmailPlaceholder}
          next={next}
        />
      </div>
    );
  }

  const emailErr = state.fieldErrors?.email ? errors[state.fieldErrors.email] : undefined;

  return (
    <div className="grid gap-3 border-t border-rule pt-4">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-signal">OTP · 6-DIGIT CODE</span>
        <button type="button" onClick={() => setOpen(false)} className="font-mono text-[11px] text-ink-soft underline hover:text-ink">
          {copy.hide}
        </button>
      </div>
      <form action={action} className="grid gap-3">
        <AuthBotShield refreshKey={state} />
        <label htmlFor="login-code-email" className={FIELD_LABEL_CLASSES}>{fields.Email}</label>
        <input
          id="login-code-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          defaultValue={state.values?.email ?? initialEmail ?? ""}
          placeholder={fields.EmailPlaceholder}
          className={FIELD_INPUT_CLASSES}
        />
        {(emailErr || state.code) && (
          <p role="alert" className="text-xs font-medium text-signal-deep">
            {emailErr ?? (state.code ? errorMessage(state.code, errors, state.retryAfterMinutes) : "")}
          </p>
        )}
        <AuthSubmit label={copy.send} pendingLabel={copy.sending} variant="signal" />
      </form>
    </div>
  );
}
