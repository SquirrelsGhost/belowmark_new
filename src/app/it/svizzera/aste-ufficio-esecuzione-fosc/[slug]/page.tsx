import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogShell from "@/components/blog/BlogShell";
import SwissMultilangEntryView from "@/components/pseo/SwissMultilangEntryView";
import { getEuStaticRegionParams, resolveEuEntryOrDormant } from "@/lib/pseo/euPageHelpers";
import { buildSwissMultilangMetadata } from "@/lib/pseo/swissMultilangCopy";
import { PseoService } from "@/services/PseoService";

export const instant = false;

interface SvizzeraItEntryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getEuStaticRegionParams("CH");
}

export async function generateMetadata({ params }: SvizzeraItEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const catalog = (await PseoService.GetCatalog()).euMarkets.CH;
  const entry = resolveEuEntryOrDormant(catalog, slug);
  if (!entry) notFound();
  return buildSwissMultilangMetadata({ lang: "it", totalCount: catalog.totalListings, entry });
}

export default async function SvizzeraItFoscEntryPage({ params }: SvizzeraItEntryPageProps) {
  const { slug } = await params;
  const catalog = (await PseoService.GetCatalog()).euMarkets.CH;
  const entry = resolveEuEntryOrDormant(catalog, slug);
  if (!entry) notFound();
  return (
    <BlogShell lang="it">
      <SwissMultilangEntryView catalog={catalog} entry={entry} lang="it" />
    </BlogShell>
  );
}
