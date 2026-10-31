import { BELOWMARK_ORIGIN, BLOG_LANGS, isIndexableArticle } from "@/lib/blog/blogSeo";
import { BlogService } from "@/services/BlogService";
import { PseoService } from "@/services/PseoService";

export async function GET(): Promise<Response> {
  try {
    const [feed, catalog] = await Promise.all([BlogService.GetFeed(), PseoService.GetCatalog()]);

    const clusterBlock = feed.clusters
      .map((c) => {
        const langs = BLOG_LANGS.map((l) => {
          const entry = c.languages[l];
          return isIndexableArticle(entry)
            ? `  - [${l.toUpperCase()}] ${entry.title} (${BELOWMARK_ORIGIN}${entry.url}): ${entry.excerpt}`
            : null;
        })
          .filter(Boolean)
          .join("\n");
        return langs ? `### ${c.topicKey} (${c.dayKey})\n${langs}` : "";
      })
      .filter(Boolean)
      .join("\n\n");

    const deStatesBlock = catalog.deStates
      .map((s) => `- ${s.name}: ${s.totalCount} active ZVG proceedings | GrESt ${s.transferTaxPct}% (${BELOWMARK_ORIGIN}/bundesland/${s.slug})`)
      .join("\n");

    const euSummaryBlock = Object.values(catalog.euMarkets)
      .map(
        (m) =>
          `- ${m.market} (${m.currency}): ${m.totalListings} active auctions across ${m.regions.length} regions | Hub: ${BELOWMARK_ORIGIN}${m.hubPath} | Calculator: ${BELOWMARK_ORIGIN}${m.calcPath}`,
      )
      .join("\n");

    const body = [
      `# ${feed.siteName} AI Search Knowledge Base (llms-full.txt)`,
      "",
      `> ${feed.strategy.aiSearchPositioning}`,
      "",
      `## ${feed.siteName} (${feed.domain}) — 8-Country Foreclosure & Property Auction Platform`,
      `- **Tagline**: ${feed.tagline}`,
      `- **Target Audience**: ${feed.strategy.targetPersona}`,
      `- **Content Pillars**: ${feed.strategy.corePillars.join(" · ")}`,
      `- **Conversion Goal**: ${feed.strategy.conversionGoal}`,
      "",
      "## Germany 16 Bundesländer Live ZVG Foreclosure Breakdown",
      deStatesBlock,
      "",
      "## European Partner Markets (AT, CH, IT, ES, FR, GB) & Calculators",
      euSummaryBlock,
      `- TR (TRY): ${catalog.trTotalListings} active UYAP E-İhale auctions across 81 provinces | Hub: ${BELOWMARK_ORIGIN}/tr/icra-ihale | Calculator: ${BELOWMARK_ORIGIN}/tr/hesaplama/icra-ihale-teminat`,
      "",
      "## 8-Language Legal & Strategic Investor Clusters (DE · TR · EN · IT · ES · FR · AR · RU)",
      clusterBlock,
    ].join("\n");

    return new Response(body, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=600",
      },
    });
  } catch (error) {
    console.error("[GET /llms-full.txt]", error);
    return new Response("# Belowmark\n", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
