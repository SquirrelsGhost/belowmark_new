import Link from "next/link";
import { fmtPublicMoney, PUBLIC_LISTING_LABELS } from "@/lib/pseo/publicListingCopy";
import { PublicListingResolved } from "@/services/PublicListingService";

interface PublicListingFactsCardProps {
  item: PublicListingResolved;
}

export default function PublicListingFactsCard({ item }: PublicListingFactsCardProps) {
  const L = PUBLIC_LISTING_LABELS[item.locale];
  const pricePerM2 =
    item.appraisedValue && item.areaM2 && item.areaM2 > 0
      ? `${fmtPublicMoney(Math.round(item.appraisedValue / item.areaM2), item.currency, item.locale, L.onRequest)} / m²`
      : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 border-2 border-ink bg-paper-bright p-5 sm:grid-cols-4">
        <div>
          <span className="block font-mono text-[10px] uppercase tracking-wider text-ink-soft">{L.appraisedLabel}</span>
          <span className="mt-1 block font-mono text-base font-bold text-ink sm:text-lg">
            {fmtPublicMoney(item.appraisedValue, item.currency, item.locale, L.onRequest)}
          </span>
        </div>
        <div>
          <span className="block font-mono text-[10px] uppercase tracking-wider text-ink-soft">{L.minBidLabel}</span>
          <span className="mt-1 block font-mono text-base font-bold text-signal sm:text-lg">
            {fmtPublicMoney(item.minBidValue, item.currency, item.locale, L.onRequest)}
          </span>
        </div>
        <div>
          <span className="block font-mono text-[10px] uppercase tracking-wider text-ink-soft">{L.thresholdLabel}</span>
          <span className="mt-1 block font-mono text-base font-semibold text-ink sm:text-lg">
            {fmtPublicMoney(item.thresholdValue, item.currency, item.locale, L.onRequest)}
          </span>
        </div>
        <div>
          <span className="block font-mono text-[10px] uppercase tracking-wider text-ink-soft">{L.depositLabel}</span>
          <span className="mt-1 block font-mono text-base font-semibold text-ink sm:text-lg">
            {fmtPublicMoney(item.depositValue, item.currency, item.locale, L.onRequest)}
          </span>
        </div>
      </div>

      <div className="border-2 border-ink bg-paper-bright p-5 sm:p-6">
        <h2 className="font-display text-xl text-ink sm:text-2xl">{L.factsHeading}</h2>
        {item.teaserExcerpt && (
          <p className="mt-3 border-l-2 border-signal pl-3.5 font-serif text-base leading-relaxed text-ink-soft">
            {item.teaserExcerpt}
          </p>
        )}
        <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 border-t border-rule pt-4 font-mono text-xs sm:grid-cols-2">
          <div className="flex justify-between border-b border-rule pb-2">
            <dt className="text-ink-soft">{L.cityLabel}</dt>
            <dd className="font-semibold text-ink">
              {item.cityHref ? (
                <Link href={item.cityHref} className="underline underline-offset-4 hover:text-signal">
                  {item.postcode ? `${item.postcode} ` : ""}
                  {item.cleanCity}
                </Link>
              ) : (
                `${item.postcode ? `${item.postcode} ` : ""}${item.cleanCity}`
              )}
            </dd>
          </div>
          <div className="flex justify-between border-b border-rule pb-2">
            <dt className="text-ink-soft">{L.courtLabel}</dt>
            <dd className="font-semibold text-ink">
              {item.courtHref ? (
                <Link href={item.courtHref} className="underline underline-offset-4 hover:text-signal">
                  {item.authority}
                </Link>
              ) : (
                item.authority
              )}
            </dd>
          </div>
          <div className="flex justify-between border-b border-rule pb-2">
            <dt className="text-ink-soft">{L.hearingLabel}</dt>
            <dd className="font-semibold text-ink">{item.hearingDate ?? L.dateTbc}</dd>
          </div>
          <div className="flex justify-between border-b border-rule pb-2">
            <dt className="text-ink-soft">{L.fileNoLabel}</dt>
            <dd className="font-semibold text-signal">{item.maskedFileNo} 🔒</dd>
          </div>
          {item.areaM2 && (
            <div className="flex justify-between border-b border-rule pb-2">
              <dt className="text-ink-soft">{L.areaLabel}</dt>
              <dd className="font-semibold text-ink">{item.areaM2} m²</dd>
            </div>
          )}
          {pricePerM2 && (
            <div className="flex justify-between border-b border-rule pb-2">
              <dt className="text-ink-soft">{L.pricePerM2Label}</dt>
              <dd className="font-semibold text-ink">{pricePerM2}</dd>
            </div>
          )}
          {item.rooms && (
            <div className="flex justify-between border-b border-rule pb-2">
              <dt className="text-ink-soft">{L.roomsLabel}</dt>
              <dd className="font-semibold text-ink">{item.rooms}</dd>
            </div>
          )}
          {item.yearBuilt && (
            <div className="flex justify-between border-b border-rule pb-2">
              <dt className="text-ink-soft">{L.yearBuiltLabel}</dt>
              <dd className="font-semibold text-ink">{item.yearBuilt}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="border-2 border-ink bg-paper-dark p-5 sm:p-6">
        <h2 className="font-display text-xl text-ink sm:text-2xl">{L.dossierHeading}</h2>
        <p className="mt-1.5 font-serif text-sm text-ink-soft">{L.dossierSub}</p>
        <ul className="mt-4 space-y-2.5">
          {L.lockedItems.map((line) => (
            <li key={line} className="flex items-center justify-between gap-3 border border-rule-strong bg-paper-bright px-3.5 py-2.5 font-mono text-xs text-ink">
              <span>🔓 {line}</span>
              <a href="#unlock-dossier" className="shrink-0 font-semibold text-signal hover:underline">
                FREE →
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={item.calcHref}
            className="inline-flex items-center border-2 border-ink bg-paper-bright px-4 py-2 font-narrow text-xs font-semibold uppercase tracking-wider text-ink hover:bg-ink hover:text-paper-bright"
          >
            {L.calcCta}
          </Link>
          <Link
            href={`/suche?markt=${item.country}`}
            className="inline-flex items-center border-2 border-ink bg-paper px-4 py-2 font-narrow text-xs font-semibold uppercase tracking-wider text-ink hover:bg-signal hover:border-signal hover:text-paper-bright"
          >
            {L.searchCta}
          </Link>
        </div>
      </div>
    </div>
  );
}
