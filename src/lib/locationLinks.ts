import { Listing } from "@/types/listing.types";
import { getMapQuery } from "@/lib/listingLabels";

/** Outbound links that help look at a place; none of them is a source for a figure. */

export const googleMapsUrl = (listing: Listing): string =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(getMapQuery(listing))}`;

export const openStreetMapUrl = (lat: number, lng: number, zoom: number): string =>
  `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`;

/**
 * Computes the Web Mercator slippy-map tile (z/y/x) for Esri World Imagery
 * so every listing with coordinates has an authentic aerial/satellite view.
 */
export function getAerialTileUrl(lat: number, lng: number, zoom = 16): string {
  const n = 2 ** zoom;
  const x = Math.floor(((lng + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n);
  return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${y}/${x}`;
}

export function getAerialTileQuad(lat: number, lng: number, zoom = 16): string[] {
  const n = 2 ** zoom;
  const xf = ((lng + 180) / 360) * n;
  const latRad = (lat * Math.PI) / 180;
  const yf = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;
  const x0 = Math.floor(xf) - (xf % 1 < 0.5 ? 1 : 0);
  const y0 = Math.floor(yf) - (yf % 1 < 0.5 ? 1 : 0);
  const base = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile";
  return [
    `${base}/${zoom}/${y0}/${x0}`,
    `${base}/${zoom}/${y0}/${x0 + 1}`,
    `${base}/${zoom}/${y0 + 1}/${x0}`,
    `${base}/${zoom}/${y0 + 1}/${x0 + 1}`,
  ];
}

export const TKGM_PARCEL_URL = "https://parselsorgu.tkgm.gov.tr/";

export const UYAP_ESATIS_URL = "https://esatis.uyap.gov.tr/";

export const hostOf = (url: string | null | undefined): string => {
  if (!url) return "zvg-portal.de";
  if (url.startsWith("/api/quelle/")) return "zvg-portal.de";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "zvg-portal.de";
  }
};

/**
 * Referer-safe URL to open the official portal notice.
 * zvg-portal.de blocks direct external links without Referer, so we route via our POST bridge.
 */
export function officialPortalHref(listing: Listing): string {
  const raw = listing.officialUrl ?? "";
  if (listing.key.startsWith("zvgportal-") || raw.includes("zvg-portal.de")) {
    return `/api/quelle/${encodeURIComponent(listing.key)}?mode=portal`;
  }
  return raw || "https://www.zvg-portal.de/";
}

/**
 * Referer-safe URL to open the primary official PDF announcement.
 */
export function officialDocumentHref(listing: Listing): string | null {
  if (!listing.documentUrl && !listing.exposeUrl) return null;
  const raw = listing.documentUrl ?? listing.exposeUrl ?? "";
  if (raw.includes("zvg-portal.de")) {
    const fMatch = /file_id=(\d+)/.exec(raw);
    const q = fMatch ? `?fileId=${fMatch[1]}` : "";
    return `/api/quelle/${encodeURIComponent(listing.key)}${q}`;
  }
  if (raw.includes("edikte.justiz.gv.at") || raw.includes("shab.ch")) {
    return `/api/quelle/${encodeURIComponent(listing.key)}`;
  }
  return raw;
}

const BORIS_BY_STATE: Record<string, { name: string; url: string }> = {
  bw: { name: "BORIS-BW (Bodenrichtwerte BW)", url: "https://www.gutachterausschuesse-bw.de/borisbw/" },
  by: { name: "BORIS Bayern", url: "https://www.bodenrichtwerte.bayern.de/" },
  be: { name: "BORIS Berlin", url: "https://fbinter.stadt-berlin.de/boris/" },
  bb: { name: "BORIS Brandenburg", url: "https://www.boris-brandenburg.de/boris-bb/" },
  hb: { name: "BORIS Bremen", url: "https://www.geo.bremen.de/" },
  hh: { name: "BORIS.HH Hamburg", url: "https://geoportal-hamburg.de/boris/" },
  he: { name: "BORIS Hessen", url: "https://boris.hessen.de/" },
  mv: { name: "BORIS-MV", url: "https://www.geoportal-mv.de/portal/Bodenrichtwerte" },
  ni: { name: "BORIS.NI Niedersachsen", url: "https://bodenrichtwerte.niedersachsen.de/" },
  nw: { name: "BORIS.NRW Bodenrichtwerte", url: "https://www.boris.nrw.de/" },
  rp: { name: "BORIS Rheinland-Pfalz", url: "https://www.boris.rlp.de/" },
  sl: { name: "BORIS Saarland", url: "https://www.bodenrichtwerte-informationen.de/" },
  sn: { name: "BORIS Sachsen", url: "https://www.boris.sachsen.de/" },
  st: { name: "BORIS Sachsen-Anhalt", url: "https://www.lvermgeo.sachsen-anhalt.de/de/kostenfreie_angebote/boris_st.html" },
  sh: { name: "BORIS-D Schleswig-Holstein", url: "https://www.bodenrichtwerte-boris.de/" },
  th: { name: "BORIS Thüringen", url: "https://bodenrichtwerte.geoproxy.geoportal-th.de/" },
};

export function getBorisPortal(listing: Listing): { name: string; url: string } | null {
  if (listing.market === "TR") return null;
  if (listing.country === "AT" || listing.key.startsWith("edikte-")) {
    return {
      name: listing.geoportalName ?? "Geoland.at · Österreichisches Kataster- & Geoportal",
      url: listing.geoportalUrl ?? "https://www.geoland.at/",
    };
  }
  if (listing.country === "CH" || listing.key.startsWith("shab-")) {
    return {
      name: listing.geoportalName ?? "geo.admin.ch · Amtliche Vermessung & ÖREB-Kataster",
      url: listing.geoportalUrl ?? "https://map.geo.admin.ch/",
    };
  }
  const code = (listing.regionCode ?? "").toLowerCase();
  return BORIS_BY_STATE[code] ?? { name: "BORIS-D Bodenrichtwert-Portal", url: "https://www.bodenrichtwerte-boris.de/" };
}

export interface ComparisonPortalLink {
  name: string;
  sub: string;
  href: string;
}

export function getMarketComparisonLinks(listing: Listing): ComparisonPortalLink[] {
  if (listing.market === "TR") {
    const q = [listing.region, listing.place, listing.tr?.mahalle].filter(Boolean).join(" ").trim();
    const enc = encodeURIComponent(q || listing.region || "Türkiye");
    return [
      {
        name: "Sahibinden Emlak",
        sub: q || "Bölge İlanları",
        href: `https://www.sahibinden.com/kelime-ile-arama?query_text=${enc}`,
      },
      {
        name: "Hepsiemlak",
        sub: q || "Piyasa Karşılaştırması",
        href: `https://www.hepsiemlak.com/ara?q=${enc}`,
      },
      {
        name: "Endeksa / Emlakjet",
        sub: q || "Bölge Fiyat Analizi",
        href: `https://www.google.com/search?q=${encodeURIComponent(`"${q}" satılık m2 fiyatı emlakjet sahibinden`)}`,
      },
    ];
  }

  const loc = [listing.postcode, listing.place].filter(Boolean).join(" ").trim();
  const segWord =
    listing.segment === "apartment"
      ? "Eigentumswohnung kaufen"
      : listing.segment === "land" || listing.segment === "farmland"
        ? "Grundstück kaufen"
        : listing.segment === "commercial"
          ? "Gewerbeimmobilie kaufen"
          : "Haus kaufen";

  if (listing.country === "AT" || listing.key.startsWith("edikte-")) {
    return [
      {
        name: "Willhaben Immobilien",
        sub: loc || "Standort-Angebote (AT)",
        href: `https://www.google.com/search?q=${encodeURIComponent(`site:willhaben.at/iad/immobilien ${segWord} ${loc}`)}`,
      },
      {
        name: "ImmoScout24 Österreich",
        sub: loc || "Marktpreise vor Ort",
        href: `https://www.google.com/search?q=${encodeURIComponent(`site:immobilienscout24.at ${segWord} ${loc}`)}`,
      },
      {
        name: "Immobilienpreisspiegel & Lage",
        sub: `${listing.place ?? listing.region ?? "Gemeinde"}`,
        href: `https://www.google.com/search?q=${encodeURIComponent(`Quadratmeterpreis ${loc || listing.region || "Österreich"}`)}`,
      },
    ];
  }

  if (listing.country === "CH" || listing.key.startsWith("shab-")) {
    return [
      {
        name: "Homegate.ch Vergleich",
        sub: loc || "Standort-Angebote (CH)",
        href: `https://www.google.com/search?q=${encodeURIComponent(`site:homegate.ch ${segWord} ${loc}`)}`,
      },
      {
        name: "ImmoScout24 Schweiz",
        sub: loc || "Marktpreise vor Ort",
        href: `https://www.google.com/search?q=${encodeURIComponent(`site:immoscout24.ch ${segWord} ${loc}`)}`,
      },
      {
        name: "Quadratmeterpreise & Kanton",
        sub: `${listing.place ?? listing.region ?? "Gemeinde"}`,
        href: `https://www.google.com/search?q=${encodeURIComponent(`Quadratmeterpreis Immobilien ${loc || listing.region || "Schweiz"}`)}`,
      },
    ];
  }

  const encLoc = encodeURIComponent(loc || listing.region || "Deutschland");
  return [
    {
      name: "ImmoScout24 Vergleich",
      sub: loc || "Standort-Angebote",
      href: `https://www.google.com/search?q=${encodeURIComponent(`site:immobilienscout24.de ${segWord} ${loc}`)}`,
    },
    {
      name: "Immowelt & Kleinanzeigen",
      sub: loc || "Marktpreise vor Ort",
      href: `https://www.google.com/search?q=${encodeURIComponent(`${segWord} ${loc} immowelt OR kleinanzeigen`)}`,
    },
    {
      name: "Bodenrichtwert & Lage",
      sub: `${listing.place ?? listing.region ?? "Kommune"}`,
      href: `https://www.google.com/search?q=${encodeURIComponent(`Bodenrichtwert ${encLoc ? decodeURIComponent(encLoc) : ""}`)}`,
    },
  ];
}
