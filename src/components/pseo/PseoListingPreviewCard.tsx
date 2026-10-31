import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { PseoLocale, PseoPreviewListing } from "@/types/pseo.types";

interface PseoListingPreviewCardProps {
  item: PseoPreviewListing;
  locale: PseoLocale;
}

const LOCALE_FORMAT: Record<PseoLocale, string> = {
  de: "de-DE",
  tr: "tr-TR",
  en: "en-GB",
  it: "it-IT",
  es: "es-ES",
  fr: "fr-FR",
};

const CARD_LABELS: Record<
  PseoLocale,
  {
    onRequest: string;
    dateFallback: string;
    appraised: string;
    minBid: string;
    waived: string;
    belowMarket: string;
    cta: string;
  }
> = {
  de: {
    onRequest: "Auf Anfrage",
    dateFallback: "Termin folgt",
    appraised: "Verkehrswert / Schätzwert",
    minBid: "Einstieg / Mindestgebot",
    waived: "Wertgrenzen entfallen",
    belowMarket: "unter Markt",
    cta: "🔒 Aktenzeichen, Gutachten-KI & Bietgrenze",
  },
  tr: {
    onRequest: "Belirtilmedi",
    dateFallback: "E-İhale Takviminde",
    appraised: "Muhammen Bedel",
    minBid: "Başlangıç / %50 Sınır",
    waived: "Fırsat İhalesi",
    belowMarket: "Piyasa Altı",
    cta: "🔒 Dosya No, Şerh Analizi & Teklif Sınırı",
  },
  en: {
    onRequest: "TBC in Legal Pack",
    dateFallback: "Auction Catalog",
    appraised: "Market Benchmark",
    minBid: "Guide Price",
    waived: "No Reserve / Repossession",
    belowMarket: "Below Market",
    cta: "🔒 Lot Number, Legal Pack & Reserve Check",
  },
  it: {
    onRequest: "In Perizia CTU",
    dateFallback: "Avviso PVP",
    appraised: "Prezzo Base / Stima",
    minBid: "Offerta Minima (75%)",
    waived: "Ribasso d'Asta",
    belowMarket: "Sotto Mercato",
    cta: "🔒 R.G.E., Perizia CTU & Offerta Massima",
  },
  es: {
    onRequest: "Ver Edicto BOE",
    dateFallback: "Subasta BOE Activa",
    appraised: "Valor de Subasta",
    minBid: "Umbral 50% / 70% LEC",
    waived: "Sin Puja Mínima",
    belowMarket: "Bajo Mercado",
    cta: "🔒 Id. BOE, Cargas Registrales & Puja Óptima",
  },
  fr: {
    onRequest: "Voir Cahier CCV",
    dateFallback: "Audience TJ",
    appraised: "Valeur Référence DVF",
    minBid: "Mise à Prix TJ",
    waived: "Baisse de Mise à Prix",
    belowMarket: "Sous le Marché",
    cta: "🔒 Rôle TJ, Cahier des Ventes & Plafond",
  },
};

function formatMoney(amount: number | null, currency: "EUR" | "CHF" | "GBP" | "TRY", locale: PseoLocale): string {
  if (!amount) return CARD_LABELS[locale].onRequest;
  return new Intl.NumberFormat(LOCALE_FORMAT[locale], {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PseoListingPreviewCard({ item, locale }: PseoListingPreviewCardProps) {
  const L = CARD_LABELS[locale];
  const dateStr = item.hearingAt ? item.hearingAt.slice(0, 10) : L.dateFallback;

  return (
    <article className="flex flex-col justify-between border-2 border-ink bg-paper-bright p-5 transition-transform duration-150 hover:-translate-y-0.5">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule-strong pb-2.5 font-mono text-[11px] uppercase tracking-wider text-ink-soft">
          <span className="font-semibold text-signal">{item.segmentLabel}</span>
          <span>{dateStr}</span>
        </div>

        <h3 className="mt-3 font-display text-xl leading-snug text-ink">{item.title}</h3>
        <p className="mt-1 font-mono text-xs text-ink-soft">
          {item.postcode ? `${item.postcode} ` : ""}
          {item.place} · {item.authority}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-b border-rule-strong py-3">
          <div>
            <span className="block font-mono text-[10px] uppercase tracking-wider text-ink-soft">{L.appraised}</span>
            <span className="font-mono text-sm font-semibold text-ink">
              {formatMoney(item.appraisedValue, item.currency, locale)}
            </span>
          </div>
          <div>
            <span className="block font-mono text-[10px] uppercase tracking-wider text-ink-soft">{L.minBid}</span>
            <span className="font-mono text-sm font-semibold text-signal">
              {formatMoney(item.minimumBid, item.currency, locale)}
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5 font-mono text-[10px] uppercase">
          {item.limitsWaived && (
            <span className="bg-signal px-2 py-0.5 font-semibold text-paper-bright">{L.waived}</span>
          )}
          {item.discountPct && item.discountPct >= 20 && (
            <span className="bg-ink px-2 py-0.5 font-semibold text-paper-bright">
              -{item.discountPct}% {L.belowMarket}
            </span>
          )}
          {item.areaM2 && <span className="border border-ink px-2 py-0.5 text-ink">{item.areaM2} m²</span>}
          {item.rooms && <span className="border border-ink px-2 py-0.5 text-ink">{item.rooms}</span>}
        </div>
      </div>

      <div className="mt-5 pt-2">
        <Link
          href={ROUTES.signup}
          className="inline-flex w-full items-center justify-between border-2 border-ink bg-paper-deep px-3.5 py-2 font-narrow text-[11px] font-semibold uppercase tracking-[0.07em] text-ink transition-colors hover:bg-ink hover:text-paper-bright"
        >
          <span>{L.cta}</span>
          <span>→</span>
        </Link>
      </div>
    </article>
  );
}
