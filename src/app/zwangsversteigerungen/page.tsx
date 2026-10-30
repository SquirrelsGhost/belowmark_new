import { Metadata } from "next";
import BlogShell from "@/components/blog/BlogShell";
import PseoDeHubView from "@/components/pseo/PseoDeHubView";
import { BELOWMARK_ORIGIN, DEFAULT_BLOG_OG } from "@/lib/blog/blogSeo";
import { MetaTagService } from "@/services/MetaTagService";
import { PseoService } from "@/services/PseoService";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const c = await PseoService.GetCatalog();
  const courtCount = c.courts.length;
  const cityCount = c.cities.length;
  return MetaTagService.CreateMetaTags({
    title: `Zwangsversteigerung Deutschland: Alle ${courtCount} Amtsgerichte & ${c.deTotalListings} Termine | Belowmark`,
    description: `Aktuelles Verzeichnis aller ${c.deTotalListings} Immobilien-Zwangsversteigerungen (§ 39 ZVG) an ${courtCount} Amtsgerichten in ${cityCount} Städten mit 5/10- & 7/10-Wertgrenzen.`,
    imgUrl: DEFAULT_BLOG_OG,
    tags: [
      "Zwangsversteigerung Deutschland",
      "Zwangsversteigerung Immobilien",
      "Amtsgericht Zwangsversteigerung",
      "ZVG Portal Termine",
      "5/10 Grenze",
      "7/10 Grenze",
      "Verkehrswert Gutachten",
    ],
    url: `${BELOWMARK_ORIGIN}/zwangsversteigerungen`,
  });
}

export default async function ZwangsversteigerungenHubPage() {
  const catalog = await PseoService.GetCatalog();
  return (
    <BlogShell lang="de">
      <PseoDeHubView catalog={catalog} />
    </BlogShell>
  );
}
