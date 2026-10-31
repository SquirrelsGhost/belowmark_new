import { Metadata } from "next";
import { redirect } from "next/navigation";
import BlogShell from "@/components/blog/BlogShell";
import PseoEuEntryView from "@/components/pseo/PseoEuEntryView";
import { buildEuEntryMetadata } from "@/lib/pseo/euPageHelpers";
import { PseoService } from "@/services/PseoService";

export const instant = false;

interface ItAsteEntryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ItAsteEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildEuEntryMetadata("IT", slug);
}

export default async function ItAsteEntryPage({ params }: ItAsteEntryPageProps) {
  const { slug } = await params;
  const catalog = (await PseoService.GetCatalog()).euMarkets.IT;
  const entry = catalog.bySlug.get(slug);
  if (!entry) redirect(catalog.hubPath);
  return (
    <BlogShell lang="it">
      <PseoEuEntryView catalog={catalog} entry={entry} />
    </BlogShell>
  );
}
