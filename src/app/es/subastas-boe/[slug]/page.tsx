import { Metadata } from "next";
import { redirect } from "next/navigation";
import BlogShell from "@/components/blog/BlogShell";
import PseoEuEntryView from "@/components/pseo/PseoEuEntryView";
import { buildEuEntryMetadata } from "@/lib/pseo/euPageHelpers";
import { PseoService } from "@/services/PseoService";

export const instant = false;

interface EsSubastasEntryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EsSubastasEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildEuEntryMetadata("ES", slug);
}

export default async function EsSubastasEntryPage({ params }: EsSubastasEntryPageProps) {
  const { slug } = await params;
  const catalog = (await PseoService.GetCatalog()).euMarkets.ES;
  const entry = catalog.bySlug.get(slug);
  if (!entry) redirect(catalog.hubPath);
  return (
    <BlogShell lang="es">
      <PseoEuEntryView catalog={catalog} entry={entry} />
    </BlogShell>
  );
}
