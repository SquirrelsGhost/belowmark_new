import { Metadata } from "next";
import BlogShell from "@/components/blog/BlogShell";
import PublicAtlasView from "@/components/pseo/PublicAtlasView";
import { BELOWMARK_ORIGIN, DEFAULT_BLOG_OG } from "@/lib/blog/blogSeo";
import { MetaTagService } from "@/services/MetaTagService";
import { PseoService } from "@/services/PseoService";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const c = await PseoService.GetCatalog();
  const euSum = Object.values(c.euMarkets).reduce((s, m) => s + m.totalListings, 0);
  const total = c.deTotalListings + c.trTotalListings + euSum;
  return MetaTagService.CreateMetaTags({
    title: `Zwangsversteigerungs-Atlas 2026: ${total.toLocaleString("de-DE")} Auktionen in 8 Ländern`,
    description: `Aktuelle Statistik & Marktstudie zu ${total.toLocaleString("de-DE")} gerichtlichen Immobilienversteigerungen in DE, AT, CH, TR, IT, ES, FR & UK: Wertgrenzen, Abschläge & Gerichte.`,
    imgUrl: DEFAULT_BLOG_OG,
    tags: [
      "Zwangsversteigerung Statistik",
      "Zwangsversteigerungen Deutschland Zahlen",
      "Immobilien Zwangsversteigerung Studie",
      "European Foreclosure Market Report",
    ],
    url: `${BELOWMARK_ORIGIN}/atlas`,
  });
}

export default async function PublicAtlasPage() {
  const catalog = await PseoService.GetCatalog();
  return (
    <BlogShell lang="de">
      <PublicAtlasView catalog={catalog} />
    </BlogShell>
  );
}
