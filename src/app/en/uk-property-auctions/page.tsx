import { Metadata } from "next";
import BlogShell from "@/components/blog/BlogShell";
import PseoEuHubView from "@/components/pseo/PseoEuHubView";
import { buildEuHubMetadata } from "@/lib/pseo/euPageHelpers";
import { PseoService } from "@/services/PseoService";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return buildEuHubMetadata("GB");
}

export default async function GbAuctionsHubPage() {
  const catalog = (await PseoService.GetCatalog()).euMarkets.GB;
  return (
    <BlogShell lang="en">
      <PseoEuHubView catalog={catalog} />
    </BlogShell>
  );
}
