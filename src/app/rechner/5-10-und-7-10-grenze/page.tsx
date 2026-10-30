import { Metadata } from "next";
import BlogShell from "@/components/blog/BlogShell";
import PseoCalculatorPageView from "@/components/pseo/PseoCalculatorPageView";
import { BELOWMARK_ORIGIN, DEFAULT_BLOG_OG } from "@/lib/blog/blogSeo";
import { MetaTagService } from "@/services/MetaTagService";
import { PseoService } from "@/services/PseoService";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return MetaTagService.CreateMetaTags({
    title: "5/10- & 7/10-Grenze Rechner: Zwangsversteigerung (§ 74a / § 85a ZVG) & Sicherheitsleistung | Belowmark",
    description:
      "Kostenloser ZVG-Rechner: Berechnen Sie sofort die 5/10-Wertgrenze (§ 85a ZVG), 7/10-Grenze (§ 74a ZVG), 10 % Sicherheitsleistung (§ 68 ZVG) und Grunderwerbsteuer für jede Zwangsversteigerung.",
    imgUrl: DEFAULT_BLOG_OG,
    tags: [
      "5/10 Grenze Rechner",
      "7/10 Grenze Zwangsversteigerung",
      "§ 85a ZVG",
      "§ 74a ZVG",
      "Sicherheitsleistung Zwangsversteigerung 10 Prozent",
      "Zwangsversteigerung Nebenkosten Rechner",
    ],
    url: `${BELOWMARK_ORIGIN}/rechner/5-10-und-7-10-grenze`,
  });
}

export default async function DeCalculatorPage() {
  const catalog = await PseoService.GetCatalog();
  const topEntities = catalog.courts.slice(0, 24).map((c) => ({
    slug: c.slug,
    name: c.displayName,
    totalCount: c.totalCount,
  }));
  return (
    <BlogShell lang="de">
      <PseoCalculatorPageView locale="de" topEntities={topEntities} />
    </BlogShell>
  );
}
