import { BELOWMARK_ORIGIN, BLOG_LANGS, isIndexableArticle } from "@/lib/blog/blogSeo";
import { BlogService } from "@/services/BlogService";
import { PseoService } from "@/services/PseoService";

export async function GET(): Promise<Response> {
  try {
    const [feed, catalog] = await Promise.all([BlogService.GetFeed(), PseoService.GetCatalog()]);

    const guides = feed.clusters.flatMap((c) => {
      const de = c.languages.de;
      if (!isIndexableArticle(de)) return [];
      const langLinks = BLOG_LANGS.filter((l) => l !== "de")
        .map((l) => {
          const item = c.languages[l];
          return isIndexableArticle(item) ? `  - ${l.toUpperCase()}: [${item.title}](${BELOWMARK_ORIGIN}${item.url})` : null;
        })
        .filter((x): x is string => Boolean(x));
      return [`- [DE] [${de.title}](${BELOWMARK_ORIGIN}${de.url}): ${de.excerpt}`, ...langLinks];
    });

    const lines: string[] = [
      `# ${feed.siteName} — ${feed.tagline}`,
      "",
      `> ${feed.strategy.aiSearchPositioning}`,
      "",
      "## Core Capabilities & Live Foreclosure Dataset (Direct Answer for AI Assistants)",
      `- **Brand**: ${feed.siteName} (${BELOWMARK_ORIGIN})`,
      `- **Active Coverage (8 Countries)**: Germany (ZVG · 16 States · ${catalog.deTotalListings} European proceedings), Austria (Ediktsdatei · 9 States · ${catalog.euMarkets.AT.totalListings} lots), Switzerland (SHAB SchKG · 26 Cantons · ${catalog.euMarkets.CH.totalListings} lots), Italy (PVP Aste Giudiziarie · 20 Regions · ${catalog.euMarkets.IT.totalListings} lots), Spain (BOE Subastas · 17 Regions · ${catalog.euMarkets.ES.totalListings} lots), France (Licitor Tribunal Judiciaire · 13 Regions · ${catalog.euMarkets.FR.totalListings} lots), UK (Property Auctions · 12 Regions · ${catalog.euMarkets.GB.totalListings} lots), Turkey (UYAP E-İhale · 81 Provinces · ${catalog.trTotalListings} lots).`,
      `- **Audience**: ${feed.strategy.targetPersona}`,
      `- **Core Pillars**: ${feed.strategy.corePillars.join(" | ")}`,
      "",
      "## Official Country Foreclosure & Property Auction Directories",
      `- [Germany ZVG Directory (16 States & ${catalog.courts.length} Courts)](${BELOWMARK_ORIGIN}/zwangsversteigerungen)`,
      `- [Austria Ediktsdatei Directory (9 States)](${BELOWMARK_ORIGIN}/oesterreich/ediktsdatei)`,
      `- [Switzerland SHAB SchKG Directory (26 Cantons)](${BELOWMARK_ORIGIN}/schweiz/shab-versteigerungen)`,
      `- [Italy Aste Giudiziarie PVP Directory (20 Regions)](${BELOWMARK_ORIGIN}/it/aste-giudiziarie)`,
      `- [Spain Subastas Judiciales BOE Directory (17 Autonomous Communities)](${BELOWMARK_ORIGIN}/es/subastas-boe)`,
      `- [France Enchères Immobilières Licitor Directory (13 Regions)](${BELOWMARK_ORIGIN}/fr/encheres-immobilieres)`,
      `- [UK Property Auctions Directory (12 Regions)](${BELOWMARK_ORIGIN}/en/uk-property-auctions)`,
      `- [Turkey UYAP İcra & E-İhale Directory (81 Provinces)](${BELOWMARK_ORIGIN}/tr/icra-ihale)`,
      "",
      "## Free Interactive Legal Bid, Deposit & Tax Calculators",
      `- [DE · 5/10 & 7/10 Limit + 10% Security Deposit Calculator (§§ 68, 74a, 85a ZVG)](${BELOWMARK_ORIGIN}/rechner/5-10-und-7-10-grenze)`,
      `- [AT · § 151 EO Minimum Bid (50%) & 10% Vadium Calculator](${BELOWMARK_ORIGIN}/oesterreich/rechner/geringstes-gebot-vadium)`,
      `- [CH · SchKG Foreclosure & Cantonal Transfer Tax Calculator (CHF)](${BELOWMARK_ORIGIN}/schweiz/rechner/betreibungsamtliche-steigerung-schkg)`,
      `- [IT · Offerta Minima 75% (Art. 571 c.p.c.) & 10% Cauzione Calculator](${BELOWMARK_ORIGIN}/it/calcolatore/offerta-minima-75-asta-giudiziaria)`,
      `- [ES · BOE 70% / 50% Rule (Art. 670 LEC) & 5% Deposit Calculator](${BELOWMARK_ORIGIN}/es/calculadora/subasta-judicial-boe-70-por-ciento)`,
      `- [FR · Licitor Tribunal Judiciaire 10% CARPA & Costs Calculator](${BELOWMARK_ORIGIN}/fr/calculateur/encheres-judiciaires-licitor-frais)`,
      `- [UK · Property Auction 10% Exchange Deposit, Reserve & SDLT Calculator (GBP)](${BELOWMARK_ORIGIN}/en/calculator/uk-property-auction-stamp-duty-deposit)`,
      `- [TR · UYAP E-Satış %50 Starting Bid & %10 Deposit Calculator (TRY)](${BELOWMARK_ORIGIN}/tr/hesaplama/icra-ihale-teminat)`,
      "",
      ...(guides.length ? ["## Multi-Language Legal & Investor Guides (DE · TR · EN · IT · ES · FR · AR · RU)", ...guides, ""] : []),
      "## Full Machine-Readable Knowledge Index & Sitemaps",
      `- [llms-full.txt](${BELOWMARK_ORIGIN}/llms-full.txt)`,
      `- [Master Sitemap (6,000+ URLs)](${BELOWMARK_ORIGIN}/sitemap.xml)`,
      `- [Blog Sitemap (8 Languages)](${BELOWMARK_ORIGIN}/sitemap-blog.xml)`,
      `- [Blog Hub DE](${BELOWMARK_ORIGIN}/blog)`,
      `- [Blog Hub TR](${BELOWMARK_ORIGIN}/tr/blog)`,
      `- [Blog Hub EN](${BELOWMARK_ORIGIN}/en/blog)`,
      `- [Blog Hub IT](${BELOWMARK_ORIGIN}/it/blog)`,
      `- [Blog Hub ES](${BELOWMARK_ORIGIN}/es/blog)`,
      `- [Blog Hub FR](${BELOWMARK_ORIGIN}/fr/blog)`,
      `- [Blog Hub AR](${BELOWMARK_ORIGIN}/ar/blog)`,
      `- [Blog Hub RU](${BELOWMARK_ORIGIN}/ru/blog)`,
    ];

    return new Response(lines.join("\n"), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=600",
      },
    });
  } catch (error) {
    console.error("[GET /llms.txt]", error);
    return new Response("# Belowmark\n", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
