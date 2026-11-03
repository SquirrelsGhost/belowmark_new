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
    badge: "🔔 KOSTENLOSER E-MAIL-SUCHAUFTRAG",
    title: (loc) => `Neue Zwangsversteigerungen in ${loc} sofort per E-Mail erhalten`,
    body: (loc, count) =>
      `Verpassen Sie keinen neuen Termin und keinen Wegfall der 5/10- & 7/10-Grenzen in ${loc} (${count} aktive Verfahren). Wir benachrichtigen Sie automatisch um 06:15 Uhr bei neuen gerichtlichen Bekanntmachungen.`,
    placeholder: "Ihre E-Mail-Adresse eingeben …",
    button: "Such-Alert kostenlos aktivieren →",
  },
  tr: {
    badge: "🔔 ÜCRETSİZ E-POSTA İHALE ALARMI",
    title: (loc) => `${loc} Yeni İcra & E-İhale İlanlarını E-Postayla Alın`,
    body: (loc, count) =>
      `${loc} bölgesindeki ${count} aktif dosya ve yeni eklenen UYAP E-Satış %50 açılışlı gayrimenkul ihaleleri için günlük otomatik e-posta bildirimi kurun.`,
    placeholder: "E-posta adresinizi girin …",
    button: "Ücretsiz İhale Alarmı Kur →",
  },
  en: {
    badge: "🔔 FREE AUCTION EMAIL ALERT",
    title: (loc) => `Get New Below-Market Property Auctions in ${loc} by Email`,
    body: (loc, count) =>
      `Track ${count} active auction lots in ${loc}. Receive automatic daily email alerts whenever new repossession lots, guide price reductions, or auction dates are published.`,
    placeholder: "Enter your email address …",
    button: "Activate Free Alert →",
  },
  it: {
    badge: "🔔 AVVISO ASTE GRATUITO VIA EMAIL",
    title: (loc) => `Ricevi le Nuove Aste Giudiziarie a ${loc} via Email`,
    body: (loc, count) =>
      `Monitora ${count} procedure attive a ${loc}. Ricevi una notifica automatica ogni mattina per nuovi avvisi PVP, ribassi d'asta e offerte minime (-25%).`,
    placeholder: "Inserisci la tua email …",
    button: "Attiva Avviso Gratuito →",
  },
  es: {
    badge: "🔔 ALERTA GRATUITA DE SUBASTAS BOE",
    title: (loc) => `Reciba Nuevas Subastas Judiciales en ${loc} por Email`,
    body: (loc, count) =>
      `Siga ${count} expedientes activos en ${loc}. Reciba avisos automáticos cuando se publiquen nuevos edictos BOE o inmuebles bajo el 70% de tasación.`,
    placeholder: "Introduzca su correo electrónico …",
    button: "Activar Alerta Gratuita →",
  },
  fr: {
    badge: "🔔 ALERTE EMAIL ENCHÈRES GRATUITE",
    title: (loc) => `Recevez les Nouvelles Ventes Judiciaires (${loc}) par Email`,
    body: (loc, count) =>
      `Suivez ${count} audiences actives (${loc}). Recevez une alerte automatique dès la publication de nouvelles adjudications ou baisses de mise à prix.`,
    placeholder: "Votre adresse e-mail …",
    button: "Activer l'Alerte Gratuite →",
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
