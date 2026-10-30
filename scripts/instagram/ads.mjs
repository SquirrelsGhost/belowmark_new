// ---------------------------------------------------------------------------
// Meta-Ads- & Instagram-Boost-Pakete für die täglichen Belowmark-Posts.
// Verwendet exakt dieselben belegten Zahlen aus dem amtlichen Aushang wie
// das Bild und die Bildunterschrift — keine erfundenen Rabatte, keine
// Renditeversprechen, inklusive Quellenangabe und Beratungshinweis.
// ---------------------------------------------------------------------------

import { T, money, number, dateLong, dateShort, time } from "./texts.mjs";
import { placeLine } from "./data.mjs";
import { buildHashtags, tag } from "./captions.mjs";

const BASE_URL = "https://belowmark.com";

export function buildAdUrl({ lang, theme, isoDay, placement = "feed" }) {
  const params = new URLSearchParams({
    utm_source: "meta",
    utm_medium: "cpc",
    utm_campaign: `belowmark_${lang}_${theme}_${isoDay}`,
    utm_content: placement,
  });
  return `${BASE_URL}/?${params.toString()}`;
}

export function objectAdSpec({ listing, lang, day, isoDay, snapshotDate }) {
  const t = T[lang];
  const v = listing.appraisedValue;

  if (lang === "de") {
    const kind =
      String(listing.segmentLabel ?? "")
        .replace(/^\s*(?:[A-ZÄÖÜ]{1,4}\s+)?\d+\s*K\s*[\d/-]+(?:\s*\(\d+\))?\s*:\s*/iu, "")
        .split(/[,(;:]/)[0]
        .trim() || t.segment[listing.segment];
    const city = listing.place.split(",")[0].trim();
    const minBid = money(v * 0.5, lang);
    const living = listing.livingAreaM2 ?? listing.usableAreaM2 ?? null;
    const land = listing.landAreaM2 ?? null;
    const areaBadge = living ? `${number(living, lang)} m² Wfl.` : land ? `${number(land, lang)} m² Grundst.` : null;

    const headline = listing.limitsWaived
      ? `${kind} in ${city}${areaBadge ? ` (${areaBadge})` : ""} · VW ${money(v, lang)}`
      : `${kind} in ${city}${areaBadge ? ` (${areaBadge})` : ""} · ab ${minBid}`;
    const description = `${listing.authority} · Termin ${dateShort(listing.hearingAt, lang)} · Amtlicher Aushang`;
    const primaryText = [
      `Amtlicher Versteigerungstermin in ${placeLine(listing)} (${listing.region}): ${kind}.`,
      "",
      ...(listing.limitsWaived
        ? [`Verkehrswert laut Amtsgericht: ${money(v, lang)} (${t.limitsWaived})`]
        : [
            `Zuschlag im ersten Termin möglich ab ${minBid} (5/10-Grenze nach § 85a ZVG).`,
            `Verkehrswert laut Amtsgericht: ${money(v, lang)} · 7/10-Grenze (§ 74a ZVG): ${money(v * 0.7, lang)}.`,
          ]),
      ...(living ? [`Wohn-/Nutzfläche: ca. ${number(living, lang)} m²${listing.yearBuilt ? ` (Baujahr ${listing.yearBuilt})` : ""}`] : []),
      ...(land ? [`Grundstücksfläche: ${number(land, lang)} m²`] : []),
      `Termin: ${dateLong(listing.hearingAt, lang)}, ${time(listing.hearingAt, lang)} (${listing.authority})`,
      `Sicherheitsleistung (§ 68 ZVG): ${money(v * 0.1, lang)}`,
      "",
      listing.limitsWaived ? t.minBidNote : `${t.limitsNote} ${t.minBidNote}`,
      "",
      "Alle amtlichen Aushänge, Rechenwege und Wertgrenzen prüfen auf belowmark.com.",
      "",
      t.source(snapshotDate),
      t.disclaimer,
    ].join("\n");

    const hashtags = buildHashtags(
      lang,
      [tag(listing.region, lang), tag(city, lang), tag(`immobilien${city}`, lang)],
      "object",
      listing.segment
    );

    return {
      lang,
      market: "DE",
      theme: "objekt",
      isoDay,
      headline,
      description,
      primaryText,
      ctaType: "LEARN_MORE",
      ctaLabel: t.ctaFeed,
      targetUrlFeed: buildAdUrl({ lang, theme: "objekt", isoDay, placement: "feed_4x5" }),
      targetUrlStory: buildAdUrl({ lang, theme: "objekt", isoDay, placement: "story_9x16" }),
      targeting: {
        countries: ["DE", "AT", "CH"],
        regionFocus: listing.region,
        cityFocus: city,
        ageMin: 25,
        ageMax: 65,
        interests: ["Immobilien", "Eigentumswohnung", "Einfamilienhaus", "Zwangsversteigerung", "Baufinanzierung"],
      },
      hashtags,
    };
  }

  const tr = listing.tr;
  const rounds = listing.rounds.filter((r) => Date.parse(r.end) >= day.getTime());
  const segName = t.segment[listing.segment];
  const discountPct = Math.round(100 - (tr.startingBid / v) * 100);
  const bldgArea = tr.buildingAreaM2 ?? tr.netAreaM2 ?? listing.livingAreaM2 ?? null;
  const landArea = tr.landAreaM2 ?? listing.landAreaM2 ?? null;
  const trAreaBadge = bldgArea ? `${number(bldgArea, lang)} m²` : landArea ? `${number(landArea, lang)} m² Arsa` : null;

  const headline = `${placeLine(listing)} · ${segName}${trAreaBadge ? ` (${trAreaBadge})` : ""} · Başlangıç ${money(tr.startingBid, lang)}`;
  const description = `Muhammen bedel ${money(v, lang)} (−%${discountPct}) · Resmi İcra İlanı`;
  const primaryText = [
    `Resmi icra satışı: ${placeLine(listing)} bölgesinde ${segName.toLocaleLowerCase("tr-TR")}.`,
    "",
    `Açık artırma başlangıç bedeli: ${money(tr.startingBid, lang)} (muhammen bedelin %${discountPct} altında).`,
    `Muhammen bedel: ${money(v, lang)} · Teminat (%10): ${money(v * 0.1, lang)}.`,
    ...(bldgArea ? [`Brüt / Net kullanım alanı: ${number(bldgArea, lang)} m²${tr.rooms ? ` (${tr.rooms})` : ""}`] : []),
    ...(landArea ? [`Arsa yüzölçümü: ${number(landArea, lang)} m²${tr.arsaPayi ? ` (Arsa payı: ${tr.arsaPayi})` : ""}`] : []),
    ...rounds.slice(0, 2).map((r) => `${t.round(r.round)}: ${dateShort(r.start, lang)} – ${dateShort(r.end, lang)}`),
    `Satışı yapan: ${listing.authority}`,
    "",
    t.limitsNote,
    "",
    "Tüm resmi icra ilanları, hesaplama ve belgeler: belowmark.com",
    "",
    t.source(snapshotDate),
    t.disclaimer,
  ].join("\n");

  const hashtags = buildHashtags(
    lang,
    [tag(listing.region, lang), tag(listing.place, lang), tag(`${listing.region}emlak`, lang)],
    "object",
    listing.segment
  );

  return {
    lang,
    market: "TR",
    theme: "objekt",
    isoDay,
    headline,
    description,
    primaryText,
    ctaType: "LEARN_MORE",
    ctaLabel: t.ctaFeed,
    targetUrlFeed: buildAdUrl({ lang, theme: "objekt", isoDay, placement: "feed_4x5" }),
    targetUrlStory: buildAdUrl({ lang, theme: "objekt", isoDay, placement: "story_9x16" }),
    targeting: {
      countries: ["TR", "DE"],
      regionFocus: listing.region,
      cityFocus: listing.place,
      ageMin: 25,
      ageMax: 65,
      interests: ["Gayrimenkul", "Emlak", "Konut", "İhale"],
    },
    hashtags,
  };
}

export function statAdSpec({ stat, lang, isoDay, snapshotDate }) {
  const t = T[lang];
  const headline =
    stat.variant === "median"
      ? `${t.statMedianTitle} · ${t.statMedian(stat.days)}`
      : `${number(stat.total, lang)} ${t.statWeek(stat.days)}`;
  const description = `${t.statPromise} · ${t.disclaimer}`;
  const bodyLines =
    stat.variant === "median"
      ? [
          `${t.statMedian(stat.days)}:`,
          "",
          ...stat.rows.map(
            (r) => `• ${t.segmentPlural[r.segment]}: ${money(r.value, lang)} (${t.statBasis(number(r.count, lang))})`
          ),
        ]
      : [
          `${number(stat.total, lang)} ${t.statWeek(stat.days)}.`,
          "",
          `${t.statRegions}:`,
          ...stat.regions.map((r) => `• ${r.name}: ${number(r.count, lang)}`),
        ];
  const primaryText = [
    ...bodyLines,
    "",
    t.statPromise,
    lang === "tr" ? "Tüm resmi ilanları inceleyin: belowmark.com" : "Alle amtlichen Aushänge prüfen auf belowmark.com.",
    "",
    t.source(snapshotDate),
    t.disclaimer,
  ].join("\n");

  const regionTags =
    stat.variant === "median" ? [] : (stat.regions || []).slice(0, 5).map((r) => tag(r.name, lang));

  return {
    lang,
    market: lang === "tr" ? "TR" : "DE",
    theme: "zahl",
    isoDay,
    headline,
    description,
    primaryText,
    ctaType: "LEARN_MORE",
    ctaLabel: t.ctaFeed,
    targetUrlFeed: buildAdUrl({ lang, theme: "zahl", isoDay, placement: "feed_4x5" }),
    targetUrlStory: buildAdUrl({ lang, theme: "zahl", isoDay, placement: "story_9x16" }),
    targeting: {
      countries: lang === "tr" ? ["TR", "DE"] : ["DE", "AT", "CH"],
      ageMin: 25,
      ageMax: 65,
      interests: lang === "tr" ? ["Gayrimenkul", "Emlak", "Konut"] : ["Immobilien", "Zwangsversteigerung", "Eigenheim"],
    },
    hashtags: buildHashtags(lang, regionTags, "stat"),
  };
}

export function tipAdSpec({ tip, lang, isoDay }) {
  const t = T[lang];
  const headline = `${tip.kicker} · ${tip.title}`;
  const description = `${t.tipPromise} · ${t.disclaimer}`;
  const sourceLine =
    lang === "de" ? "Gesetzestext: gesetze-im-internet.de" : "Mevzuat: mevzuat.gov.tr · UYAP e-Satış";
  const primaryText = [
    `${tip.title} (${tip.kicker})`,
    "",
    tip.body,
    "",
    tip.note,
    "",
    t.tipPromise,
    "",
    sourceLine,
    t.disclaimer,
  ].join("\n");

  return {
    lang,
    market: lang === "tr" ? "TR" : "DE",
    theme: "wissen",
    isoDay,
    headline,
    description,
    primaryText,
    ctaType: "LEARN_MORE",
    ctaLabel: t.ctaFeed,
    targetUrlFeed: buildAdUrl({ lang, theme: "wissen", isoDay, placement: "feed_4x5" }),
    targetUrlStory: buildAdUrl({ lang, theme: "wissen", isoDay, placement: "story_9x16" }),
    targeting: {
      countries: lang === "tr" ? ["TR", "DE"] : ["DE", "AT", "CH"],
      ageMin: 25,
      ageMax: 65,
      interests: lang === "tr" ? ["Gayrimenkul", "Emlak", "İhale"] : ["Immobilien", "Zwangsversteigerung", "Immobilienrecht"],
    },
    hashtags: buildHashtags(lang, [tag(tip.kicker, lang)], "tip"),
  };
}

export function formatAdSheet(ad, feedFile, storyFile) {
  return [
    `=== META ADS VORLAGE (${ad.market} · ${ad.theme.toUpperCase()} · ${ad.isoDay}) ===`,
    `Feed-Bild (4:5, 1080×1350):  ${feedFile}`,
    `Story-Bild (9:16, 1080×1920): ${storyFile}`,
    `CTA-Button:                  ${ad.ctaType} (${ad.ctaLabel})`,
    `Ziel-URL (Feed):             ${ad.targetUrlFeed}`,
    `Ziel-URL (Story):            ${ad.targetUrlStory}`,
    `Targeting:                   Länder=${ad.targeting.countries.join(", ")}, Alter=${ad.targeting.ageMin}-${ad.targeting.ageMax}${ad.targeting.regionFocus ? `, Fokus=${ad.targeting.regionFocus}` : ""}`,
    "",
    `--- HEADLINE (Titelzeile) ---`,
    ad.headline,
    "",
    `--- DESCRIPTION (Unterzeile) ---`,
    ad.description,
    "",
    `--- PRIMARY TEXT (Anzeigentext) ---`,
    ad.primaryText,
    "",
    `--- SEO & HASHTAGS ---`,
    ad.hashtags.join(" "),
    "",
  ].join("\n");
}
