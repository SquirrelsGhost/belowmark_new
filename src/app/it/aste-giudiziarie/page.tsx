import { Metadata } from "next";
import BlogShell from "@/components/blog/BlogShell";
import PseoEuHubView from "@/components/pseo/PseoEuHubView";
import { buildEuHubMetadata } from "@/lib/pseo/euPageHelpers";
import { PseoService } from "@/services/PseoService";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return buildEuHubMetadata("IT");
}

export default async function ItAsteHubPage() {
  const catalog = (await PseoService.GetCatalog()).euMarkets.IT;
  return (
    <BlogShell lang="it">
      <PseoEuHubView catalog={catalog} />
    </BlogShell>
  );
}
