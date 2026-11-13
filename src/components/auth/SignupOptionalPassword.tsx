// Needs useState so users can sign up passwordlessly by default or optionally set a password
"use client";

import { useState } from "react";
import PasswordField from "@/components/auth/PasswordField";
import { IAuthTranslation } from "@/translations/auth/IAuthTranslation";

interface SignupOptionalPasswordProps {
  fields: IAuthTranslation["Fields"];
  error?: string;
  number: string;
}

const COPY = {
  de: {
    fastNote: "Kein Passwort nötig: Sie erhalten sofort einen 6-stelligen Zugangs-Code per E-Mail.",
    showPwd: "+ Optional eigenes Passwort festlegen",
    hidePwd: "Ohne Passwort fortfahren (6-Stellen-Code per E-Mail)",
  },
  tr: {
    fastNote: "Şifre gerekmez: E-postanıza anında 6 haneli tek kullanımlık giriş kodu gönderilir.",
    showPwd: "+ İsteğe bağlı şifre belirle",
    hidePwd: "Şifresiz devam et (E-posta ile 6 haneli kod)",
  },
  en: {
    fastNote: "No password required: we send an instant 6-digit access code to your email.",
    showPwd: "+ Set an optional password",
    hidePwd: "Continue without password (6-digit email code)",
  },
  fr: {
    fastNote: "Aucun mot de passe requis : vous recevez immédiatement un code à 6 chiffres par e-mail.",
    showPwd: "+ Définir un mot de passe (optionnel)",
    hidePwd: "Continuer sans mot de passe (code à 6 chiffres)",
  },
  es: {
    fastNote: "Sin contraseña: te enviamos al instante un código de acceso de 6 dígitos por correo.",
    showPwd: "+ Añadir contraseña opcional",
    hidePwd: "Continuar sin contraseña (código de 6 dígitos)",
  },
  it: {
    fastNote: "Nessuna password richiesta: ricevi subito un codice di accesso a 6 cifre via e-mail.",
    showPwd: "+ Imposta password opzionale",
    hidePwd: "Continua senza password (codice a 6 cifre)",
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

export default function SignupOptionalPassword({ fields, error, number }: SignupOptionalPasswordProps) {
  const [open, setOpen] = useState(Boolean(error));
  const copy = COPY[detectLang(fields.Email)];

  if (!open && !error) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 border border-rule bg-paper px-3 py-2">
        <input type="hidden" name="passwordless" value="1" />
        <span className="font-mono text-[11px] leading-snug text-ink-soft">{copy.fastNote}</span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="font-mono text-[11px] font-semibold text-ink underline underline-offset-4 hover:text-signal"
        >
          {copy.showPwd}
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      <PasswordField
        id="signup-password"
        name="password"
        number={number}
        label={fields.Password}
        autoComplete="new-password"
        fields={fields}
        hint={fields.PasswordHint}
        error={error}
        withStrength
        aside={
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="font-mono text-[11px] font-semibold text-ink-soft underline underline-offset-4 hover:text-signal"
          >
            {copy.hidePwd}
          </button>
        }
      />
    </div>
  );
}
