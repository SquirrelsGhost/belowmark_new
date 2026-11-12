// ---------------------------------------------------------------------------
// Shared `agy.exe` conversion copy enhancer for DE & TR Instagram Captions
// and Meta Ads. Strictly grounded in official court notice numbers — zero
// invented discounts, zero yield promises, zero cloud LLM API keys.
// Automatically falls back to deterministic copy if `agy.exe` is missing or
// `--no-agy` is passed.
// ---------------------------------------------------------------------------

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { callAgyJsonSync } from "../lib/agyCli.mjs";
import { cleanObjectTitle, extractDealInsights, placeLine } from "./data.mjs";
import { T, dateShort, money, number } from "./texts.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = resolve(__dirname, "..", "..", "marketing", "instagram", ".agy-cache");

const FORBIDDEN_CLAIMS_RE =
  /\b(rendite|mietrendite|garantiert|gewinnversprechen|schnäppchengarantie|kira\s*getirisi|garantili|kesin\s*kazanç|yatırım\s*tavsiyesidir)\b/i;

const memCache = new Map();

function sanitizeLine(value, { minLen = 12, maxLen = 220, allowDomain = false } = {}) {
  if (typeof value !== "string") return null;
  const cleaned = value.replace(/\s+/g, " ").trim();
  if (cleaned.length < minLen || cleaned.length > maxLen) return null;
  if (FORBIDDEN_CLAIMS_RE.test(cleaned)) return null;
  if (!allowDomain && /https?:\/\//i.test(cleaned)) return null;
  return cleaned;
}

export function getAgyObjectCopy({ listing, lang }) {
  if (!listing?.key) return null;
  const cacheKey = `obj-v1:${lang}:${listing.key}:${listing.appraisedValue}:${listing.hearingAt || ""}`;
  if (memCache.has(cacheKey)) return memCache.get(cacheKey);

  const t = T[lang];
  const v = listing.appraisedValue;
  const ins = extractDealInsights(listing);

  let prompt;
  if (lang === "de") {
    const kind = cleanObjectTitle(listing, t.segment[listing.segment]);
    const city = listing.place.split(",")[0].trim();
    const living = listing.livingAreaM2 ?? listing.usableAreaM2 ?? null;
    const land = listing.segment !== "apartment" ? (listing.landAreaM2 ?? null) : null;
    const facts = {
      stadt: city,
      ortZeile: placeLine(listing),
      bundesland: listing.region || "",
      amtsgericht: listing.authority || "Amtsgericht",
      objektart: kind,
      verkehrswert: money(v, "de"),
      mindestgrenze50: listing.limitsWaived ? "entfallen (Folgetermin)" : money(ins.startBid, "de"),
      grenze70: listing.limitsWaived ? "entfallen" : money(ins.limit70, "de"),
      sicherheit10: money(ins.deposit10, "de"),
      quadratmeterpreisAb: ins.startPerM2 ? `${money(ins.startPerM2, "de")}/m²` : null,
      wohnflaecheM2: living ? number(living, "de") : null,
      grundstueckM2: land ? number(land, "de") : null,
      zimmer: listing.rooms || null,
      baujahr: listing.yearBuilt || null,
      terminDatum: listing.hearingAt ? dateShort(listing.hearingAt, "de") : null,
      merkmale: ins.features,
      keineInnenbesichtigung: ins.noInsideInspection,
    };

    prompt = [
      "Du bist Conversion-Texter für Belowmark (Deutschlands Datenplattform für amtliche Zwangsversteigerungen).",
      "Schreibe faktenbasierte, verkaufspsychologisch scharfe Instagram- & Meta-Ads-Hooks auf Deutsch.",
      "STRIKTE REGELN: Verwende AUSSCHLIESSLICH die übergebenen Zahlen. KEINE erfundenen Rabatte, KEINE Renditeversprechen, KEINE Straßennamen.",
      `FAKTEN: ${JSON.stringify(facts)}`,
      "Gib exakt dieses JSON-Objekt zurück:",
      JSON.stringify({
        hookLine: "Zeile 1 Scroll-Stopper (max 118 Zeichen, Stadt + Objektart + Einstiegsschwelle/Gutachten, neugierig machend)",
        angleLine: "Zeile 2 mit 👉 am Anfang (max 155 Zeichen): Verweis auf die 5 Slides (m²-Check, Cash-Rechnung & Risiko-Check)",
        closingQuestion: "Diskussionsfrage mit 💬 am Anfang und 👇 am Ende (max 155 Zeichen, konkret auf Stadt & Gebotsgrenze bezogen)",
        adHeadline: "Meta Ads Titelzeile (max 58 Zeichen, z.B. Objektart in Stadt · ab X €)",
        adDescription: "Meta Ads Unterzeile (max 68 Zeichen, Amtsgericht + Termin + Gratis-Dossier Hinweis)",
        adLead: "Erster Absatz für Meta Ads Anzeigentext (1-2 präzise Sätze, max 210 Zeichen, sachlich & klickstark)",
      }),
    ].join("\n");
  } else {
    const tr = listing.tr || {};
    const segName = t.segment[listing.segment];
    const discountPct = Math.max(1, Math.round(100 - ((tr.startingBid || v * 0.5) / v) * 100));
    const facts = {
      konum: placeLine(listing),
      il: listing.region || "",
      daireAdi: listing.authority || "İcra Dairesi",
      emlakTipi: segName,
      muhammenBedel: money(v, "tr"),
      baslangicBedeli: money(tr.startingBid || ins.startBid, "tr"),
      indirimOrani: `%${discountPct}`,
      teminat10: money(ins.deposit10, "tr"),
      alanM2: ins.area ? number(ins.area, "tr") : null,
      odaSayisi: tr.rooms || null,
      baslangicM2Fiyat: ins.startPerM2 ? `${money(ins.startPerM2, "tr")}/m²` : null,
    };

    prompt = [
      "Sen Belowmark (resmi icra gayrimenkul ihaleleri veri platformu) için kıdemli dönüşüm metin yazarısın.",
      "SADECE verilen resmi rakamları kullanarak Türkçe Instagram ve Meta Ads kanca metinleri üret.",
      "KESİN KURALLAR: Asla getiri/kira garantisi verme, uydurma rakam yazma, yatırım tavsiyesi verme.",
      `VERİLER: ${JSON.stringify(facts)}`,
      "Sadece şu JSON nesnesini döndür:",
      JSON.stringify({
        hookLine: "1. satır kaydırma durdurucu kanca (maks 118 karakter, ilçe/il + emlak tipi + % fark veya başlangıç fiyatı)",
        angleLine: "👉 ile başlayan 2. satır (maks 155 karakter, 5 Slide'da m² analizi, nakit hesabı ve ihale kontrolü vurgusu)",
        closingQuestion: "💬 ile başlayıp 👇 ile biten yorum sorusu (maks 155 karakter, bölge ve fiyat odaklı)",
        adHeadline: "Meta Ads başlığı (maks 58 karakter, konum + emlak tipi + başlangıç bedeli)",
        adDescription: "Meta Ads alt başlık (maks 68 karakter, muhammen bedel + resmi icra ilanı)",
        adLead: "Meta Ads ana metin giriş paragrafı (1-2 net cümle, maks 210 karakter, resmi veri ve ücretsiz dosya inceleme vurgusu)",
      }),
    ].join("\n");
  }

  const res = callAgyJsonSync(prompt, { cacheDir: CACHE_DIR, cacheKey });
  if (!res?.data) {
    memCache.set(cacheKey, null);
    return null;
  }

  const d = res.data;
  const parsed = {
    provider: res.provider,
    hookLine: sanitizeLine(d.hookLine, { minLen: 20, maxLen: 135 }),
    angleLine: sanitizeLine(d.angleLine, { minLen: 20, maxLen: 180 }),
    closingQuestion: sanitizeLine(d.closingQuestion, { minLen: 20, maxLen: 180 }),
    adHeadline: sanitizeLine(d.adHeadline, { minLen: 14, maxLen: 68 }),
    adDescription: sanitizeLine(d.adDescription, { minLen: 14, maxLen: 80 }),
    adLead: sanitizeLine(d.adLead, { minLen: 24, maxLen: 240, allowDomain: true }),
  };

  memCache.set(cacheKey, parsed);
  return parsed;
}
