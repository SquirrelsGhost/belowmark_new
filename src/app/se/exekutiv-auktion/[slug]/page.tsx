import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogShell from "@/components/blog/BlogShell";
import PseoEuEntryView from "@/components/pseo/PseoEuEntryView";
import { buildEuEntryMetadata, getEuStaticRegionParams, resolveEuEntryOrDormant } from "@/lib/pseo/euPageHelpers";
import { PseoService } from "@/services/PseoService";

export const instant = false;

interface SeExekutivAuktionEntryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getEuStaticRegionParams("SE");
}

export async function generateMetadata({ params }: SeExekutivAuktionEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildEuEntryMetadata("SE", slug);
}

export default async function SeExekutivAuktionEntryPage({ params }: SeExekutivAuktionEntryPageProps) {
  const { slug } = await params;
  const catalog = (await PseoService.GetCatalog()).euMarkets.SE;
  const entry = resolveEuEntryOrDormant(catalog, slug);
  if (!entry) notFound();
  return (
    <BlogShell lang="sv">
      <PseoEuEntryView catalog={catalog} entry={entry} />
    </BlogShell>
  );
}
