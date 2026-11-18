import { Metadata } from "next";
import BlogShell from "@/components/blog/BlogShell";
import PseoEuCalculatorPageView from "@/components/pseo/PseoEuCalculatorPageView";
import { buildEuCalcMetadata } from "@/lib/pseo/euPageHelpers";
import { PseoService } from "@/services/PseoService";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return buildEuCalcMetadata("CZ");
}

export default async function CzCalculatorPage() {
  const catalog = (await PseoService.GetCatalog()).euMarkets.CZ;
  return (
    <BlogShell lang="cs">
      <PseoEuCalculatorPageView catalog={catalog} />
    </BlogShell>
  );
}
