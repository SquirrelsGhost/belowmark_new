import { Metadata } from "next";
import BlogShell from "@/components/blog/BlogShell";
import PseoEuHubView from "@/components/pseo/PseoEuHubView";
import { buildEuHubMetadata } from "@/lib/pseo/euPageHelpers";
import { PseoService } from "@/services/PseoService";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return buildEuHubMetadata("CZ");
}

export default async function CzDrazbyNemovitostiHubPage() {
  const catalog = (await PseoService.GetCatalog()).euMarkets.CZ;
  return (
    <BlogShell lang="cs">
      <PseoEuHubView catalog={catalog} />
    </BlogShell>
  );
}
