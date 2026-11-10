import PseoDirectoryView from "@/components/pseo/PseoDirectoryView";
import { BELOWMARK_ORIGIN } from "@/lib/blog/blogSeo";
import { EU_MARKET_COPY } from "@/lib/pseo/euMarketCopy";
import { EU_MARKET_META } from "@/lib/pseo/euMarketRegions";
import { EuMarketCatalog, EuMarketLocationEntry, PseoLocale } from "@/types/pseo.types";

interface PseoEuEntryViewProps {
  catalog: EuMarketCatalog;
  entry: EuMarketLocationEntry;
}

const LOCALE_FORMAT: Record<PseoLocale, string> = {
  de: "de-DE",
  tr: "tr-TR",
  en: "en-GB",
  it: "it-IT",
  es: "es-ES",
  fr: "fr-FR",
};

const STAT_LABELS: Record<
  PseoLocale,
  { active: string; avgVal: string; tax: string; nextDate: string }
> = {
  de: {
    active: "Aktive Verfahren",
    avgVal: "Ø Schätzwert",
    tax: "Steuer / Gebühr",
    nextDate: "Nächster Termin",
  },
  tr: {
    active: "Aktif İhale",
    avgVal: "Ort. Muhammen Bedel",
    tax: "Tapu / Vergi",
    nextDate: "İlk İhale Tarihi",
  },
  en: {
    active: "Active Auction Lots",
    avgVal: "Avg. Market Value",
    tax: "Stamp Duty (SDLT)",
    nextDate: "Next Auction Date",
  },
  it: {
    active: "Lotti all'Asta",
    avgVal: "Valore Medio CTU",
    tax: "Imposta Registro",
    nextDate: "Prossima Asta",
  },
  es: {
    active: "Subastas Activas",
    avgVal: "Tasación Media BOE",
    tax: "ITP Autonómico",
    nextDate: "Próxima Subasta",
  },
  fr: {
    active: "Ventes Actives",
    avgVal: "Valeur Moyenne DVF",
    tax: "Droits Mutation",
    nextDate: "Prochaine Audience",
  },
};

function buildEntityFaq(entry: EuMarketLocationEntry, fmtAvg: string): { q: string; a: string } {
  switch (entry.market) {
    case "AT":
      return {
        q: `Wie viele gerichtliche Zwangsversteigerungen (Edikte) laufen aktuell für ${entry.name}?`,
        a: `Aktuell sind für ${entry.name} (${entry.nativeRegionName}) ${entry.totalCount} gerichtliche Liegenschaftsversteigerungen aus der österreichischen Ediktsdatei erfasst. Der durchschnittliche gerichtliche Schätzwert liegt bei ${fmtAvg}, die Nebenkosten (Grunderwerbsteuer + Grundbuch) betragen ${entry.transferTaxPct} %.`,
      };
    case "CH":
      return {
        q: `Wie viele Grundstücksteigerungen & Zwangsversteigerungen (SHAB) sind für ${entry.name} publiziert?`,
        a: `Für ${entry.name} (${entry.nativeRegionName}) sind aktuell ${entry.totalCount} betreibungs- und konkursamtliche Grundstücksteigerungen im Schweizerischen Handelsamtsblatt (SHAB) erfasst. Die durchschnittliche betreibungsamtliche Schätzung liegt bei ${fmtAvg} (kantonale Handänderungssteuer/Gebühr: ${entry.transferTaxPct} %).`,
      };
    case "IT":
      return {
        q: `Quante aste giudiziarie immobiliari (PVP) sono attive a ${entry.name}?`,
        a: `Attualmente per ${entry.name} (${entry.nativeRegionName}) sono censiti ${entry.totalCount} lotti immobiliari all'asta sul Portale delle Vendite Pubbliche (PVP), con un valore medio di stima CTU pari a ${fmtAvg} e Offerta Minima al 75% (art. 571 c.p.c.).`,
      };
    case "ES":
      return {
        q: `¿Cuántas subastas judiciales del BOE están activas en ${entry.name}?`,
        a: `Actualmente existen ${entry.totalCount} subastas judiciales y administrativas del BOE activas en ${entry.name} (${entry.nativeRegionName}), con un Valor de Subasta medio de ${fmtAvg} e ITP autonómico orientativo del ${entry.transferTaxPct}%.`,
      };
    case "FR":
      return {
        q: `Combien de ventes aux enchères immobilières (Licitor / TJ) sont programmées pour ${entry.name} ?`,
        a: `On compte actuellement ${entry.totalCount} ventes aux enchères immobilières judiciaires suivies pour ${entry.name} (${entry.nativeRegionName}), avec une valeur vénale de référence moyenne de ${fmtAvg} et des droits d'enregistrement d'environ ${entry.transferTaxPct} %.`,
      };
    case "GB":
      return {
        q: `How many live UK property auction lots are available in ${entry.name}?`,
        a: `There are currently ${entry.totalCount} active residential and commercial property auction lots tracked in ${entry.name} (${entry.nativeRegionName}), with an average market benchmark of ${fmtAvg} and standard 10% exchange deposit terms.`,
      };
  }
}

export default function PseoEuEntryView({ catalog, entry }: PseoEuEntryViewProps) {
  const copy = EU_MARKET_COPY[catalog.market];
  const meta = EU_MARKET_META[catalog.market];
  const sLabels = STAT_LABELS[catalog.locale] ?? STAT_LABELS.de;

  const fmtAvg = entry.avgAppraisedValue
    ? new Intl.NumberFormat(LOCALE_FORMAT[catalog.locale], {
        style: "currency",
        currency: catalog.currency,
        maximumFractionDigits: 0,
      }).format(entry.avgAppraisedValue)
    : "—";

  const breadcrumbs = [
    { label: "Belowmark", href: "/" },
    { label: meta.shortLabel, href: catalog.hubPath },
    ...(entry.kind !== "region"
      ? [{ label: entry.nativeRegionName, href: `${catalog.hubPath}/${entry.regionSlug}` }]
      : []),
    { label: entry.name, href: `${catalog.hubPath}/${entry.slug}` },
  ];

  const primaryRelated =
    entry.subLinks.length > 0
      ? entry.subLinks.map((s) => ({ label: s.name, href: `${catalog.hubPath}/${s.slug}`, count: s.count }))
      : catalog.regions.map((r) => ({ label: r.name, href: `${catalog.hubPath}/${r.slug}`, count: r.totalCount }));

  const secondaryRelated =
    entry.courtLinks.length > 0
      ? entry.courtLinks.map((c) => ({ label: c.name, href: `${catalog.hubPath}/${c.slug}`, count: c.count }))
      : catalog.regions
          .filter((r) => r.slug !== entry.slug)
          .slice(0, 12)
          .map((r) => ({ label: r.name, href: `${catalog.hubPath}/${r.slug}`, count: r.totalCount }));

  return (
    <PseoDirectoryView
      locale={catalog.locale}
      eyebrow={`${copy.hubEyebrow} · ${entry.nativeRegionName.toUpperCase()}`}
      title={copy.entryTitle(entry)}
      lead={copy.entryLead(entry)}
      canonicalUrl={`${BELOWMARK_ORIGIN}${catalog.hubPath}/${entry.slug}`}
      breadcrumbs={breadcrumbs}
      stats={[
        { label: sLabels.active, value: String(entry.totalCount), accent: true },
        { label: sLabels.avgVal, value: fmtAvg },
        { label: sLabels.tax, value: `${entry.transferTaxPct}%` },
        { label: sLabels.nextDate, value: entry.nextHearingDate ? entry.nextHearingDate.slice(0, 10) : "2026/2027" },
      ]}
      listings={entry.listings}
      relatedTitle={entry.subLinks.length > 0 ? copy.citiesHeading(entry.subLinks.length) : copy.regionsHeading(catalog.regions.length)}
      relatedLinks={primaryRelated}
      secondaryTitle={entry.courtLinks.length > 0 ? copy.courtsHeading(entry.courtLinks.length) : copy.regionsHeading(catalog.regions.length)}
      secondaryLinks={secondaryRelated}
      faqs={[buildEntityFaq(entry, fmtAvg), ...copy.faqs]}
      calcHref={catalog.calcPath}
      calcLabel={copy.calcButtonLabel}
      listingsHeading={copy.listingsHeading}
      faqHeading={copy.faqHeading}
    />
  );
}
