interface DeadlineNoteProps {
  text: string;
  tone?: "plain" | "hatch";
}

/** A short remark under or inside the timeline (no dates, after-award hint, disclaimer). */
export default function DeadlineNote({ text, tone = "plain" }: DeadlineNoteProps) {
  const classes = tone === "hatch" ? "border border-dashed border-rule-strong bg-hatch p-3 text-sm text-ink-soft" : "font-mono text-[11px] leading-relaxed text-muted";
  return <p className={`max-w-2xl ${classes}`}>{text}</p>;
}
