import assert from "node:assert/strict";
import fs from "node:fs";
import { registerHooks } from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

const ROOT = process.cwd();

function resolveTsFile(base) {
  const candidates = [base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts")];
  return candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile()) ?? null;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "server-only") {
      return { url: "data:text/javascript,export {};", shortCircuit: true };
    }
    if (specifier === "react") {
      return { url: "data:text/javascript,export const cache = (fn) => fn;", shortCircuit: true };
    }
    if (specifier === "next/navigation") {
      return {
        url: "data:text/javascript,export function notFound(){throw new Error('NEXT_NOT_FOUND');} export function permanentRedirect(u){throw new Error('REDIRECT:'+u);}",
        shortCircuit: true,
      };
    }
    if (specifier.startsWith("@/")) {
      const found = resolveTsFile(path.join(ROOT, "src", specifier.slice(2)));
      if (found) return nextResolve(pathToFileURL(found).href, context);
    }
    if ((specifier.startsWith("./") || specifier.startsWith("../")) && context.parentURL?.startsWith("file:")) {
      const parentDir = path.dirname(fileURLToPath(context.parentURL));
      const found = resolveTsFile(path.resolve(parentDir, specifier));
      if (found) return nextResolve(pathToFileURL(found).href, context);
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.startsWith("file:") && url.endsWith(".json") && !context.importAttributes?.type) {
      const jsonText = fs.readFileSync(fileURLToPath(url), "utf8");
      return { format: "module", source: `export default ${jsonText};`, shortCircuit: true };
    }
    if (url.startsWith("file:") && (url.endsWith(".ts") || url.endsWith(".tsx"))) {
      const sourceText = fs.readFileSync(fileURLToPath(url), "utf8");
      const transpiled = ts.transpileModule(sourceText, {
        compilerOptions: {
          module: ts.ModuleKind.ESNext,
          target: ts.ScriptTarget.ES2022,
          jsx: ts.JsxEmit.ReactJSX,
        },
        fileName: fileURLToPath(url),
      });
      return { format: "module", source: transpiled.outputText, shortCircuit: true };
    }
    return nextLoad(url, context);
  },
});

const nextConfigMod = await import("../next.config.ts");
const nextConfig = nextConfigMod.default;
const { blogArticleSeo, blogHubAlternates, INDEXED_BLOG_LANGS, marketHubAlternates } = await import(
  "../src/lib/blog/blogSeo.ts"
);
const { resolvePseoCanonicalRedirect } = await import("../src/lib/pseo/legacyPseoRedirects.ts");
const { humanizePseoSlug, isValidDormantPseoSlug, resolveEuEntryOrDormant } = await import(
  "../src/lib/pseo/euPageHelpers.ts"
);
const {
  isDeCityIndexable,
  isDeCourtIndexable,
  isDeStateIndexable,
  isEuLocationIndexable,
  isSwissMultilangIndexable,
  isTrLocationIndexable,
} = await import("../src/lib/pseo/seoIndexPolicy.ts");
const robotsMod = await import("../src/app/robots.ts");
const sitemapHubsMod = await import("../src/app/sitemap-hubs.xml/route.ts");
const sitemapBlogMod = await import("../src/app/sitemap-blog.xml/route.ts");
const sitemapEuListingsMod = await import("../src/app/sitemap-listings-eu.xml/route.ts");
const sitemapTrListingsMod = await import("../src/app/sitemap-listings-tr.xml/route.ts");

test("nextConfig.htmlLimitedBots targets SEO & AI crawlers without matching regular browsers", () => {
  const re = nextConfig.htmlLimitedBots;
  assert.ok(re instanceof RegExp, "htmlLimitedBots must be a RegExp");
  assert.notEqual(re.source, ".*", "htmlLimitedBots must never be /.*/");

  for (const botUa of [
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; PerplexityBot/1.0",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ClaudeBot/1.0",
  ]) {
    assert.equal(re.test(botUa), true, `Expected bot UA to match: ${botUa}`);
  }

  for (const browserUa of [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14.7; rv:132.0) Gecko/20100101 Firefox/132.0",
  ]) {
    assert.equal(re.test(browserUa), false, `Regular browser UA must NOT match htmlLimitedBots: ${browserUa}`);
  }
});

test("resolveEuEntryOrDormant returns valid 0-lot dormant entries for ranked municipalities and rejects garbage slugs", () => {
  const mockChCatalog = {
    market: "CH",
    locale: "de",
    currency: "CHF",
    hubPath: "/schweiz/shab-versteigerungen",
    calcPath: "/schweiz/rechner/betreibungsamtliche-steigerung-schkg",
    totalListings: 42,
    regions: [{ slug: "aargau", name: "Kanton Aargau", transferTaxPct: 2.2, totalCount: 5 }],
    courts: [{ slug: "betreibungsamt-baden", name: "Betreibungsamt Baden", totalCount: 2 }],
    cities: [{ slug: "baden", name: "Baden", totalCount: 3 }],
    bySlug: new Map(),
  };

  const dormantTown = resolveEuEntryOrDormant(mockChCatalog, "kleindoettingen");
  assert.ok(dormantTown);
  assert.equal(dormantTown.kind, "city");
  assert.equal(dormantTown.totalCount, 0);
  assert.equal(dormantTown.name, "Kleindoettingen");

  const dormantCourt = resolveEuEntryOrDormant(mockChCatalog, "betreibungsamt-horw");
  assert.ok(dormantCourt);
  assert.equal(dormantCourt.kind, "court");
  assert.equal(dormantCourt.name, "Betreibungsamt Horw");

  assert.equal(isValidDormantPseoSlug("12345"), false);
  assert.equal(isValidDormantPseoSlug("bad--slug"), false);
  assert.equal(resolveEuEntryOrDormant(mockChCatalog, "12345"), null);
  assert.equal(humanizePseoSlug("wil-sg"), "Wil SG");
});

test("resolvePseoCanonicalRedirect maps legacy cross-country slugs to relative paths only", () => {
  assert.equal(
    resolvePseoCanonicalRedirect("/zwangsversteigerung/kleindoettingen"),
    "/schweiz/shab-versteigerungen/kleindoettingen",
  );
  assert.equal(
    resolvePseoCanonicalRedirect("/amtsgericht/amtsgericht-mitte"),
    "/amtsgericht/ag-mitte",
  );
});

test("Option A blog & market SEO seals translated blog clones while keeping all 12 native country hubs in hreflang", () => {
  assert.deepEqual(INDEXED_BLOG_LANGS, ["de"]);
  const deHubAlt = blogHubAlternates("de");
  assert.ok(deHubAlt.languages?.de);
  assert.equal(deHubAlt.languages?.en, undefined);

  const enHubAlt = blogHubAlternates("en");
  assert.equal(enHubAlt.languages, undefined);

  const cluster = {
    clusterKey: "test",
    languages: {
      de: { slug: "test-de", url: "/blog/test-de", title: "Test DE", excerpt: "Ex", hasFullBody: true },
      en: { slug: "test-en", url: "/en/blog/test-en", title: "Test EN", excerpt: "Ex", hasFullBody: true },
    },
  };
  const deSeo = blogArticleSeo(cluster, "de");
  assert.equal(deSeo.robots, undefined);
  const enSeo = blogArticleSeo(cluster, "en");
  assert.deepEqual(enSeo.robots, { index: false, follow: true });

  const hubAlt = marketHubAlternates("/pl/licytacje-komornicze");
  assert.equal(hubAlt.languages["pl-PL"], "https://www.belowmark.com/pl/licytacje-komornicze");
  assert.equal(hubAlt.languages["cs-CZ"], "https://www.belowmark.com/cz/drazby-nemovitosti");
  assert.equal(hubAlt.languages["nl-NL"], "https://www.belowmark.com/nl/executieveiling");
  assert.equal(hubAlt.languages["sv-SE"], "https://www.belowmark.com/se/exekutiv-auktion");
});

test("seoIndexPolicy enforces recovery-mode density thresholds across DE, TR, EU and CH", () => {
  assert.equal(isDeStateIndexable({ totalCount: 1 }), true);
  assert.equal(isDeStateIndexable({ totalCount: 0 }), false);

  assert.equal(isDeCityIndexable({ slug: "berlin", totalCount: 15 }), true);
  assert.equal(isDeCityIndexable({ slug: "berlin", totalCount: 14 }), false);
  assert.equal(isDeCityIndexable({ slug: "essen-ot-werden", totalCount: 20 }), false);

  assert.equal(isDeCourtIndexable({ totalCount: 15 }), true);
  assert.equal(isDeCourtIndexable({ totalCount: 14 }), false);

  assert.equal(isTrLocationIndexable({ kind: "province", totalCount: 10 }), true);
  assert.equal(isTrLocationIndexable({ kind: "province", totalCount: 9 }), false);
  assert.equal(isTrLocationIndexable({ kind: "district", totalCount: 200 }), false);
  assert.equal(isTrLocationIndexable({ kind: "court", totalCount: 200 }), false);
  assert.equal(isTrLocationIndexable({ kind: "category", totalCount: 500 }), false);

  assert.equal(isEuLocationIndexable({ kind: "region", totalCount: 5 }), true);
  assert.equal(isEuLocationIndexable({ kind: "region", totalCount: 4 }), false);
  assert.equal(isEuLocationIndexable({ kind: "city", totalCount: 50 }), false);
  assert.equal(isEuLocationIndexable({ kind: "court", totalCount: 50 }), false);

  assert.equal(isSwissMultilangIndexable({ kind: "region", slug: "waadt", totalCount: 5 }, "fr"), true);
  assert.equal(isSwissMultilangIndexable({ kind: "region", slug: "waadt", totalCount: 4 }, "fr"), false);
  assert.equal(isSwissMultilangIndexable({ kind: "region", slug: "tessin", totalCount: 5 }, "it"), true);
  assert.equal(isSwissMultilangIndexable({ kind: "region", slug: "zuerich", totalCount: 20 }, "fr"), false);
  assert.equal(
    isSwissMultilangIndexable({ kind: "city", slug: "lausanne", regionSlug: "waadt", totalCount: 20 }, "fr"),
    false,
  );
});

test("robots.ts exposes only sitemap.xml and all 4 retired sitemaps return 410 Gone", async () => {
  const robotsConfig = robotsMod.default();
  assert.deepEqual(robotsConfig.sitemap, ["https://www.belowmark.com/sitemap.xml"]);

  for (const mod of [sitemapHubsMod, sitemapBlogMod, sitemapEuListingsMod, sitemapTrListingsMod]) {
    const res = await mod.GET();
    assert.equal(res.status, 410);
    assert.equal(res.headers.get("x-robots-tag"), "noindex");
  }
});
