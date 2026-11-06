import { Metadata } from "next";
import BlogShell from "@/components/blog/BlogShell";
import PseoTrHubView from "@/components/pseo/PseoTrHubView";
import { BELOWMARK_ORIGIN, DEFAULT_BLOG_OG, marketHubAlternates } from "@/lib/blog/blogSeo";
import { MetaTagService } from "@/services/MetaTagService";
import { PseoService } from "@/services/PseoService";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const c = await PseoService.GetCatalog();
  const distCount = c.trLocations.filter((l) => l.kind === "district").length;
  return {
    ...MetaTagService.CreateMetaTags({
      title: `Türkiye İcra & UYAP E-İhale: 81 İl ve ${c.trTotalListings} Aktif İhale`,
      description: `81 il ve ${distCount} ilçede güncel ${c.trTotalListings} UYAP E-Satış, Basın İlan, GİB ve SGK gayrimenkul ihalesi: muhammen bedel, %50 açılış ve %10 teminat.`,
      imgUrl: DEFAULT_BLOG_OG,
      tags: [
        "İcra İhale Gayrimenkul",
        "UYAP E-Satış Gayrimenkul",
        "İcradan Satılık Ev",
        "İcradan Satılık Arsa",
        "Basın İlan Kurumu İhale",
        "Muhammen Bedel Hesaplama",
      ],
      url: `${BELOWMARK_ORIGIN}/tr/icra-ihale`,
    }),
    alternates: marketHubAlternates("/tr/icra-ihale"),
  };
}

export default async function TrIcraIhaleHubPage() {
  const catalog = await PseoService.GetCatalog();
  return (
    <BlogShell lang="tr">
      <PseoTrHubView catalog={catalog} />
    </BlogShell>
  );
}
