import { GeoSource } from "@/types/listing.types";

interface MapSourcesProps {
  label: string;
  sources: GeoSource[];
  /** e.g. "12 ohne Postleitzahl, deshalb nicht auf der Karte" */
  note?: string;
}

/** Attribution line under a map: what the outlines and points are made of, and their licence. */
export default function MapSources({ label, sources, note }: MapSourcesProps) {
  return (
    <p className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] leading-relaxed text-muted">
      {note && <span className="text-ink-soft">{note}</span>}
      <span>{label}:</span>
      {sources.map((source) => (
        <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="underline decoration-rule underline-offset-2 hover:text-ink">
          {source.label} · {source.by} · {source.license}
        </a>
      ))}
    </p>
  );
}
