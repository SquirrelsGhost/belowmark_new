import { Metadata } from "next";
import BlogShell from "@/components/blog/BlogShell";
import SwissMultilangHubView from "@/components/pseo/SwissMultilangHubView";
import { buildSwissMultilangMetadata } from "@/lib/pseo/swissMultilangCopy";
import { PseoService } from "@/services/PseoService";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const catalog = (await PseoService.GetCatalog()).euMarkets.CH;
  return buildSwissMultilangMetadata({ lang: "fr", totalCount: catalog.totalListings });
}

export default async function SuisseFrShabHubPage() {
  const catalog = (await PseoService.GetCatalog()).euMarkets.CH;
  return (
    <BlogShell lang="fr">
      <SwissMultilangHubView catalog={catalog} lang="fr" />
    </BlogShell>
  );
}
