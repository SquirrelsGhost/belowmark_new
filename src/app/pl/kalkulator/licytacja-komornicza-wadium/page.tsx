import { Metadata } from "next";
import BlogShell from "@/components/blog/BlogShell";
import PseoEuCalculatorPageView from "@/components/pseo/PseoEuCalculatorPageView";
import { buildEuCalcMetadata } from "@/lib/pseo/euPageHelpers";
import { PseoService } from "@/services/PseoService";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return buildEuCalcMetadata("PL");
}

export default async function PlCalculatorPage() {
  const catalog = (await PseoService.GetCatalog()).euMarkets.PL;
  return (
    <BlogShell lang="pl">
      <PseoEuCalculatorPageView catalog={catalog} />
    </BlogShell>
  );
}
