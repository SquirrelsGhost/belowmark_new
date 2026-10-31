import Link from "next/link";
import BlogArticleCta from "@/components/blog/BlogArticleCta";
import PseoEuPublicCalculator from "@/components/pseo/PseoEuPublicCalculator";
import { BELOWMARK_ORIGIN } from "@/lib/blog/blogSeo";
import { EU_MARKET_COPY } from "@/lib/pseo/euMarketCopy";
import { EU_MARKET_META } from "@/lib/pseo/euMarketRegions";
import { EuMarketCatalog } from "@/types/pseo.types";

interface PseoEuCalculatorPageViewProps {
  catalog: EuMarketCatalog;
}

export default function PseoEuCalculatorPageView({ catalog }: PseoEuCalculatorPageViewProps) {
  const copy = EU_MARKET_COPY[catalog.market];
  const meta = EU_MARKET_META[catalog.market];
  const canonicalUrl = `${BELOWMARK_ORIGIN}${catalog.calcPath}`;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: copy.calcMetaTitle,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: canonicalUrl,
    offers: { "@type": "Offer", price: "0", priceCurrency: meta.currency },
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />

      <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-ink-muted">
        <Link href="/" className="hover:text-ink">Belowmark</Link>
        <span>/</span>
        <Link href={catalog.hubPath} className="hover:text-ink">{meta.shortLabel}</Link>
        <span>/</span>
        <span className="font-semibold text-signal">Calculator</span>
      </div>

      <h1 className="mt-4 font-display text-3xl leading-[1.08] tracking-tight text-ink sm:text-5xl">
        {copy.calcPageTitle}
      </h1>
      <p className="mt-4 max-w-3xl font-serif text-lg leading-relaxed text-ink-soft">{copy.calcPageLead}</p>

      <div className="mt-8">
        <PseoEuPublicCalculator market={catalog.market} />
      </div>

      <section className="mt-12 border-t-2 border-ink pt-8">
        <h2 className="font-display text-2xl text-ink">{copy.faqHeading}</h2>
        <div className="mt-5 grid gap-4">
          {copy.faqs.map((f) => (
            <div key={f.q} className="border border-rule-strong bg-paper-bright p-5">
              <h3 className="font-display text-lg text-ink">{f.q}</h3>
              <p className="mt-2 font-serif text-sm leading-relaxed text-ink-soft">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 border-t border-rule-strong pt-8">
        <h2 className="font-display text-xl text-ink">{copy.regionsHeading(catalog.regions.length)}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {catalog.regions.map((reg) => (
            <Link
              key={reg.slug}
              href={`${catalog.hubPath}/${reg.slug}`}
              className="border border-rule-strong bg-paper px-3 py-1.5 font-mono text-xs text-ink hover:border-ink hover:bg-paper-bright"
            >
              {reg.name} ({reg.totalCount})
            </Link>
          ))}
        </div>
      </section>

      <BlogArticleCta lang={catalog.locale} />
    </div>
  );
}
