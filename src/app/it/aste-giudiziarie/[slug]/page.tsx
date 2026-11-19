import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogShell from "@/components/blog/BlogShell";
import PseoEuEntryView from "@/components/pseo/PseoEuEntryView";
import { buildEuEntryMetadata, getEuStaticRegionParams, resolveEuEntryOrDormant } from "@/lib/pseo/euPageHelpers";
import { PseoService } from "@/services/PseoService";

export const instant = false;

interface ItAsteEntryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getEuStaticRegionParams("IT");
}

export async function generateMetadata({ params }: ItAsteEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildEuEntryMetadata("IT", slug);
}

export default async function ItAsteEntryPage({ params }: ItAsteEntryPageProps) {
  const { slug } = await params;
  const catalog = (await PseoService.GetCatalog()).euMarkets.IT;
  const entry = resolveEuEntryOrDormant(catalog, slug);
  if (!entry) notFound();
  return (
    <BlogShell lang="it">
      <PseoEuEntryView catalog={catalog} entry={entry} />
    </BlogShell>
  );
}
