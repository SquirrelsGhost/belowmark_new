import { LocaleOption } from "@/lib/constants";
import { PseoPreviewListing } from "@/types/pseo.types";

interface SignupContextBannerProps {
  lang: LocaleOption;
  previewListing?: PseoPreviewListing;
  targetCity?: string;
}

const LOCALE_FORMAT: Record<LocaleOption, string> = {
  de: "de-DE",
  tr: "tr-TR",
  en: "en-GB",
  it: "it-IT",
  es: "es-ES",
  fr: "fr-FR",
};

const BANNER_COPY: Record<
  LocaleOption,
  {
    listingBadge: string;
    alertBadge: string;
    appraised: string;
    minBid: string;
    listingNote: (city: string) => string;
    cityTitle: (city: string) => string;
    cityNote: (city: string) => string;
  }
> = {
  de: {
    listingBadge: "🎁 IHR 1 GRATIS-DOSSIER (OHNE ZAHLUNGSMETHODE)",
    alertBadge: "🎁 1 GRATIS-DOSSIER + KOSTENLOSER E-MAIL-SUCHAUFTRAG",
    appraised: "Verkehrswert / Schätzwert",
    minBid: "Einstieg / Mindestgebot",
    listingNote: (city) =>
      `Nach Bestätigung Ihrer E-Mail schalten wir genau dieses Objekt automatisch als Ihr 1 Gratis-Dossier komplett ungeschwärzt frei (inkl. Aktenzeichen, exakter Adresse, Gerichts-PDF & KI-Analyse) und aktivieren Ihren kostenlosen Such-Alert für ${city}.`,
    cityTitle: (city) => `1 Gratis-Dossier + Automatischer Such-Alert für ${city}`,
    cityNote: (city) =>
      `Sobald Sie Ihre E-Mail bestätigen, ist Ihr kostenloses 1 Gratis-Dossier (ohne Karte) für ein Objekt Ihrer Wahl freigeschaltet und Ihr täglicher Suchauftrag für ${city} sofort aktiv.`,
  },
  tr: {
    listingBadge: "🎁 1 ÜCRETSİZ TAM DOSYANIZ (KARTSIZ / ÜCRETSİZ)",
    alertBadge: "🎁 1 ÜCRETSİZ DOSYA + E-POSTA İHALE ALARMI",
    appraised: "Muhammen Bedel",
    minBid: "Başlangıç / %50 Sınır",
    listingNote: (city) =>
      `E-postanızı doğruladığınız anda bu ihale dosyası 1 Ücretsiz Dosya hakkınızla sansürsüz olarak (esas no, açık adres, şartname PDF ve yapay zekâ analizi) otomatik açılır ve ${city} alarmınız kurulur.`,
    cityTitle: (city) => `1 Ücretsiz Dosya + ${city} İcra & E-İhale Alarmı`,
    cityNote: (city) =>
      `E-postanızı doğruladığınız anda 1 ücretsiz tam dosya açma hakkınız (kartsız) tanımlanır ve ${city} bölgesindeki yeni ihaleler için günlük bildiriminiz başlar.`,
  },
  en: {
    listingBadge: "🎁 YOUR 1 FREE PROPERTY DOSSIER (NO CARD REQUIRED)",
    alertBadge: "🎁 1 FREE DOSSIER + AUCTION EMAIL ALERT",
    appraised: "Market Benchmark",
    minBid: "Guide / Minimum Bid",
    listingNote: (city) =>
      `Right after confirming your email, we automatically unlock this exact lot as your 1 Free Dossier (full case number, street address, court PDF & AI report) and activate your free alert for ${city}.`,
    cityTitle: (city) => `1 Free Dossier + Property Auction Alert for ${city}`,
    cityNote: (city) =>
      `Confirm your email below to unlock 1 full auction dossier of your choice for free (no card required) and activate daily alerts for ${city}.`,
  },
  it: {
    listingBadge: "🎁 IL TUO 1° FASCICOLO GRATUITO (SENZA CARTA)",
    alertBadge: "🎁 1 FASCICOLO GRATIS + AVVISO ASTE",
    appraised: "Prezzo Base / Stima",
    minBid: "Offerta Minima",
    listingNote: (city) =>
      `Subito dopo la conferma dell'email sbloccheremo automaticamente questo immobile come tuo 1° Fascicolo Gratuito (R.G.E., indirizzo esatto, PDF tribunale e analisi IA) e attiveremo l'avviso per ${city}.`,
    cityTitle: (city) => `1 Fascicolo Gratis + Avviso Aste per ${city}`,
    cityNote: (city) =>
      `Conferma la tua email per sbloccare gratuitamente 1 fascicolo completo a tua scelta (senza carta) e ricevere i nuovi avvisi d'asta a ${city}.`,
  },
  es: {
    listingBadge: "🎁 SU 1er EXPEDIENTE GRATIS (SIN TARJETA)",
    alertBadge: "🎁 1 EXPEDIENTE GRATIS + ALERTA BOE",
    appraised: "Valor de Subasta",
    minBid: "Umbral Mínimo",
    listingNote: (city) =>
      `Al confirmar su correo desbloquearemos automáticamente este inmueble como su 1er Expediente Gratis (n.º BOE, dirección exacta, edicto PDF e informe IA) y activaremos su alerta en ${city}.`,
    cityTitle: (city) => `1 Expediente Gratis + Alerta de Subastas en ${city}`,
    cityNote: (city) =>
      `Confirme su correo para activar 1 expediente completo gratis (sin tarjeta) y recibir avisos automáticos de nuevas subastas BOE en ${city}.`,
  },
  fr: {
    listingBadge: "🎁 VOTRE 1er DOSSIER COMPLET GRATUIT (SANS CARTE)",
    alertBadge: "🎁 1 DOSSIER GRATUIT + ALERTE ENCHÈRES",
    appraised: "Valeur Référence",
    minBid: "Mise à Prix",
    listingNote: (city) =>
      `Dès confirmation de votre e-mail, nous débloquons automatiquement ce bien comme votre 1er Dossier Gratuit (n° de rôle TJ, adresse exacte, cahier PDF et analyse IA) et activons votre alerte (${city}).`,
    cityTitle: (city) => `1 Dossier Gratuit + Alerte Automatique (${city})`,
    cityNote: (city) =>
      `Confirmez votre e-mail pour débloquer 1 dossier complet gratuit (sans carte bancaire) et activer les alertes de nouvelles ventes judiciaires (${city}).`,
  },
};

function formatCurrency(val: number | null, currency: "EUR" | "CHF" | "GBP" | "TRY", lang: LocaleOption): string {
  if (!val) return "—";
  return new Intl.NumberFormat(LOCALE_FORMAT[lang], {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(val);
}

export default function SignupContextBanner({ lang, previewListing, targetCity }: SignupContextBannerProps) {
  if (!previewListing && !targetCity) return null;
  const copy = BANNER_COPY[lang] ?? BANNER_COPY.de;
  const cityLabel = targetCity || previewListing?.place || "";

  if (previewListing) {
    return (
      <div className="mb-5 border-2 border-ink bg-paper-deep p-4">
        <span className="inline-block bg-signal px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-paper-bright">
          {copy.listingBadge}
        </span>
        <p className="mt-2 font-display text-lg leading-snug text-ink">{previewListing.title}</p>
        <p className="mt-0.5 font-mono text-xs text-ink-soft">
          {previewListing.postcode ? `${previewListing.postcode} ` : ""}
          {previewListing.place} · {previewListing.authority}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-b border-rule-strong py-2 font-mono text-xs">
          <div>
            <span className="block text-[10px] uppercase text-ink-soft">{copy.appraised}</span>
            <span className="font-semibold text-ink">
              {formatCurrency(previewListing.appraisedValue, previewListing.currency, lang)}
            </span>
          </div>
          <div>
            <span className="block text-[10px] uppercase text-ink-soft">{copy.minBid}</span>
            <span className="font-semibold text-signal">
              {formatCurrency(previewListing.minimumBid, previewListing.currency, lang)}
            </span>
          </div>
        </div>
        <p className="mt-2.5 font-serif text-xs leading-relaxed text-ink-soft">
          {copy.listingNote(cityLabel)}
        </p>
      </div>
    );
  }

  return (
    <div className="mb-5 border-2 border-ink bg-paper-deep p-4">
      <span className="inline-block bg-signal px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-paper-bright">
        {copy.alertBadge}
      </span>
      <p className="mt-2 font-display text-lg leading-snug text-ink">{copy.cityTitle(cityLabel)}</p>
      <p className="mt-1 font-serif text-xs leading-relaxed text-ink-soft">{copy.cityNote(cityLabel)}</p>
    </div>
  );
}
