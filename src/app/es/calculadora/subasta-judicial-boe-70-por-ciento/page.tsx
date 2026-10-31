import { Metadata } from "next";
import BlogShell from "@/components/blog/BlogShell";
import PseoEuCalculatorPageView from "@/components/pseo/PseoEuCalculatorPageView";
import { buildEuCalcMetadata } from "@/lib/pseo/euPageHelpers";
import { PseoService } from "@/services/PseoService";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return buildEuCalcMetadata("ES");
}

export default async function EsCalculatorPage() {
  const catalog = (await PseoService.GetCatalog()).euMarkets.ES;
  return (
    <BlogShell lang="es">
      <PseoEuCalculatorPageView catalog={catalog} />
    </BlogShell>
  );
}
