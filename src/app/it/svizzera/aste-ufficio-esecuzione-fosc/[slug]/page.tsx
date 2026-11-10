import { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import BlogShell from "@/components/blog/BlogShell";
import SwissMultilangEntryView from "@/components/pseo/SwissMultilangEntryView";
import { buildSwissMultilangMetadata, SWISS_HUB_PATHS } from "@/lib/pseo/swissMultilangCopy";
import { PseoService } from "@/services/PseoService";

export const instant = false;

interface SvizzeraItEntryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SvizzeraItEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const catalog = (await PseoService.GetCatalog()).euMarkets.CH;
  const entry = catalog.bySlug.get(slug);
  if (!entry) permanentRedirect(SWISS_HUB_PATHS.it);
  if (entry.slug !== slug) permanentRedirect(`${SWISS_HUB_PATHS.it}/${entry.slug}`);
  return buildSwissMultilangMetadata({ lang: "it", totalCount: catalog.totalListings, entry });
}

export default async function SvizzeraItFoscEntryPage({ params }: SvizzeraItEntryPageProps) {
  const { slug } = await params;
  const catalog = (await PseoService.GetCatalog()).euMarkets.CH;
  const entry = catalog.bySlug.get(slug);
  if (!entry) permanentRedirect(SWISS_HUB_PATHS.it);
  if (entry.slug !== slug) permanentRedirect(`${SWISS_HUB_PATHS.it}/${entry.slug}`);
  return (
    <BlogShell lang="it">
      <SwissMultilangEntryView catalog={catalog} entry={entry} lang="it" />
    </BlogShell>
  );
}
