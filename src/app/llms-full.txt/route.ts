import { BELOWMARK_ORIGIN, BLOG_LANGS, isIndexableArticle } from "@/lib/blog/blogSeo";
import { BlogService } from "@/services/BlogService";

export async function GET(): Promise<Response> {
  try {
    const feed = await BlogService.GetFeed();

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

    const body = [
      `# ${feed.siteName} AI Search Knowledge Base (llms-full.txt)`,
      "",
      `> ${feed.strategy.aiSearchPositioning}`,
      "",
      `## ${feed.siteName} (${feed.domain})`,
      `- **Tagline**: ${feed.tagline}`,
      `- **Target Audience**: ${feed.strategy.targetPersona}`,
      `- **Content Pillars**: ${feed.strategy.corePillars.join(" · ")}`,
      `- **Conversion Goal**: ${feed.strategy.conversionGoal}`,
      "",
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
