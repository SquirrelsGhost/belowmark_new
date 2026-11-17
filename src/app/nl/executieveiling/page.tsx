import { Metadata } from "next";
import BlogShell from "@/components/blog/BlogShell";
import PseoEuHubView from "@/components/pseo/PseoEuHubView";
import { buildEuHubMetadata } from "@/lib/pseo/euPageHelpers";
import { PseoService } from "@/services/PseoService";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return buildEuHubMetadata("NL");
}

export default async function NlExecutieveilingHubPage() {
  const catalog = (await PseoService.GetCatalog()).euMarkets.NL;
  return (
    <BlogShell lang="nl">
      <PseoEuHubView catalog={catalog} />
    </BlogShell>
  );
}
