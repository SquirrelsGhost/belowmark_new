// ---------------------------------------------------------------------------
// Echte Luftbild-/Satelliten-Kartenkacheln für Instagram-Slides & Reels.
// Nutzt öffentliche Esri World Imagery Kacheln (Zoom 15 = Stadtviertel-Ebene,
// datenschutzkonform mit PLZ-Umkreis-Radar statt Einzelhaus-Pin) und cached
// alle Kacheln lokal unter marketing/instagram/.tile-cache/, damit wiederholte
// Läufe in Millisekunden rendern.
// ---------------------------------------------------------------------------

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { C, F, el } from "./brand.mjs";

const ZOOM = 15;
const TILE_PX = 256;

function latLngToTilePixel(lat, lng, zoom = ZOOM) {
  const n = 2 ** zoom;
  const xFloat = ((lng + 180) / 360) * n;
  const latRad = (lat * Math.PI) / 180;
  const yFloat = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;
  return {
    tileX: Math.floor(xFloat),
    tileY: Math.floor(yFloat),
    offsetX: Math.round((xFloat - Math.floor(xFloat)) * TILE_PX),
    offsetY: Math.round((yFloat - Math.floor(yFloat)) * TILE_PX),
  };
}

async function fetchTileBase64(cacheDir, z, x, y) {
  mkdirSync(cacheDir, { recursive: true });
  const cacheFile = resolve(cacheDir, `esri-${z}-${x}-${y}.jpg`);
  if (existsSync(cacheFile)) {
    return `data:image/jpeg;base64,${readFileSync(cacheFile).toString("base64")}`;
  }
  const url = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5000);
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "BelowmarkEditorialRenderer/2.0" },
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 500) return null;
    writeFileSync(cacheFile, buf);
    return `data:image/jpeg;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

/**
 * Lädt ein 4×3 Satelliten-Kachel-Grid um (lat, lng) vor, damit Satori daraus
 * synchron jedes beliebige Format (4:5 Slide oder 9:16 Reel/Story) zentriert
 * zusammensetzen kann.
 */
export async function loadAerialGrid(cacheDir, geo) {
  if (!geo || typeof geo.lat !== "number" || typeof geo.lng !== "number") return null;
  const center = latLngToTilePixel(geo.lat, geo.lng, ZOOM);
  const cols = [-1, 0, 1, 2];
  const rows = [-1, 0, 1];
  const grid = [];
  let loaded = 0;

  for (const dy of rows) {
    const rowTiles = [];
    for (const dx of cols) {
      const b64 = await fetchTileBase64(cacheDir, ZOOM, center.tileX + dx, center.tileY + dy);
      if (b64) loaded++;
      rowTiles.push(b64);
    }
    grid.push(rowTiles);
  }
  if (loaded < 6) return null;
  return {
    lat: geo.lat,
    lng: geo.lng,
    offsetX: center.offsetX,
    offsetY: center.offsetY,
    grid,
  };
}

/**
 * Rendert das Luftbild-Fenster mit PLZ-Sektor-Radar, Koordinaten-Telemetrie
 * und Preis-/Rabatt-Badge direkt für Satori (next/og).
 */
export function AerialHeroBox({ aerial, width = 936, height = 390, badgeLeft, badgeRight, sectorLabel }) {
  if (!aerial) {
    return el(
      {
        width,
        height: 160,
        background: C.ink,
        color: C.paperBright,
        padding: "24px 30px",
        justifyContent: "space-between",
        alignItems: "center",
        border: `3px solid ${C.ink}`,
      },
      el({ fontFamily: F.mono, fontSize: 22, letterSpacing: 2 }, sectorLabel || "AMTLICHER AUSHANG"),
      badgeRight
        ? el(
            { background: C.signal, color: C.paperBright, padding: "8px 18px", fontFamily: F.display, fontSize: 34 },
            badgeRight
          )
        : null
    );
  }

  // Das 4x3 Grid ist 1024x768 groß; das Zentrum liegt bei (256 + offsetX, 256 + offsetY).
  // Wir skalieren leicht hoch (1.12x), damit Breite >= 936px immer voll gedeckt ist.
  const scale = Math.max(1.12, (width + 120) / (4 * TILE_PX));
  const tileSize = Math.ceil(TILE_PX * scale);
  const centerPxX = (1 * TILE_PX + aerial.offsetX) * scale;
  const centerPxY = (1 * TILE_PX + aerial.offsetY) * scale;
  const leftShift = Math.round(width / 2 - centerPxX);
  const topShift = Math.round(height / 2 - centerPxY);

  const coordText = `${aerial.lat.toFixed(2)}° N · ${aerial.lng.toFixed(2)}° E`;
  const radarSize = Math.round(Math.min(width, height) * 0.46);

  return el(
    {
      position: "relative",
      width,
      height,
      overflow: "hidden",
      border: `3px solid ${C.ink}`,
      boxShadow: `10px 10px 0 ${C.ink}`,
      background: "#1b211e",
    },
    // Satelliten-Kacheln
    el(
      {
        position: "absolute",
        left: leftShift,
        top: topShift,
        flexDirection: "column",
      },
      ...aerial.grid.map((row) =>
        el(
          { flexDirection: "row" },
          ...row.map((src) =>
            src
              ? createTileImg(src, tileSize)
              : el({ width: tileSize, height: tileSize, background: "#232a26" })
          )
        )
      )
    ),
    // Dezente Abdunklung für maximalen Kontrast der Overlays
    el({
      position: "absolute",
      left: 0,
      top: 0,
      width,
      height,
      background: "linear-gradient(180deg, rgba(18,17,15,0.52) 0%, rgba(18,17,15,0.12) 45%, rgba(18,17,15,0.68) 100%)",
    }),
    // PLZ-Sektor-Radar im Zentrum
    el(
      {
        position: "absolute",
        left: Math.round((width - radarSize) / 2),
        top: Math.round((height - radarSize) / 2),
        width: radarSize,
        height: radarSize,
        borderRadius: 999,
        border: `4px solid ${C.signal}`,
        background: "rgba(200, 54, 43, 0.20)",
        alignItems: "center",
        justifyContent: "center",
      },
      el({
        width: 18,
        height: 18,
        borderRadius: 99,
        background: C.signal,
        border: `3px solid ${C.paperBright}`,
      })
    ),
    // Top-Bar: Sektor links + Rabatt-Stempel rechts
    el(
      {
        position: "absolute",
        left: 20,
        top: 18,
        width: width - 40,
        justifyContent: "space-between",
        alignItems: "center",
      },
      badgeLeft
        ? el(
            {
              background: "rgba(18,17,15,0.88)",
              color: C.paperBright,
              padding: "8px 16px",
              fontFamily: F.mono,
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: 1.5,
            },
            badgeLeft
          )
        : el({}),
      badgeRight
        ? el(
            {
              background: C.signal,
              color: C.paperBright,
              padding: "8px 20px",
              fontFamily: F.display,
              fontSize: 44,
              letterSpacing: 1,
              boxShadow: `6px 6px 0 ${C.ink}`,
            },
            badgeRight
          )
        : null
    ),
    // Bottom-Bar: PLZ-Sektor-Hinweis links + Koordinaten rechts
    el(
      {
        position: "absolute",
        left: 20,
        bottom: 16,
        width: width - 40,
        justifyContent: "space-between",
        alignItems: "center",
      },
      el(
        {
          background: "rgba(18,17,15,0.85)",
          color: C.paperBright,
          padding: "6px 14px",
          fontFamily: F.mono,
          fontSize: 18,
          letterSpacing: 1,
        },
        sectorLabel || "LAGE-SEKTOR (LUFTBILD)"
      ),
      el(
        {
          background: "rgba(18,17,15,0.85)",
          color: "#d8d3c8",
          padding: "6px 14px",
          fontFamily: F.mono,
          fontSize: 18,
          letterSpacing: 1,
        },
        coordText
      )
    )
  );
}

import { createElement } from "react";
function createTileImg(src, size) {
  return createElement("img", {
    src,
    width: size,
    height: size,
    style: { width: size, height: size, objectFit: "cover", display: "flex" },
  });
}
