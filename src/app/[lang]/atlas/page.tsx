import { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { connection } from "next/server";
import BlogShell from "@/components/blog/BlogShell";
import PublicAtlasView from "@/components/pseo/PublicAtlasView";
import { BELOWMARK_ORIGIN, DEFAULT_BLOG_OG } from "@/lib/blog/blogSeo";
import { ATLAS_COPY, buildAtlasAlternates } from "@/lib/pseo/atlasCopy";
import { MetaTagService } from "@/services/MetaTagService";
import { PseoService } from "@/services/PseoService";
import { PseoLocale } from "@/types/pseo.types";

// Reads request-time params & live catalog snapshot.
export const instant = false;

const ATLAS_LANGS = new Set<PseoLocale>(["en", "fr", "it", "es", "tr"]);

interface LangAtlasPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: LangAtlasPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (lang === "de") permanentRedirect("/atlas");
  if (!ATLAS_LANGS.has(lang as PseoLocale)) permanentRedirect("/atlas");
  const locale = lang as PseoLocale;
  const copy = ATLAS_COPY[locale];

  const c = await PseoService.GetCatalog();
  const euSum = Object.values(c.euMarkets).reduce((s, m) => s + m.totalListings, 0);
  const total = (c.deTotalListings + c.trTotalListings + euSum).toLocaleString(copy.numLocale);

  return {
    ...MetaTagService.CreateMetaTags({
      title: copy.metaTitle(total),
      description: copy.metaDesc(total),
      imgUrl: DEFAULT_BLOG_OG,
      tags: [
        "Property Auction Market Report",
        "European Foreclosure Atlas",
        "Aste Giudiziarie Statistiche",
        "Subastas BOE Estadísticas",
        "Enchères Judiciaires Observatoire",
        "İcra İhale İstatistikleri",
      ],
      url: `${BELOWMARK_ORIGIN}${copy.path}`,
    }),
    alternates: buildAtlasAlternates(locale),
  };
}

export default async function LangAtlasPage({ params }: LangAtlasPageProps) {
  await connection();
  const { lang } = await params;
  if (lang === "de") permanentRedirect("/atlas");
  if (!ATLAS_LANGS.has(lang as PseoLocale)) permanentRedirect("/atlas");
  const locale = lang as PseoLocale;
  const catalog = await PseoService.GetCatalog();

  return (
    <BlogShell lang={locale}>
      <PublicAtlasView catalog={catalog} locale={locale} />
    </BlogShell>
  );
}
