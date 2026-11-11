import Link from "next/link";
import { listingHref } from "@/lib/appConstants";
import { formatMoney } from "@/lib/appFormat";
import { LocaleOption } from "@/lib/constants";
import { Listing } from "@/types/listing.types";

interface RelatedRegionalListingsProps {
  items: Listing[];
  locale: LocaleOption;
  regionLabel: string;
  isFreePlan: boolean;
}

const COPY: Record<
  LocaleOption,
  { eyebrow: string; heading: (r: string) => string; subFree: string; val: string; cta: string }
> = {
  de: {
    eyebrow: "WEITERE VERFAHREN IN DIESER REGION",
    heading: (r) => `Weitere aktive Versteigerungen in ${r}`,
    subFree: "Prüfen Sie direkt die nächste Akte — mit 7 Tagen Vollzugang (heute 0,00 €) schalten Sie alle Gutachten & Aktenzeichen frei.",
    val: "Verkehrswert / Schätzwert",
    cta: "Akte prüfen →",
  },
  tr: {
    eyebrow: "BU BÖLGEDEKİ DİĞER AKTİF İHALELER",
    heading: (r) => `${r} bölgesindeki diğer güncel icra ihaleleri`,
    subFree: "Sıradaki dosyayı inceleyin — 7 günlük tam erişim denemesiyle (bugün 0,00 TL) tüm şartname ve esas numaralarını açın.",
    val: "Muhammen Bedel",
    cta: "Dosyayı incele →",
  },
  en: {
    eyebrow: "MORE ACTIVE AUCTIONS IN THIS REGION",
    heading: (r) => `Other live auction lots in ${r}`,
    subFree: "Inspect the next lot — unlock unlimited Legal Packs, addresses & court files with a 7-day full-access trial (0.00 due today).",
    val: "Market / Guide Benchmark",
    cta: "Inspect dossier →",
  },
  fr: {
    eyebrow: "AUTRES ENCHÈRES ACTIVES DANS CETTE RÉGION",
    heading: (r) => `Autres ventes judiciaires actives — ${r}`,
    subFree: "Consultez le dossier suivant — débloquez tous les cahiers des ventes avec l'essai 7 jours (0,00 € aujourd'hui).",
    val: "Valeur / Estimation",
    cta: "Voir le dossier →",
  },
  es: {
    eyebrow: "MÁS SUBASTAS ACTIVAS EN ESTA REGIÓN",
    heading: (r) => `Otras subastas judiciales activas en ${r}`,
    subFree: "Revisa el siguiente expediente — desbloquea todos los edictos y cargas con 7 días de acceso completo (0,00 € hoy).",
    val: "Valor de Subasta",
    cta: "Ver expediente →",
  },
  it: {
    eyebrow: "ALTRE ASTE ATTIVE IN QUESTA REGIONE",
    heading: (r) => `Altri lotti all'asta attivi in ${r}`,
    subFree: "Esamina il prossimo fascicolo — sblocca tutte le perizie CTU e gli avvisi con 7 giorni di prova (0,00 € oggi).",
    val: "Valore di Stima",
    cta: "Apri fascicolo →",
  },
};

export default function RelatedRegionalListings({
  items,
  locale,
  regionLabel,
  isFreePlan,
}: RelatedRegionalListingsProps) {
  if (items.length === 0) return null;
  const c = COPY[locale] ?? COPY.de;

  return (
    <section className="mt-10 border-t-2 border-ink pt-8">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-signal">
        {c.eyebrow}
      </p>
      <h2 className="mt-1 font-display text-2xl text-ink">
        {c.heading(regionLabel)}
      </h2>
      {isFreePlan && (
        <p className="mt-1.5 max-w-3xl font-serif text-sm text-ink-soft">
          {c.subFree}
        </p>
      )}
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const valStr = item.appraisedValue
            ? formatMoney(item.appraisedValue, item.market, locale, item.currency)
            : "—";
          return (
            <Link
              key={item.key}
              href={listingHref(item.key)}
              className="group flex flex-col justify-between border-2 border-ink bg-paper-bright p-4 transition-colors hover:bg-paper-deep"
            >
              <div>
                <span className="inline-block bg-paper-deep px-2 py-0.5 font-mono text-[10px] uppercase text-ink-soft">
                  {item.segmentLabel}
                </span>
                <h3 className="mt-2 line-clamp-2 font-display text-base leading-snug text-ink group-hover:text-signal">
                  {item.place || item.region || item.authority}
                </h3>
                <p className="mt-1 truncate font-mono text-[11px] text-ink-muted">
                  {item.authority}
                </p>
              </div>
              <div className="mt-4 border-t border-rule pt-2.5">
                <span className="block font-mono text-[10px] uppercase text-ink-muted">{c.val}</span>
                <span className="font-mono text-sm font-semibold text-ink">{valStr}</span>
                <span className="mt-2 block font-mono text-xs font-semibold text-signal group-hover:underline">
                  {c.cta}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
