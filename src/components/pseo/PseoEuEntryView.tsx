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

export default function PseoEuEntryView({ catalog, entry }: PseoEuEntryViewProps) {
  const copy = EU_MARKET_COPY[catalog.market];
  const meta = EU_MARKET_META[catalog.market];

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
        { label: "Active Lots / Edikte", value: String(entry.totalCount), accent: true },
        { label: "Avg. Valuation", value: fmtAvg },
        { label: "Transfer Tax", value: `${entry.transferTaxPct}%` },
        { label: "Next Auction", value: entry.nextHearingDate ? entry.nextHearingDate.slice(0, 10) : "2026/2027" },
      ]}
      listings={entry.listings}
      relatedTitle={entry.subLinks.length > 0 ? copy.citiesHeading(entry.subLinks.length) : copy.regionsHeading(catalog.regions.length)}
      relatedLinks={primaryRelated}
      secondaryTitle={entry.courtLinks.length > 0 ? copy.courtsHeading(entry.courtLinks.length) : copy.regionsHeading(catalog.regions.length)}
      secondaryLinks={secondaryRelated}
      faqs={copy.faqs}
      calcHref={catalog.calcPath}
      calcLabel={copy.calcButtonLabel}
      listingsHeading={copy.listingsHeading}
      faqHeading={copy.faqHeading}
    />
  );
}
