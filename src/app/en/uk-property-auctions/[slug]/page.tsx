import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogShell from "@/components/blog/BlogShell";
import PseoEuEntryView from "@/components/pseo/PseoEuEntryView";
import { buildEuEntryMetadata, getEuStaticRegionParams, resolveEuEntryOrDormant } from "@/lib/pseo/euPageHelpers";
import { PseoService } from "@/services/PseoService";

export const instant = false;

interface GbAuctionsEntryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getEuStaticRegionParams("GB");
}

export async function generateMetadata({ params }: GbAuctionsEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildEuEntryMetadata("GB", slug);
}

export default async function GbAuctionsEntryPage({ params }: GbAuctionsEntryPageProps) {
  const { slug } = await params;
  const catalog = (await PseoService.GetCatalog()).euMarkets.GB;
  const entry = resolveEuEntryOrDormant(catalog, slug);
  if (!entry) notFound();
  return (
    <BlogShell lang="en">
      <PseoEuEntryView catalog={catalog} entry={entry} />
    </BlogShell>
  );
}
