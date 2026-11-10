import { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
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
    permanentRedirect("/tr/icra-ihale");
  }
  if (entity.slug !== slug) {
    permanentRedirect(`/tr/icra-ihale/${entity.slug}`);
  }

  const trBids = entity.listings
    .map((l) => l.minimumBid ?? l.appraisedValue)
    .filter((v): v is number => typeof v === "number" && v > 0);
  const minBidTry = trBids.length > 0 ? Math.min(...trBids) : null;
  const minBidStr = minBidTry ? ` (${formatTry(minBidTry)}'den)` : "";
  const isCourt = entity.kind === "court";
  const isCategory = entity.kind === "category";
  const fullTitle = isCourt
    ? `${entity.name}: ${entity.totalCount} İcra İhale & Gayrimenkul Satış İlanı`
    : isCategory
      ? `${entity.name}: ${entity.totalCount} Aktif UYAP E-İhale${minBidStr}`
      : `${entity.name} İcradan Satılık Daire, Ev & Arsa: ${entity.totalCount} İhale${minBidStr}`;
  const compactTitle = isCategory
    ? `${entity.name}: ${entity.totalCount} Aktif İhale`
    : `${entity.name} İcradan Satılık: ${entity.totalCount} İhale${minBidStr}`;
  return MetaTagService.CreateMetaTags({
    title: fullTitle.length <= 68 ? fullTitle : compactTitle,
    description: isCourt
      ? `${entity.name} (${entity.provinceName}) tarafından yürütülen ${entity.totalCount} güncel gayrimenkul icra satış ihalesi${minBidStr}: Esas No, muhammen bedel, %50 açılış ve %10 teminat.`
      : `${entity.name} genelinde icradan satılık daire, müstakil ev, arsa ve tarla (${entity.totalCount} aktif UYAP E-Satış ihalesi${minBidStr}). Muhammen bedel, %50 açılış ve şartname PDF.`,
    imgUrl: DEFAULT_BLOG_OG,
    tags: [
      `${entity.name} icradan satılık`,
      `${entity.name} icradan satılık daireler`,
      `${entity.name} icradan satılık evler`,
      `${entity.name} icradan satılık arsa tarla`,
      `${entity.name} icra ihale`,
      `${entity.name} uyap e-satış`,
    ],
    url: `${BELOWMARK_ORIGIN}/tr/icra-ihale/${entity.slug}`,
  });
}

export default async function TrIcraEntityPage({ params }: TrIcraEntityPageProps) {
  const { slug } = await params;
  const catalog = await PseoService.GetCatalog();
  const entity = catalog.trBySlug.get(slug);
  if (!entity) permanentRedirect("/tr/icra-ihale");
  if (entity.slug !== slug) permanentRedirect(`/tr/icra-ihale/${entity.slug}`);

  const provinces = catalog.trLocations.filter((l) => l.kind === "province" && l.slug !== entity.slug).slice(0, 24);
  const isCourt = entity.kind === "court";
  const isCategory = entity.kind === "category";

  return (
    <BlogShell lang="tr">
      <PseoDirectoryView
        locale="tr"
        eyebrow={
          isCourt
            ? `İCRA DAİRESİ & SATIŞ MEMURLUĞU · ${entity.provinceName.toUpperCase()}`
            : `TÜRKİYE İCRA & E-İHALE · ${entity.provinceName.toUpperCase()}`
        }
        title={
          isCourt
            ? `${entity.name}: ${entity.totalCount} Aktif Gayrimenkul İcra Satış İhalesi`
            : isCategory
              ? `${entity.name}: ${entity.totalCount} Aktif UYAP E-Satış İhalesi`
              : `${entity.name} İcradan Satılık Daire, Ev, Arsa & Tarla (${entity.totalCount} İhale)`
        }
        lead={
          isCourt
            ? `${entity.name} (${entity.provinceName}) nezdinde UYAP E-Satış üzerinden satışa çıkarılan ${entity.totalCount} gayrimenkul dosyasının esas numarası, muhammen bedel, %50 açılış bedeli ve %10 teminat özeti.`
            : `${entity.name} bölgesinde UYAP E-Satış, Basın İlan Kurumu, SGK ve GİB üzerinden icradan satışa sunulan ${entity.totalCount} daire, müstakil ev, arsa, tarla ve işyerinin muhammen bedel, %50 açılış bedeli ve %10 teminat özeti.`
        }
        canonicalUrl={`${BELOWMARK_ORIGIN}/tr/icra-ihale/${entity.slug}`}
        breadcrumbs={[
          { label: "Belowmark", href: "/" },
          { label: "Türkiye İcra & İhale", href: "/tr/icra-ihale" },
          ...(entity.kind !== "province" && entity.kind !== "category"
            ? [{ label: entity.provinceName, href: `/tr/icra-ihale/${entity.provinceSlug}` }]
            : []),
          { label: entity.name, href: `/tr/icra-ihale/${entity.slug}` },
        ]}
        stats={[
          { label: "Aktif İhale", value: formatNumber(entity.totalCount, "tr"), accent: true },
          { label: "Ort. Muhammen Bedel", value: formatTry(entity.avgAppraisedValueTry) },
          { label: "Fırsat İhaleleri", value: formatNumber(entity.opportunityCount, "tr") },
          { label: "Ort. İskonto Potansiyeli", value: entity.avgDiscountPct ? `%${entity.avgDiscountPct}` : "%28" },
        ]}
        listings={entity.listings}
        relatedTitle={
          entity.districts.length > 0
            ? `${entity.name} İlçeleri İcradan Satılık Daire & Arsa İhaleleri`
            : `${entity.provinceName} İli ve Diğer İller`
        }
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
        secondaryTitle={
          entity.courts && entity.courts.length > 0
            ? `${entity.name} İcra Daireleri ve Satış Memurlukları`
            : "Türkiye Genelinde En Çok İhale Olan İller"
        }
        secondaryLinks={
          entity.courts && entity.courts.length > 0
            ? entity.courts.map((c) => ({
                label: c.name,
                href: `/tr/icra-ihale/${c.slug}`,
                count: c.count,
              }))
            : provinces.map((p) => ({
                label: p.name,
                href: `/tr/icra-ihale/${p.slug}`,
                count: p.totalCount,
              }))
        }
        faqs={[
          {
            q: `${entity.name} genelinde şu an kaç adet icradan satılık daire, ev, arsa ve tarla ihalesi var?`,
            a: `Şu anda ${entity.name} kapsamında aktif olarak takip edilen ${entity.totalCount} adet icradan satılık daire, müstakil ev, arsa, tarla ve ticari taşınmaz ihale dosyası bulunmaktadır. Ortalama muhammen bedel ${formatTry(entity.avgAppraisedValueTry)} seviyesindedir.`,
          },
          {
            q: `${entity.name} UYAP E-Satış ihalelerine katılmak için ne kadar teminat yatırılır?`,
            a: `Elektronik satışlarda muhammen bedelin %10'u tutarında teminatın artırma bitiminden önceki gün saat 23:30'a kadar UYAP E-Satış portalı (esatis.uyap.gov.tr) üzerinden yatırılması gerekir. İlk artırmada açılış bedeli muhammen bedelin %50'si + paraya çevirme ve paylaştırma masraflarıdır.`,
          },
          {
            q: `${entity.name} icra ihale şartnamesi ve bilirkişi raporu nasıl ücretsiz incelenir?`,
            a: `Belowmark'ta e-posta adresinizi doğrulayarak seçtiğiniz 1 ihale dosyasını (1 Ücretsiz Dosya hakkıyla, kartsız) esas numarası, açık adres, resmî şartname PDF'i ve yapay zekâ şerh/risk analiziyle birlikte tamamen ücretsiz açabilirsiniz.`,
          },
        ]}
      />
    </BlogShell>
  );
}
