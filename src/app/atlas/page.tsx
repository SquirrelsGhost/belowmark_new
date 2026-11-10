import { Metadata } from "next";
import BlogShell from "@/components/blog/BlogShell";
import PublicAtlasView from "@/components/pseo/PublicAtlasView";
import { BELOWMARK_ORIGIN, DEFAULT_BLOG_OG } from "@/lib/blog/blogSeo";
import { ATLAS_COPY, buildAtlasAlternates } from "@/lib/pseo/atlasCopy";
import { MetaTagService } from "@/services/MetaTagService";
import { PseoService } from "@/services/PseoService";

// Uses live catalog counts at request time.
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const c = await PseoService.GetCatalog();
  const euSum = Object.values(c.euMarkets).reduce((s, m) => s + m.totalListings, 0);
  const total = (c.deTotalListings + c.trTotalListings + euSum).toLocaleString("de-DE");
  const copy = ATLAS_COPY.de;
  return {
    ...MetaTagService.CreateMetaTags({
      title: copy.metaTitle(total),
      description: copy.metaDesc(total),
      imgUrl: DEFAULT_BLOG_OG,
      tags: [
        "Zwangsversteigerung Statistik",
        "Zwangsversteigerungen Deutschland Zahlen",
        "Immobilien Zwangsversteigerung Studie",
        "European Foreclosure Market Report",
      ],
      url: `${BELOWMARK_ORIGIN}/atlas`,
    }),
    alternates: buildAtlasAlternates("de"),
  };
}

export default async function PublicAtlasPage() {
  const catalog = await PseoService.GetCatalog();
  return (
    <BlogShell lang="de">
      <PublicAtlasView catalog={catalog} locale="de" />
    </BlogShell>
  );
}
