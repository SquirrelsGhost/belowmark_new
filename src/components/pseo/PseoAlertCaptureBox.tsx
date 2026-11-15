import PseoInlineSignupForm from "@/components/pseo/PseoInlineSignupForm";
import { PricingCountryCode } from "@/lib/constants";
import { AuthTranslations } from "@/translations/auth/AuthTranslations";
import { Locale } from "@/translations/Translations";
import { PseoLocale } from "@/types/pseo.types";

interface PseoAlertCaptureBoxProps {
  locale: PseoLocale;
  locationName: string;
  marketCode: PricingCountryCode;
  activeCount: number;
  targetKey?: string;
}

const LOCALE_MAP: Record<PseoLocale, Locale> = {
  de: Locale.DE,
  tr: Locale.TR,
  en: Locale.EN,
  it: Locale.IT,
  es: Locale.ES,
  fr: Locale.FR,
};

const ALERT_COPY: Record<
  PseoLocale,
  {
    badge: string;
    title: (loc: string) => string;
    body: (loc: string, count: number) => string;
    placeholder: string;
    button: string;
  }
> = {
  de: {
    badge: "🎁 1 GRATIS-DOSSIER + KOSTENLOSER E-MAIL-SUCHAUFTRAG",
    title: (loc) => `1 Objekt in ${loc} sofort kostenlos freischalten + täglichen Such-Alert erhalten`,
    body: (loc, count) =>
      `Geben Sie Ihre E-Mail ein (ohne Passwort, ohne Zahlungsmethode): Sie erhalten sofort Ihren 6-stelligen Zugangs-Code, schalten 1 Objekt komplett ungeschwärzt frei (Aktenzeichen, PDF & KI-Analyse) und überwachen ${count} aktive Verfahren in ${loc}.`,
    placeholder: "Ihre E-Mail-Adresse eingeben …",
    button: "Sofort 1 Gratis-Dossier öffnen →",
  },
  tr: {
    badge: "🎁 1 ÜCRETSİZ DOSYA + E-POSTA İHALE ALARMI",
    title: (loc) => `${loc} İçin 1 Ücretsiz Tam Dosya Açın + Günlük İhale Alarmı Kurun`,
    body: (loc, count) =>
      `E-postanızı girin (şifresiz, kartsız): Anında gelen 6 haneli kodla 1 ihale dosyasını sansürsüz açın (esas no, şartname PDF ve yapay zekâ analizi) ve ${loc} bölgesindeki ${count} aktif dosyayı takip edin.`,
    placeholder: "E-posta adresinizi girin …",
    button: "Anında 1 Ücretsiz Dosya Aç →",
  },
  en: {
    badge: "🎁 1 FREE PROPERTY DOSSIER + DAILY EMAIL ALERT",
    title: (loc) => `Unlock 1 Full Property Dossier in ${loc} for Free + Get Daily Alerts`,
    body: (loc, count) =>
      `Enter your email (no password, no card required): receive your instant 6-digit code to unlock 1 full auction dossier (case number, exact address, legal pack PDF & AI analysis) and track ${count} active auction lots in ${loc}.`,
    placeholder: "Enter your email address …",
    button: "Unlock 1 Free Dossier Now →",
  },
  it: {
    badge: "🎁 1 FASCICOLO GRATUITO + AVVISO ASTE VIA EMAIL",
    title: (loc) => `Sblocca 1 Fascicolo Completo Gratis a ${loc} + Ricevi Avvisi Giornalieri`,
    body: (loc, count) =>
      `Inserisci la tua email (senza password, senza carta): ricevi subito il codice a 6 cifre per sbloccare 1 immobile all'asta con R.G.E., perizia PDF e analisi IA e monitorare ${count} procedure attive a ${loc}.`,
    placeholder: "Inserisci la tua email …",
    button: "Sblocca 1 Fascicolo Gratis →",
  },
  es: {
    badge: "🎁 1 EXPEDIENTE GRATIS + ALERTA DE SUBASTAS BOE",
    title: (loc) => `Desbloquee 1 Expediente Completo Gratis en ${loc} + Alerta Diaria BOE`,
    body: (loc, count) =>
      `Introduzca su correo (sin contraseña, sin tarjeta): reciba al instante su código de 6 dígitos para abrir 1 subasta completa (n.º edicto BOE, dirección exacta, PDF oficial e IA) y seguir ${count} expedientes activos en ${loc}.`,
    placeholder: "Introduzca su correo electrónico …",
    button: "Abrir 1 Expediente Gratis →",
  },
  fr: {
    badge: "🎁 1 DOSSIER COMPLET GRATUIT + ALERTE ENCHÈRES",
    title: (loc) => `Débloquez 1 Dossier Complet Gratuit (${loc}) + Alerte Email Quotidienne`,
    body: (loc, count) =>
      `Entrez votre e-mail (sans mot de passe, sans carte) : recevez immédiatement votre code à 6 chiffres pour débloquer 1 bien aux enchères (rôle TJ, adresse exacte, cahier PDF et IA) et suivre ${count} ventes actives (${loc}).`,
    placeholder: "Votre adresse e-mail …",
    button: "Ouvrir 1 Dossier Gratuit →",
  },
};

export default function PseoAlertCaptureBox({
  locale,
  locationName,
  marketCode,
  activeCount,
  targetKey,
}: PseoAlertCaptureBoxProps) {
  const copy = ALERT_COPY[locale] ?? ALERT_COPY.de;
  const authT = AuthTranslations[LOCALE_MAP[locale] ?? Locale.DE];

  return (
    <aside className="mt-8 border-2 border-ink bg-paper-bright p-5 sm:p-6 shadow-[4px_4px_0_0_var(--color-ink)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <span className="inline-block bg-signal px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-paper-bright">
            {copy.badge}
          </span>
          <h2 className="mt-2 font-display text-xl leading-snug text-ink sm:text-2xl">
            {copy.title(locationName)}
          </h2>
          <p className="mt-1 font-serif text-sm leading-relaxed text-ink-soft">
            {copy.body(locationName, activeCount)}
          </p>
        </div>

        <PseoInlineSignupForm
          t={{ Fields: authT.Fields, Errors: authT.Errors, Signup: authT.Signup }}
          marketCode={marketCode}
          locationName={locationName}
          targetKey={targetKey}
          placeholder={copy.placeholder}
          buttonLabel={copy.button}
        />
      </div>
    </aside>
  );
}
