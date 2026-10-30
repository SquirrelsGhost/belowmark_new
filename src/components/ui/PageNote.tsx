type PageNoteVariant = "softTop" | "monoMuted" | "monoKicker" | "mutedSmall" | "hatched";

interface PageNoteProps {
  text: string;
  variant?: PageNoteVariant;
}

const NOTE_CLASSES: Record<PageNoteVariant, string> = {
  softTop: "mt-8 text-sm text-ink-soft",
  monoMuted: "font-mono text-[11px] text-muted",
  monoKicker: "mt-2 font-mono text-[11px] tracking-[0.1em] text-muted uppercase",
  mutedSmall: "text-[13px] text-muted",
  hatched: "bg-hatch px-2 py-1.5 text-[13px] text-ink-soft",
};

/** Single-line typographic status or fallback note for composed pages. */
export default function PageNote({ text, variant = "mutedSmall" }: PageNoteProps) {
  return <p className={NOTE_CLASSES[variant]}>{text}</p>;
}
