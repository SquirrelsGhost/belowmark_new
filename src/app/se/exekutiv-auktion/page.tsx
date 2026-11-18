import { Metadata } from "next";
import BlogShell from "@/components/blog/BlogShell";
import PseoEuHubView from "@/components/pseo/PseoEuHubView";
import { buildEuHubMetadata } from "@/lib/pseo/euPageHelpers";
import { PseoService } from "@/services/PseoService";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return buildEuHubMetadata("SE");
}

export default async function SeExekutivAuktionHubPage() {
  const catalog = (await PseoService.GetCatalog()).euMarkets.SE;
  return (
    <BlogShell lang="sv">
      <PseoEuHubView catalog={catalog} />
    </BlogShell>
  );
}
