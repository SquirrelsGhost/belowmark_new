"use client";

import { useState } from "react";
import { MAP_TILES } from "@/lib/appConstants";
import { metresPerPixel, toTile } from "@/lib/geo";

type Provider = "basemap" | "osm";

interface LocationTileMapProps {
  lat: number;
  lng: number;
  /** Three zoom steps, coarse to fine */
  zooms: readonly [number, number, number];
  provider: Provider;
  /** Radius of the "somewhere in here" circle; null draws a pin instead */
  radiusMetres: number | null;
  scaleLabel: string;
  levels: readonly [string, string, string];
  label: string;
}

/** Tiles around the centre: 7 × 5 covers any container up to ~1800 × 1280 px. */
const SPAN_X = [-3, -2, -1, 0, 1, 2, 3];
const SPAN_Y = [-2, -1, 0, 1, 2];

/**
 * A printed map clip: plain image tiles in a grid, toned to paper, with three
 * fixed scales instead of a map library. Falls back from basemap.de to
 * OpenStreetMap if the official tiles do not load.
 */
export default function LocationTileMap({ lat, lng, zooms, provider: initial, radiusMetres, scaleLabel, levels, label }: LocationTileMapProps) {
  const [level, setLevel] = useState(1);
  const [provider, setProvider] = useState<Provider>(initial);
  const zoom = zooms[level];
  const tiles = MAP_TILES[provider];
  const size = MAP_TILES.tileSize;
  const centre = toTile(lat, lng, zoom);
  const baseX = Math.floor(centre.x);
  const baseY = Math.floor(centre.y);
  const count = 2 ** zoom;
  // Whole pixels: server and browser print fractions differently, which breaks hydration.
  const radius = radiusMetres === null ? null : Math.round(radiusMetres / metresPerPixel(lat, zoom));

  return (
    <div className="relative h-80 overflow-hidden border-2 border-ink bg-paper-deep sm:h-96" role="img" aria-label={label}>
      <div className="absolute top-1/2 left-1/2 [filter:grayscale(1)_sepia(0.18)_contrast(1.05)] mix-blend-multiply">
        {SPAN_Y.flatMap((dy) =>
          SPAN_X.map((dx) => {
            const x = (((baseX + dx) % count) + count) % count;
            const y = baseY + dy;
            if (y < 0 || y >= count) return null;
            const src = tiles.url.replace("{z}", String(zoom)).replace("{x}", String(x)).replace("{y}", String(y));
            return (
              // eslint-disable-next-line @next/next/no-img-element -- map tiles come from the tile server as is
              <img
                key={`${provider}-${zoom}-${dx}-${dy}`}
                src={src}
                alt=""
                width={size}
                height={size}
                draggable={false}
                className="absolute max-w-none select-none"
                style={{ left: Math.round((baseX + dx - centre.x) * size), top: Math.round((y - centre.y) * size) }}
                onError={() => provider === "basemap" && setProvider("osm")}
              />
            );
          }),
        )}
      </div>

      <div className="pointer-events-none absolute top-1/2 left-1/2" aria-hidden="true">
        {radius !== null ? (
          <span
            className="absolute rounded-full border-2 border-dashed border-signal bg-signal/10"
            style={{ width: radius * 2, height: radius * 2, left: -radius, top: -radius }}
          />
        ) : null}
        <span className="absolute -top-2 -left-2 size-4 rounded-full border-2 border-paper-bright bg-signal shadow-[0_0_0_2px_var(--signal)]" />
      </div>

      <div className="absolute top-3 left-3 flex border-2 border-ink bg-paper-bright" role="group" aria-label={scaleLabel}>
        {levels.map((name, index) => (
          <button
            key={name}
            type="button"
            onClick={() => setLevel(index)}
            aria-pressed={index === level}
            className={`px-2.5 py-1 font-narrow text-[11px] font-semibold tracking-[0.08em] uppercase ${index === level ? "bg-ink text-paper-bright" : "hover:bg-paper-deep"}`}
          >
            {name}
          </button>
        ))}
      </div>

      <a
        href={tiles.attributionUrl}
        target="_blank"
        rel="noreferrer"
        className="absolute right-0 bottom-0 bg-paper-bright/90 px-1.5 py-0.5 font-mono text-[9px] text-ink-soft hover:text-ink"
      >
        {tiles.attribution}
      </a>
    </div>
  );
}
