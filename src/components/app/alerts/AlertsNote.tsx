interface AlertsNoteProps {
  text: string;
}

/** How alerts compare — the fine print under the list. */
export default function AlertsNote({ text }: AlertsNoteProps) {
  return <p className="mt-10 max-w-3xl border-l-4 border-ink pl-4 font-mono text-[11px] leading-relaxed text-muted">{text}</p>;
}
