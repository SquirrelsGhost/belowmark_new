// ---------------------------------------------------------------------------
// Bildunterschriften mit Instagram-SEO & High-Intent-Hashtags (DE & TR).
// Gleiche Fakten wie auf dem Bild, nichts dazu erfunden.
// Jede Zahl stammt aus dem amtlichen Aushang oder ist eine gesetzliche Quote
// davon (5/10, 7/10, 10 %).
// ---------------------------------------------------------------------------

import { T, money, number, dateLong, dateShort, time } from "./texts.mjs";
import { placeLine } from "./data.mjs";

/** Pflicht-Basis-Hashtags laut Schablone. */
const BASE_TAGS = {
  de: [
    "#zwangsversteigerung",
    "#versteigerung",
    "#immobilien",
    "#immobilienkauf",
    "#amtsgericht",
    "#belowmark",
  ],
  tr: [
    "#icra",
    "#icradansatılık",
    "#ihale",
    "#gayrimenkul",
    "#emlak",
    "#belowmark",
  ],
};

/** Objektart-spezifische SEO-Hashtags für hohe Kauf- & Suchintention. */
const SEGMENT_TAGS = {
  de: {
    house: ["#einfamilienhaus", "#hauskauf", "#hauskaufen", "#wohnhaus", "#eigenheim"],
    apartment: ["#eigentumswohnung", "#wohnungskauf", "#wohnungkaufen", "#etw", "#wohneigentum"],
    multiFamily: ["#mehrfamilienhaus", "#zinshaus", "#wohngebäude", "#anlageimmobilie", "#immobilieninvestment"],
  },
  tr: {
    house: ["#müstakilev", "#satılıkev", "#konut", "#evsatışı", "#müstakil"],
    apartment: ["#satılıkdaire", "#icradandaire", "#daire", "#konutihalesi", "#evilanları"],
    multiFamily: ["#satılıkbina", "#apartman", "#gayrimenkulsatışı", "#binaihaleleri", "#yatırımlıkgayrimenkul"],
  },
};

/** Themen-spezifische SEO-Hashtags (Objekt, Zahl, Wissen). */
const THEME_TAGS = {
  de: {
    object: [
      "#zvg",
      "#verkehrswert",
      "#zwangsversteigerungen",
      "#immobiliensuche",
      "#immobilienmarkt",
      "#immobilienwissen",
      "#immobiliendeutschland",
      "#versteigerungstermin",
    ],
    stat: [
      "#immobilienmarkt",
      "#marktdaten",
      "#verkehrswert",
      "#zwangsversteigerungen",
      "#zvg",
      "#immobilienstatistik",
      "#immobiliensuche",
      "#immobiliendeutschland",
      "#immobilienwissen",
    ],
    tip: [
      "#zvg",
      "#zwangsversteigerungsgesetz",
      "#immobilienwissen",
      "#immobilienrecht",
      "#verkehrswert",
      "#zwangsversteigerungen",
      "#bargebot",
      "#geringstesgebot",
      "#immobiliendeutschland",
    ],
  },
  tr: {
    object: [
      "#uyapesatış",
      "#esatış",
      "#icraihalesi",
      "#muhammenbedel",
      "#icramüdürlüğü",
      "#resmiilan",
      "#gayrimenkulihale",
      "#emlakpiyasası",
    ],
    stat: [
      "#emlakpiyasası",
      "#gayrimenkulverileri",
      "#muhammenbedel",
      "#icraihalesi",
      "#uyapesatış",
      "#resmiilan",
      "#konutpiyasası",
      "#türkiyeemlak",
    ],
    tip: [
      "#icraiflas",
      "#uyapesatış",
      "#ihaleşartları",
      "#gayrimenkulbilgi",
      "#muhammenbedel",
      "#teminat",
      "#icraihalesi",
      "#resmiilan",
      "#emlakbilgi",
    ],
  },
};

/** „Baden-Württemberg“ → „#badenwürttemberg“, „İzmir“ → „#izmir“ */
export function tag(text, lang) {
  if (!text) return "";
  const cleaned = String(text)
    .toLocaleLowerCase(lang === "tr" ? "tr-TR" : "de-DE")
    .replace(/[^\p{L}\p{N}]/gu, "");
  return cleaned ? `#${cleaned}` : "";
}

/** Baut das deduplizierte Hashtag-Set (Pflicht-Tags zuerst, danach Orts-, Segment- & Themen-Tags). */
export function buildHashtags(lang, extraTags = [], theme = "object", segment = null) {
  const segTags = segment && SEGMENT_TAGS[lang]?.[segment] ? SEGMENT_TAGS[lang][segment] : [];
  const thmTags = THEME_TAGS[lang]?.[theme] ?? [];
  const all = [...BASE_TAGS[lang], ...extraTags, ...segTags, ...thmTags]
    .map((t) => String(t || "").trim())
    .filter((t) => t.startsWith("#") && t.length > 2);
  return [...new Set(all)];
}

function footer(lang, snapshotDate, extraTags, { theme = "object", segment = null, seoLine = "" } = {}) {
  const t = T[lang];
  const tags = buildHashtags(lang, extraTags, theme, segment).join(" ");
  const cta =
    lang === "tr"
      ? "Tüm ilanlar, hesaplama ve belgeler: link biyografide."
      : "Alle Aushänge mit Rechenweg und Belegen: Link in der Bio.";
  const source = snapshotDate ? `${t.source(snapshotDate)}\n` : "";
  const seoBlock = seoLine ? `\n${seoLine}\n` : "";
  return `\n${cta}${seoBlock}\n${source}${t.disclaimer}\n\n${tags}\n`;
}

export function objectCaption({ listing, lang, day, snapshotDate }) {
  const t = T[lang];
  const v = listing.appraisedValue;
  if (lang === "de") {
    const kind =
      String(listing.segmentLabel ?? "")
        .replace(/^\s*(?:[A-ZÄÖÜ]{1,4}\s+)?\d+\s*K\s*[\d/-]+(?:\s*\(\d+\))?\s*:\s*/iu, "")
        .split(/[,(;:]/)[0]
        .trim() || t.segment[listing.segment];
    const city = listing.place.split(",")[0].trim();
    const living = listing.livingAreaM2 ?? listing.usableAreaM2 ?? null;
    const land = listing.landAreaM2 ?? null;
    const primaryArea = living ?? land ?? null;
    const perM2 = primaryArea && primaryArea > 0 ? Math.round(v / primaryArea) : null;

    const lines = [
      `Objekt des Tages: ${kind} in ${placeLine(listing)}${listing.place.startsWith(listing.region) ? "" : ` (${listing.region})`}.`,
      "",
      ...(listing.limitsWaived
        ? []
        : [`Zuschlag im ersten Termin möglich ab ${money(v * 0.5, lang)}, 50 % unter Verkehrswert.`, ""]),
      `Verkehrswert laut Amtsgericht: ${money(v, lang)}`,
      ...(living ? [`${listing.livingAreaM2 ? "Wohnfläche" : "Wohn-/Nutzfläche"}: ca. ${number(living, lang)} m²`] : []),
      ...(land ? [`Grundstücksfläche: ${number(land, lang)} m²`] : []),
      ...(perM2 ? [`Richtwert / m² (${living ? "Wohnfläche" : "Grundstück"}): ${money(perM2, lang)} / m²`] : []),
      ...(listing.rooms ? [`Zimmer: ${listing.rooms}`] : []),
      ...(listing.yearBuilt ? [`Baujahr: ${listing.yearBuilt}`] : []),
      `Termin: ${dateLong(listing.hearingAt, lang)}, ${time(listing.hearingAt, lang)}, ${listing.authority}`,
      ...(listing.limitsWaived
        ? [t.limitsWaived]
        : [
            `5/10-Grenze (§ 85a ZVG): ${money(v * 0.5, lang)}`,
            `7/10-Grenze (§ 74a ZVG): ${money(v * 0.7, lang)}`,
          ]),
      `Sicherheitsleistung (§ 68 ZVG): ${money(v * 0.1, lang)}`,
      ...(listing.transferTaxPct
        ? [`Grunderwerbsteuer (${String(listing.transferTaxPct).replace(".", ",")} %): ${money((v * listing.transferTaxPct) / 100, lang)}`]
        : []),
      "",
      listing.limitsWaived
        ? t.minBidNote
        : `Unter 5/10 wird der Zuschlag im ersten Termin versagt. Der echte Preis entsteht erst im Termin. ${t.minBidNote}`,
    ];
    const seoLine = `Suchbegriffe: Zwangsversteigerung ${kind} ${city} (${listing.region}), ${listing.authority}, Verkehrswert & Wertgrenzen nach ZVG.`;
    const locationTags = [
      tag(listing.region, lang),
      tag(city, lang),
      tag(`immobilien${city}`, lang),
      tag(`zwangsversteigerung${city}`, lang),
    ];
    return (
      lines.join("\n") +
      footer(lang, snapshotDate, locationTags, {
        theme: "object",
        segment: listing.segment,
        seoLine,
      })
    );
  }

  const tr = listing.tr;
  const rounds = listing.rounds.filter((r) => Date.parse(r.end) >= day.getTime());
  const segLower = t.segment[listing.segment].toLocaleLowerCase("tr-TR");
  const bldgArea = tr.buildingAreaM2 ?? listing.livingAreaM2 ?? null;
  const netArea = tr.netAreaM2 ?? null;
  const landArea = tr.landAreaM2 ?? listing.landAreaM2 ?? null;
  const primaryTrArea = bldgArea ?? netArea ?? tr.areaM2 ?? landArea ?? null;
  const trPerM2 = primaryTrArea && primaryTrArea > 0 ? Math.round(v / primaryTrArea) : null;

  const lines = [
    `Günün ilanı: ${placeLine(listing)} bölgesinde ${segLower}.`,
    "",
    `Başlangıç bedeli muhammen bedelin %${Math.round(100 - (tr.startingBid / v) * 100)} altında.`,
    "",
    `Muhammen bedel: ${money(v, lang)}`,
    `Başlangıç bedeli (ilana göre): ${money(tr.startingBid, lang)}`,
    bldgArea ? `Brüt / bina alanı (ilana göre): ${number(bldgArea, lang)} m²` : null,
    netArea && netArea !== bldgArea ? `Net kullanım alanı: ${number(netArea, lang)} m²` : null,
    landArea ? `Arsa yüzölçümü: ${number(landArea, lang)} m²${tr.arsaPayi ? ` (Arsa payı: ${tr.arsaPayi})` : ""}` : null,
    trPerM2 ? `m² birim değeri: ${money(trPerM2, lang)} / m²` : null,
    tr.rooms ? `Oda sayısı: ${tr.rooms}` : null,
    tr.floor ? `Bulunduğu kat: ${tr.floor}` : null,
    ...rounds.slice(0, 2).map((r) => `${t.round(r.round)}: ${dateShort(r.start, lang)} – ${dateShort(r.end, lang)}`),
    `Teminat (%10): ${money(v * 0.1, lang)}`,
    tr.vatRate !== null && tr.vatRate !== undefined ? `KDV (ilana göre): %${tr.vatRate}` : null,
    `Satışı yapan: ${listing.authority}`,
    "",
    t.limitsNote,
  ].filter((l) => l !== null);

  const seoLine = `Arama terimleri: ${listing.region} ${listing.place} icradan satılık ${segLower}, ${listing.authority}, muhammen bedel ve UYAP e-Satış ihale bilgileri.`;
  const locationTags = [
    tag(listing.region, lang),
    tag(listing.place, lang),
    tag(`${listing.region}emlak`, lang),
    tag(`${listing.region}icra`, lang),
  ];
  return (
    lines.join("\n") +
    footer(lang, snapshotDate, locationTags, {
      theme: "object",
      segment: listing.segment,
      seoLine,
    })
  );
}

export function statCaption({ stat, lang, snapshotDate }) {
  const t = T[lang];
  const lines =
    stat.variant === "median"
      ? [
          `${t.statMedian(stat.days)}:`,
          "",
          ...stat.rows.map(
            (r) => `${t.segmentPlural[r.segment]}: ${money(r.value, lang)} (${t.statBasis(number(r.count, lang))})`
          ),
        ]
      : [
          `${number(stat.total, lang)} ${t.statWeek(stat.days)}.`,
          "",
          `${t.statRegions}:`,
          ...stat.regions.map((r) => `${r.name}: ${number(r.count, lang)}`),
        ];
  const regionTags =
    stat.variant === "median"
      ? []
      : (stat.regions || []).slice(0, 5).map((r) => tag(r.name, lang));
  const seoLine =
    lang === "tr"
      ? "Arama terimleri: Türkiye icra ihaleleri istatistikleri, il bazında gayrimenkul satışları ve medyan muhammen bedel verileri."
      : "Suchbegriffe: Zwangsversteigerung Statistik Deutschland, Versteigerungstermine nach Bundesland und Median-Verkehrswert laut Amtsgericht.";
  return (
    [...lines, "", t.statPromise].join("\n") +
    footer(lang, snapshotDate, regionTags, { theme: "stat", seoLine })
  );
}

export function tipCaption({ tip, lang }) {
  const normTag = tag(tip.kicker, lang);
  const seoLine =
    lang === "tr"
      ? `Arama terimleri: ${tip.title} (${tip.kicker}), icra ihalesi kuralları, teminat ve UYAP e-Satış rehberi.`
      : `Suchbegriffe: ${tip.title} (${tip.kicker}), Zwangsversteigerung Ablauf, Bietregeln und Wertgrenzen beim Amtsgericht.`;
  return (
    [`${tip.title} (${tip.kicker})`, "", tip.body, "", tip.note].join("\n") +
    footer(lang, null, [normTag], { theme: "tip", seoLine })
  );
}
