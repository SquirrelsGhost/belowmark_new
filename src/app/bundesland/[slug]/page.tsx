import { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import BlogShell from "@/components/blog/BlogShell";
import PseoDirectoryView from "@/components/pseo/PseoDirectoryView";
import { BELOWMARK_ORIGIN, DEFAULT_BLOG_OG } from "@/lib/blog/blogSeo";
import { formatEuro, formatNumber } from "@/lib/format";
import { MetaTagService } from "@/services/MetaTagService";
import { PseoService } from "@/services/PseoService";

export const instant = false;

interface BundeslandPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BundeslandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const catalog = await PseoService.GetCatalog();
  const state = catalog.deStateBySlug.get(slug);
  if (!state) {
    permanentRedirect("/zwangsversteigerungen");
  }
  if (state.slug !== slug) {
    permanentRedirect(`/bundesland/${state.slug}`);
  }

  const minBidVal = state.minAppraisedValue ? Math.round(state.minAppraisedValue * 0.5) : null;
  const minBidStr = minBidVal ? ` ab ${formatEuro(minBidVal, "de")}` : "";
  return MetaTagService.CreateMetaTags({
    title: `Zwangsversteigerung ${state.name}: ${state.totalCount} Termine${minBidStr}`,
    description: `Alle ${state.totalCount} Immobilien-Zwangsversteigerungen (§ 39 ZVG) in ${state.name}${minBidStr}: ${state.courts.length} Amtsgerichte, 5/10- & 7/10-Grenze & ${state.transferTaxPct} % Steuer.`,
    imgUrl: DEFAULT_BLOG_OG,
    tags: [
      `Zwangsversteigerung ${state.name}`,
      `ZVG Portal ${state.name}`,
      `Immobilien Zwangsversteigerung ${state.name}`,
      `Amtsgerichte ${state.name}`,
      "5/10 Grenze",
    ],
    url: `${BELOWMARK_ORIGIN}/bundesland/${state.slug}`,
  });
}

export default async function BundeslandPage({ params }: BundeslandPageProps) {
  const { slug } = await params;
  const catalog = await PseoService.GetCatalog();
  const state = catalog.deStateBySlug.get(slug);
  if (!state) permanentRedirect("/zwangsversteigerungen");
  if (state.slug !== slug) permanentRedirect(`/bundesland/${state.slug}`);

  return (
    <BlogShell lang="de">
      <PseoDirectoryView
        locale="de"
        eyebrow={`BUNDESLAND · ZVG-VERZEICHNIS · ${state.transferTaxPct} % GRUNDERWERBSTEUER`}
        title={`Zwangsversteigerung ${state.name}: ${formatNumber(state.totalCount, "de")} aktuelle Termine`}
        lead={`Vollständige Übersicht aller amtlich terminierten Immobilien-Zwangsversteigerungen und Teilungsversteigerungen (§ 39 ZVG) in ${state.name} — mit ${state.courts.length} Vollstreckungsgerichten, Verkehrswert-Auswertung, 5/10- und 7/10-Wertgrenzen sowie ${state.transferTaxPct} % Grunderwerbsteuer.`}
        canonicalUrl={`${BELOWMARK_ORIGIN}/bundesland/${state.slug}`}
        breadcrumbs={[
          { label: "Belowmark", href: "/" },
          { label: "Zwangsversteigerungen", href: "/zwangsversteigerungen" },
          { label: state.name, href: `/bundesland/${state.slug}` },
        ]}
        stats={[
          { label: "Aktive Verfahren", value: formatNumber(state.totalCount, "de"), accent: true },
          { label: "Ø Verkehrswert", value: state.avgAppraisedValue ? formatEuro(state.avgAppraisedValue, "de") : "—" },
          { label: "Grunderwerbsteuer", value: `${state.transferTaxPct} %` },
          { label: "Wertgrenzen entfallen", value: formatNumber(state.limitsWaivedCount, "de") },
        ]}
        listings={state.listings}
        relatedTitle={`Städte & Gemeinden mit Zwangsversteigerungen in ${state.name}`}
        relatedLinks={state.cities.map((c) => ({
          label: `Zwangsversteigerung ${c.name}`,
          href: `/zwangsversteigerung/${c.slug}`,
          count: c.count,
        }))}
        secondaryTitle={`Zuständige Amtsgerichte in ${state.name}`}
        secondaryLinks={state.courts.map((c) => ({
          label: c.name,
          href: `/amtsgericht/${c.slug}`,
          count: c.count,
        }))}
        faqs={[
          {
            q: `Wie viele Immobilien-Zwangsversteigerungen laufen aktuell in ${state.name}?`,
            a: `Aktuell sind in ${state.name} ${state.totalCount} Zwangsversteigerungs- und Teilungsversteigerungsverfahren (§ 39 ZVG) amtlich veröffentlicht. Bei ${state.limitsWaivedCount} Terminen sind die 5/10- und 7/10-Wertgrenzen (§§ 74a, 85a ZVG) bereits entfallen.`,
          },
          {
            q: `Wie hoch ist die Grunderwerbsteuer bei einer Zwangsversteigerung in ${state.name}?`,
            a: `Beim Immobilienerwerb durch Zuschlagsbeschluss (§ 90 ZVG) in ${state.name} beträgt die gesetzliche Grunderwerbsteuer ${state.transferTaxPct} % des Meistgebots zuzüglich etwaiger bestehenbleibender Rechte. Notarkosten fallen in der Zwangsversteigerung nicht an.`,
          },
        ]}
      />
    </BlogShell>
  );
}
