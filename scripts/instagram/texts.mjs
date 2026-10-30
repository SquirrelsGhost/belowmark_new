// Texte und Formate für die Instagram-Bilder, Deutsch (Markt DE) und Türkisch (Markt TR).

const TZ = { de: "Europe/Berlin", tr: "Europe/Istanbul" };

export function money(value, lang) {
  if (value === null || value === undefined) return "—";
  const n = new Intl.NumberFormat(lang === "tr" ? "tr-TR" : "de-DE", { maximumFractionDigits: 0 }).format(value);
  return lang === "tr" ? `${n} TL` : `${n} €`;
}

export function number(value, lang) {
  return new Intl.NumberFormat(lang === "tr" ? "tr-TR" : "de-DE", { maximumFractionDigits: 0 }).format(value);
}

export function dateLong(iso, lang) {
  return new Intl.DateTimeFormat(lang === "tr" ? "tr-TR" : "de-DE", {
    timeZone: TZ[lang], weekday: "short", day: "2-digit", month: "2-digit", year: "numeric",
  }).format(new Date(iso));
}

export function time(iso, lang) {
  const t = new Intl.DateTimeFormat("de-DE", { timeZone: TZ[lang], hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
  return lang === "tr" ? t : `${t} Uhr`;
}

export function dateShort(iso, lang) {
  return new Intl.DateTimeFormat(lang === "tr" ? "tr-TR" : "de-DE", { timeZone: TZ[lang], day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(iso));
}

export const T = {
  de: {
    rubric: { object: "Objekt des Tages", stat: "Zahl des Tages", tip: "Wissen" },
    segment: { house: "Haus", apartment: "Wohnung", multiFamily: "Mehrfamilienhaus" },
    segmentPlural: { house: "Häuser", apartment: "Wohnungen", multiFamily: "Mehrfamilienhäuser" },
    kicker: (authority) => `Zwangsversteigerung · ${authority}`,
    valueLabel: "Verkehrswert laut Amtsgericht",
    hearing: "Termin",
    priceLabel: "Zuschlag im ersten Termin möglich ab",
    priceSub: (v) => `Verkehrswert ${v} · 5/10-Grenze, § 85a ZVG`,
    valueShort: "Verkehrswert",
    livingArea: "Wohn-/Nutzfläche",
    landArea: "Grundstücksfläche",
    valuePerM2: "Richtwert / m²",
    limit5: "5/10-Grenze · § 85a ZVG",
    limit7: "7/10-Grenze · § 74a ZVG",
    security: "Sicherheitsleistung · § 68 ZVG",
    transferTax: (pct) => `Grunderwerbsteuer · ${String(pct).replace(".", ",")} %`,
    panel: "Eckdaten",
    limitsNote: "Unter 5/10 kein Zuschlag im ersten Termin. Der echte Preis entsteht erst im Termin.",
    minBidNote: "Das geringste Gebot wird erst im Termin festgestellt.",
    limitsWaived: "5/10- und 7/10-Grenze sind in diesem Verfahren entfallen (Folgetermin).",
    marketLine: "Verkehrswert",
    source: (date) => `Quelle: amtlicher Aushang (zvg-portal.de), Stand ${date}`,
    disclaimer: "Keine Rechts- oder Anlageberatung. Termine können aufgehoben werden.",
    ctaFeed: "Alle Aushänge prüfen",
    ctaStory: "Link in der Bio",
    statWeek: (n) => `Versteigerungstermine in den nächsten ${n} Tagen`,
    statMedian: (n) => `Median-Verkehrswert der Termine in den nächsten ${n} Tagen`,
    statMedianTitle: "Was kommt unter den Hammer?",
    statRegions: "Die meisten Termine",
    statCount: (n) => `${n} Termine`,
    statBasis: (n) => `Grundlage: ${n} Aushänge`,
    statPromise: "Jeden Tag neu aus den amtlichen Justizportalen.",
    tipOf: (i, n) => `Folge ${i} von ${n}`,
    tipPromise: "Mehr Wissen und alle Aushänge: belowmark.com",
  },
  tr: {
    rubric: { object: "Günün ilanı", stat: "Günün rakamı", tip: "Bilgi" },
    segment: { house: "Müstakil ev", apartment: "Daire", multiFamily: "Bina" },
    segmentPlural: { house: "Müstakil evler", apartment: "Daireler", multiFamily: "Binalar" },
    kicker: (authority) => `İcra satışı · ${authority}`,
    valueLabel: "Muhammen bedel",
    round: (n) => `${n}. artırma`,
    startingBid: "Başlangıç bedeli (ilana göre)",
    priceLabel: "Açık artırma başlangıç bedeli",
    priceSub: (v) => `Muhammen bedel ${v} · ilana göre`,
    security: "Teminat · %10",
    vat: "KDV (ilana göre)",
    area: "Brüt / Net alan",
    landArea: "Arsa yüzölçümü",
    valuePerM2: "m² birim değeri",
    panel: "Özet",
    limitsNote: "Başlangıç bedeli ilandan alınmıştır. Masraflar ve şartlar için ilanın tamamını okuyun.",
    marketLine: "Muhammen bedel",
    source: (date) => `Kaynak: resmi ilan (ilan.gov.tr), ${date}`,
    disclaimer: "Hukuki veya yatırım danışmanlığı değildir. İhaleler iptal edilebilir.",
    ctaFeed: "Tüm ilanları incele",
    ctaStory: "Link biyografide",
    statWeek: (n) => `Önümüzdeki ${n} günde başlayan icra artırması`,
    statMedian: (n) => `Önümüzdeki ${n} günün ihalelerinde medyan muhammen bedel`,
    statMedianTitle: "Hangi değerde satılıyor?",
    statRegions: "En çok ihale olan iller",
    statCount: (n) => `${n} ihale`,
    statBasis: (n) => `${n} ilana göre`,
    statPromise: "Her gün resmi ilanlardan güncellenir.",
    tipOf: (i, n) => `${i} / ${n}`,
    tipPromise: "Tüm ilanlar ve daha fazlası: belowmark.com",
  },
};
