interface TrPanelNoteProps {
  text: string;
  tone?: "muted" | "caution";
}

/** Fine print under a panel: source, or why a figure is missing. */
export default function TrPanelNote({ text, tone = "muted" }: TrPanelNoteProps) {
  return (
    <p className={`px-4 py-3 font-mono text-[11px] leading-relaxed ${tone === "caution" ? "border-l-4 border-caution bg-caution/10 text-ink-soft" : "border-t border-rule text-muted"}`}>{text}</p>
  );
}
