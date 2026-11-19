import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogShell from "@/components/blog/BlogShell";
import PseoEuEntryView from "@/components/pseo/PseoEuEntryView";
import { buildEuEntryMetadata, getEuStaticRegionParams, resolveEuEntryOrDormant } from "@/lib/pseo/euPageHelpers";
import { PseoService } from "@/services/PseoService";

export const instant = false;

interface AtEdikteEntryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getEuStaticRegionParams("AT");
}

export async function generateMetadata({ params }: AtEdikteEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildEuEntryMetadata("AT", slug);
}

export default async function AtEdikteEntryPage({ params }: AtEdikteEntryPageProps) {
  const { slug } = await params;
  const catalog = (await PseoService.GetCatalog()).euMarkets.AT;
  const entry = resolveEuEntryOrDormant(catalog, slug);
  if (!entry) notFound();
  return (
    <BlogShell lang="de">
      <PseoEuEntryView catalog={catalog} entry={entry} />
    </BlogShell>
  );
}
