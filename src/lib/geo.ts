import { GeoProjection } from "@/types/listing.types";

/**
 * Coordinate helpers for the app's own maps. The outlines in data/geo were
 * projected with the same formula (scripts/build-geo.mjs), so points and
 * outlines line up.
 */

/** Latitude/longitude → SVG coordinates of the market map. */
export function projectPoint(projection: GeoProjection, lat: number, lng: number): [number, number] {
  const { minLng, maxLat, k, scale, pad } = projection;
  const inset = projection.insets?.find(({ bounds: [west, south, east, north] }) => lng >= west && lng <= east && lat >= south && lat <= north);
  return [pad + (lng - minLng) * k * scale + (inset?.dx ?? 0), pad + (maxLat - lat) * scale + (inset?.dy ?? 0)];
}

/** Frames around the insets (x, y, width, height), so a shifted area does not pass for its real position. */
export function insetFrames(projection: GeoProjection): [number, number, number, number][] {
  return (projection.insets ?? []).map(({ bounds: [west, south, east, north] }) => {
    const [x0, y0] = projectPoint(projection, north, west);
    const [x1, y1] = projectPoint(projection, south, east);
    return [x0, y0, x1 - x0, y1 - y0];
  });
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
