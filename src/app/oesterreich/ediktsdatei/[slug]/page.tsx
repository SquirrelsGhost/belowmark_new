import { Metadata } from "next";
import { redirect } from "next/navigation";
import BlogShell from "@/components/blog/BlogShell";
import PseoEuEntryView from "@/components/pseo/PseoEuEntryView";
import { buildEuEntryMetadata } from "@/lib/pseo/euPageHelpers";
import { PseoService } from "@/services/PseoService";

export const instant = false;

interface AtEdikteEntryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AtEdikteEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildEuEntryMetadata("AT", slug);
}

export default async function AtEdikteEntryPage({ params }: AtEdikteEntryPageProps) {
  const { slug } = await params;
  const catalog = (await PseoService.GetCatalog()).euMarkets.AT;
  const entry = catalog.bySlug.get(slug);
  if (!entry) redirect(catalog.hubPath);
  return (
    <BlogShell lang="de">
      <PseoEuEntryView catalog={catalog} entry={entry} />
    </BlogShell>
  );
}
