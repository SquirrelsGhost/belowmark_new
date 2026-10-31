import { Metadata } from "next";
import BlogShell from "@/components/blog/BlogShell";
import PseoEuHubView from "@/components/pseo/PseoEuHubView";
import { buildEuHubMetadata } from "@/lib/pseo/euPageHelpers";
import { PseoService } from "@/services/PseoService";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return buildEuHubMetadata("FR");
}

export default async function FrEncheresHubPage() {
  const catalog = (await PseoService.GetCatalog()).euMarkets.FR;
  return (
    <BlogShell lang="fr">
      <PseoEuHubView catalog={catalog} />
    </BlogShell>
  );
}
