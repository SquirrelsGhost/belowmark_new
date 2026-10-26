import { GeoProjection } from "@/types/listing.types";

/**
 * Coordinate helpers for the app's own maps. The outlines in data/geo were
 * projected with the same formula (scripts/build-geo.mjs), so points and
 * outlines line up.
 */

/** Latitude/longitude → SVG coordinates of the market map. */
export function projectPoint(projection: GeoProjection, lat: number, lng: number): [number, number] {
  const { minLng, maxLat, k, scale, pad } = projection;
  return [pad + (lng - minLng) * k * scale, pad + (maxLat - lat) * scale];
}

/** Latitude/longitude → fractional web-mercator tile position at zoom z. */
export function toTile(lat: number, lng: number, zoom: number): { x: number; y: number } {
  const n = 2 ** zoom;
  const rad = (lat * Math.PI) / 180;
  return {
    x: ((lng + 180) / 360) * n,
    y: ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * n,
  };
}

/** Metres covered by one pixel of a 256 px tile at this latitude and zoom. */
export function metresPerPixel(lat: number, zoom: number): number {
  return (156_543.033_92 * Math.cos((lat * Math.PI) / 180)) / 2 ** zoom;
}
