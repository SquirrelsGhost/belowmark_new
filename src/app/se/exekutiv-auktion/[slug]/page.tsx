import { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import BlogShell from "@/components/blog/BlogShell";
import PseoEuEntryView from "@/components/pseo/PseoEuEntryView";
import { buildEuEntryMetadata } from "@/lib/pseo/euPageHelpers";
import { PseoService } from "@/services/PseoService";

export const instant = false;

interface SeExekutivAuktionEntryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SeExekutivAuktionEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildEuEntryMetadata("SE", slug);
}

export default async function SeExekutivAuktionEntryPage({ params }: SeExekutivAuktionEntryPageProps) {
  const { slug } = await params;
  const catalog = (await PseoService.GetCatalog()).euMarkets.SE;
  const entry = catalog.bySlug.get(slug);
  if (!entry) permanentRedirect(catalog.hubPath);
  if (entry.slug !== slug) permanentRedirect(`${catalog.hubPath}/${entry.slug}`);
  return (
    <BlogShell lang="sv">
      <PseoEuEntryView catalog={catalog} entry={entry} />
    </BlogShell>
  );
}
