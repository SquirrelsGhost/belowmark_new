import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogShell from "@/components/blog/BlogShell";
import PseoEuEntryView from "@/components/pseo/PseoEuEntryView";
import { buildEuEntryMetadata, getEuStaticRegionParams, resolveEuEntryOrDormant } from "@/lib/pseo/euPageHelpers";
import { PseoService } from "@/services/PseoService";

export const instant = false;

interface NlExecutieveilingEntryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getEuStaticRegionParams("NL");
}

export async function generateMetadata({ params }: NlExecutieveilingEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildEuEntryMetadata("NL", slug);
}

export default async function NlExecutieveilingEntryPage({ params }: NlExecutieveilingEntryPageProps) {
  const { slug } = await params;
  const catalog = (await PseoService.GetCatalog()).euMarkets.NL;
  const entry = resolveEuEntryOrDormant(catalog, slug);
  if (!entry) notFound();
  return (
    <BlogShell lang="nl">
      <PseoEuEntryView catalog={catalog} entry={entry} />
    </BlogShell>
  );
}
