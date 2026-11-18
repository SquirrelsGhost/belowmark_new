import { Metadata } from "next";
import BlogShell from "@/components/blog/BlogShell";
import PseoEuCalculatorPageView from "@/components/pseo/PseoEuCalculatorPageView";
import { buildEuCalcMetadata } from "@/lib/pseo/euPageHelpers";
import { PseoService } from "@/services/PseoService";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return buildEuCalcMetadata("SE");
}

export default async function SeCalculatorPage() {
  const catalog = (await PseoService.GetCatalog()).euMarkets.SE;
  return (
    <BlogShell lang="sv">
      <PseoEuCalculatorPageView catalog={catalog} />
    </BlogShell>
  );
}
