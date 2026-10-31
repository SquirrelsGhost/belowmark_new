import { Metadata } from "next";
import { redirect } from "next/navigation";
import BlogShell from "@/components/blog/BlogShell";
import PseoEuEntryView from "@/components/pseo/PseoEuEntryView";
import { buildEuEntryMetadata } from "@/lib/pseo/euPageHelpers";
import { PseoService } from "@/services/PseoService";

export const instant = false;

interface FrEncheresEntryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: FrEncheresEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildEuEntryMetadata("FR", slug);
}

export default async function FrEncheresEntryPage({ params }: FrEncheresEntryPageProps) {
  const { slug } = await params;
  const catalog = (await PseoService.GetCatalog()).euMarkets.FR;
  const entry = catalog.bySlug.get(slug);
  if (!entry) redirect(catalog.hubPath);
  return (
    <BlogShell lang="fr">
      <PseoEuEntryView catalog={catalog} entry={entry} />
    </BlogShell>
  );
}
