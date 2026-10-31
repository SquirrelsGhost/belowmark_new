import { Metadata } from "next";
import BlogShell from "@/components/blog/BlogShell";
import PseoEuHubView from "@/components/pseo/PseoEuHubView";
import { buildEuHubMetadata } from "@/lib/pseo/euPageHelpers";
import { PseoService } from "@/services/PseoService";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return buildEuHubMetadata("ES");
}

export default async function EsSubastasHubPage() {
  const catalog = (await PseoService.GetCatalog()).euMarkets.ES;
  return (
    <BlogShell lang="es">
      <PseoEuHubView catalog={catalog} />
    </BlogShell>
  );
}
