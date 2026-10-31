import Link from "next/link";
import BlogArticleCta from "@/components/blog/BlogArticleCta";
import PseoListingPreviewCard from "@/components/pseo/PseoListingPreviewCard";
import PseoStatsBanner from "@/components/pseo/PseoStatsBanner";
import { PseoLocale, PseoPreviewListing } from "@/types/pseo.types";

interface PseoDirectoryViewProps {
  locale: PseoLocale;
  eyebrow: string;
  title: string;
  lead: string;
  canonicalUrl: string;
  breadcrumbs: ReadonlyArray<{ label: string; href: string }>;
  stats: ReadonlyArray<{ label: string; value: string; accent?: boolean }>;
  listings: PseoPreviewListing[];
  relatedTitle: string;
  relatedLinks: ReadonlyArray<{ label: string; href: string; count?: number }>;
  secondaryTitle?: string;
  secondaryLinks?: ReadonlyArray<{ label: string; href: string; count?: number }>;
  faqs: ReadonlyArray<{ q: string; a: string }>;
  calcHref?: string;
  calcLabel?: string;
  listingsHeading?: string;
  faqHeading?: string;
}

export default function PseoDirectoryView({
  locale,
  eyebrow,
  title,
  lead,
  canonicalUrl,
  breadcrumbs,
  stats,
  listings,
  relatedTitle,
  relatedLinks,
  secondaryTitle,
  secondaryLinks,
  faqs,
  calcHref,
  calcLabel,
  listingsHeading,
  faqHeading,
}: PseoDirectoryViewProps) {
  const isTr = locale === "tr";
  const resolvedCalcHref =
    calcHref ?? (isTr ? "/tr/hesaplama/icra-ihale-teminat" : "/rechner/5-10-und-7-10-grenze");
  const resolvedCalcLabel =
    calcLabel ??
    (isTr
      ? "🧮 Ücretsiz İcra İhale %10 Teminat & %50 Sınır Hesaplayıcı →"
      : "🧮 Kostenloser 5/10- & 7/10-Grenze + Sicherheitsleistung Rechner →");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((b, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: b.label,
          item: `https://belowmark.com${b.href}`,
        })),
      },
      {
        "@type": "ItemList",
        name: title,
        description: lead,
        url: canonicalUrl,
        numberOfItems: listings.length,
        itemListElement: listings.slice(0, 10).map((item, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: `${item.segmentLabel} in ${item.place} (${item.authority})`,
        })),
      },
      ...(faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 font-mono text-xs text-ink-soft">
        {breadcrumbs.map((b, idx) => (
          <span key={b.href} className="inline-flex items-center gap-2">
            {idx > 0 && <span>/</span>}
            <Link href={b.href} className="hover:text-signal hover:underline">{b.label}</Link>
          </span>
        ))}
      </nav>

      <header className="border-b-2 border-ink pb-7">
        <span className="inline-block bg-signal px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-paper-bright">
          {eyebrow}
        </span>
        <h1 className="mt-3 font-display text-3xl leading-tight text-ink sm:text-5xl">{title}</h1>
        <p className="mt-3 max-w-3xl font-serif text-lg leading-relaxed text-ink-soft">{lead}</p>
        <div className="mt-4">
          <Link href={resolvedCalcHref} className="inline-flex items-center border-2 border-ink bg-paper-deep px-4 py-2 font-narrow text-xs font-semibold uppercase tracking-wider text-ink hover:bg-ink hover:text-paper-bright">
            {resolvedCalcLabel}
          </Link>
        </div>
        <PseoStatsBanner stats={stats} />
      </header>

      <div className="mt-10">
        <h2 className="font-display text-2xl text-ink sm:text-3xl">
          {listingsHeading ?? (isTr ? "Güncel İcra & İhale Gayrimenkul Listesi" : "Aktuelle Zwangsversteigerungstermine & Objekte")}
        </h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((item) => <PseoListingPreviewCard key={item.key} item={item} locale={locale} />)}
        </div>
      </div>

      {relatedLinks.length > 0 && (
        <div className="mt-12 border-2 border-ink bg-paper-bright p-6">
          <h2 className="font-display text-2xl text-ink">{relatedTitle}</h2>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {relatedLinks.map((rl) => (
              <Link key={rl.href} href={rl.href} className="border border-ink bg-paper px-3 py-1.5 font-mono text-xs text-ink transition-colors hover:border-signal hover:bg-signal hover:text-paper-bright">
                {rl.label} {typeof rl.count === "number" ? `(${rl.count})` : ""}
              </Link>
            ))}
          </div>
        </div>
      )}

      {secondaryLinks && secondaryLinks.length > 0 && (
        <div className="mt-6 border-2 border-ink bg-paper-bright p-6">
          <h2 className="font-display text-2xl text-ink">{secondaryTitle}</h2>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {secondaryLinks.map((sl) => (
              <Link key={sl.href} href={sl.href} className="border border-ink bg-paper px-3 py-1.5 font-mono text-xs text-ink transition-colors hover:border-signal hover:bg-signal hover:text-paper-bright">
                {sl.label} {typeof sl.count === "number" ? `(${sl.count})` : ""}
              </Link>
            ))}
          </div>
        </div>
      )}

      {faqs.length > 0 && (
        <div className="mt-12 border-2 border-ink bg-paper-bright p-6 sm:p-8">
          <h2 className="font-display text-2xl text-ink sm:text-3xl">
            {faqHeading ?? (isTr ? "Sıkça Sorulan Sorular (SSS)" : "Häufig gestellte Fragen (FAQ)")}
          </h2>
          <div className="mt-5 space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="border-b border-rule-strong pb-4 last:border-b-0">
                <h3 className="font-display text-lg text-ink">{f.q}</h3>
                <p className="mt-1.5 font-serif text-base leading-relaxed text-ink-soft">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <BlogArticleCta lang={locale} />
    </section>
  );
}
