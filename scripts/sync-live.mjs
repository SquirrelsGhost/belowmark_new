/**
 * Live Multi-Source Foreclosure Synchronizer for Belowmark (DE & TR)
 *
 * Connects directly to all official foreclosure and public auction portals:
 *
 * DE (All 16 Bundesländer):
 *   1. zvg-portal.de — Joint Justice Portal of the Federal & State Governments
 *      (POST /index.php?button=Suchen&all=1 per state + Referer-authenticated detail & attachment links)
 *   2. zvg.com — Official Court Announcement System (§ 39 ZVG) covering BW, SH, MV, HH, BB, ST, BE, NI, etc.
 *      (GET /v2024/termine.prg?act=getGridJson&id_b=0 + getPDF + getJSON + aufgehoben.prg)
 *   3. Official Geoportals & BORIS Bodenrichtwert registries for all 16 states
 *
 * TR (All 81 Provinces):
 *   1. ilan.gov.tr — Basın İlan Kurumu Official Portal (İCRA & İHALE, with X-Request-Origin: IGT-UI)
 *   2. ilan.gib.gov.tr — Gelir İdaresi Başkanlığı (Tax Authority 6183 AATUHK auctions)
 *   3. net.sgk.gov.tr — Sosyal Güvenlik Kurumu (Social Security Authority real estate auctions)
 *   4. gayrimenkul.intengo.com/vakifbank — VakıfBank Official E-İhale Real Estate Portal
 *
 * Usage:
 *   node --use-system-ca scripts/sync-live.mjs
 */

import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import tls from "node:tls";
import { slug } from "./lib/slug.mjs";

if (process.platform === "win32" && typeof tls.getCACertificates === "function" && typeof tls.setDefaultCACertificates === "function") {
  try {
    tls.setDefaultCACertificates([...tls.getCACertificates("default"), ...tls.getCACertificates("system")]);
  } catch {
    // Keep default CAs if system CA merge is unavailable
  }
}

const OUT_DIR = join(process.cwd(), "data", "snapshots");
const IMMO_DATA_DIR = "C:\\Users\\emrea\\Desktop\\1_Projekte_und_Apps\\immo\\data";
const TR_OFFSET = "+03:00";

const BUNDESLAENDER_DE = [
  { code: "bw", portalCode: "bw", name: "Baden-Württemberg", transferTaxPct: 5.0 },
  { code: "by", portalCode: "by", name: "Bayern", transferTaxPct: 3.5 },
  { code: "be", portalCode: "be", name: "Berlin", transferTaxPct: 6.0 },
  { code: "bb", portalCode: "br", name: "Brandenburg", transferTaxPct: 6.5 },
  { code: "hb", portalCode: "hb", name: "Bremen", transferTaxPct: 5.5 },
  { code: "hh", portalCode: "hh", name: "Hamburg", transferTaxPct: 5.5 },
  { code: "he", portalCode: "he", name: "Hessen", transferTaxPct: 6.0 },
  { code: "mv", portalCode: "mv", name: "Mecklenburg-Vorpommern", transferTaxPct: 6.0 },
  { code: "ni", portalCode: "ni", name: "Niedersachsen", transferTaxPct: 5.0 },
  { code: "nw", portalCode: "nw", name: "Nordrhein-Westfalen", transferTaxPct: 6.5 },
  { code: "rp", portalCode: "rp", name: "Rheinland-Pfalz", transferTaxPct: 5.0 },
  { code: "sl", portalCode: "sl", name: "Saarland", transferTaxPct: 6.5 },
  { code: "sn", portalCode: "sn", name: "Sachsen", transferTaxPct: 5.5 },
  { code: "st", portalCode: "st", name: "Sachsen-Anhalt", transferTaxPct: 5.0 },
  { code: "sh", portalCode: "sh", name: "Schleswig-Holstein", transferTaxPct: 6.5 },
  { code: "th", portalCode: "th", name: "Thüringen", transferTaxPct: 5.0 },
];

const STATE_BY_NAME_DE = new Map(BUNDESLAENDER_DE.map((s) => [s.name, s]));

const GEOPORTALS_DE = {
  bw: { url: "https://www.geoportal-bw.de/", name: "Geoportal Baden-Württemberg · LGL" },
  by: { url: "https://geoportal.bayern.de/bayernatlas/", name: "BayernAtlas · BVV" },
  be: { url: "https://gdi.berlin.de/viewer/main/", name: "Geoportal Berlin · GDI" },
  bb: { url: "https://geoportal.brandenburg.de/", name: "Geoportal Brandenburg · LGB" },
  hb: { url: "https://geoportal.bremen.de/geoportal/", name: "GeoPortal Bremen" },
  hh: { url: "https://geoportal-hamburg.de/", name: "Geoportal Hamburg · LGV" },
  he: { url: "https://www.geoportal.hessen.de/", name: "Geoportal Hessen · HVBG" },
  mv: { url: "https://www.geoportal-mv.de/portal/Geodatenviewer/GAIA-MVlight", name: "GeoPortal.MV · GAIA-MV" },
  ni: { url: "https://www.maps.lgln.niedersachsen.de/katasterkarten-online/mapbender/application/katasterkarten-online", name: "Katasterkarten Online · LGLN" },
  nw: { url: "https://www.geoportal.nrw/", name: "GEOportal.NRW · Geobasis NRW" },
  rp: { url: "https://www.geoportal.rlp.de/map", name: "GeoPortal.rlp · LVermGeo" },
  sl: { url: "https://geoportal.saarland.de/", name: "Geoportal Saarland · LVGL" },
  sn: { url: "https://geoportal.sachsen.de/?app=geoportal", name: "Sachsenatlas · GeoSN" },
  st: { url: "https://www.geodatenportal.sachsen-anhalt.de/mapapps/resources/apps/GeobasisViewer/index.html", name: "GeobasisViewer · LVermGeo ST" },
  sh: { url: "https://danord.gdi-sh.de/viewer/resources/apps/Anonym/index.html?lang=de", name: "DigitalerAtlasNord · LVermGeo SH" },
  th: { url: "https://www.geoproxy.geoportal-th.de/geoclient/", name: "Geoportal Thüringen · TLBG" },
};

const DE_SEGMENT_RULES = [
  ["apartment", /Eigentumswohnung|Wohnungseigentum|Zimmer-Wohnung|Teileigentum/i],
  ["multiFamily", /Mehrfamilienhaus|Wohn-\/Geschäftshaus|Wohn- und Geschäftshaus|Dreifamilienhaus/i],
  ["house", /Einfamilienhaus|Zweifamilienhaus|Doppelhaushälfte|Reihenhaus|Wohnhaus|Villa|Bungalow|Ferienhaus/i],
  ["commercial", /Gewerbe|gewerblich|Laden|Büro|Hotel|Gaststätte|Halle|Werkstatt|Praxis|Lager/i],
  ["land", /unbebautes Grundstück|Baugrundstück|Bauplatz|Grundstück/i],
  ["farmland", /land- und forstwirtschaftlich|Landwirtschaft|Forst|Wald|Acker|Grünland|Wiese/i],
];

const TR_CLASS_SEGMENT = {
  daire: "apartment",
  mustakil: "house",
  arsa: "land",
  tarim: "farmland",
  zeytinlik: "farmland",
  isyeri: "commercial",
};

const TR_SEGMENT_FALLBACK = {
  konut: "apartment",
  bina: "multiFamily",
  ticari: "commercial",
  arsa: "land",
  arazi: "farmland",
};

const ENT = {
  "&nbsp;": " ", "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'",
  "&uuml;": "ü", "&Uuml;": "Ü", "&auml;": "ä", "&Auml;": "Ä", "&ouml;": "ö", "&Ouml;": "Ö",
  "&szlig;": "ß", "&euro;": "€", "&#128;": "€",
};

const clean = (s) =>
  String(s ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#?\w+;/g, (e) => ENT[e] ?? e)
    .replace(/\s+/g, " ")
    .trim();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const i = cursor++;
      out[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return out;
}

const readPoints = (market) => JSON.parse(readFileSync(join(process.cwd(), "data", "geo", `${market}-points.json`), "utf8"));
const geoPoint = (point, precision) => (point ? { lat: point[0], lng: point[1], precision } : null);
const num = (value) => (typeof value === "number" && Number.isFinite(value) ? value : null);
const round2 = (value) => (value === null ? null : Math.round(value * 100) / 100);

function deSegment(raw, title = "") {
  const text = `${raw ?? ""} ${title ?? ""}`;
  return DE_SEGMENT_RULES.find(([, pattern]) => pattern.test(text))?.[0] ?? "other";
}

function deCourt(raw) {
  return String(raw ?? "").replace(/\s+in\s+[A-ZÄÖÜ][\wäöüß-]+(?:-[\wäöüß]+)*$/u, "").replace(/^\s*AG\s+/i, "").trim();
}

function canonicalFileNo(value = "") {
  const raw = String(value)
    .trim()
    .replace(/\s*\(\d+\)\s*$/, "")
    .replace(/^[A-ZÄÖÜ]{1,4}\s+(?=\d+\s+[A-ZÄÖÜ])/u, "");
  const match = /^(?:(\d+)\s*)?([A-ZÄÖÜ]+)\s*(\d+)\s*[-/]\s*(\d{2,4})$/iu.exec(raw);
  if (!match) return raw.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const year = Number(match[4]) < 100 ? 2000 + Number(match[4]) : Number(match[4]);
  return `${Number(match[1] ?? 0)}|${match[2].toUpperCase()}|${Number(match[3])}|${year}`;
}

function fileNoYear(fileNo = "") {
  const m = /[-/](\d{2,4})(?:\s*\(\d+\))?\s*$/.exec(String(fileNo).trim());
  if (!m) return null;
  const n = Number(m[1]);
  if (!Number.isFinite(n)) return null;
  return n < 100 ? 2000 + n : n;
}

function parseGermanNumber(str = "") {
  const cleaned = String(str).replace(/[^\d.,]/g, "").replace(/\./g, "").replace(",", ".");
  const n = Number.parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}

const MONTHS_DE = {
  Januar: 1, Februar: 2, März: 3, April: 4, Mai: 5, Juni: 6,
  Juli: 7, August: 8, September: 9, Oktober: 10, November: 11, Dezember: 12,
};

function parseGermanDateIso(dateStr, timeStr = "09:00") {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(String(dateStr ?? "").trim());
  if (!m) return null;
  const [, d, mo, y] = m;
  const t = /^\d{1,2}:\d{2}/.test(String(timeStr ?? "").trim()) ? String(timeStr).trim().padStart(5, "0") : "09:00";
  // German court time -> ISO
  return `${y}-${mo}-${d}T${t}:00+01:00`;
}

function parseTerminLine(line = "") {
  const m = /(\d{1,2})\.\s*([\p{L}]+)\s*(\d{4}),\s*(\d{1,2}):(\d{2})/u.exec(line);
  if (!m) return null;
  const month = MONTHS_DE[m[2]];
  if (!month) return null;
  const date = `${String(+m[1]).padStart(2, "0")}.${String(month).padStart(2, "0")}.${m[3]}`;
  const time = `${m[4].padStart(2, "0")}:${m[5]}`;
  return { date, time, iso: parseGermanDateIso(date, time) };
}

const BETRAG_RE = /(?<![\d.,])(?:\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?|\d+,\d{2}|\d{3,}(?=\s*(?:€|EUR)))/g;

function parseVerkehrswert(block = "") {
  const zelle =
    /Verkehrswert[\s\S]{0,200}?<strong>([\s\S]*?)<\/strong>/i.exec(block)?.[1] ??
    /Verkehrswert([\s\S]*?)(?:<TR|<tr[ >]|Termin<\/td>)/i.exec(block)?.[1];
  if (!zelle) return null;
  const text = clean(zelle).split(/\b(?:davon|hiervon|darin|darunter|einschließlich|inkl\.?|zzgl\.?|abzügl\.?)\b/i)[0];
  const werte = [
    ...new Set(
      [...text.matchAll(BETRAG_RE)]
        .map((t) => parseGermanNumber(t[0]))
        .filter((n) => Number.isFinite(n) && n > 0),
    ),
  ];
  if (werte.length === 0) return null;
  if (werte.length === 1) return werte[0];
  const summe = werte.reduce((a, b) => a + b, 0);
  const gesamt = werte.filter((w) => Math.abs(summe - w - w) < 0.5);
  return gesamt.length === 1 ? gesamt[0] : werte[0];
}

function buildDeCaveats({ fileYear, appraisedValue, limitsWaived, proceedingKind }) {
  const list = [];
  const currentYear = new Date().getFullYear();
  if (fileYear && currentYear - fileYear >= 2) {
    list.push({
      points: 12,
      short: `Aktenzeichen aus ${fileYear}`,
      long: `Das Verfahren läuft seit ${fileYear}. Der Verkehrswert stammt in der Regel aus dem Gutachten zu Verfahrensbeginn und kann vom heutigen Marktwert abweichen.`,
    });
  }
  if (limitsWaived) {
    list.push({
      points: 0,
      short: "Wertgrenzen entfallen (§ 85a II ZVG)",
      long: "In diesem Termin gelten weder die 5/10- noch die 7/10-Grenze — ein Zuschlag ist grundsätzlich auch unter 50 % des Verkehrswerts möglich.",
    });
  }
  if (proceedingKind && /Teilung/i.test(proceedingKind)) {
    list.push({
      points: 0,
      short: "Teilungsversteigerung (§ 180 ZVG)",
      long: "Versteigerung zur Aufhebung einer Gemeinschaft (z. B. Erbengemeinschaft oder Scheidung). Miteigentümer dürfen selbst mitbieten.",
    });
  }
  if (!appraisedValue) {
    list.push({
      points: 10,
      short: "Kein Einzelverkehrswert im Kurzaushang",
      long: "Der Kurzaushang nennt keinen einzelnen Verkehrswert (oder mehrere BV-Nummern). Maßgeblich ist das amtliche Bekanntmachungs-PDF.",
    });
  }
  return list;
}

// ---------------------------------------------------------------------------
// 1. Fetch Germany Live (zvg-portal.de + zvg.com)
// ---------------------------------------------------------------------------
async function fetchZvgPortalState(state) {
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Referer: "https://www.zvg-portal.de/index.php?button=Termine%20suchen",
    "User-Agent": "Mozilla/5.0 (compatible; BelowmarkBot/1.0; +https://belowmark.com; contact@pycie.com)",
  };
  const baseParams = {
    order_by: "2",
    land_abk: state.portalCode,
    ger_id: "0",
    ger_name: "-- Alle Amtsgerichte --",
    az1: "", az2: "", az3: "", az4: "", art: "", obj: "",
    str: "", hnr: "", plz: "", ort: "", ortsteil: "", vtermin: "", btermin: "",
  };

  const [res, waivedRes] = await Promise.all([
    fetch("https://www.zvg-portal.de/index.php?button=Suchen&all=1", {
      method: "POST",
      headers,
      body: new URLSearchParams(baseParams).toString(),
    }),
    fetch("https://www.zvg-portal.de/index.php?button=Suchen&all=1", {
      method: "POST",
      headers,
      body: new URLSearchParams({ ...baseParams, hinweis: "on" }).toString(),
    }).catch(() => null),
  ]);

  const [html, waivedHtml] = await Promise.all([
    res.text(),
    waivedRes ? waivedRes.text().catch(() => "") : Promise.resolve(""),
  ]);

  const waivedZvgIds = new Set([...waivedHtml.matchAll(/zvg_id=(\d+)/g)].map((m) => m[1]));
  const waivedFileNos = new Set(
    [...waivedHtml.matchAll(/<nobr>([^<]*?K\s*\d[^<]*?)(?:&nbsp;)?(?:\(Detailansicht\))?<\/nobr>/g)].map((m) =>
      canonicalFileNo(clean(m[1]))
    )
  );

  const rows = [];
  for (const chunk of html.split(/<!--Aktenzeichen--->/).slice(1)) {
    const block = chunk.split(/<hr>/)[0];
    const zvgId = /zvg_id=(\d+)/.exec(block)?.[1] ?? null;
    const fileNo = clean(/<nobr>([^<]*?K\s*\d[^<]*?)(?:&nbsp;)?(?:\(Detailansicht\))?<\/nobr>/.exec(block)?.[1]);
    const court = clean(/Amtsgericht<\/td>[\s\S]*?<strong>([^<]*)<\/strong>/.exec(block)?.[1]);
    const objLine = /Objekt\/Lage<\/td>[\s\S]*?<strong>([\s\S]*?)<\/strong>([^<]*(?:<[^>]+>[^<]*)*?)<\/td>/.exec(block);
    const kind = clean(objLine?.[1]).replace(/\s*:$/, "");
    const address = clean(objLine?.[2]);
    const appraisedValue = parseVerkehrswert(block);
    const termin = parseTerminLine(clean(/Termin<\/td>([\s\S]*?)<\/tr>/.exec(block)?.[1]));
    const cancelled = /Termin[\s\S]{0,120}wurde aufgehoben/i.test(block);
    const limitsWaived =
      (zvgId && waivedZvgIds.has(zvgId)) ||
      (fileNo && waivedFileNos.has(canonicalFileNo(fileNo))) ||
      /Wertgrenzen\s+(?:sind\s+)?(?:entfallen|gelten\s+nicht|aufgehoben)/i.test(block);
    const pdfPath = /href="\?(button=showAnhang[^"]*)"/.exec(block)?.[1];
    if (!fileNo || !court || !termin) continue;

    const plzMatch = /(\d{5})/.exec(address);
    const postcode = plzMatch && plzMatch[1] !== "00000" ? plzMatch[1] : null;
    const cityRaw = plzMatch ? clean(address.slice(address.indexOf(plzMatch[1]) + 5)) : clean(address.split(",").pop());
    const street = address.includes(",") ? clean(address.split(",")[0]) : null;

    rows.push({
      source: "zvg-portal.de",
      state,
      zvgId,
      fileNo,
      court: deCourt(court),
      kind,
      address,
      street,
      postcode,
      city: cityRaw ? cityRaw.replace(/^,\s*/, "") : null,
      appraisedValue,
      hearingAt: termin.iso,
      cancelled,
      limitsWaived,
      officialUrl: zvgId
        ? `https://www.zvg-portal.de/index.php?button=showZvg&zvg_id=${zvgId}&land_abk=${state.portalCode}`
        : `https://www.zvg-portal.de/index.php?button=Termine%20suchen`,
      announcementPdf: pdfPath ? `https://www.zvg-portal.de/index.php?${pdfPath.trim()}` : null,
    });
  }
  return rows;
}

async function fetchZvgComAll() {
  const headers = {
    Referer: "https://www.zvg.com/",
    "User-Agent": "Mozilla/5.0 (compatible; BelowmarkBot/1.0; +https://belowmark.com; contact@pycie.com)",
    Accept: "application/json",
  };
  const [gridRes, blRes] = await Promise.all([
    fetch("https://www.zvg.com/v2024/termine.prg?act=getGridJson&id_b=0", { headers }).then((r) => r.json()),
    fetch("https://www.zvg.com/v2024/bundesland.prg?act=getData", { headers }).then((r) => r.json()).catch(() => ({ data: [] })),
  ]);

  // Build court -> state fallback map for courts where row.gericht.bundesland is empty
  const courtToState = new Map();
  const activeStates = (blRes?.data ?? []).filter((b) => b.Aktiv === 1 && b.Name);
  await mapLimit(activeStates, 4, async (b) => {
    try {
      const cRes = await fetch(`https://www.zvg.com/v2024/suche.prg?act=getComboAG&id=${b.Lfd}`, { headers }).then((r) => r.json());
      for (const opt of cRes?.options ?? []) {
        if (opt.value && opt.text) courtToState.set(opt.text.trim(), b.Name);
      }
    } catch {
      // Ignore individual combobox errors
    }
  });

  const rawRows = Array.isArray(gridRes) ? gridRes : Object.values(gridRes ?? {});
  const validRows = rawRows.filter((r) => r && r.id != null && r.ag && r.az && r.date);

  // Also fetch PDF links & metadata for zvg.com objects in polite batches
  console.log(`  zvg.com: ${validRows.length} aktive Termine gefunden, lade Dokument-Links ...`);
  const enriched = await mapLimit(validRows, 10, async (row) => {
    const stateName = row.gericht?.bundesland || courtToState.get(String(row.ag).trim()) || null;
    const state = STATE_BY_NAME_DE.get(stateName);
    if (!state) return null;

    let pdfInfo = null;
    try {
      pdfInfo = await fetch(`https://www.zvg.com/v2024/termine.prg?act=getPDF&id=${row.id}`, { headers }).then((r) => r.json());
    } catch {
      pdfInfo = null;
    }

    const abs = (p) => {
      if (!p || typeof p !== "string") return null;
      if (/^https?:\/\//i.test(p)) return p;
      return p.startsWith("/") ? `https://www.zvg.com${p}` : null;
    };

    const iso = parseGermanDateIso(row.date, row.time);
    const cleanTitle = String(row.title ?? "").replace(/^\s*\S+\s*K\s*\S+\s*:\s*/i, "").trim();
    const postcode = row.plz && row.plz !== "00000" ? String(row.plz).trim() : null;
    const city = row.city ? String(row.city).trim() : null;
    const street = row.street ? String(row.street).trim() : null;
    const appraisedValue = Number.isFinite(row.vwert) && row.vwert > 0 ? row.vwert : null;

    return {
      source: "zvg.com",
      state,
      zvgId: String(row.id),
      fileNo: String(row.az).trim(),
      court: deCourt(row.ag),
      kind: cleanTitle.split(/\s+in\s+/i)[0] || cleanTitle,
      title: cleanTitle || `${row.ag} · ${row.az}`,
      street,
      postcode,
      city,
      appraisedValue,
      hearingAt: iso,
      cancelled: Boolean(row.terminAufgehoben),
      limitsWaived: /Wertgrenzen\s+(?:entfallen|gelten\s+nicht)/i.test(cleanTitle),
      officialUrl: `https://www.zvg.com/objekt/${row.id}/show`,
      imageUrl: row.img ? `https://www.zvg.com${String(row.img).replace("/vn_", "/")}` : null,
      announcementPdf: abs(pdfInfo?.pdf) ?? abs(pdfInfo?.expose) ?? null,
      exposeUrl: abs(pdfInfo?.expose) ?? null,
      biddingNotesUrl: abs(pdfInfo?.hinweis) ?? null,
      courtUrl: row.gericht?.url || null,
    };
  });

  return enriched.filter(Boolean);
}

async function buildDeLive() {
  console.log("▸ Starte Live-Abruf Deutschland (zvg-portal.de alle 16 Länder + zvg.com) ...");
  const postcodes = readPoints("de");

  // Load previous dataset-de.json if present to preserve firstSeenAt and change history
  let prevByKey = new Map();
  let prevByIdentity = new Map();
  const oldDePath = join(process.cwd(), "data", "snapshots", "de.json");
  if (existsSync(oldDePath)) {
    try {
      const oldDe = JSON.parse(readFileSync(oldDePath, "utf8"));
      for (const l of oldDe.listings ?? []) {
        prevByKey.set(l.key, l);
        prevByIdentity.set(`${l.regionCode}|${l.authority}|${canonicalFileNo(l.fileNo)}`, l);
      }
    } catch {
      // Ignore
    }
  }

  const portalByState = await mapLimit(BUNDESLAENDER_DE, 4, async (state) => {
    try {
      const rows = await fetchZvgPortalState(state);
      console.log(`  zvg-portal.de · ${state.code.toUpperCase()}: ${rows.length} Termine`);
      return { state, rows, status: "complete" };
    } catch (err) {
      console.warn(`  ! zvg-portal.de · ${state.code.toUpperCase()} Fehler: ${err.message}`);
      return { state, rows: [], status: "error" };
    }
  });

  let zvgComRows = [];
  try {
    zvgComRows = await fetchZvgComAll();
    console.log(`  zvg.com · Bundesweit: ${zvgComRows.length} Termine geladen`);
  } catch (err) {
    console.warn(`  ! zvg.com Fehler: ${err.message}`);
  }

  const nowIso = new Date().toISOString();
  const byProceeding = new Map();
  const stateCounts = new Map(BUNDESLAENDER_DE.map((s) => [s.code, 0]));

  // 1. Insert zvg-portal.de rows first
  for (const { state, rows } of portalByState) {
    for (const r of rows) {
      const procId = `${state.code}|AG ${r.court}|${canonicalFileNo(r.fileNo)}`;
      if (byProceeding.has(procId)) continue;
      const key = r.zvgId ? `zvgportal-${r.zvgId}` : `zvgportal-${state.code}-${canonicalFileNo(r.fileNo).replace(/[^a-z0-9]/gi, "")}`;
      const prev = prevByKey.get(key) ?? prevByIdentity.get(procId);
      const geoportal = GEOPORTALS_DE[state.code];
      const fYear = fileNoYear(r.fileNo);
      const endIso = r.hearingAt ? new Date(Date.parse(r.hearingAt) + 30 * 60000).toISOString() : null;
      const fullTitle = [r.kind, r.address].filter(Boolean).join(": ") || `${r.court} · ${r.fileNo}`;

      byProceeding.set(procId, {
        key,
        market: "DE",
        title: fullTitle,
        segment: deSegment(r.kind, fullTitle),
        segmentLabel: r.kind || null,
        region: state.name,
        regionCode: state.code,
        place: r.city || null,
        postcode: r.postcode,
        street: r.street,
        authority: `AG ${r.court}`,
        fileNo: r.fileNo,
        fileYear: fYear,
        rounds: r.hearingAt ? [{ round: 1, start: r.hearingAt, end: endIso }] : [],
        hearingAt: r.hearingAt,
        cancelled: r.cancelled,
        limitsWaived: r.limitsWaived,
        appraisedValue: r.appraisedValue,
        transferTaxPct: state.transferTaxPct,
        officialUrl: r.officialUrl,
        mapUrl: r.address ? `https://www.openstreetmap.org/search?query=${encodeURIComponent(r.address)}` : null,
        documentUrl: r.announcementPdf,
        geo: geoPoint(postcodes[r.postcode], "postcode"),
        history: prev?.history ?? [],
        geoportalUrl: geoportal?.url ?? null,
        geoportalName: geoportal?.name ?? null,
        caveats: buildDeCaveats({ fileYear: fYear, appraisedValue: r.appraisedValue, limitsWaived: r.limitsWaived }),
        firstSeenAt: prev?.firstSeenAt ?? nowIso,
      });
    }
  }

  // 2. Merge or add zvg.com rows (adds HH, MV, SH, BW courts and enriches existing proceedings with PDFs)
  let addedFromZvgCom = 0;
  let enrichedFromZvgCom = 0;
  for (const r of zvgComRows) {
    const state = r.state;
    const procId = `${state.code}|AG ${r.court}|${canonicalFileNo(r.fileNo)}`;
    const existing = byProceeding.get(procId);
    if (existing) {
      if (!existing.documentUrl && r.announcementPdf) existing.documentUrl = r.announcementPdf;
      if (!existing.imageUrl && r.imageUrl) existing.imageUrl = r.imageUrl;
      if (!existing.zvgComId && r.zvgId) existing.zvgComId = r.zvgId;
      if (!existing.appraisedValue && r.appraisedValue) existing.appraisedValue = r.appraisedValue;
      if (!existing.postcode && r.postcode) {
        existing.postcode = r.postcode;
        existing.geo = geoPoint(postcodes[r.postcode], "postcode");
      }
      enrichedFromZvgCom++;
      continue;
    }

    const key = `zvgcom-${r.zvgId}`;
    const prev = prevByKey.get(key) ?? prevByIdentity.get(procId);
    const geoportal = GEOPORTALS_DE[state.code];
    const fYear = fileNoYear(r.fileNo);
    const endIso = r.hearingAt ? new Date(Date.parse(r.hearingAt) + 30 * 60000).toISOString() : null;
    const addr = [r.street, [r.postcode, r.city].filter(Boolean).join(" ")].filter(Boolean).join(", ");

    byProceeding.set(procId, {
      key,
      market: "DE",
      title: r.title,
      segment: deSegment(r.kind, r.title),
      segmentLabel: r.kind || null,
      region: state.name,
      regionCode: state.code,
      place: r.city || null,
      postcode: r.postcode,
      street: r.street,
      authority: `AG ${r.court}`,
      fileNo: r.fileNo,
      fileYear: fYear,
      rounds: r.hearingAt ? [{ round: 1, start: r.hearingAt, end: endIso }] : [],
      hearingAt: r.hearingAt,
      cancelled: r.cancelled,
      limitsWaived: r.limitsWaived,
      appraisedValue: r.appraisedValue,
      transferTaxPct: state.transferTaxPct,
      officialUrl: r.officialUrl,
      imageUrl: r.imageUrl ?? null,
      zvgComId: r.zvgId,
      mapUrl: addr ? `https://www.openstreetmap.org/search?query=${encodeURIComponent(addr)}` : null,
      documentUrl: r.announcementPdf,
      geo: geoPoint(postcodes[r.postcode], "postcode"),
      history: prev?.history ?? [],
      geoportalUrl: geoportal?.url ?? null,
      geoportalName: geoportal?.name ?? null,
      caveats: buildDeCaveats({ fileYear: fYear, appraisedValue: r.appraisedValue, limitsWaived: r.limitsWaived }),
      firstSeenAt: prev?.firstSeenAt ?? nowIso,
    });
    addedFromZvgCom++;
  }

  const listings = [...byProceeding.values()];
  for (const l of listings) {
    if (l.regionCode) stateCounts.set(l.regionCode, (stateCounts.get(l.regionCode) ?? 0) + 1);
  }

  console.log(`  → DE Gesamt: ${listings.length} Verfahren (${addedFromZvgCom} exklusiv über zvg.com, ${enrichedFromZvgCom} angereichert)`);

  return {
    meta: {
      market: "DE",
      generatedAt: nowIso,
      source: "zvg-portal.de · zvg.com",
      sourceUrl: "https://www.zvg-portal.de/",
      states: BUNDESLAENDER_DE.map((s) => ({
        code: s.code,
        name: s.name,
        status: "complete",
        included: stateCounts.get(s.code) ?? 0,
      })),
    },
    listings,
  };
}

// ---------------------------------------------------------------------------
// 2. Fetch Turkey Live (GİB, VakıfBank, ilan.gov.tr top cities + dataset.json)
// ---------------------------------------------------------------------------
function trTitle(value) {
  if (!value) return null;
  return String(value)
    .toLocaleLowerCase("tr")
    .split(/(\s+|\/|-)/)
    .map((word) => word.charAt(0).toLocaleUpperCase("tr") + word.slice(1))
    .join("");
}

function trTime(value) {
  if (!value) return null;
  const raw = String(value).trim();
  const dmy = /^(\d{2})[-.](\d{2})[-.](\d{4})(?:[T\s]+(\d{2}):(\d{2})(?::(\d{2}))?)?$/.exec(raw);
  if (dmy) {
    return `${dmy[3]}-${dmy[2]}-${dmy[1]}T${dmy[4] ?? "10"}:${dmy[5] ?? "00"}:${dmy[6] ?? "00"}${TR_OFFSET}`;
  }
  const s = raw.replace(" ", "T");
  if (/[zZ]|[+-]\d\d:\d\d$/.test(s)) return s;
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(s)) return `${s}${TR_OFFSET}`;
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s)) return `${s}:00${TR_OFFSET}`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return `${s}T10:00:00${TR_OFFSET}`;
  return null;
}

async function fetchVakifbankLive(centers) {
  const listings = [];
  try {
    const pages = [1, 2, 3];
    for (const page of pages) {
      const url = `https://gayrimenkul.intengo.com/vakifbank${page > 1 ? `?page=${page}` : ""}`;
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0.0.0 Safari/537.36" },
      });
      if (!res.ok) break;
      const html = await res.text();
      const blocks = html.split(/<div class="box1 imgWrap">/i).slice(1);
      for (const b of blocks) {
        const no = /class="reNo"[^>]*>[\s\S]*?<span>(\d+)<\/span>/i.exec(b)?.[1];
        const href = /href="(\/vakifbank\/ilan\/[^"]+)"/i.exec(b)?.[1];
        const title = clean(/class="headline"[\s\S]*?<h1><span>([\s\S]*?)<\/span><\/h1>/i.exec(b)?.[1]);
        const loc = clean(/class="location"[\s\S]*?<span>([\s\S]*?)<\/span>/i.exec(b)?.[1]);
        const typeStr = clean(/class="type"[\s\S]*?<span>([\s\S]*?)<\/span>/i.exec(b)?.[1]);
        const endStr = clean(/(?:İ|&#x130;|&#304;)hale Biti(?:ş|&#x15F;|&#351;) Tarihi<\/span>\s*<span>([\d-]+\s+[\d:]+)<\/span>/i.exec(b)?.[1]);
        const priceStr = /class="priceMask">([\d.]+)<\/span>/i.exec(b)?.[1];
        if (!no || !href || !endStr) continue;

        const locParts = loc.split("/").map((p) => clean(p)).filter(Boolean);
        const city = trTitle(locParts[0] ?? "İstanbul");
        const county = trTitle(locParts[1] ?? null);
        const mahalle = trTitle(locParts[3] ?? locParts[2] ?? null);
        const regionCode = slug(city ?? "");
        const price = priceStr ? Number.parseFloat(priceStr) : null;
        const endIso = trTime(endStr);
        if (!endIso) continue;
        const startIso = new Date(Date.now() - 86400000).toISOString();

        const isLand = /arsa|tarla|arazi/i.test(typeStr);
        const isComm = /iş\s*yeri|depo|dükkan|ofis|ticari/i.test(typeStr);
        const segment = isLand ? "land" : isComm ? "commercial" : "apartment";

        listings.push({
          key: `vakifbank-${no}`,
          market: "TR",
          title: title || `${city} ${county ?? ""} VakıfBank Gayrimenkul Satışı`.trim(),
          segment,
          segmentLabel: typeStr || "Banka Gayrimenkulü",
          region: city,
          regionCode: regionCode || null,
          place: county,
          postcode: null,
          street: mahalle,
          authority: "VakıfBank E-İhale",
          fileNo: `VB-${no}`,
          fileYear: new Date().getFullYear(),
          rounds: [{ round: 1, start: startIso, end: endIso }],
          hearingAt: endIso,
          cancelled: false,
          limitsWaived: false,
          appraisedValue: price,
          transferTaxPct: null,
          officialUrl: `https://gayrimenkul.intengo.com${href}`,
          mapUrl: null,
          documentUrl: null,
          geo: geoPoint(centers[regionCode], "province"),
          history: [],
          geoportalUrl: "https://parselsorgu.tkgm.gov.tr/",
          geoportalName: "TKGM Parsel Sorgu",
          caveats: [
            {
              points: 0,
              short: "Banka E-İhale (VakıfBank)",
              long: "Banka mülkiyetindeki taşınmazın doğrudan e-ihale satışı. Başlangıç bedeli banka tarafından belirlenen muhammen/başlangıç tutarıdır.",
            },
          ],
          firstSeenAt: new Date().toISOString(),
          tr: {
            adType: "BANKA",
            source: "gayrimenkul.intengo.com",
            mahalle,
            ada: null,
            parsel: null,
            isCondo: segment === "apartment",
            landAreaM2: null,
            buildingAreaM2: null,
            vatRate: null,
            startingBid: price,
            areaM2: null,
            areaKind: null,
            marketMedianPerM2: null,
            marketSampleSize: null,
            discountPct: null,
            confidence: null,
            hitCount: null,
          },
        });
      }
    }
    console.log(`  VakıfBank E-İhale: ${listings.length} aktive Bank-Auktionen geladen`);
  } catch (err) {
    console.warn(`  ! VakıfBank Fehler: ${err.message}`);
  }
  return listings;
}

async function fetchIlanGovFresh(centers) {
  const fresh = [];
  const topCities = ["İSTANBUL", "ANKARA", "İZMİR", "ANTALYA", "BURSA", "MUĞLA", "AYDIN", "BALIKESİR"];
  try {
    for (const city of topCities) {
      for (const ats of [2, 3]) {
        const res = await fetch("https://www.ilan.gov.tr/api/api/services/app/Ad/AdsByFilter", {
          method: "POST",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0.0.0 Safari/537.36",
            "Content-Type": "application/json-patch+json",
            Accept: "text/plain, application/json",
            "X-Requested-With": "XMLHttpRequest",
            "X-Request-Origin": "IGT-UI",
            Pragma: "no-cache",
            "Cache-Control": "no-cache",
            Origin: "https://www.ilan.gov.tr",
            Referer: "https://www.ilan.gov.tr/",
          },
          body: JSON.stringify({ keys: { txv: [1], ats: [ats], c: [city] }, skipCount: 0, maxResultCount: 20 }),
        });
        if (!res.ok) continue;
        const json = await res.json();
        const ads = json?.result?.ads ?? [];
        for (const ad of ads) {
          fresh.push({ ad, city, adType: ats === 2 ? "İCRA" : "İHALE" });
        }
        await sleep(80);
      }
    }
    console.log(`  ilan.gov.tr Live-Check (X-Request-Origin: IGT-UI): ${fresh.length} neueste Aushänge geprüft`);
  } catch (err) {
    console.warn(`  ! ilan.gov.tr Live-Check Fehler: ${err.message}`);
  }
  return { fresh, centers };
}

async function buildTrLive() {
  console.log("▸ Starte Live-Aufbau Türkei (ilan.gov.tr İCRA & İHALE + GİB + SGK + VakıfBank) ...");
  const centers = readPoints("tr");
  const listings = [];
  const seenKeys = new Set();

  // 1. Read comprehensive dataset.json from immo pipeline (including İHALE, GİB, SGK that were previously dropped!)
  const rawPath = join(IMMO_DATA_DIR, "dataset.json");
  if (existsSync(rawPath)) {
    const data = JSON.parse(readFileSync(rawPath, "utf8"));
    const cutoff = new Date("2026-08-15T00:00:00Z");

    for (const l of data.listings) {
      let rounds = (l.auction?.rounds ?? [])
        .map((r) => ({ round: r.round, start: trTime(r.start), end: trTime(r.end ?? r.start) }))
        .filter((r) => r.start && r.end);

      // Fix: İHALE, GİB, and SGK often provide tenderAt or firstAuctionDateShort when rounds is empty
      if (rounds.length === 0) {
        const singleIso = trTime(l.auction?.tenderAt ?? l.auction?.envelopeDeadline ?? null);
        if (singleIso) {
          rounds = [{ round: 1, start: singleIso, end: singleIso }];
        }
      }

      const lastEnd = rounds.reduce((max, r) => (r.end > max ? r.end : max), "");
      if (!lastEnd || new Date(lastEnd) < cutoff) continue;

      const parcel = l.parcel ?? {};
      const ev = l.evaluation ?? {};
      const regionName = trTitle(l.city ?? parcel.city ?? null);
      const regionCode = slug(l.city ?? parcel.city ?? "") || null;
      const appraised = num(ev.appraisedValue ?? parcel.appraisedValue);

      seenKeys.add(l.key);
      listings.push({
        key: l.key,
        market: "TR",
        title: l.title,
        segment: TR_CLASS_SEGMENT[l.marketClass] ?? TR_SEGMENT_FALLBACK[l.segment] ?? "other",
        segmentLabel: ev.marketClassLabel ?? l.segment ?? null,
        region: regionName,
        regionCode,
        place: l.county ?? parcel.county ?? null,
        postcode: null,
        street: parcel.address && !/dosya numarası/i.test(parcel.address) ? parcel.address : null,
        authority: trTitle(l.authority) ?? "",
        fileNo: l.fileNo ?? l.adNo ?? l.adId ?? "",
        fileYear: Number.parseInt(String(l.fileNo ?? "").slice(0, 4), 10) || 2026,
        rounds,
        hearingAt: rounds[0]?.start ?? null,
        cancelled: false,
        limitsWaived: false,
        appraisedValue: appraised,
        transferTaxPct: null,
        officialUrl: l.officialUrl,
        mapUrl: null,
        documentUrl: null,
        geo: geoPoint(centers[regionCode], "province"),
        history: (l.changes ?? []).map((c) => c.text).filter(Boolean),
        geoportalUrl: "https://parselsorgu.tkgm.gov.tr/",
        geoportalName: "TKGM Parsel Sorgu",
        caveats: (l.caveats ?? []).map((c) => ({ points: c.points ?? 0, short: c.short, long: c.long })),
        firstSeenAt: l.firstSeenAt ?? data.meta?.generatedAt ?? new Date().toISOString(),
        tr: {
          adType: l.adType ?? "İCRA",
          source: l.source ?? "ilan.gov.tr",
          mahalle: trTitle(parcel.mahalle ?? null),
          ada: parcel.ada ? String(parcel.ada) : null,
          parsel: parcel.parsel ? String(parcel.parsel) : null,
          isCondo: Boolean(parcel.isCondo),
          landAreaM2: round2(num(parcel.landAreaM2)),
          buildingAreaM2: round2(num(parcel.buildingAreaM2)),
          vatRate: num(parcel.vatRate),
          startingBid: num(ev.startingBid) ?? (appraised ? round2(appraised * 0.5) : null),
          areaM2: round2(num(ev.areaM2 ?? parcel.landAreaM2)),
          areaKind: ev.areaKind ?? null,
          marketMedianPerM2: round2(num(ev.marketMedianPerM2)),
          marketSampleSize: num(ev.marketSampleSize),
          discountPct: round2(num(ev.discountPct)),
          confidence: ev.confidence ?? null,
          hitCount: num(l.hitCount),
          nitelik: parcel.nitelik ?? null,
          zoning: parcel.zoning ?? null,
          ownershipShare: parcel.ownershipShare ?? null,
        },
      });
    }
  }

  // 2. Append live VakıfBank E-İhale auctions
  const vakifListings = await fetchVakifbankLive(centers);
  for (const vl of vakifListings) {
    if (!seenKeys.has(vl.key)) {
      seenKeys.add(vl.key);
      listings.push(vl);
    }
  }

  // 3. Verify live ilan.gov.tr connection with X-Request-Origin: IGT-UI and add any brand-new October 2026 notices
  const { fresh } = await fetchIlanGovFresh(centers);
  for (const { ad, city, adType } of fresh) {
    const key = `${ad.id}#1`;
    if (seenKeys.has(key)) continue;
    const filterVal = (k) => ad.adTypeFilters?.find((f) => f.key === k)?.value ?? null;
    const rawDate = filterVal("Birinci Satış Günü") ?? filterVal("İhale Tarihi ve Saati");
    let startIso = null;
    if (rawDate) {
      const m = /(\d{2})\.(\d{2})\.(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(rawDate);
      if (m) startIso = `${m[3]}-${m[2]}-${m[1]}T${m[4] ?? "10"}:${m[5] ?? "00"}:00${TR_OFFSET}`;
    }
    if (!startIso) continue;
    const endIso = new Date(Date.parse(startIso) + 7 * 86400000).toISOString();
    const rawBedel = filterVal("Muhammen Bedeli");
    const bedel = rawBedel ? parseGermanNumber(rawBedel) : null;
    const regionName = trTitle(ad.addressCityName ?? city);
    const regionCode = slug(regionName ?? "");
    const urlStr = ad.urlStr ?? "";
    const seg = urlStr.includes("arsa") ? "land" : urlStr.includes("tarla") || urlStr.includes("zeytin") ? "farmland" : urlStr.includes("isyeri") || urlStr.includes("ticari") ? "commercial" : "apartment";

    seenKeys.add(key);
    listings.push({
      key,
      market: "TR",
      title: ad.title ?? "",
      segment: seg,
      segmentLabel: adType === "İHALE" ? "Kamu İhalesi" : "İcra Satışı",
      region: regionName,
      regionCode: regionCode || null,
      place: ad.addressCountyName ?? null,
      postcode: null,
      street: null,
      authority: trTitle(ad.advertiserName ?? "İcra Dairesi") ?? "",
      fileNo: filterVal("Dosya No") ?? ad.adNo ?? String(ad.id),
      fileYear: 2026,
      rounds: [{ round: 1, start: startIso, end: endIso }],
      hearingAt: startIso,
      cancelled: false,
      limitsWaived: false,
      appraisedValue: bedel,
      transferTaxPct: null,
      officialUrl: `https://www.ilan.gov.tr${urlStr}`,
      mapUrl: null,
      documentUrl: null,
      geo: geoPoint(centers[regionCode], "province"),
      history: [],
      geoportalUrl: "https://parselsorgu.tkgm.gov.tr/",
      geoportalName: "TKGM Parsel Sorgu",
      caveats: [],
      firstSeenAt: new Date().toISOString(),
      tr: {
        adType,
        source: "ilan.gov.tr",
        mahalle: null,
        ada: null,
        parsel: null,
        isCondo: seg === "apartment",
        landAreaM2: null,
        buildingAreaM2: null,
        vatRate: null,
        startingBid: bedel ? round2(bedel * 0.5) : null,
        areaM2: null,
        areaKind: null,
        marketMedianPerM2: null,
        marketSampleSize: null,
        discountPct: null,
        confidence: null,
        hitCount: null,
      },
    });
  }

  const nowIso = new Date().toISOString();
  console.log(`  → TR Gesamt: ${listings.length} Verfahren (Quellen: ilan.gov.tr, ilan.gib.gov.tr, net.sgk.gov.tr, VakıfBank)`);

  return {
    meta: {
      market: "TR",
      generatedAt: nowIso,
      source: "ilan.gov.tr · GİB · SGK · VakıfBank",
      sourceUrl: "https://www.ilan.gov.tr/",
      states: [],
    },
    listings,
  };
}

// ---------------------------------------------------------------------------
// 3. Run & Write Snapshots + Update Landing Page Stats (src/lib/snapshot.ts)
// ---------------------------------------------------------------------------
async function run() {
  mkdirSync(OUT_DIR, { recursive: true });
  const trOnly = process.argv.includes("--tr-only");
  const deOnly = process.argv.includes("--de-only");

  if (!trOnly) {
    const de = await buildDeLive();
    writeFileSync(join(OUT_DIR, "de.json"), JSON.stringify(de));
    console.log(`✓ data/snapshots/de.json geschrieben (${de.listings.length} Objekte, Stand ${de.meta.generatedAt})`);
  }

  if (!deOnly) {
    const tr = await buildTrLive();
    writeFileSync(join(OUT_DIR, "tr.json"), JSON.stringify(tr));
    console.log(`✓ data/snapshots/tr.json geschrieben (${tr.listings.length} Objekte, Stand ${tr.meta.generatedAt})`);
  }
}

run().catch((err) => {
  console.error("Sync fehlgeschlagen:", err);
  process.exit(1);
});
