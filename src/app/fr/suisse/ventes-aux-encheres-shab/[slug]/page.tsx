import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogShell from "@/components/blog/BlogShell";
import SwissMultilangEntryView from "@/components/pseo/SwissMultilangEntryView";
import { getEuStaticRegionParams, resolveEuEntryOrDormant } from "@/lib/pseo/euPageHelpers";
import { buildSwissMultilangMetadata } from "@/lib/pseo/swissMultilangCopy";
import { PseoService } from "@/services/PseoService";

export const instant = false;

interface SuisseFrEntryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getEuStaticRegionParams("CH");
}

export async function generateMetadata({ params }: SuisseFrEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const catalog = (await PseoService.GetCatalog()).euMarkets.CH;
  const entry = resolveEuEntryOrDormant(catalog, slug);
  if (!entry) notFound();
  return buildSwissMultilangMetadata({ lang: "fr", totalCount: catalog.totalListings, entry });
}

export default async function SuisseFrShabEntryPage({ params }: SuisseFrEntryPageProps) {
  const { slug } = await params;
  const catalog = (await PseoService.GetCatalog()).euMarkets.CH;
  const entry = resolveEuEntryOrDormant(catalog, slug);
  if (!entry) notFound();
  return (
    <BlogShell lang="fr">
      <SwissMultilangEntryView catalog={catalog} entry={entry} lang="fr" />
    </BlogShell>
  );
}
