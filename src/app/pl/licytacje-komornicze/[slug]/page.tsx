import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogShell from "@/components/blog/BlogShell";
import PseoEuEntryView from "@/components/pseo/PseoEuEntryView";
import { buildEuEntryMetadata, getEuStaticRegionParams, resolveEuEntryOrDormant } from "@/lib/pseo/euPageHelpers";
import { PseoService } from "@/services/PseoService";

export const instant = false;

interface PlLicytacjeEntryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getEuStaticRegionParams("PL");
}

export async function generateMetadata({ params }: PlLicytacjeEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildEuEntryMetadata("PL", slug);
}

export default async function PlLicytacjeEntryPage({ params }: PlLicytacjeEntryPageProps) {
  const { slug } = await params;
  const catalog = (await PseoService.GetCatalog()).euMarkets.PL;
  const entry = resolveEuEntryOrDormant(catalog, slug);
  if (!entry) notFound();
  return (
    <BlogShell lang="pl">
      <PseoEuEntryView catalog={catalog} entry={entry} />
    </BlogShell>
  );
}
