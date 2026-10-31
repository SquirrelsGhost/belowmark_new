import { Metadata } from "next";
import BlogShell from "@/components/blog/BlogShell";
import PseoEuCalculatorPageView from "@/components/pseo/PseoEuCalculatorPageView";
import { buildEuCalcMetadata } from "@/lib/pseo/euPageHelpers";
import { PseoService } from "@/services/PseoService";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return buildEuCalcMetadata("IT");
}

export default async function ItCalculatorPage() {
  const catalog = (await PseoService.GetCatalog()).euMarkets.IT;
  return (
    <BlogShell lang="it">
      <PseoEuCalculatorPageView catalog={catalog} />
    </BlogShell>
  );
}
