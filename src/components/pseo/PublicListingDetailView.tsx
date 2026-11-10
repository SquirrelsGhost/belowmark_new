import Link from "next/link";
import BlogArticleCta from "@/components/blog/BlogArticleCta";
import PseoListingPreviewCard from "@/components/pseo/PseoListingPreviewCard";
import PublicListingFactsCard from "@/components/pseo/PublicListingFactsCard";
import PublicListingUnlockCard from "@/components/pseo/PublicListingUnlockCard";
import { BELOWMARK_ORIGIN } from "@/lib/blog/blogSeo";
import { buildPublicListingFaqs, PUBLIC_LISTING_LABELS } from "@/lib/pseo/publicListingCopy";
import { PublicListingResolved } from "@/services/PublicListingService";

interface PublicListingDetailViewProps {
  item: PublicListingResolved;
  isSignedIn: boolean;
}

export default function PublicListingDetailView({ item, isSignedIn }: PublicListingDetailViewProps) {
  const L = PUBLIC_LISTING_LABELS[item.locale];
  const faqs = buildPublicListingFaqs(item);
  const price = item.minBidValue ?? item.appraisedValue;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: item.breadcrumbs.map((b, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: b.label,
          item: `${BELOWMARK_ORIGIN}${b.href === "/" ? "/" : b.href}`,
        })),
      },
      {
        "@type": "RealEstateListing",
        name: item.headline,
        description: `${item.segmentLabel} · ${item.postcode ? `${item.postcode} ` : ""}${item.cleanCity} (${item.authority})`,
        url: item.canonicalUrl,
        ...(item.hearingDate ? { datePosted: item.hearingDate } : {}),
        contentLocation: {
          "@type": "Place",
          name: `${item.postcode ? `${item.postcode} ` : ""}${item.cleanCity}`,
          address: {
            "@type": "PostalAddress",
            addressLocality: item.cleanCity,
            addressRegion: item.regionName,
            ...(item.postcode ? { postalCode: item.postcode } : {}),
            addressCountry: item.country,
          },
        },
        ...(price
          ? {
              offers: {
                "@type": "Offer",
                price,
                priceCurrency: item.currency,
                availability: "https://schema.org/InStock",
                ...(item.hearingDate ? { validThrough: item.hearingDate } : {}),
              },
            }
          : {}),
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 font-mono text-xs text-ink-soft">
        {item.breadcrumbs.map((b, idx) => (
          <span key={b.href} className="inline-flex items-center gap-2">
            {idx > 0 && <span>/</span>}
            <Link href={b.href} className="hover:text-signal hover:underline">
              {b.label}
            </Link>
          </span>
        ))}
      </nav>

      <header className="border-b-2 border-ink pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-block bg-signal px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-paper-bright">
            {L.eyebrowPrefix} · {item.country}
          </span>
          {item.limitsWaived && (
            <span className="inline-block border border-verdict bg-verdict-tint px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-verdict">
              {L.waivedYes}
            </span>
          )}
        </div>
        <h1 className="mt-3 font-display text-3xl leading-tight text-ink sm:text-4xl">{item.headline}</h1>
        <p className="mt-2 font-mono text-xs text-ink-soft">
          {item.segmentLabel} · {item.postcode ? `${item.postcode} ` : ""}
          {item.cleanCity} ({item.regionName}) · {item.authority}
        </p>
      </header>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <PublicListingFactsCard item={item} />
        </div>
        <div className="lg:sticky lg:top-6 lg:col-span-5">
          <PublicListingUnlockCard item={item} isSignedIn={isSignedIn} />
        </div>
      </div>

      {item.relatedListings.length > 0 && (
        <div className="mt-14">
          <h2 className="font-display text-2xl text-ink sm:text-3xl">{L.relatedHeading}</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {item.relatedListings.map((rel) => (
              <PseoListingPreviewCard key={rel.key} item={rel} locale={item.locale} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 border-2 border-ink bg-paper-bright p-6 sm:p-8">
        <h2 className="font-display text-2xl text-ink sm:text-3xl">{L.faqHeading}</h2>
        <div className="mt-5 space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="border-b border-rule-strong pb-4 last:border-b-0">
              <h3 className="font-display text-lg text-ink">{f.q}</h3>
              <p className="mt-1.5 font-serif text-base leading-relaxed text-ink-soft">{f.a}</p>
            </div>
          ))}
        </div>
      </div>

      <BlogArticleCta lang={item.locale} />
    </section>
  );
}
