import { Metadata } from "next";
import { BELOWMARK_ORIGIN, DEFAULT_BLOG_OG } from "@/lib/blog/blogSeo";
import { EU_MARKET_COPY } from "@/lib/pseo/euMarketCopy";
import { EU_MARKET_META } from "@/lib/pseo/euMarketRegions";
import { MetaTagService } from "@/services/MetaTagService";
import { PseoService } from "@/services/PseoService";
import { EuPseoMarketCode } from "@/types/pseo.types";

export async function buildEuHubMetadata(market: EuPseoMarketCode): Promise<Metadata> {
  const catalog = (await PseoService.GetCatalog()).euMarkets[market];
  const copy = EU_MARKET_COPY[market];
  const meta = EU_MARKET_META[market];
  return MetaTagService.CreateMetaTags({
    title: copy.hubMetaTitle(catalog.totalListings, catalog.regions.length),
    description: copy.hubMetaDesc(catalog.totalListings, catalog.regions.length),
    imgUrl: DEFAULT_BLOG_OG,
    tags: [meta.shortLabel, copy.hubEyebrow, "Belowmark"],
    url: `${BELOWMARK_ORIGIN}${catalog.hubPath}`,
  });
}

export async function buildEuEntryMetadata(market: EuPseoMarketCode, slug: string): Promise<Metadata> {
  const catalog = (await PseoService.GetCatalog()).euMarkets[market];
  const copy = EU_MARKET_COPY[market];
  const entry = catalog.bySlug.get(slug);
  if (!entry) {
    return buildEuHubMetadata(market);
  }
  return MetaTagService.CreateMetaTags({
    title: copy.entryMetaTitle(entry),
    description: copy.entryMetaDesc(entry),
    imgUrl: DEFAULT_BLOG_OG,
    tags: [entry.name, entry.nativeRegionName, copy.hubEyebrow, "Belowmark"],
    url: `${BELOWMARK_ORIGIN}${catalog.hubPath}/${entry.slug}`,
  });
}

export function buildEuCalcMetadata(market: EuPseoMarketCode): Metadata {
  const copy = EU_MARKET_COPY[market];
  const meta = EU_MARKET_META[market];
  return MetaTagService.CreateMetaTags({
    title: copy.calcMetaTitle,
    description: copy.calcMetaDesc,
    imgUrl: DEFAULT_BLOG_OG,
    tags: [meta.shortLabel, copy.calcMetaTitle, "Belowmark"],
    url: `${BELOWMARK_ORIGIN}${meta.calcPath}`,
  });
}
