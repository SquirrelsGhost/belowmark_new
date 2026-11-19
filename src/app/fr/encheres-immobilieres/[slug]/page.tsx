import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogShell from "@/components/blog/BlogShell";
import PseoEuEntryView from "@/components/pseo/PseoEuEntryView";
import { buildEuEntryMetadata, getEuStaticRegionParams, resolveEuEntryOrDormant } from "@/lib/pseo/euPageHelpers";
import { PseoService } from "@/services/PseoService";

export const instant = false;

interface FrEncheresEntryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getEuStaticRegionParams("FR");
}

export async function generateMetadata({ params }: FrEncheresEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildEuEntryMetadata("FR", slug);
}

export default async function FrEncheresEntryPage({ params }: FrEncheresEntryPageProps) {
  const { slug } = await params;
  const catalog = (await PseoService.GetCatalog()).euMarkets.FR;
  const entry = resolveEuEntryOrDormant(catalog, slug);
  if (!entry) notFound();
  return (
    <BlogShell lang="fr">
      <PseoEuEntryView catalog={catalog} entry={entry} />
    </BlogShell>
  );
}
