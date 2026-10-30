import { Metadata } from "next";
import BlogShell from "@/components/blog/BlogShell";
import PseoCalculatorPageView from "@/components/pseo/PseoCalculatorPageView";
import { BELOWMARK_ORIGIN, DEFAULT_BLOG_OG } from "@/lib/blog/blogSeo";
import { MetaTagService } from "@/services/MetaTagService";
import { PseoService } from "@/services/PseoService";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return MetaTagService.CreateMetaTags({
    title: "İcra İhale %50 Açılış Bedeli, %10 Teminat ve Tapu Harcı Hesaplama Aracı | Belowmark",
    description:
      "Ücretsiz UYAP E-Satış ve İcra İhale Hesaplama Aracı: Muhammen bedel üzerinden %50 açılış bedeli, %10 teminat tutarı, %2 alıcı tapu harcı ve KDV dahil toplam maliyeti anında hesaplayın.",
    imgUrl: DEFAULT_BLOG_OG,
    tags: [
      "İcra ihale hesaplama",
      "UYAP e-satış teminat hesaplama",
      "İcradan ev alma maliyet hesaplama",
      "Muhammen bedel %50 hesaplama",
      "İcra ihale tapu harcı ve KDV",
    ],
    url: `${BELOWMARK_ORIGIN}/tr/hesaplama/icra-ihale-teminat`,
  });
}

export default async function TrCalculatorPage() {
  const catalog = await PseoService.GetCatalog();
  const topEntities = catalog.trLocations
    .filter((l) => l.kind === "province")
    .slice(0, 24)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      totalCount: p.totalCount,
    }));
  return (
    <BlogShell lang="tr">
      <PseoCalculatorPageView locale="tr" topEntities={topEntities} />
    </BlogShell>
  );
}
