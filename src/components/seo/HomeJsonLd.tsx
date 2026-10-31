import { BELOWMARK_ORIGIN } from "@/lib/blog/blogSeo";

interface HomeJsonLdProps {
  faqs: ReadonlyArray<{ Question: string; Answer: string }>;
}

export default function HomeJsonLd({ faqs }: HomeJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${BELOWMARK_ORIGIN}/#organization`,
        name: "Belowmark",
        url: BELOWMARK_ORIGIN,
        logo: `${BELOWMARK_ORIGIN}/og/home-de.png`,
        sameAs: [
          `${BELOWMARK_ORIGIN}/blog`,
          `${BELOWMARK_ORIGIN}/tr/blog`,
          `${BELOWMARK_ORIGIN}/en/blog`,
          `${BELOWMARK_ORIGIN}/it/blog`,
          `${BELOWMARK_ORIGIN}/es/blog`,
          `${BELOWMARK_ORIGIN}/fr/blog`,
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${BELOWMARK_ORIGIN}/#website`,
        url: BELOWMARK_ORIGIN,
        name: "Belowmark — Zwangsversteigerungen, Edikte, SHAB, Aste Giudiziarie, Subastas BOE, Licitor, UK Auctions & İcra İhale",
        publisher: { "@id": `${BELOWMARK_ORIGIN}/#organization` },
        inLanguage: ["de", "tr", "en", "it", "es", "fr", "ar", "ru"],
      },
      {
        "@type": "SoftwareApplication",
        name: "Belowmark Foreclosure & Property Auction Intelligence Terminal",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        url: BELOWMARK_ORIGIN,
        offers: {
          "@type": "AggregateOffer",
          lowPrice: "0",
          highPrice: "79",
          priceCurrency: "EUR",
          offerCount: "8",
        },
      },
      {
        "@type": "Dataset",
        name: "Belowmark Official European & Turkish Foreclosure & Court Auction Dataset (DE, AT, CH, IT, ES, FR, GB, TR)",
        description:
          "Daily updated official court foreclosure and property auction proceedings across Germany (ZVG), Austria (Ediktsdatei), Switzerland (SHAB), Italy (PVP Aste Giudiziarie), Spain (Portal BOE), France (Licitor TJ), UK (Property Auctions), and Turkey (UYAP E-İhale).",
        url: `${BELOWMARK_ORIGIN}/zwangsversteigerungen`,
        creator: { "@id": `${BELOWMARK_ORIGIN}/#organization` },
        isAccessibleForFree: true,
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((item) => ({
          "@type": "Question",
          name: item.Question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.Answer,
          },
        })),
      },
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
