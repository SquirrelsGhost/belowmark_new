import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogShell from "@/components/blog/BlogShell";
import PseoEuEntryView from "@/components/pseo/PseoEuEntryView";
import { buildEuEntryMetadata, getEuStaticRegionParams, resolveEuEntryOrDormant } from "@/lib/pseo/euPageHelpers";
import { PseoService } from "@/services/PseoService";

export const instant = false;

interface CzDrazbyNemovitostiEntryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getEuStaticRegionParams("CZ");
}

export async function generateMetadata({ params }: CzDrazbyNemovitostiEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildEuEntryMetadata("CZ", slug);
}

export default async function CzDrazbyNemovitostiEntryPage({ params }: CzDrazbyNemovitostiEntryPageProps) {
  const { slug } = await params;
  const catalog = (await PseoService.GetCatalog()).euMarkets.CZ;
  const entry = resolveEuEntryOrDormant(catalog, slug);
  if (!entry) notFound();
  return (
    <BlogShell lang="cs">
      <PseoEuEntryView catalog={catalog} entry={entry} />
    </BlogShell>
  );
}
