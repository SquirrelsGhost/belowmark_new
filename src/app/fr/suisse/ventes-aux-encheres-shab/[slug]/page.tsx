import { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import BlogShell from "@/components/blog/BlogShell";
import SwissMultilangEntryView from "@/components/pseo/SwissMultilangEntryView";
import { buildSwissMultilangMetadata, SWISS_HUB_PATHS } from "@/lib/pseo/swissMultilangCopy";
import { PseoService } from "@/services/PseoService";

export const instant = false;

interface SuisseFrEntryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SuisseFrEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const catalog = (await PseoService.GetCatalog()).euMarkets.CH;
  const entry = catalog.bySlug.get(slug);
  if (!entry) permanentRedirect(SWISS_HUB_PATHS.fr);
  if (entry.slug !== slug) permanentRedirect(`${SWISS_HUB_PATHS.fr}/${entry.slug}`);
  return buildSwissMultilangMetadata({ lang: "fr", totalCount: catalog.totalListings, entry });
}

export default async function SuisseFrShabEntryPage({ params }: SuisseFrEntryPageProps) {
  const { slug } = await params;
  const catalog = (await PseoService.GetCatalog()).euMarkets.CH;
  const entry = catalog.bySlug.get(slug);
  if (!entry) permanentRedirect(SWISS_HUB_PATHS.fr);
  if (entry.slug !== slug) permanentRedirect(`${SWISS_HUB_PATHS.fr}/${entry.slug}`);
  return (
    <BlogShell lang="fr">
      <SwissMultilangEntryView catalog={catalog} entry={entry} lang="fr" />
    </BlogShell>
  );
}
