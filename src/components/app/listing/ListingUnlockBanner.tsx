import Button from "@/components/ui/Button";
import { APP_ROUTES } from "@/lib/appConstants";
import { LocaleOption } from "@/lib/constants";
import { Listing, ListingCountry } from "@/types/listing.types";

interface ListingUnlockBannerProps {
  listing: Listing;
  country: ListingCountry;
  locale: LocaleOption;
}

interface UnlockCopy {
  kicker: string;
  title: string;
  body: string;
  items: [string, string, string, string];
  cta: string;
  note: string;
}

const COPY: Record<LocaleOption, UnlockCopy> = {
  de: {
    kicker: "Vorschau-Modus · Vertrauliche Verfahrensdaten geschwärzt",
    title: "Vollständige Akte, Adresse & Verkehrswert für dieses Objekt freischalten",
    body: "Im kostenlosen Such-Alert-Konto sind Identifikationsmerkmale zum Schutz vor automatisiertem Scraping geschwärzt. Mit dem Investor-Zugang schalten Sie dieses Verfahren sofort vollständig frei:",
    items: [
      "Ungekürztes Aktenzeichen & Grundbuchblatt",
      "Exakte Hausnummer, Flurstück & Lagekarte",
      "Verkehrswert, 5/10- & 7/10-Limits + Gebotsrechner",
      "Amtliche Edikt-/Gutachten-PDFs & KI-Risiko-Analyse",
    ],
    cta: "Vollständige Akte jetzt freischalten",
    note: "Sofortige Freischaltung nach Buchung · Monatlich kündbar",
  },
  tr: {
    kicker: "Önizleme Modu · Dosya ve kıymet verileri gizlendi",
    title: "Bu ihale için tam esas numarasını, açık adresi ve muhammen bedeli açın",
    body: "Ücretsiz bildirim hesabında dosya kimlik bilgileri gizlenmiştir. Yatırımcı erişimi ile bu dosyanın tüm resmi verilerini anında açabilirsiniz:",
    items: [
      "Tam Esas No, İcra Dairesi ve Ada/Parsel bilgileri",
      "Açık sokak adresi, bağımsız bölüm ve konum haritası",
      "Muhammen bedel, %50 açılış bedeli, teminat ve ihale hesaplayıcı",
      "Resmi şartname/ilan PDF belgeleri ve yapay zeka risk analizi",
    ],
    cta: "Dosyanın tamamını şimdi aç",
    note: "Ödeme sonrası anında erişim · İstediğiniz zaman iptal edin",
  },
  en: {
    kicker: "Preview Mode · Confidential case data redacted",
    title: "Unlock the full case file, exact street address & appraised value",
    body: "In the free alert account, identifying case fields are redacted. Upgrade to Investor access to unlock all official dossier records for this property immediately:",
    items: [
      "Unredacted court file number & land registry reference",
      "Exact street address, parcel number & location map",
      "Appraised value, statutory minimum bid limits & bid calculator",
      "Official court notice PDFs & AI risk verdict",
    ],
    cta: "Unlock full dossier now",
    note: "Instant activation · Cancel monthly anytime",
  },
  fr: {
    kicker: "Mode aperçu · Données confidentielles du dossier masquées",
    title: "Débloquer le dossier complet, l'adresse exacte et la mise à prix",
    body: "Dans le compte d'alerte gratuit, les identifiants du dossier sont masqués. Passez à l'accès Investisseur pour débloquer immédiatement toutes les pièces officielles de ce bien :",
    items: [
      "Numéro de rôle complet et référence cadastrale",
      "Adresse exacte, parcelle et carte de localisation",
      "Valeur d'estimation, mise à prix et calculateur d'enchères",
      "Cahier des conditions de vente / PDF officiels et analyse IA",
    ],
    cta: "Débloquer le dossier complet",
    note: "Activation immédiate · Résiliable chaque mois",
  },
  es: {
    kicker: "Modo vista previa · Datos confidenciales del expediente ocultos",
    title: "Desbloquear el expediente completo, dirección exacta y valor de tasación",
    body: "En la cuenta gratuita de alertas, los datos identificativos están ocultos. Active el acceso Inversor para desbloquear al instante todos los datos oficiales de esta subasta:",
    items: [
      "Número de expediente judicial completo y referencia registral",
      "Dirección exacta, parcela catastral y mapa de ubicación",
      "Valor de tasación, puja mínima recomendada y calculadora",
      "Edicto oficial / certificación de cargas en PDF y análisis IA",
    ],
    cta: "Desbloquear expediente completo",
    note: "Activación inmediata · Cancelación mensual en cualquier momento",
  },
  it: {
    kicker: "Modalità anteprima · Dati riservati del fascicolo oscurati",
    title: "Sblocca il fascicolo completo, l'indirizzo esatto e la perizia",
    body: "Nell'account gratuito di avviso i dati identificativi sono oscurati. Attiva l'accesso Investitore per sbloccare subito tutti i documenti ufficiali di questa procedura:",
    items: [
      "Numero di R.G. completo e dati catastali (foglio/particella/sub)",
      "Indirizzo civico esatto e mappa di localizzazione",
      "Valore di stima, offerta minima (75 %) e calcolatore d'asta",
      "Avviso di vendita / perizia PDF ufficiale e analisi rischi IA",
    ],
    cta: "Sblocca il fascicolo completo",
    note: "Attivazione immediata · Disdetta mensile in qualsiasi momento",
  },
};

export default function ListingUnlockBanner({ listing, country, locale }: ListingUnlockBannerProps) {
  const c = COPY[locale] ?? COPY.de;
  const href = `${APP_ROUTES.order}?markt=${encodeURIComponent(country)}&tarif=investor-monat`;

  return (
    <section
      aria-label={c.title}
      className="my-6 border-2 border-ink bg-paper-dark p-5 sm:p-6 shadow-[4px_4px_0_0_var(--color-ink)]"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-verdict">
            {c.kicker} · {listing.authority} ({listing.fileNo})
          </p>
          <h2 className="mt-1.5 font-display text-2xl leading-snug text-ink sm:text-3xl">
            {c.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {c.body}
          </p>
          <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {c.items.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs font-medium text-ink">
                <span aria-hidden="true" className="font-mono text-verdict">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-start lg:items-end">
          <Button label={c.cta} href={href} variant="signal" withArrow />
          <p className="font-mono text-[11px] text-ink-muted">{c.note}</p>
        </div>
      </div>
    </section>
  );
}
