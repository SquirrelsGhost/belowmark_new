import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { PseoLocale, PseoPreviewListing } from "@/types/pseo.types";

interface PseoMarketComparisonTableProps {
  listings: PseoPreviewListing[];
  locale: PseoLocale;
  heading: string;
}

const LOCALE_FORMAT: Record<PseoLocale, string> = {
  de: "de-DE",
  tr: "tr-TR",
  en: "en-GB",
  it: "it-IT",
  es: "es-ES",
  fr: "fr-FR",
};

const TABLE_COPY: Record<
  PseoLocale,
  {
    colProperty: string;
    colAuthority: string;
    colDate: string;
    colAppraised: string;
    colMinBid: string;
    colDeposit: string;
    colAction: string;
    tbc: string;
    unlock: string;
  }
> = {
  de: {
    colProperty: "Objekt & Ort",
    colAuthority: "Gericht / Behörde",
    colDate: "Termin",
    colAppraised: "Verkehrswert / Schätzwert",
    colMinBid: "Mindestgebot (50 % / 70 %)",
    colDeposit: "10 % Sicherheit",
    colAction: "Akte & Gutachten",
    tbc: "Auf Anfrage",
    unlock: "Prüfen →",
  },
  tr: {
    colProperty: "Taşınmaz & Konum",
    colAuthority: "İcra / Satış Dairesi",
    colDate: "İhale Tarihi",
    colAppraised: "Muhammen Bedel",
    colMinBid: "%50 Açılış Bedeli",
    colDeposit: "%10 Teminat",
    colAction: "Dosya & Şartname",
    tbc: "Belirtilmedi",
    unlock: "İncele →",
  },
  en: {
    colProperty: "Lot & Location",
    colAuthority: "Auctioneer / Region",
    colDate: "Auction Date",
    colAppraised: "Market Benchmark",
    colMinBid: "Guide Price",
    colDeposit: "10% Deposit",
    colAction: "Legal Pack",
    tbc: "See Pack",
    unlock: "Inspect →",
  },
  it: {
    colProperty: "Immobile & Comune",
    colAuthority: "Tribunale",
    colDate: "Data Asta",
    colAppraised: "Prezzo Base CTU",
    colMinBid: "Offerta Minima (75%)",
    colDeposit: "Cauzione 10%",
    colAction: "Perizia & R.G.E.",
    tbc: "In Perizia",
    unlock: "Apri →",
  },
  es: {
    colProperty: "Inmueble & Municipio",
    colAuthority: "Juzgado / Autoridad",
    colDate: "Fecha BOE",
    colAppraised: "Valor de Subasta",
    colMinBid: "Umbral 50% / 70% LEC",
    colDeposit: "Depósito 5%",
    colAction: "Edicto & Cargas",
    tbc: "Ver BOE",
    unlock: "Ver →",
  },
  fr: {
    colProperty: "Bien & Commune",
    colAuthority: "Tribunal Judiciaire",
    colDate: "Audience",
    colAppraised: "Valeur Réf. DVF",
    colMinBid: "Mise à Prix",
    colDeposit: "CARPA 10%",
    colAction: "Cahier CCV",
    tbc: "Voir CCV",
    unlock: "Ouvrir →",
  },
};

function fmt(amount: number | null, currency: "EUR" | "CHF" | "GBP" | "TRY", locale: PseoLocale, fallback: string) {
  if (!amount) return fallback;
  return new Intl.NumberFormat(LOCALE_FORMAT[locale], {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PseoMarketComparisonTable({ listings, locale, heading }: PseoMarketComparisonTableProps) {
  if (listings.length === 0) return null;
  const C = TABLE_COPY[locale];

  return (
    <div className="mt-12 border-2 border-ink bg-paper-bright p-5 sm:p-6">
      <h2 className="font-display text-xl text-ink sm:text-2xl">{heading}</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-left font-mono text-xs">
          <thead>
            <tr className="border-b-2 border-ink bg-paper-deep text-[11px] uppercase tracking-wider text-ink">
              <th className="px-3 py-2.5">{C.colProperty}</th>
              <th className="px-3 py-2.5">{C.colAuthority}</th>
              <th className="px-3 py-2.5">{C.colDate}</th>
              <th className="px-3 py-2.5 text-right">{C.colAppraised}</th>
              <th className="px-3 py-2.5 text-right text-signal">{C.colMinBid}</th>
              <th className="px-3 py-2.5 text-right">{C.colDeposit}</th>
              <th className="px-3 py-2.5 text-right">{C.colAction}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">
            {listings.slice(0, 10).map((item) => (
              <tr key={`tbl-${item.key}`} className="hover:bg-paper">
                <td className="px-3 py-2.5 font-sans font-medium text-ink">
                  <span className="block font-mono text-[10px] font-semibold uppercase text-signal">{item.segmentLabel}</span>
                  <span>{item.postcode ? `${item.postcode} ` : ""}{item.place}</span>
                </td>
                <td className="px-3 py-2.5 text-ink-soft">{item.authority}</td>
                <td className="px-3 py-2.5 text-ink-soft">{item.hearingAt ? item.hearingAt.slice(0, 10) : "2026/2027"}</td>
                <td className="px-3 py-2.5 text-right font-semibold text-ink">
                  {fmt(item.appraisedValue, item.currency, locale, C.tbc)}
                </td>
                <td className="px-3 py-2.5 text-right font-bold text-signal">
                  {fmt(item.minimumBid, item.currency, locale, C.tbc)}
                </td>
                <td className="px-3 py-2.5 text-right text-ink-soft">
                  {fmt(item.depositAmount, item.currency, locale, C.tbc)}
                </td>
                <td className="px-3 py-2.5 text-right">
                  <Link href={ROUTES.signup} className="font-semibold text-ink underline hover:text-signal">
                    {C.unlock}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
