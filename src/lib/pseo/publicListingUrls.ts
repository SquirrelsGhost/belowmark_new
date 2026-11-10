import { PricingCountryCode } from "@/lib/constants";
import { PseoLocale, PseoPreviewListing } from "@/types/pseo.types";

/**
 * Lossless URL-safe key encoding across all 19,785+ snapshot listings.
 * Only `[A-Za-z0-9_-]` and `#` occur in keys, and `--` never occurs in keys.
 */
export function encodePublicListingKey(key: string): string {
  return key.replace(/_/g, "__").replace(/#/g, "_h_");
}

export function decodePublicListingKey(encoded: string): string {
  return encoded.replace(/_h_/g, "#").replace(/__/g, "_");
}

export function slugifyPublicSegment(input: string, country?: PricingCountryCode): string {
  const isTr = country === "TR";
  let s = input
    .replace(/İ/g, "i")
    .replace(/I/g, "i")
    .replace(/ı/g, "i")
    .toLowerCase();
  if (!isTr) {
    s = s.replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue");
  } else {
    s = s.replace(/ö/g, "o").replace(/ü/g, "u");
  }
  return s
    .replace(/ß/g, "ss")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ş/g, "s")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toCleanTitleCase(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/(^|[\s/-])(\p{L})/gu, (_m, sep: string, ch: string) => `${sep}${ch.toUpperCase()}`);
}

export function localizePublicSegmentLabel(
  segment: string | null | undefined,
  rawSegmentLabel: string | null | undefined,
  country: PricingCountryCode,
): string {
  const raw = (rawSegmentLabel ?? "").trim();
  if (country === "TR") {
    if (/olivenhain|zeytin/i.test(raw)) return "Zeytinlik";
    switch (segment) {
      case "apartment":
        return "Daire / Konut";
      case "house":
        return "Müstakil Ev / Villa";
      case "multiFamily":
        return "Bina / Apartman";
      case "land":
        return "İmarlı Arsa";
      case "farmland":
        return "Tarla / Arazi";
      case "commercial":
        return "Dükkan / İşyeri";
      default:
        return raw && !/ackerland|bauland|wohnung|haus|gewerbe/i.test(raw) ? raw : "Gayrimenkul";
    }
  }
  if (country === "IT") {
    if (/stalle|autorimesse|box|posto auto/i.test(raw)) return "Autorimessa / Posto Auto";
    if (raw && raw === raw.toUpperCase() && raw.length >= 3) {
      return toCleanTitleCase(raw.split(",")[0].trim());
    }
    switch (segment) {
      case "apartment":
        return raw || "Appartamento";
      case "house":
        return raw || "Villa / Abitazione";
      case "commercial":
        return raw || "Immobile Commerciale";
      case "land":
      case "farmland":
        return raw || "Terreno";
      default:
        return raw || "Immobile all'Asta";
    }
  }
  if (country === "ES") {
    if (raw && !/^bien inmueble/i.test(raw)) return raw;
    switch (segment) {
      case "apartment":
        return "Vivienda / Piso";
      case "house":
        return "Chalet / Vivienda Unifamiliar";
      case "multiFamily":
        return "Edificio Residencial";
      case "commercial":
        return "Local Comercial / Nave";
      case "land":
        return "Solar / Parcela Urbana";
      case "farmland":
        return "Finca Rústica";
      default:
        return "Inmueble en Subasta BOE";
    }
  }
  if (country === "FR") {
    const cleanedFr = raw.replace(/^(?:un|une|des)\s+/i, "").trim();
    if (cleanedFr.length >= 3) {
      return `${cleanedFr.charAt(0).toUpperCase()}${cleanedFr.slice(1)}`;
    }
    switch (segment) {
      case "apartment":
        return "Appartement";
      case "house":
        return "Maison Individuelle";
      case "commercial":
        return "Local Commercial";
      case "land":
      case "farmland":
        return "Terrain";
      default:
        return "Bien Immobilier";
    }
  }
  if (country === "GB") {
    if (raw) return raw;
    switch (segment) {
      case "apartment":
        return "Flat / Apartment";
      case "house":
        return "House";
      case "commercial":
        return "Commercial Property";
      case "land":
      case "farmland":
        return "Land / Plot";
      default:
        return "Auction Property";
    }
  }
  if (country === "CH") {
    switch (segment) {
      case "apartment":
        return "Stockwerkeigentum / Wohnung";
      case "house":
        return "Einfamilienhaus";
      case "multiFamily":
        return "Mehrfamilienhaus";
      case "commercial":
        return "Gewerbeliegenschaft";
      case "land":
      case "farmland":
        return "Grundstück / Parzelle";
      default:
        return raw || "Grundstücksteigerung";
    }
  }
  return raw || "Immobilie";
}

export function inferPreviewListingCountry(item: Pick<PseoPreviewListing, "key" | "currency">, fallbackLocale?: PseoLocale): PricingCountryCode {
  if (item.key.startsWith("edikte-")) return "AT";
  if (item.key.startsWith("shab-") || item.currency === "CHF") return "CH";
  if (item.key.startsWith("it-aste-")) return "IT";
  if (item.key.startsWith("es-boe-")) return "ES";
  if (item.key.startsWith("fr-")) return "FR";
  if (item.key.startsWith("gb-") || item.currency === "GBP") return "GB";
  if (fallbackLocale === "tr" || item.currency === "TRY" || /^\d+#\d+$/.test(item.key)) return "TR";
  return "DE";
}

export function countryToPseoLocale(country: PricingCountryCode): PseoLocale {
  switch (country) {
    case "TR":
      return "tr";
    case "IT":
      return "it";
    case "ES":
      return "es";
    case "FR":
      return "fr";
    case "GB":
      return "en";
    default:
      return "de";
  }
}

export function publicListingRoutePrefix(country: PricingCountryCode): "/objekt" | "/tr/ilan" | "/lot" {
  if (country === "TR") return "/tr/ilan";
  if (country === "IT" || country === "ES" || country === "FR" || country === "GB") return "/lot";
  return "/objekt";
}

/**
 * Redacts street + house number substrings and court case numbers from raw public titles
 * so public SEO pages never leak scrapeable exact street addresses while keeping rich
 * property type, area, postcode, and city keywords.
 */
export function sanitizePublicListingHeadline(params: {
  rawTitle: string;
  segmentLabel: string;
  place: string | null | undefined;
  postcode: string | null | undefined;
  country: PricingCountryCode;
}): string {
  const { rawTitle, segmentLabel, place, postcode, country } = params;
  const cleanCity = (place ?? "").split(",")[0].trim();
  const locPart = [postcode?.trim(), cleanCity].filter(Boolean).join(" ");

  if (country === "TR") {
    return (rawTitle || segmentLabel || "İcradan Satılık Gayrimenkul")
      .replace(/\b\d{4}\/\d+\s*(?:esas|talimat|satis|satış)\b/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  if (country === "CH") {
    const chKind = /konkurs/i.test(rawTitle) ? "Konkursamtliche Steigerung" : "Betreibungsamtliche Steigerung";
    const seg = segmentLabel && !/steigerung/i.test(segmentLabel) ? `${segmentLabel} (${chKind})` : chKind;
    return locPart ? `${seg} · ${locPart}` : seg;
  }

  if (country === "ES") {
    const seg = segmentLabel || "Inmueble en Subasta BOE";
    return locPart ? `${seg} en ${locPart}` : seg;
  }

  if (country === "FR") {
    const seg = segmentLabel || "Bien Immobilier";
    return locPart ? `${seg} à ${locPart}` : seg;
  }

  if (country === "IT") {
    const seg = segmentLabel || "Immobile all'Asta";
    return locPart ? `${seg} a ${locPart}` : seg;
  }

  if (country === "GB") {
    const seg = segmentLabel || "Property for Auction";
    return locPart ? `${seg} in ${locPart}` : seg;
  }

  // Strip raw file numbers like `0002 K 0005/2023`
  let cleaned = (rawTitle || "").replace(/\b\d{1,4}\s*[A-Z]{1,3}\s*\d{1,5}\/\d{2,4}\b/gi, "").trim();

  // DE ZVG format often looks like `Einfamilienhaus: Hebelstraße 3 b, 77977 Rust` -> keep segment + postcode/city
  if (cleaned.includes(":")) {
    const left = cleaned.split(":")[0].trim();
    if (left.length >= 4 && locPart) {
      return `${left} in ${locPart}`;
    }
  }

  // AT Edikte format often looks like `Einfamilienhaus, 5020 Salzburg, Hammerauer Straße 12` -> keep segment + PLZ + city
  if (country === "AT" && cleaned.includes(",") && locPart) {
    const firstPart = cleaned.split(",")[0].trim();
    if (firstPart.length >= 4) {
      return `${firstPart} in ${locPart}`;
    }
  }

  // Mask house numbers after common street words if present
  cleaned = cleaned.replace(
    /\b([A-Za-zÄÖÜäöüßéèàùçñ.\-]+(?:straße|strasse|str\.|weg|gasse|platz|allee|ring|damm|ufer|hof|stieg|chaussee|rue|avenue|calle|via|piazza|road|street|lane))\s+\d+[a-zA-Z0-9\s/-]*/gi,
    "$1",
  );

  if (!cleaned || cleaned.length < 5) {
    return locPart ? `${segmentLabel || "Immobilie"} in ${locPart}` : segmentLabel || "Zwangsversteigerung Immobilie";
  }
  return cleaned.replace(/[·,\s]+$/, "").trim();
}

export function buildPublicListingSlug(params: {
  key: string;
  country: PricingCountryCode;
  place?: string | null;
  postcode?: string | null;
  segment?: string | null;
  segmentLabel?: string | null;
  title?: string | null;
}): string {
  const cleanCity = (params.place ?? "").split(",")[0].trim();
  const localizedSeg = localizePublicSegmentLabel(params.segment, params.segmentLabel, params.country);
  const baseWords = [
    localizedSeg,
    params.postcode ?? "",
    cleanCity,
    !cleanCity && params.title ? params.title.slice(0, 45) : "",
  ]
    .filter(Boolean)
    .join(" ");
  const seoPart = slugifyPublicSegment(baseWords, params.country).slice(0, 56).replace(/-+$/g, "") || "objekt";
  return `${seoPart}--${encodePublicListingKey(params.key)}`;
}

export function buildPublicListingHref(params: {
  key: string;
  country: PricingCountryCode;
  place?: string | null;
  postcode?: string | null;
  segment?: string | null;
  segmentLabel?: string | null;
  title?: string | null;
}): string {
  const prefix = publicListingRoutePrefix(params.country);
  const slug = buildPublicListingSlug(params);
  return `${prefix}/${slug}`;
}

export function buildPreviewCardListingHref(item: PseoPreviewListing, fallbackLocale?: PseoLocale): string {
  const country = inferPreviewListingCountry(item, fallbackLocale);
  return buildPublicListingHref({
    key: item.key,
    country,
    place: item.place,
    postcode: item.postcode,
    segmentLabel: item.segmentLabel,
    title: item.title,
  });
}

export function extractKeyFromPublicSlug(slug: string): string | null {
  const decoded = decodeURIComponent(slug).trim();
  const idx = decoded.lastIndexOf("--");
  if (idx === -1) return decodePublicListingKey(decoded) || null;
  const rawEncoded = decoded.slice(idx + 2).trim();
  if (!rawEncoded) return null;
  return decodePublicListingKey(rawEncoded);
}
