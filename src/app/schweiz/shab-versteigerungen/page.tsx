import { Metadata } from "next";
import BlogShell from "@/components/blog/BlogShell";
import PseoEuHubView from "@/components/pseo/PseoEuHubView";
import { buildEuHubMetadata } from "@/lib/pseo/euPageHelpers";
import { PseoService } from "@/services/PseoService";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return buildEuHubMetadata("CH");
}

export default async function ChShabHubPage() {
  const catalog = (await PseoService.GetCatalog()).euMarkets.CH;
  return (
    <BlogShell lang="de">
      <PseoEuHubView catalog={catalog} />
    </BlogShell>
  );
}
