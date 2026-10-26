interface TeamNoticeProps {
  text: string;
  tone: "signal" | "muted";
}

/** One-line notice above the team content: team at rest, or read-only role. */
export default function TeamNotice({ text, tone }: TeamNoticeProps) {
  return (
    <p role="note" className={`mt-6 border-l-4 bg-paper-bright px-4 py-3 text-sm leading-relaxed ${tone === "signal" ? "border-signal text-ink" : "border-rule-strong text-ink-soft"}`}>
      {text}
    </p>
  );
}
