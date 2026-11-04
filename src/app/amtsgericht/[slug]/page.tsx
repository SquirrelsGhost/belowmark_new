import { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
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
    const legacyTarget = catalog.legacyCourtRedirects.get(slug);
    if (legacyTarget) permanentRedirect(legacyTarget);
    return {
      ...MetaTagService.CreateMetaTags({
        title: "Amtsgericht Zwangsversteigerungen | Belowmark",
        description: "Alle laufenden Zwangsversteigerungen und Versteigerungstermine an deutschen Amtsgerichten.",
        imgUrl: DEFAULT_BLOG_OG,
        tags: ["Amtsgericht", "Zwangsversteigerung"],
        url: `${BELOWMARK_ORIGIN}/zwangsversteigerungen`,
      }),
      robots: { index: false, follow: true },
    };
  }

  const minBidVal = entity.minAppraisedValue ? Math.round(entity.minAppraisedValue * 0.5) : null;
  const minBidStr = minBidVal ? ` ab ${formatEuro(minBidVal, "de")}` : "";
  const avgStr = entity.avgAppraisedValue ? ` (Ø Verkehrswert ${formatEuro(entity.avgAppraisedValue, "de")})` : "";
  const shortAg = entity.authority && entity.authority !== entity.displayName ? ` (${entity.authority})` : "";
  return MetaTagService.CreateMetaTags({
    title: `${entity.displayName}${shortAg}: ${entity.totalCount} Zwangsversteigerungen & Termine${minBidStr} | Belowmark`,
    description: `Aktuelle Zwangsversteigerungen & Termine am ${entity.displayName}${shortAg} (${entity.region}): Alle ${entity.totalCount} Immobilien${minBidStr}${avgStr} mit Aktenzeichen, 5/10- & 7/10-Grenze & Gutachten.`,
    imgUrl: DEFAULT_BLOG_OG,
    tags: [
      `${entity.displayName} Zwangsversteigerungen`,
      `${entity.displayName} Termine`,
      `${entity.authority} Zwangsversteigerung`,
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
  if (!entity) {
    const legacyTarget = catalog.legacyCourtRedirects.get(slug);
    permanentRedirect(legacyTarget ?? "/zwangsversteigerungen");
  }

  const shortAg = entity.authority && entity.authority !== entity.displayName ? ` (${entity.authority})` : "";

  return (
    <BlogShell lang="de">
      <PseoDirectoryView
        locale="de"
        eyebrow={`VOLLSTRECKUNGSGERICHT · ${entity.authority.toUpperCase()} · ${entity.region.toUpperCase()}`}
        title={`${entity.displayName}${shortAg}: ${entity.totalCount} aktuelle Zwangsversteigerungen & Termine`}
        lead={`Amtliche Terminübersicht für das ${entity.displayName}${shortAg} (${entity.region}) nach § 39 ZVG — inklusive Immobilien-Objektliste, Verkehrswert, 5/10- und 7/10-Mindestgebot, 10 % Sicherheitsleistung (§ 68 ZVG) und Gutachten-Status.`}
        canonicalUrl={`${BELOWMARK_ORIGIN}/amtsgericht/${entity.slug}`}
        listingsHeading={`Aktuelle Versteigerungstermine & Immobilien am ${entity.displayName}${shortAg}`}
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
            label: `${c.displayName} (${c.authority})`,
            href: `/amtsgericht/${c.slug}`,
            count: c.totalCount,
          }))}
        faqs={[
          {
            q: `Wie viele Zwangsversteigerungen und Termine laufen aktuell am ${entity.displayName}${shortAg}?`,
            a: `Aktuell sind am ${entity.displayName}${shortAg} (${entity.region}) ${entity.totalCount} aktive Immobilien-Zwangsversteigerungen und Teilungsversteigerungstermine (§ 39 ZVG) amtlich terminiert. Bei ${entity.limitsWaivedCount} Verfahren sind die 5/10- und 7/10-Wertgrenzen bereits entfallen.`,
          },
          {
            q: `Welche Sicherheitsleistung gilt im Versteigerungstermin am ${entity.displayName}?`,
            a: `Nach § 68 ZVG beträgt die Sicherheitsleistung am ${entity.displayName}${shortAg} in der Regel 10 % des gerichtlich festgesetzten Verkehrswerts (§ 74a Abs. 5 ZVG). Bargeld ist ausgeschlossen; zulässig sind Vorab-Überweisung an die Gerichtskasse, Bundesbankscheck oder Bankbürgschaft.`,
          },
          {
            q: `Für welche Städte und Gemeinden ist das Vollstreckungsgericht ${entity.displayName} zuständig?`,
            a: `Das ${entity.displayName}${shortAg} führt die Zwangsversteigerungstermine u. a. für Immobilien in ${entity.cities.map((c) => c.name).join(", ") || entity.region} durch.`,
          },
        ]}
      />
    </BlogShell>
  );
}
