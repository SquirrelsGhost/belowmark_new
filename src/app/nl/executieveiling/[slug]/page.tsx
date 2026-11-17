import { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import BlogShell from "@/components/blog/BlogShell";
import PseoEuEntryView from "@/components/pseo/PseoEuEntryView";
import { buildEuEntryMetadata } from "@/lib/pseo/euPageHelpers";
import { PseoService } from "@/services/PseoService";

export const instant = false;

interface NlExecutieveilingEntryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: NlExecutieveilingEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildEuEntryMetadata("NL", slug);
}

export default async function NlExecutieveilingEntryPage({ params }: NlExecutieveilingEntryPageProps) {
  const { slug } = await params;
  const catalog = (await PseoService.GetCatalog()).euMarkets.NL;
  const entry = catalog.bySlug.get(slug);
  if (!entry) permanentRedirect(catalog.hubPath);
  if (entry.slug !== slug) permanentRedirect(`${catalog.hubPath}/${entry.slug}`);
  return (
    <BlogShell lang="nl">
      <PseoEuEntryView catalog={catalog} entry={entry} />
    </BlogShell>
  );
}
