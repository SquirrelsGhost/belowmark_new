import { PricingCountryCode, ROUTES } from "@/lib/constants";
import { PseoLocale } from "@/types/pseo.types";

interface PseoAlertCaptureBoxProps {
  locale: PseoLocale;
  locationName: string;
  marketCode: PricingCountryCode;
  activeCount: number;
}

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
      `Schalten Sie nach E-Mail-Bestätigung 1 beliebiges Objekt komplett ungeschwärzt (Aktenzeichen, PDF & KI-Analyse, ohne Zahlungsmethode) frei und verpassen Sie keinen neuen Termin in ${loc} (${count} aktive Verfahren).`,
    placeholder: "Ihre E-Mail-Adresse eingeben …",
    button: "1 Gratis-Dossier + Alert sichern →",
  },
  tr: {
    badge: "🎁 1 ÜCRETSİZ DOSYA + E-POSTA İHALE ALARMI",
    title: (loc) => `${loc} İçin 1 Ücretsiz Tam Dosya Açın + Günlük İhale Alarmı Kurun`,
    body: (loc, count) =>
      `E-postanızı doğrulayarak seçtiğiniz 1 ihale dosyasını kartsız/ücretsiz sansürsüz açın (esas no, şartname PDF ve yapay zekâ analizi) ve ${loc} bölgesindeki ${count} aktif dosyayı takip edin.`,
    placeholder: "E-posta adresinizi girin …",
    button: "1 Ücretsiz Dosya + Alarm Kur →",
  },
  en: {
    badge: "🎁 1 FREE PROPERTY DOSSIER + DAILY EMAIL ALERT",
    title: (loc) => `Unlock 1 Full Property Dossier in ${loc} for Free + Get Daily Alerts`,
    body: (loc, count) =>
      `Verify your email (no card required) to unlock 1 full auction dossier of your choice (case number, exact address, legal pack PDF & AI analysis) and track ${count} active auction lots in ${loc}.`,
    placeholder: "Enter your email address …",
    button: "Claim 1 Free Dossier + Alert →",
  },
  it: {
    badge: "🎁 1 FASCICOLO GRATUITO + AVVISO ASTE VIA EMAIL",
    title: (loc) => `Sblocca 1 Fascicolo Completo Gratis a ${loc} + Ricevi Avvisi Giornalieri`,
    body: (loc, count) =>
      `Conferma la tua email (senza carta) per sbloccare 1 immobile all'asta a tua scelta con numero R.G.E., perizia PDF e analisi IA e monitorare ${count} procedure attive a ${loc}.`,
    placeholder: "Inserisci la tua email …",
    button: "1 Fascicolo Gratis + Avviso →",
  },
  es: {
    badge: "🎁 1 EXPEDIENTE GRATIS + ALERTA DE SUBASTAS BOE",
    title: (loc) => `Desbloquee 1 Expediente Completo Gratis en ${loc} + Alerta Diaria BOE`,
    body: (loc, count) =>
      `Verifique su correo (sin tarjeta) para abrir 1 subasta completa de su elección (n.º edicto BOE, dirección exacta, PDF oficial e IA) y seguir ${count} expedientes activos en ${loc}.`,
    placeholder: "Introduzca su correo electrónico …",
    button: "1 Expediente Gratis + Alerta →",
  },
  fr: {
    badge: "🎁 1 DOSSIER COMPLET GRATUIT + ALERTE ENCHÈRES",
    title: (loc) => `Débloquez 1 Dossier Complet Gratuit (${loc}) + Alerte Email Quotidienne`,
    body: (loc, count) =>
      `Confirmez votre e-mail (sans carte bancaire) pour débloquer intégralement 1 bien aux enchères de votre choix (rôle TJ, adresse exacte, cahier PDF et IA) et suivre ${count} ventes actives (${loc}).`,
    placeholder: "Votre adresse e-mail …",
    button: "1 Dossier Gratuit + Alerte →",
  },
};

export default function PseoAlertCaptureBox({
  locale,
  locationName,
  marketCode,
  activeCount,
}: PseoAlertCaptureBoxProps) {
  const copy = ALERT_COPY[locale] ?? ALERT_COPY.de;

  return (
    <aside className="mt-8 border-2 border-ink bg-paper-bright p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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

        <form action={ROUTES.signup} method="GET" className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto lg:min-w-[410px]">
          <input type="hidden" name="markt" value={marketCode} />
          <input type="hidden" name="stadt" value={locationName} />
          <input type="hidden" name="alert" value="1" />
          <input
            type="email"
            name="email"
            required
            placeholder={copy.placeholder}
            aria-label={copy.placeholder}
            className="h-11 flex-1 border-2 border-ink bg-paper px-3.5 font-mono text-xs text-ink placeholder:text-ink-muted focus:border-signal focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex h-11 shrink-0 cursor-pointer items-center justify-center border-2 border-signal bg-signal px-4 font-narrow text-xs font-semibold uppercase tracking-wider text-paper-bright transition-colors hover:bg-signal-deep"
          >
            {copy.button}
          </button>
        </form>
      </div>
    </aside>
  );
}
