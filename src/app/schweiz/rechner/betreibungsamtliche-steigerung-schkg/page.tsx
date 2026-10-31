import { Metadata } from "next";
import BlogShell from "@/components/blog/BlogShell";
import PseoEuCalculatorPageView from "@/components/pseo/PseoEuCalculatorPageView";
import { buildEuCalcMetadata } from "@/lib/pseo/euPageHelpers";
import { PseoService } from "@/services/PseoService";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return buildEuCalcMetadata("CH");
}

export default async function ChCalculatorPage() {
  const catalog = (await PseoService.GetCatalog()).euMarkets.CH;
  return (
    <BlogShell lang="de">
      <PseoEuCalculatorPageView catalog={catalog} />
    </BlogShell>
  );
}
