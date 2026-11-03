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
    listingBadge: "🔒 AUSGEWÄHLTES VERSTEIGERUNGSVERFAHREN",
    alertBadge: "🔔 KOSTENLOSER E-MAIL-SUCHAUFTRAG",
    appraised: "Verkehrswert / Schätzwert",
    minBid: "Einstieg / Mindestgebot",
    listingNote: (city) =>
      `Nach Bestätigung Ihrer E-Mail öffnen wir direkt dieses Objekt auf Ihrer Merkliste und aktivieren Ihren kostenlosen Such-Alert für ${city}.`,
    cityTitle: (city) => `Automatischer Zwangsversteigerungs-Alert für ${city}`,
    cityNote: (city) =>
      `Sobald Sie Ihre E-Mail bestätigen, ist Ihr kostenloser täglicher Suchauftrag für neue Termine und Wertgrenzen-Wegfälle in ${city} sofort aktiv.`,
  },
  tr: {
    listingBadge: "🔒 SEÇİLEN İCRA & E-İHALE DOSYASI",
    alertBadge: "🔔 ÜCRETSİZ E-POSTA İHALE ALARMI",
    appraised: "Muhammen Bedel",
    minBid: "Başlangıç / %50 Sınır",
    listingNote: (city) =>
      `E-postanızı doğruladığınızda bu dosya izleme listenize eklenir ve ${city} için ücretsiz ihale alarmınız otomatik kurulur.`,
    cityTitle: (city) => `${city} İcra & E-İhale Bildirim Alarmı`,
    cityNote: (city) =>
      `E-postanızı doğruladığınız anda ${city} bölgesindeki yeni %50 açılışlı gayrimenkul ihaleleri için günlük e-posta bildiriminiz başlar.`,
  },
  en: {
    listingBadge: "🔒 SELECTED AUCTION LOT",
    alertBadge: "🔔 FREE AUCTION EMAIL ALERT",
    appraised: "Market Benchmark",
    minBid: "Guide / Minimum Bid",
    listingNote: (city) =>
      `Right after confirming your email, we open this lot on your watchlist and activate your free daily auction alert for ${city}.`,
    cityTitle: (city) => `Automatic Property Auction Alert for ${city}`,
    cityNote: (city) =>
      `Confirm your email below to activate automatic notifications for new below-market auction lots in ${city}.`,
  },
  it: {
    listingBadge: "🔒 PROCEDURA D'ASTA SELEZIONATA",
    alertBadge: "🔔 AVVISO ASTE GRATUITO",
    appraised: "Prezzo Base / Stima",
    minBid: "Offerta Minima",
    listingNote: (city) =>
      `Dopo la conferma dell'email apriremo direttamente questo immobile e attiveremo il tuo avviso gratuito per ${city}.`,
    cityTitle: (city) => `Avviso Aste Giudiziarie per ${city}`,
    cityNote: (city) =>
      `Conferma la tua email per ricevere automaticamente i nuovi avvisi d'asta e ribassi a ${city}.`,
  },
  es: {
    listingBadge: "🔒 EXPEDIENTE DE SUBASTA SELECCIONADO",
    alertBadge: "🔔 ALERTA DE SUBASTAS BOE",
    appraised: "Valor de Subasta",
    minBid: "Umbral Mínimo",
    listingNote: (city) =>
      `Tras confirmar su correo abriremos directamente este expediente y activaremos su alerta gratuita para ${city}.`,
    cityTitle: (city) => `Alerta Automática de Subastas en ${city}`,
    cityNote: (city) =>
      `Confirme su correo para activar los avisos automáticos de nuevas subastas BOE en ${city}.`,
  },
  fr: {
    listingBadge: "🔒 VENTE JUDICIAIRE SÉLECTIONNÉE",
    alertBadge: "🔔 ALERTE ENCHÈRES GRATUITE",
    appraised: "Valeur Référence",
    minBid: "Mise à Prix",
    listingNote: (city) =>
      `Dès confirmation de votre e-mail, nous ouvrons ce lot dans vos favoris et activons votre alerte gratuite pour ${city}.`,
    cityTitle: (city) => `Alerte Automatique Enchères (${city})`,
    cityNote: (city) =>
      `Confirmez votre e-mail pour activer les notifications automatiques des nouvelles ventes judiciaires (${city}).`,
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
