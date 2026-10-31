import { Metadata } from "next";
import BlogShell from "@/components/blog/BlogShell";
import PseoEuCalculatorPageView from "@/components/pseo/PseoEuCalculatorPageView";
import { buildEuCalcMetadata } from "@/lib/pseo/euPageHelpers";
import { PseoService } from "@/services/PseoService";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return buildEuCalcMetadata("GB");
}

export default async function GbCalculatorPage() {
  const catalog = (await PseoService.GetCatalog()).euMarkets.GB;
  return (
    <BlogShell lang="en">
      <PseoEuCalculatorPageView catalog={catalog} />
    </BlogShell>
  );
}
