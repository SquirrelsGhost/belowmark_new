import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { PseoPreviewListing } from "@/types/pseo.types";

interface PseoListingPreviewCardProps {
  item: PseoPreviewListing;
  locale: "de" | "tr";
}

function formatMoney(amount: number | null, currency: "EUR" | "CHF" | "GBP" | "TRY", locale: "de" | "tr"): string {
  if (!amount) return locale === "tr" ? "Belirtilmedi" : "Auf Anfrage";
  return new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "de-DE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PseoListingPreviewCard({ item, locale }: PseoListingPreviewCardProps) {
  const isTr = locale === "tr";
  const dateStr = item.hearingAt ? item.hearingAt.slice(0, 10) : isTr ? "E-İhale Takviminde" : "Termin folgt";

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
            <span className="block font-mono text-[10px] uppercase tracking-wider text-ink-soft">
              {isTr ? "Muhammen Bedel" : "Verkehrswert"}
            </span>
            <span className="font-mono text-sm font-semibold text-ink">
              {formatMoney(item.appraisedValue, item.currency, locale)}
            </span>
          </div>
          <div>
            <span className="block font-mono text-[10px] uppercase tracking-wider text-ink-soft">
              {isTr ? "Başlangıç / %50 Sınır" : "5/10 Mindestgebot"}
            </span>
            <span className="font-mono text-sm font-semibold text-signal">
              {formatMoney(item.minimumBid, item.currency, locale)}
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5 font-mono text-[10px] uppercase">
          {item.limitsWaived && (
            <span className="bg-signal px-2 py-0.5 font-semibold text-paper-bright">
              {isTr ? "Fırsat İhalesi" : "Wertgrenzen entfallen"}
            </span>
          )}
          {item.discountPct && item.discountPct >= 20 && (
            <span className="bg-ink px-2 py-0.5 font-semibold text-paper-bright">
              -{item.discountPct}% {isTr ? "Piyasa Altı" : "unter Markt"}
            </span>
          )}
          {item.areaM2 && (
            <span className="border border-ink px-2 py-0.5 text-ink">{item.areaM2} m²</span>
          )}
          {item.rooms && (
            <span className="border border-ink px-2 py-0.5 text-ink">{item.rooms}</span>
          )}
        </div>
      </div>

      <div className="mt-5 pt-2">
        <Link
          href={ROUTES.signup}
          className="inline-flex w-full items-center justify-between border-2 border-ink bg-paper-deep px-3.5 py-2 font-narrow text-[11px] font-semibold uppercase tracking-[0.07em] text-ink transition-colors hover:bg-ink hover:text-paper-bright"
        >
          <span>
            {isTr
              ? "🔒 Dosya No, Şerh Analizi & Teklif Sınırı"
              : "🔒 Aktenzeichen, Gutachten-KI & Bietgrenze"}
          </span>
          <span>→</span>
        </Link>
      </div>
    </article>
  );
}
