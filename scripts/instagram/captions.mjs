// ---------------------------------------------------------------------------
// Psychologisch geschärfte Instagram-Captions (Scroll-Stopper in Zeile 1,
// echte Deal-Kalkulation, ehrlicher Risiko-Check & Diskussionsfrage am Ende
// für Kommentare & Saves + fokussiertes 10er High-Intent-Hashtag-Set).
// ---------------------------------------------------------------------------

import { T, money, number, dateLong, dateShort, time } from "./texts.mjs";
import { placeLine, cleanObjectTitle, extractDealInsights } from "./data.mjs";
import { getAgyObjectCopy } from "./agyCopy.mjs";

const BASE_TAGS = {
  de: [
    "#zwangsversteigerung",
    "#immobilieninvestment",
    "#kapitalanlageimmobilien",
    "#immobilienkauf",
    "#belowmark",
  ],
  tr: [
    "#icradansatılık",
    "#gayrimenkulyatırımı",
    "#icraihalesi",
    "#uyapesatış",
    "#belowmark",
  ],
};

const SEGMENT_TAGS = {
  de: {
    house: ["#einfamilienhaus", "#hauskaufen"],
    apartment: ["#eigentumswohnung", "#wohnungkaufen"],
    multiFamily: ["#mehrfamilienhaus", "#zinshaus"],
  },
  tr: {
    house: ["#müstakilev", "#satılıkev"],
    apartment: ["#satılıkdaire", "#konutihalesi"],
    multiFamily: ["#satılıkbina", "#yatırımlık"],
  },
};

const THEME_TAGS = {
  de: {
    object: ["#amtsgericht", "#verkehrswert"],
    stat: ["#immobilienmarkt", "#marktdaten", "#verkehrswert"],
    tip: ["#immobilienwissen", "#zwangsversteigerungsgesetz", "#verkehrswert"],
  },
  tr: {
    object: ["#muhammenbedel", "#emlakpiyasası"],
    stat: ["#emlakpiyasası", "#konutpiyasası"],
    tip: ["#gayrimenkulbilgi", "#ihaleşartları"],
  },
};

export function tag(text, lang) {
  if (!text) return "";
  const cleaned = String(text)
    .toLocaleLowerCase(lang === "tr" ? "tr-TR" : "de-DE")
    .replace(/[^\p{L}\p{N}]/gu, "");
  return cleaned ? `#${cleaned}` : "";
}

/** Fokussierte 8–11 relevante Hashtags (Instagram 2026 Best Practice statt 25er Spam-Block). */
export function buildHashtags(lang, extraTags = [], theme = "object", segment = null) {
  const segTags = segment && SEGMENT_TAGS[lang]?.[segment] ? SEGMENT_TAGS[lang][segment] : [];
  const thmTags = THEME_TAGS[lang]?.[theme] ?? [];
  const all = [...BASE_TAGS[lang], ...extraTags, ...segTags, ...thmTags]
    .map((t) => String(t || "").trim())
    .filter((t) => t.startsWith("#") && t.length > 2);
  return [...new Set(all)].slice(0, 11);
}

function footer(lang, snapshotDate, extraTags, { theme = "object", segment = null } = {}) {
  const t = T[lang];
  const tags = buildHashtags(lang, extraTags, theme, segment).join(" ");
  const cta =
    lang === "tr"
      ? "🔎 81 ildeki tüm resmi icra ihaleleri, teminat hesaplayıcı ve şartnameler: Biyografideki linkte (belowmark.com)."
      : "🔎 Alle 3.400+ aktuellen Zwangsversteigerungen in deiner PLZ, PDF-Gutachten & Gebotsrechner: Link in der Bio (belowmark.com).";
  const source = snapshotDate ? `${t.source(snapshotDate)}\n` : "";
  return `\n${cta}\n\n${source}${t.disclaimer}\n\n${tags}\n`;
}

export function objectCaption({ listing, lang, day, snapshotDate }) {
  const t = T[lang];
  const v = listing.appraisedValue;
  const ins = extractDealInsights(listing);
  const agy = getAgyObjectCopy({ listing, lang });

  if (lang === "de") {
    const kind = cleanObjectTitle(listing, t.segment[listing.segment]);
    const city = listing.place.split(",")[0].trim();
    const isCondo = listing.segment === "apartment";
    const living = listing.livingAreaM2 ?? listing.usableAreaM2 ?? null;
    const land = !isCondo ? (listing.landAreaM2 ?? null) : null;
    const roomPart = listing.rooms && !/zimmer/i.test(kind) ? ` · ${listing.rooms}` : "";
    const areaSnippet = living
      ? `${number(living, lang)} m²${roomPart}`
      : land
        ? `${number(land, lang)} m² Grund`
        : "";

    // Zeile 1 = Scroll-Stopper vor „… mehr“ (via lokaler agy.exe CLI mit deterministischem Fallback)
    const fallbackHook = listing.limitsWaived
      ? `${city}: ${kind}${areaSnippet ? ` (${areaSnippet})` : ""} OHNE 5/10-Wertgrenze vorm ${listing.authority}! (Gutachten: ${money(v, lang)})`
      : `${city}: ${kind}${areaSnippet ? ` (${areaSnippet})` : ""} ab ${money(ins.startBid, lang)} vorm Amtsgericht? (Gutachten: ${money(v, lang)})`;
    const hookLine = agy?.hookLine || fallbackHook;
    const angleLine =
      agy?.angleLine ||
      "👉 Swipe durch die 5 Slides für den €/m²-Check, die komplette Cash-Rechnung & die Haken im Verfahren.";
    const closingQuestion =
      agy?.closingQuestion ||
      `💬 Dein Urteil: Top-Chance in ${city} ab ${money(ins.startBid, lang)} oder zu heiß? Bis wohin würdest du maximal mitbieten? Schreib’s in die Kommentare 👇`;

    const lines = [
      hookLine,
      angleLine,
      "",
      `📊 Die amtlichen Zahlen (${placeLine(listing)}):`,
      `• Verkehrswert (Gutachten): ${money(v, lang)}${ins.fullPerM2 ? ` (${money(ins.fullPerM2, lang)}/m²)` : ""}`,
      ...(listing.limitsWaived
        ? [`• Status: ${t.limitsWaived}`]
        : [
            `• 5/10-Mindestgrenze (§ 85a ZVG): ${money(ins.startBid, lang)}${ins.startPerM2 ? ` (${money(ins.startPerM2, lang)}/m²)` : ""}`,
            `• 7/10-Grenze (§ 74a ZVG): ${money(ins.limit70, lang)}`,
          ]),
      `• Pflicht-Sicherheit im Termin (10 %): ${money(ins.deposit10, lang)} (Bankscheck/Überweisung, kein Bargeld)`,
      ...(living ? [`• Fläche: ca. ${number(living, lang)} m²${land && land !== living ? ` · Grundstück ${number(land, lang)} m²` : ""}`] : []),
      ...(listing.yearBuilt ? [`• Baujahr: ${listing.yearBuilt}${ins.features.length ? ` · ${ins.features.join(", ")}` : ""}`] : []),
      `• Gerichtstermin: ${dateLong(listing.hearingAt, lang)}, ${time(listing.hearingAt, lang)} (${listing.authority})`,
      ...(ins.noInsideInspection ? ["• ⚠️ Hinweis: Laut Bekanntmachung fand keine Innenbesichtigung statt — Sanierungspuffer einplanen!"] : []),
      "",
      closingQuestion,
      "📌 Speicher dir den Beitrag ab, wenn du den Termin verfolgen willst.",
    ];

    const locationTags = [
      tag(city, lang),
      tag(`immobilien${city}`, lang),
      tag(`zwangsversteigerung${city}`, lang),
    ];
    return lines.join("\n") + footer(lang, snapshotDate, locationTags, { theme: "object", segment: listing.segment });
  }

  const tr = listing.tr;
  const rounds = listing.rounds.filter((r) => Date.parse(r.end) >= day.getTime());
  const segLower = t.segment[listing.segment].toLocaleLowerCase("tr-TR");
  const discountPct = Math.max(1, Math.round(100 - (tr.startingBid / v) * 100));
  const areaSnippet = ins.area ? `${number(ins.area, lang)} m²${tr.rooms ? ` · ${tr.rooms}` : ""}` : "";

  const fallbackTrHook = `${placeLine(listing)}: Muhammen bedelin %${discountPct} altında ${segLower}${areaSnippet ? ` (${areaSnippet})` : ""}! Başlangıç: ${money(tr.startingBid, lang)}`;
  const trHookLine = agy?.hookLine || fallbackTrHook;
  const trAngleLine =
    agy?.angleLine ||
    "👉 Fiyat analizi, gerekli nakit hesabı ve ihale öncesi 3 kritik kontrol için yana kaydırın (5 Slide).";
  const trClosingQuestion =
    agy?.closingQuestion ||
    `💬 Sizce fırsat mı, risk mi? ${listing.place} bölgesinde bu ihaleye girer miydiniz? Yorumlara yazın 👇`;

  const lines = [
    trHookLine,
    trAngleLine,
    "",
    `📊 Resmi İlan Özeti (${listing.authority}):`,
    `• Muhammen bedel: ${money(v, lang)}${ins.fullPerM2 ? ` (${money(ins.fullPerM2, lang)}/m²)` : ""}`,
    `• Açık artırma başlangıç: ${money(tr.startingBid, lang)}${ins.startPerM2 ? ` (${money(ins.startPerM2, lang)}/m²)` : ""}`,
    `• Teminat (%10): ${money(ins.deposit10, lang)}${tr.vatRate !== null && tr.vatRate !== undefined ? ` · KDV %${tr.vatRate}` : ""}`,
    ...rounds.slice(0, 2).map((r) => `• ${t.round(r.round)}: ${dateShort(r.start, lang)} – ${dateShort(r.end, lang)}`),
    "",
    trClosingQuestion,
  ];

  const locationTags = [tag(listing.region, lang), tag(listing.place, lang), tag(`${listing.region}emlak`, lang)];
  return lines.join("\n") + footer(lang, snapshotDate, locationTags, { theme: "object", segment: listing.segment });
}

export function statCaption({ stat, lang, snapshotDate }) {
  const t = T[lang];
  const lines =
    stat.variant === "median"
      ? [
          `📊 ${t.statMedianTitle} (${t.statMedian(stat.days)})`,
          "",
          ...stat.rows.map((r) => `• ${t.segmentPlural[r.segment]}: ${money(r.value, lang)} (${t.statBasis(number(r.count, lang))})`),
          "",
          "💬 In welchem Bundesland suchst du aktuell nach Immobilien unter Marktwert? Schreib’s in die Kommentare 👇",
        ]
      : [
          `📊 ${number(stat.total, lang)} ${t.statWeek(stat.days)}!`,
          "",
          `${t.statRegions}:`,
          ...stat.regions.map((r) => `• ${r.name}: ${number(r.count, lang)} Termine`),
          "",
          "💬 Welche Stadt sollen wir morgen als Deal-Check durchrechnen? Schreib sie unten rein 👇",
        ];
  const regionTags = stat.variant === "median" ? [] : (stat.regions || []).slice(0, 3).map((r) => tag(r.name, lang));
  return lines.join("\n") + footer(lang, snapshotDate, regionTags, { theme: "stat" });
}

export function tipCaption({ tip, lang }) {
  const normTag = tag(tip.kicker, lang);
  const question =
    lang === "tr"
      ? "💬 İcra ihalelerinde en çok merak ettiğiniz kural hangisi? Yorumlarda sorun 👇"
      : "💬 Warst du schon mal live bei einem Versteigerungstermin im Amtsgericht dabei? Schreib deine Erfahrung unten rein 👇";
  return [`⚖️ ${tip.title} (${tip.kicker}) — kurz erklärt:`, "", tip.body, "", `💡 Wichtig: ${tip.note}`, "", question].join("\n") + footer(lang, null, [normTag], { theme: "tip" });
}
