import { Metadata } from "next";
import { redirect } from "next/navigation";
import BlogShell from "@/components/blog/BlogShell";
import PseoEuEntryView from "@/components/pseo/PseoEuEntryView";
import { buildEuEntryMetadata } from "@/lib/pseo/euPageHelpers";
import { PseoService } from "@/services/PseoService";

export const instant = false;

interface GbAuctionsEntryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: GbAuctionsEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildEuEntryMetadata("GB", slug);
}

export default async function GbAuctionsEntryPage({ params }: GbAuctionsEntryPageProps) {
  const { slug } = await params;
  const catalog = (await PseoService.GetCatalog()).euMarkets.GB;
  const entry = catalog.bySlug.get(slug);
  if (!entry) redirect(catalog.hubPath);
  return (
    <BlogShell lang="en">
      <PseoEuEntryView catalog={catalog} entry={entry} />
    </BlogShell>
  );
}
