import { Metadata } from "next";
import EmbedCalculatorWidget from "@/components/pseo/EmbedCalculatorWidget";
import { BELOWMARK_ORIGIN, DEFAULT_BLOG_OG } from "@/lib/blog/blogSeo";
import { isPricingCountry, PricingCountryCode } from "@/lib/constants";
import { MetaTagService } from "@/services/MetaTagService";

// Reads request-time searchParams (?country=DE|AT|CH|TR|IT|ES|FR|GB) for iframe embeds.
export const instant = false;

interface EmbedRechnerPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...MetaTagService.CreateMetaTags({
      title: "Zwangsversteigerung Wertgrenzen- & Gebotsrechner (Embed) | Belowmark",
      description: "Kostenfreier interaktiver 5/10- & 7/10-Zwangsversteigerungs-Rechner für Redaktionen, Immobilienblogs und Finanzierungsberater.",
      imgUrl: DEFAULT_BLOG_OG,
      tags: ["ZVG Rechner Embed", "5/10 7/10 Rechner", "Belowmark Widget"],
      url: `${BELOWMARK_ORIGIN}/atlas`,
    }),
    robots: { index: false, follow: true },
  };
}

export default async function EmbedRechnerPage({ searchParams }: EmbedRechnerPageProps) {
  const raw = await searchParams;
  const rawCountry = typeof raw.country === "string" ? raw.country.trim().toUpperCase() : "DE";
  const country: PricingCountryCode = isPricingCountry(rawCountry) ? rawCountry : "DE";

  return (
    <main className="min-h-screen bg-paper p-2 sm:p-3">
      <EmbedCalculatorWidget initialCountry={country} />
    </main>
  );
}
