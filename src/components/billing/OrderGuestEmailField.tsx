// Needs client rendering inside OrderForm for AuthBotShield PoW + guest email state
"use client";

import AuthBotShield from "@/components/auth/AuthBotShield";
import { FIELD_INPUT_CLASSES } from "@/lib/auth/fieldStyles";
import { LocaleOption } from "@/lib/constants";

interface OrderGuestEmailFieldProps {
  locale: LocaleOption;
  value: string;
  onChange: (next: string) => void;
  hasError: boolean;
  refreshKey?: unknown;
}

const COPY: Record<
  LocaleOption,
  { legend: string; placeholder: string; hint: string; error: string }
> = {
  de: {
    legend: "Ihre E-Mail-Adresse (Zugang & Rechnung)",
    placeholder: "name@beispiel.de",
    hint: "Kein Passwort vorab nötig — Ihr Vollzugang wird direkt für diese E-Mail-Adresse freigeschaltet.",
    error: "Bitte geben Sie eine gültige E-Mail-Adresse ein (keine Wegwerf-Adresse).",
  },
  tr: {
    legend: "E-posta Adresiniz (Erişim & Fatura)",
    placeholder: "ad@ornek.com",
    hint: "Önceden şifre gerekmez — tam erişiminiz doğrudan bu e-posta adresi için etkinleştirilir.",
    error: "Lütfen geçerli bir e-posta adresi girin.",
  },
  en: {
    legend: "Your Email Address (Account & Receipt)",
    placeholder: "name@example.com",
    hint: "No password required upfront — full access is activated directly for this email address.",
    error: "Please enter a valid email address (no disposable addresses).",
  },
  fr: {
    legend: "Votre adresse e-mail (Accès & Facture)",
    placeholder: "nom@exemple.fr",
    hint: "Aucun mot de passe requis à l'avance — votre accès complet sera activé sur cet e-mail.",
    error: "Veuillez saisir une adresse e-mail valide.",
  },
  es: {
    legend: "Tu correo electrónico (Acceso y Factura)",
    placeholder: "nombre@ejemplo.es",
    hint: "Sin contraseña previa — tu acceso completo se activa directamente en este correo.",
    error: "Introduce una dirección de correo electrónico válida.",
  },
  it: {
    legend: "Il tuo indirizzo e-mail (Accesso e Fattura)",
    placeholder: "nome@esempio.it",
    hint: "Nessuna password richiesta in anticipo — l'accesso completo viene attivato su questa e-mail.",
    error: "Inserisci un indirizzo e-mail valido.",
  },
};

export default function OrderGuestEmailField({
  locale,
  value,
  onChange,
  hasError,
  refreshKey,
}: OrderGuestEmailFieldProps) {
  const c = COPY[locale] ?? COPY.de;
  return (
    <div className="grid min-w-0 gap-2">
      <AuthBotShield refreshKey={refreshKey} />
      <label htmlFor="order-guest-email" className="font-mono text-[11px] font-semibold tracking-[0.14em] text-ink-soft uppercase">
        <span className="text-signal">00</span> {c.legend}
      </label>
      <input
        id="order-guest-email"
        name="guestEmail"
        type="email"
        required
        autoComplete="email"
        inputMode="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={c.placeholder}
        aria-invalid={hasError || undefined}
        className={FIELD_INPUT_CLASSES}
      />
      {hasError ? (
        <p role="alert" className="text-xs font-medium text-signal-deep">{c.error}</p>
      ) : (
        <p className="text-xs leading-relaxed text-muted">{c.hint}</p>
      )}
    </div>
  );
}
