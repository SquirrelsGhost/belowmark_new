import { Metadata } from "next";
import { redirect } from "next/navigation";
import BlogShell from "@/components/blog/BlogShell";
import PseoDirectoryView from "@/components/pseo/PseoDirectoryView";
import { BELOWMARK_ORIGIN, DEFAULT_BLOG_OG } from "@/lib/blog/blogSeo";
import { formatEuro, formatNumber } from "@/lib/format";
import { MetaTagService } from "@/services/MetaTagService";
import { PseoService } from "@/services/PseoService";

export const instant = false;

interface AmtsgerichtPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AmtsgerichtPageProps): Promise<Metadata> {
  const { slug } = await params;
  const catalog = await PseoService.GetCatalog();
  const entity = catalog.courtBySlug.get(slug);
  if (!entity) {
    return MetaTagService.CreateMetaTags({
      title: "Amtsgericht Zwangsversteigerungen | Belowmark",
      description: "Alle laufenden Zwangsversteigerungen und Versteigerungstermine an deutschen Amtsgerichten.",
      imgUrl: DEFAULT_BLOG_OG,
      tags: ["Amtsgericht", "Zwangsversteigerung"],
      url: `${BELOWMARK_ORIGIN}/zwangsversteigerungen`,
    });
  }

  const avgStr = entity.avgAppraisedValue ? ` (Ø Verkehrswert ${formatEuro(entity.avgAppraisedValue, "de")})` : "";
  return MetaTagService.CreateMetaTags({
    title: `${entity.displayName}: ${entity.totalCount} Zwangsversteigerungen & Termine (${entity.region}) | Belowmark`,
    description: `Alle ${entity.totalCount} laufenden Immobilien-Zwangsversteigerungen am ${entity.displayName} (${entity.region})${avgStr}. Mit 5/10- & 7/10-Wertgrenze, Sicherheitsleistung (§ 68 ZVG) & Gutachten-Analyse.`,
    imgUrl: DEFAULT_BLOG_OG,
    tags: [
      `${entity.displayName} Zwangsversteigerung`,
      `ZVG Termine ${entity.displayName}`,
      `Immobilien Zwangsversteigerung ${entity.displayName}`,
      entity.region,
      "Verkehrswert",
      "5/10 Grenze",
    ],
    url: `${BELOWMARK_ORIGIN}/amtsgericht/${entity.slug}`,
  });
}

export default async function AmtsgerichtPage({ params }: AmtsgerichtPageProps) {
  const { slug } = await params;
  const catalog = await PseoService.GetCatalog();
  const entity = catalog.courtBySlug.get(slug);
  if (!entity) redirect("/zwangsversteigerungen");

  return (
    <BlogShell lang="de">
      <PseoDirectoryView
        locale="de"
        eyebrow={`VOLLSTRECKUNGSGERICHT · ${entity.region.toUpperCase()}`}
        title={`${entity.displayName}: ${entity.totalCount} aktuelle Zwangsversteigerungen`}
        lead={`Amtliche Terminübersicht für das ${entity.displayName} (${entity.region}) nach § 39 ZVG — inklusive Verkehrswert, 5/10- und 7/10-Mindestgebot, 10 % Sicherheitsleistung (§ 68 ZVG) und Gutachten-Status.`}
        canonicalUrl={`${BELOWMARK_ORIGIN}/amtsgericht/${entity.slug}`}
        breadcrumbs={[
          { label: "Belowmark", href: "/" },
          { label: "Zwangsversteigerungen", href: "/zwangsversteigerungen" },
          { label: entity.displayName, href: `/amtsgericht/${entity.slug}` },
        ]}
        stats={[
          { label: "Aktive Termine", value: formatNumber(entity.totalCount, "de"), accent: true },
          { label: "Ø Verkehrswert", value: entity.avgAppraisedValue ? formatEuro(entity.avgAppraisedValue, "de") : "—" },
          { label: "Wertgrenzen entfallen", value: formatNumber(entity.limitsWaivedCount, "de") },
          { label: "Mit PDF-Dokumenten", value: formatNumber(entity.withDocsCount, "de") },
        ]}
        listings={entity.listings}
        relatedTitle={`Orte im Zuständigkeitsbereich des ${entity.displayName}`}
        relatedLinks={entity.cities.map((c) => ({
          label: `Zwangsversteigerung ${c.name}`,
          href: `/zwangsversteigerung/${c.slug}`,
          count: c.count,
        }))}
        secondaryTitle="Weitere Amtsgerichte in Deutschland"
        secondaryLinks={catalog.courts
          .filter((c) => c.slug !== entity.slug)
          .slice(0, 24)
          .map((c) => ({
            label: c.displayName,
            href: `/amtsgericht/${c.slug}`,
            count: c.totalCount,
          }))}
        faqs={[
          {
            q: `Wie viele Zwangsversteigerungen laufen aktuell am ${entity.displayName}?`,
            a: `Aktuell sind am ${entity.displayName} (${entity.region}) ${entity.totalCount} aktive Zwangsversteigerungs- und Teilungsversteigerungsverfahren amtlich terminiert. Bei ${entity.limitsWaivedCount} Verfahren sind die 5/10- und 7/10-Wertgrenzen bereits entfallen.`,
          },
          {
            q: `Welche Sicherheitsleistung gilt im Versteigerungstermin am ${entity.displayName}?`,
            a: `Nach § 68 ZVG beträgt die Sicherheitsleistung in der Regel 10 % des gerichtlich festgesetzten Verkehrswerts. Bargeld ist ausgeschlossen; zulässig sind Vorab-Überweisung an die Gerichtskasse, Bundesbankscheck oder Bankbürgschaft.`,
          },
        ]}
      />
    </BlogShell>
  );
}
