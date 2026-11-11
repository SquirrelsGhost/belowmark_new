import Link from "next/link";
import PseoRelatedGuides from "@/components/pseo/PseoRelatedGuides";
import PseoStatsBanner from "@/components/pseo/PseoStatsBanner";
import { BELOWMARK_ORIGIN } from "@/lib/blog/blogSeo";
import { ROUTES } from "@/lib/constants";
import { formatNumber } from "@/lib/format";
import { PseoCatalog } from "@/types/pseo.types";

interface PseoTrHubViewProps {
  catalog: PseoCatalog;
}

const formatTry = (val: number | null) =>
  val === null
    ? "—"
    : `${new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(Math.round(val))} ₺`;

const ITEM_LINK_CLASS =
  "flex items-center justify-between border border-rule bg-paper px-3 py-2 text-xs transition-colors hover:border-ink hover:bg-paper-bright";

export default function PseoTrHubView({ catalog }: PseoTrHubViewProps) {
  const provinces = catalog.trLocations.filter((l) => l.kind === "province");
  const districts = catalog.trLocations.filter((l) => l.kind === "district");
  const courts = catalog.trLocations.filter((l) => l.kind === "court");
  const allCategories = catalog.trLocations.filter((l) => l.kind === "category");
  const nationalCategories = allCategories.filter((c) => c.provinceName.startsWith("Türkiye"));
  const topRegionalCategories = allCategories.filter((c) => !c.provinceName.startsWith("Türkiye")).slice(0, 12);
  const topDistricts = districts.slice(0, 60);
  const topCourts = courts.slice(0, 48);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Türkiye İcra & E-İhale Gayrimenkul Rehberi — 81 İl & ${catalog.trTotalListings} İhale`,
    description: `81 il ve ${districts.length} ilçede güncel ${catalog.trTotalListings} UYAP E-Satış, Basın İlan Kurumu, SGK ve GİB gayrimenkul icra ihalesi.`,
    url: `${BELOWMARK_ORIGIN}/tr/icra-ihale`,
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="border-b-2 border-ink pb-8">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-ink-muted">
          <Link href="/" className="hover:text-ink">Belowmark</Link>
          <span>/</span>
          <span className="font-semibold text-signal">Türkiye İcra &amp; E-İhale</span>
        </div>
        <h1 className="mt-4 font-display text-3xl leading-[1.08] tracking-tight text-ink sm:text-5xl">
          Türkiye İcra &amp; E-İhale Gayrimenkul Rehberi: {provinces.length} İl &amp; {formatNumber(catalog.trTotalListings, "tr")} Aktif İhale
        </h1>
        <p className="mt-4 max-w-3xl font-serif text-lg leading-relaxed text-ink-soft">
          UYAP E-Satış, Basın İlan Kurumu (ilan.gov.tr), GİB, SGK ve banka e-ihalelerinde satışa çıkan konut, arsa, tarla ve ticari taşınmazların muhammen bedel, %50 açılış bedeli ve %10 teminat analizleri.
        </p>

        <PseoStatsBanner
          stats={[
            { label: "Aktif İcra & İhale", value: formatNumber(catalog.trTotalListings, "tr"), accent: true },
            { label: "Kapsanan İl", value: formatNumber(provinces.length, "tr") },
            { label: "Kapsanan İlçe", value: formatNumber(districts.length, "tr") },
            { label: "Teminat Oranı", value: "%10" },
          ]}
        />

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`${ROUTES.signup}?markt=TR`} className="inline-flex h-11 items-center border-2 border-signal bg-signal px-5 font-narrow text-xs font-semibold uppercase tracking-[0.08em] text-paper-bright transition-colors hover:bg-signal-deep">
            🎁 1 Ücretsiz Dosya (Kartsız): Esas No &amp; Şartname PDF&apos;i Aç →
          </Link>
          <Link href="/tr/hesaplama/icra-ihale-teminat" className="inline-flex h-11 items-center border-2 border-ink bg-paper-bright px-5 font-narrow text-xs font-semibold uppercase tracking-[0.08em] text-ink transition-colors hover:bg-ink hover:text-paper-bright">
            İcra İhale %50 Açılış &amp; Teminat Hesaplama
          </Link>
          <Link href="/suche?markt=TR" className="inline-flex h-11 items-center border border-rule-strong bg-paper px-4 font-mono text-xs text-ink-soft hover:border-ink hover:text-ink">
            🔍 Canlı İhale Arama ({formatNumber(catalog.trTotalListings, "tr")})
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 pt-2 font-mono text-[11px]">
          {nationalCategories.map((cat) => (
            <Link key={cat.slug} href={`/tr/icra-ihale/${cat.slug}`} className="border border-ink bg-paper-bright px-2.5 py-1 font-semibold text-ink hover:bg-signal hover:text-paper-bright">
              {cat.name} ({cat.totalCount})
            </Link>
          ))}
        </div>
        {topRegionalCategories.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5 font-mono text-[11px]">
            {topRegionalCategories.map((cat) => (
              <Link key={cat.slug} href={`/tr/icra-ihale/${cat.slug}`} className="border border-rule-strong bg-paper px-2 py-0.5 text-ink-soft hover:border-ink hover:text-ink">
                {cat.name} ({cat.totalCount})
              </Link>
            ))}
          </div>
        )}
      </header>

      <section className="mt-12">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule-strong pb-3">
          <h2 className="font-display text-2xl text-ink">81 İl İcra &amp; Gayrimenkul İhale Listesi</h2>
          <span className="font-mono text-xs text-ink-muted">İl sayfasında tüm ilçe ve kategori filtreleri</span>
        </div>
        <div className="mt-5 grid gap-2.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {provinces.map((prov) => (
            <Link key={prov.slug} href={`/tr/icra-ihale/${prov.slug}`} className="flex items-center justify-between border border-rule-strong bg-paper-bright px-3.5 py-2.5 transition-colors hover:border-ink">
              <div className="min-w-0 pr-2">
                <span className="block truncate font-display text-sm text-ink">{prov.name}</span>
                <span className="block font-mono text-[10px] text-ink-muted">Ort: {formatTry(prov.avgAppraisedValueTry)}</span>
              </div>
              <span className="shrink-0 bg-paper-deep px-2 py-0.5 font-mono text-xs font-semibold text-signal">{prov.totalCount}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="border-b border-rule-strong pb-3 font-display text-2xl text-ink">
          En Çok İhale Bulunan İlçeler ({formatNumber(districts.length, "tr")} İlçe)
        </h2>
        <div className="mt-5 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {topDistricts.map((dist) => (
            <Link key={dist.slug} href={`/tr/icra-ihale/${dist.slug}`} className={ITEM_LINK_CLASS}>
              <span className="truncate font-serif font-medium text-ink">{dist.name}</span>
              <span className="ml-2 shrink-0 font-mono text-[11px] font-semibold text-ink-muted">{dist.totalCount}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="border-b border-rule-strong pb-3 font-display text-2xl text-ink">
          En Aktif İcra Daireleri ({formatNumber(courts.length, "tr")} İcra Dairesi)
        </h2>
        <div className="mt-5 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {topCourts.map((court) => (
            <Link key={court.slug} href={`/tr/icra-ihale/${court.slug}`} className={ITEM_LINK_CLASS}>
              <span className="truncate font-serif font-medium text-ink">{court.name}</span>
              <span className="ml-2 shrink-0 font-mono text-[11px] font-semibold text-ink-muted">{court.totalCount}</span>
            </Link>
          ))}
        </div>
      </section>

      <PseoRelatedGuides locale="tr" market="TR" />
    </div>
  );
}
