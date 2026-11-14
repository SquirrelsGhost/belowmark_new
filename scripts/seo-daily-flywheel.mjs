#!/usr/bin/env node
// Autonomous Daily Self-Improving SEO & GEO Flywheel for Belowmark (Home-PC Autopilot)
// Run: node --use-system-ca --no-warnings scripts/seo-daily-flywheel.mjs [--push-indexnow] [--auto-deploy]

import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(ROOT, ".env.local"), quiet: true });

const ORIGIN = "https://www.belowmark.com";
const GSC_SITE = "sc-domain:belowmark.com";
const INDEXNOW_KEY = "pycie2026seoindexnowkey";
const INDEXNOW_KEY_URL = `${ORIGIN}/${INDEXNOW_KEY}.txt`;
const BOOSTS_FILE = path.join(ROOT, "src", "data", "seoLearnedBoosts.json");
const DATA_DIR = path.join(ROOT, ".data", "seo-flywheel");
mkdirSync(DATA_DIR, { recursive: true });

const GSC_KEY_CANDIDATES = [
  process.env.GSC_SERVICE_ACCOUNT_FILE,
  "C:/Users/emrea/Downloads/Developer_Keys_and_Certs/pycie-485818-56cf96e72f63.json",
  "C:/Users/emrea/Downloads/pycie-485818-56cf96e72f63.json",
].filter(Boolean);

const args = new Set(process.argv.slice(2));
const shouldPushIndexNow = args.has("--push-indexnow");
const shouldAutoDeploy = args.has("--auto-deploy");

const MARKET_SEEDS = [
  { market: "DE", hl: "de", queries: ["zwangsversteigerung haus", "zwangsversteigerung wohnung", "zwangsversteigerung amtsgericht", "teilungsversteigerung immobilie"] },
  { market: "AT", hl: "de", queries: ["zwangsversteigerung oesterreich ediktsdatei", "haus versteigerung wien", "gerichtliche versteigerung immobilien"] },
  { market: "CH", hl: "de", queries: ["betreibungsamtliche steigerung haus", "zwangsversteigerung schweiz shab", "liegenschaft steigerung kanton"] },
  { market: "TR", hl: "tr", queries: ["icradan satilik daire", "icra ihale gayrimenkul", "uyap e satis ihale"] },
  { market: "IT", hl: "it", queries: ["aste giudiziarie immobiliari", "case all asta tribunale", "offerta minima 75 asta"] },
  { market: "ES", hl: "es", queries: ["subastas judiciales boe viviendas", "pisos subasta juzgado", "subasta judicial 70 por ciento"] },
  { market: "FR", hl: "fr", queries: ["encheres immobilieres judiciaires", "vente aux encheres tribunal", "licitor encheres maison"] },
  { market: "GB", hl: "en", queries: ["repossessed property auction uk", "property auction guide price", "court auction houses london"] },
];

async function getGscToken() {
  const keyPath = GSC_KEY_CANDIDATES.find((p) => existsSync(p));
  if (!keyPath) return null;
  const sa = JSON.parse(readFileSync(keyPath, "utf8"));
  const now = Math.floor(Date.now() / 1000);
  const h = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const c = Buffer.from(
    JSON.stringify({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/webmasters",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  ).toString("base64url");
  const s = crypto.createSign("RSA-SHA256").update(`${h}.${c}`).sign(sa.private_key, "base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${h}.${c}.${s}` }),
  });
  const json = await res.json();
  return json.access_token ?? null;
}

async function fetchAutocomplete(query, hl) {
  try {
    const url = `https://suggestqueries.google.com/complete/search?client=firefox&hl=${hl}&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5_000) });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json[1])
      ? json[1].filter(
          (s) =>
            typeof s === "string" &&
            s.length >= 10 &&
            s.length <= 75 &&
            !/https?:|www\.|\b(jobs?|careers?|login|porn|casino)\b/i.test(s),
        )
      : [];
  } catch {
    return [];
  }
}

function inferMarketFromPath(pathname) {
  if (pathname.startsWith("/oesterreich")) return "AT";
  if (pathname.startsWith("/schweiz") || pathname.startsWith("/fr/suisse") || pathname.startsWith("/it/svizzera")) return "CH";
  if (pathname.startsWith("/tr/")) return "TR";
  if (pathname.startsWith("/it/")) return "IT";
  if (pathname.startsWith("/es/")) return "ES";
  if (pathname.startsWith("/fr/")) return "FR";
  if (pathname.startsWith("/en/")) return "GB";
  return "DE";
}

function mergeUniqueCapped(existing, incoming, cap) {
  const seen = new Set((existing ?? []).map((x) => x.toLowerCase()));
  const out = [...(existing ?? [])];
  let added = 0;
  for (const raw of incoming) {
    const clean = String(raw || "").trim();
    if (clean.length < 8 || clean.length > 80) continue;
    const key = clean.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(clean);
    added++;
    if (out.length >= cap) break;
  }
  return { list: out.slice(0, cap), added };
}

const boosts = existsSync(BOOSTS_FILE)
  ? JSON.parse(readFileSync(BOOSTS_FILE, "utf8"))
  : { updatedAt: "", source: "belowmark-seo-flywheel-v2", markets: {}, pages: {}, ctrBoosts: {} };
boosts.source = "belowmark-seo-flywheel-v2";
boosts.markets ??= {};
boosts.pages ??= {};
boosts.ctrBoosts ??= {};

let newlyLearned = 0;

// 1. Google Autocomplete across 8 markets (2 rotating seeds/market/day + uncovered)
const daySeed = Math.floor(Date.now() / 86_400_000);
for (const entry of MARKET_SEEDS) {
  const q1 = entry.queries[daySeed % entry.queries.length];
  const q2 = entry.queries[(daySeed + 1) % entry.queries.length];
  const hits = [...(await fetchAutocomplete(q1, entry.hl)), ...(await fetchAutocomplete(q2, entry.hl))];
  const merged = mergeUniqueCapped(boosts.markets[entry.market], hits, 12);
  boosts.markets[entry.market] = merged.list;
  newlyLearned += merged.added;
}

// 2. GSC 28-day Query+Page Harvest + Sitemap Submit
let gscReport = { available: false };
const gscToken = await getGscToken();
if (gscToken) {
  const headers = { Authorization: `Bearer ${gscToken}`, "Content-Type": "application/json" };
  const endDate = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  const startDate = new Date(Date.now() - 29 * 86_400_000).toISOString().slice(0, 10);

  const qRes = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE)}/searchAnalytics/query`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ startDate, endDate, dimensions: ["query", "page"], rowLimit: 400 }),
    },
  );
  const qJson = await qRes.json();
  const rows = Array.isArray(qJson.rows) ? qJson.rows : [];
  const pageStats = new Map();
  for (const row of rows) {
    const query = row.keys?.[0];
    const pageUrl = row.keys?.[1];
    if (!query || !pageUrl) continue;
    const imp = Number(row.impressions ?? 0);
    const clk = Number(row.clicks ?? 0);
    const pos = Number(row.position ?? 0);
    try {
      const pathname = new URL(pageUrl).pathname;
      const cur = pageStats.get(pathname) ?? { impressions: 0, clicks: 0, topQuery: "", topImp: 0, topPos: 0 };
      cur.impressions += imp;
      cur.clicks += clk;
      if (imp > cur.topImp && query.length >= 6 && query.length <= 52 && !/https?:|belowmark/i.test(query)) {
        cur.topImp = imp;
        cur.topQuery = query;
        cur.topPos = pos;
      }
      pageStats.set(pathname, cur);

      if (imp < 2) continue;
      const mergedPage = mergeUniqueCapped(boosts.pages[pathname], [query], 6);
      boosts.pages[pathname] = mergedPage.list;
      newlyLearned += mergedPage.added;

      const mkt = inferMarketFromPath(pathname);
      const mergedMkt = mergeUniqueCapped(boosts.markets[mkt], [query], 12);
      boosts.markets[mkt] = mergedMkt.list;
      newlyLearned += mergedMkt.added;
    } catch {
      // ignore invalid URL
    }
  }

  let ctrStrikersUpdated = 0;
  const nextCtrBoosts = {};
  for (const [pathname, st] of pageStats.entries()) {
    const ctrPct = st.impressions > 0 ? (st.clicks / st.impressions) * 100 : 0;
    if (st.impressions >= 50 && ctrPct < 1.0 && st.topQuery) {
      nextCtrBoosts[pathname] = {
        topQuery: st.topQuery,
        impressions: st.impressions,
        clicks: st.clicks,
        ctr: Number(ctrPct.toFixed(2)),
        position: Number(st.topPos.toFixed(1)),
      };
      if (boosts.ctrBoosts?.[pathname]?.topQuery !== st.topQuery) {
        newlyLearned++;
        ctrStrikersUpdated++;
      }
    }
  }
  boosts.ctrBoosts = nextCtrBoosts;

  const smUrl = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE)}/sitemaps/${encodeURIComponent(`${ORIGIN}/sitemap.xml`)}`;
  const smRes = await fetch(smUrl, { method: "PUT", headers: { Authorization: `Bearer ${gscToken}` } });
  gscReport = {
    available: true,
    rowsHarvested: rows.length,
    ctrStrikersActive: Object.keys(nextCtrBoosts).length,
    ctrStrikersUpdated,
    sitemapSubmitStatus: smRes.status,
  };
}

boosts.updatedAt = new Date().toISOString();
writeFileSync(BOOSTS_FILE, `${JSON.stringify(boosts, null, 2)}\n`, "utf8");

// 3. IndexNow Push (top/learned pages + hubs)
let indexNowStatus = "skipped";
if (shouldPushIndexNow) {
  const urlList = Array.from(
    new Set([
      `${ORIGIN}/`,
      `${ORIGIN}/zwangsversteigerungen`,
      `${ORIGIN}/atlas`,
      `${ORIGIN}/oesterreich/ediktsdatei`,
      `${ORIGIN}/schweiz/shab-versteigerungen`,
      `${ORIGIN}/tr/icra-ihale`,
      `${ORIGIN}/it/aste-giudiziarie`,
      `${ORIGIN}/es/subastas-boe`,
      `${ORIGIN}/fr/encheres-immobilieres`,
      `${ORIGIN}/en/uk-property-auctions`,
      ...Object.keys(boosts.pages).slice(0, 200).map((p) => `${ORIGIN}${p}`),
    ]),
  );
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: "www.belowmark.com",
        key: INDEXNOW_KEY,
        keyLocation: INDEXNOW_KEY_URL,
        urlList,
      }),
    });
    indexNowStatus = `http_${res.status}_urls_${urlList.length}`;
  } catch (err) {
    indexNowStatus = `error_${String(err?.message ?? err)}`;
  }
}

// 4. Optional Verified Git Auto-Deploy (only when ONLY seoLearnedBoosts.json changed)
let autoDeploy = { status: "skipped" };
if (shouldAutoDeploy && newlyLearned > 0) {
  try {
    const porcelain = execFileSync("git", ["status", "--porcelain"], { cwd: ROOT, encoding: "utf8" }).trim();
    const dirtyFiles = porcelain ? porcelain.split(/\r?\n/).map((l) => l.slice(3).trim().replace(/\\/g, "/")) : [];
    const onlyBoosts = dirtyFiles.length > 0 && dirtyFiles.every((f) => f === "src/data/seoLearnedBoosts.json");
    if (!onlyBoosts) {
      autoDeploy = { status: "skipped_dirty_worktree", dirtyFiles };
    } else {
      execFileSync("git", ["add", "src/data/seoLearnedBoosts.json"], { cwd: ROOT });
      execFileSync("git", ["commit", "-m", `chore(seo-flywheel): learn +${newlyLearned} live GSC & autocomplete queries`], { cwd: ROOT });
      try {
        execFileSync("git", ["pull", "--rebase", "origin", "main"], { cwd: ROOT });
      } catch (rebaseErr) {
        try {
          execFileSync("git", ["rebase", "--abort"], { cwd: ROOT });
        } catch {
          // ignore
        }
        throw rebaseErr;
      }
      execFileSync("git", ["push", "origin", "main"], { cwd: ROOT });
      const sha = execFileSync("git", ["rev-parse", "--short", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim();
      autoDeploy = { status: "pushed_origin", commit: sha };
    }
  } catch (err) {
    autoDeploy = { status: "failed", error: String(err?.message ?? err) };
  }
}

const report = {
  ranAt: new Date().toISOString(),
  newlyLearnedKeywords: newlyLearned,
  marketsCovered: Object.keys(boosts.markets).length,
  pagesCovered: Object.keys(boosts.pages).length,
  gsc: gscReport,
  indexNowStatus,
  autoDeploy,
};
writeFileSync(path.join(DATA_DIR, "latest-report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log("[Belowmark SEO Flywheel]", JSON.stringify(report));
