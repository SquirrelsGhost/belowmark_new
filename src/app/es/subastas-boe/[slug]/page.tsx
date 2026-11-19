import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogShell from "@/components/blog/BlogShell";
import PseoEuEntryView from "@/components/pseo/PseoEuEntryView";
import { buildEuEntryMetadata, getEuStaticRegionParams, resolveEuEntryOrDormant } from "@/lib/pseo/euPageHelpers";
import { PseoService } from "@/services/PseoService";

export const instant = false;

interface EsSubastasEntryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getEuStaticRegionParams("ES");
}

export async function generateMetadata({ params }: EsSubastasEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildEuEntryMetadata("ES", slug);
}

export default async function EsSubastasEntryPage({ params }: EsSubastasEntryPageProps) {
  const { slug } = await params;
  const catalog = (await PseoService.GetCatalog()).euMarkets.ES;
  const entry = resolveEuEntryOrDormant(catalog, slug);
  if (!entry) notFound();
  return (
    <BlogShell lang="es">
      <PseoEuEntryView catalog={catalog} entry={entry} />
    </BlogShell>
  );
}
