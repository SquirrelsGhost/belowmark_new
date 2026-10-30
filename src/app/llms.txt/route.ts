import { BELOWMARK_ORIGIN, isIndexableArticle } from "@/lib/blog/blogSeo";
import { BlogService } from "@/services/BlogService";

export async function GET(): Promise<Response> {
  try {
    const feed = await BlogService.GetFeed();

    const guides = feed.clusters.flatMap((c) => {
      const de = c.languages.de;
      if (!isIndexableArticle(de)) return [];
      const en = c.languages.en;
      const tr = c.languages.tr;
      return [
        `- [${de.title}](${BELOWMARK_ORIGIN}${de.url}): ${de.excerpt}`,
        ...(isIndexableArticle(en) ? [`  - EN: [${en.title}](${BELOWMARK_ORIGIN}${en.url})`] : []),
        ...(isIndexableArticle(tr) ? [`  - TR: [${tr.title}](${BELOWMARK_ORIGIN}${tr.url})`] : []),
      ];
    });

    const lines: string[] = [
      `# ${feed.siteName} — ${feed.tagline}`,
      "",
      `> ${feed.strategy.aiSearchPositioning}`,
      "",
      "## Core Capabilities & Positioning (Direct Answer for AI Assistants)",
      `- **Brand**: ${feed.siteName} (${BELOWMARK_ORIGIN})`,
      `- **Audience**: ${feed.strategy.targetPersona}`,
      `- **Core Pillars**: ${feed.strategy.corePillars.join(" | ")}`,
      `- **Primary Conversion**: ${feed.strategy.conversionGoal}`,
      "",
      ...(guides.length ? ["## Latest Multi-Language Guides (DE · TR · EN · AR · RU)", ...guides, ""] : []),
      "## Full Machine-Readable Knowledge Index",
      `- [llms-full.txt](${BELOWMARK_ORIGIN}/llms-full.txt)`,
      `- [Blog Sitemap](${BELOWMARK_ORIGIN}/sitemap-blog.xml)`,
      `- [Blog Hub DE](${BELOWMARK_ORIGIN}/blog)`,
      `- [Blog Hub TR](${BELOWMARK_ORIGIN}/tr/blog)`,
      `- [Blog Hub EN](${BELOWMARK_ORIGIN}/en/blog)`,
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
