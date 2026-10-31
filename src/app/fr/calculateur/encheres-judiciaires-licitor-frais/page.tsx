import { Metadata } from "next";
import BlogShell from "@/components/blog/BlogShell";
import PseoEuCalculatorPageView from "@/components/pseo/PseoEuCalculatorPageView";
import { buildEuCalcMetadata } from "@/lib/pseo/euPageHelpers";
import { PseoService } from "@/services/PseoService";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return buildEuCalcMetadata("FR");
}

export default async function FrCalculatorPage() {
  const catalog = (await PseoService.GetCatalog()).euMarkets.FR;
  return (
    <BlogShell lang="fr">
      <PseoEuCalculatorPageView catalog={catalog} />
    </BlogShell>
  );
}
