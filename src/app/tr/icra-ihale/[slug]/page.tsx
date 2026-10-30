import { Metadata } from "next";
import { redirect } from "next/navigation";
import BlogShell from "@/components/blog/BlogShell";
import PseoDirectoryView from "@/components/pseo/PseoDirectoryView";
import { BELOWMARK_ORIGIN, DEFAULT_BLOG_OG } from "@/lib/blog/blogSeo";
import { formatNumber } from "@/lib/format";
import { MetaTagService } from "@/services/MetaTagService";
import { PseoService } from "@/services/PseoService";

export const instant = false;

interface TrIcraEntityPageProps {
  params: Promise<{ slug: string }>;
}

const formatTry = (val: number | null) =>
  val === null
    ? "—"
    : `${new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(Math.round(val))} ₺`;

export async function generateMetadata({ params }: TrIcraEntityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const catalog = await PseoService.GetCatalog();
  const entity = catalog.trBySlug.get(slug);
  if (!entity) {
    return MetaTagService.CreateMetaTags({
      title: "Türkiye İcra & E-İhale Gayrimenkul | Belowmark",
      description: "81 ilde güncel icra ve e-ihale gayrimenkul satışları.",
      imgUrl: DEFAULT_BLOG_OG,
      tags: ["İcra İhale", "UYAP E-Satış"],
      url: `${BELOWMARK_ORIGIN}/tr/icra-ihale`,
    });
  }

  return MetaTagService.CreateMetaTags({
    title: `${entity.name} İcradan Satılık Gayrimenkul & E-İhale: ${entity.totalCount} Aktif Dosya | Belowmark`,
    description: `${entity.name} genelinde ${entity.totalCount} aktif UYAP E-Satış ve icra gayrimenkul ihalesi. Muhammen bedel, %50 açılış bedeli, %10 teminat ve TKGM parsel analizi.`,
    imgUrl: DEFAULT_BLOG_OG,
    tags: [
      `${entity.name} icradan satılık`,
      `${entity.name} icra ihale`,
      `${entity.name} uyap e-satış`,
      `${entity.name} icradan satılık daire`,
      `${entity.name} icradan satılık arsa`,
    ],
    url: `${BELOWMARK_ORIGIN}/tr/icra-ihale/${entity.slug}`,
  });
}

export default async function TrIcraEntityPage({ params }: TrIcraEntityPageProps) {
  const { slug } = await params;
  const catalog = await PseoService.GetCatalog();
  const entity = catalog.trBySlug.get(slug);
  if (!entity) redirect("/tr/icra-ihale");

  const provinces = catalog.trLocations.filter((l) => l.kind === "province" && l.slug !== entity.slug).slice(0, 24);

  return (
    <BlogShell lang="tr">
      <PseoDirectoryView
        locale="tr"
        eyebrow={`TÜRKİYE İCRA & E-İHALE · ${entity.provinceName.toUpperCase()}`}
        title={`${entity.name} İcradan Satılık Gayrimenkul & E-İhale (${entity.totalCount} İhale)`}
        lead={`${entity.name} bölgesinde UYAP E-Satış, Basın İlan Kurumu, SGK ve GİB üzerinden satışa sunulan ${entity.totalCount} gayrimenkulün muhammen bedel, %50 açılış bedeli ve %10 teminat özeti.`}
        canonicalUrl={`${BELOWMARK_ORIGIN}/tr/icra-ihale/${entity.slug}`}
        breadcrumbs={[
          { label: "Belowmark", href: "/" },
          { label: "Türkiye İcra & İhale", href: "/tr/icra-ihale" },
          { label: entity.name, href: `/tr/icra-ihale/${entity.slug}` },
        ]}
        stats={[
          { label: "Aktif İhale", value: formatNumber(entity.totalCount, "tr"), accent: true },
          { label: "Ort. Muhammen Bedel", value: formatTry(entity.avgAppraisedValueTry) },
          { label: "Fırsat İhaleleri", value: formatNumber(entity.opportunityCount, "tr") },
          { label: "Ort. İskonto Potansiyeli", value: entity.avgDiscountPct ? `%${entity.avgDiscountPct}` : "%28" },
        ]}
        listings={entity.listings}
        relatedTitle={entity.districts.length > 0 ? `${entity.name} İlçeleri İcra İhaleleri` : `${entity.provinceName} İli ve Diğer İller`}
        relatedLinks={
          entity.districts.length > 0
            ? entity.districts.map((d) => ({
                label: d.name,
                href: `/tr/icra-ihale/${d.slug}`,
                count: d.count,
              }))
            : provinces.map((p) => ({
                label: p.name,
                href: `/tr/icra-ihale/${p.slug}`,
                count: p.totalCount,
              }))
        }
        secondaryTitle="Türkiye Genelinde En Çok İhale Olan İller"
        secondaryLinks={provinces.map((p) => ({
          label: p.name,
          href: `/tr/icra-ihale/${p.slug}`,
          count: p.totalCount,
        }))}
        faqs={[
          {
            q: `${entity.name} bölgesinde şu an kaç adet icradan satılık gayrimenkul var?`,
            a: `Şu anda ${entity.name} genelinde aktif olarak takip edilen ${entity.totalCount} adet konut, arsa, tarla ve ticari taşınmaz icra/ihale dosyası bulunmaktadır.`,
          },
          {
            q: `${entity.name} UYAP E-Satış ihalelerine katılmak için ne kadar teminat yatırılır?`,
            a: `Elektronik satışlarda muhammen bedelin %10'u tutarında teminatın artırma bitiminden önceki gün saat 23:30'a kadar UYAP E-Satış portalı üzerinden yatırılması gerekir. Açılış bedeli muhammen bedelin %50'si + satış masraflarıdır.`,
          },
        ]}
      />
    </BlogShell>
  );
}
