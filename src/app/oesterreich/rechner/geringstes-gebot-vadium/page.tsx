import { Metadata } from "next";
import BlogShell from "@/components/blog/BlogShell";
import PseoEuCalculatorPageView from "@/components/pseo/PseoEuCalculatorPageView";
import { buildEuCalcMetadata } from "@/lib/pseo/euPageHelpers";
import { PseoService } from "@/services/PseoService";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return buildEuCalcMetadata("AT");
}

export default async function AtCalculatorPage() {
  const catalog = (await PseoService.GetCatalog()).euMarkets.AT;
  return (
    <BlogShell lang="de">
      <PseoEuCalculatorPageView catalog={catalog} />
    </BlogShell>
  );
}
