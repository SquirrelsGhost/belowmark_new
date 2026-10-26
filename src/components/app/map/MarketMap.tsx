import { ReactNode } from "react";
import MapHoverLayer from "@/components/app/map/MapHoverLayer";

interface MarketMapProps {
  label: string;
  viewBox: string;
  hint: string;
  /** Region outlines, then dots */
  children: ReactNode;
  legend: ReactNode;
  footer: ReactNode;
  /** e.g. "Alle Regionen" while zoomed in */
  action?: ReactNode;
}

/**
 * The search results on the app's own map: outlines from a local file, dots in
 * signal red and ink. No tiles, no third-party requests, prints like a notice.
 */
export default function MarketMap({ label, viewBox, hint, children, legend, footer, action }: MarketMapProps) {
  return (
    <figure className="mt-4 border-2 border-ink bg-paper-bright">
      <figcaption className="flex flex-wrap items-start justify-between gap-3 border-b border-rule px-4 py-3">
        <div className="max-w-xl">
          <p className="text-sm text-ink-soft">{hint}</p>
          <div className="mt-2">{legend}</div>
        </div>
        {action}
      </figcaption>
      <MapHoverLayer>
        <svg viewBox={viewBox} role="img" aria-label={label} className="block h-auto max-h-[78vh] w-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <pattern id="map-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="var(--rule)" strokeWidth="1.2" />
            </pattern>
          </defs>
          {children}
        </svg>
      </MapHoverLayer>
      <div className="border-t border-rule px-4 py-2">{footer}</div>
    </figure>
  );
}
