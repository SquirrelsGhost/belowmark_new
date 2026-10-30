import { Metadata } from "next";
import { redirect } from "next/navigation";
import BlogShell from "@/components/blog/BlogShell";
import PseoDirectoryView from "@/components/pseo/PseoDirectoryView";
import { BELOWMARK_ORIGIN, DEFAULT_BLOG_OG } from "@/lib/blog/blogSeo";
import { formatEuro, formatNumber } from "@/lib/format";
import { MetaTagService } from "@/services/MetaTagService";
import { PseoService } from "@/services/PseoService";

export const instant = false;

interface StadtPageProps {
  params: Promise<{ stadt: string }>;
}

export async function generateMetadata({ params }: StadtPageProps): Promise<Metadata> {
  const { stadt } = await params;
  const catalog = await PseoService.GetCatalog();
  const entity = catalog.cityBySlug.get(stadt);
  if (!entity) {
    return MetaTagService.CreateMetaTags({
      title: "Zwangsversteigerungen nach Stadt | Belowmark",
      description: "Aktuelle Immobilien-Zwangsversteigerungen nach Stadt und Bundesland.",
      imgUrl: DEFAULT_BLOG_OG,
      tags: ["Zwangsversteigerung", "Immobilien"],
      url: `${BELOWMARK_ORIGIN}/zwangsversteigerungen`,
    });
  }

  const avgStr = entity.avgAppraisedValue ? ` · Ø Verkehrswert ${formatEuro(entity.avgAppraisedValue, "de")}` : "";
  return MetaTagService.CreateMetaTags({
    title: `Zwangsversteigerung ${entity.name}: ${entity.totalCount} aktuelle Immobilien & Termine | Belowmark`,
    description: `${entity.totalCount} amtliche Zwangsversteigerungen in ${entity.name} (${entity.region})${avgStr}. Berechnen Sie 5/10- & 7/10-Grenzen, Sicherheitsleistung (§ 68 ZVG) & Bietgrenzen.`,
    imgUrl: DEFAULT_BLOG_OG,
    tags: [
      `Zwangsversteigerung ${entity.name}`,
      `Immobilien Zwangsversteigerung ${entity.name}`,
      `Zwangsversteigerung Haus ${entity.name}`,
      `Zwangsversteigerung Wohnung ${entity.name}`,
      entity.region,
    ],
    url: `${BELOWMARK_ORIGIN}/zwangsversteigerung/${entity.slug}`,
  });
}

export default async function ZwangsversteigerungStadtPage({ params }: StadtPageProps) {
  const { stadt } = await params;
  const catalog = await PseoService.GetCatalog();
  const entity = catalog.cityBySlug.get(stadt);
  if (!entity) redirect("/zwangsversteigerungen");

  return (
    <BlogShell lang="de">
      <PseoDirectoryView
        locale="de"
        eyebrow={`KOMMUNALER ZVG-SPIEGEL · ${entity.region.toUpperCase()}`}
        title={`Zwangsversteigerung ${entity.name}: ${entity.totalCount} aktuelle Immobilien & Termine`}
        lead={`Alle amtlich veröffentlichten Zwangsversteigerungen und Teilungsversteigerungen in ${entity.name} (${entity.region}) — mit Verkehrswerten, 5/10- und 7/10-Wertgrenzen (§ 74a / § 85a ZVG) und zuständigem Vollstreckungsgericht.`}
        canonicalUrl={`${BELOWMARK_ORIGIN}/zwangsversteigerung/${entity.slug}`}
        breadcrumbs={[
          { label: "Belowmark", href: "/" },
          { label: "Zwangsversteigerungen", href: "/zwangsversteigerungen" },
          { label: entity.name, href: `/zwangsversteigerung/${entity.slug}` },
        ]}
        stats={[
          { label: "Objekte in " + entity.name, value: formatNumber(entity.totalCount, "de"), accent: true },
          { label: "Ø Verkehrswert", value: entity.avgAppraisedValue ? formatEuro(entity.avgAppraisedValue, "de") : "—" },
          { label: "Wertgrenzen entfallen", value: formatNumber(entity.limitsWaivedCount, "de") },
          { label: "Mit PDF-Bekanntmachung", value: formatNumber(entity.withDocsCount, "de") },
        ]}
        listings={entity.listings}
        relatedTitle={`Zuständige Amtsgerichte für ${entity.name}`}
        relatedLinks={entity.courts.map((c) => ({
          label: c.name,
          href: `/amtsgericht/${c.slug}`,
          count: c.count,
        }))}
        secondaryTitle="Weitere Städte mit laufenden Zwangsversteigerungen"
        secondaryLinks={catalog.cities
          .filter((c) => c.slug !== entity.slug)
          .slice(0, 24)
          .map((c) => ({
            label: c.name,
            href: `/zwangsversteigerung/${c.slug}`,
            count: c.totalCount,
          }))}
        faqs={[
          {
            q: `Wo finden die Zwangsversteigerungen für Immobilien in ${entity.name} statt?`,
            a: `Die Versteigerungstermine für Objekte in ${entity.name} (${entity.region}) werden am zuständigen Vollstreckungsgericht (${entity.courts.map((c) => c.name).join(", ") || "Amtsgericht"}) öffentlich durchgeführt.`,
          },
          {
            q: `Wie hoch ist das Mindestgebot bei einer Zwangsversteigerung in ${entity.name}?`,
            a: `Im ersten Termin gilt nach § 85a ZVG die absolute 5/10-Grenze (50 % des Verkehrswerts) sowie auf Gläubigerantrag die 7/10-Grenze (§ 74a ZVG, 70 % des Verkehrswerts), sofern die Wertgrenzen nicht bereits aufgehoben wurden.`,
          },
        ]}
      />
    </BlogShell>
  );
}
