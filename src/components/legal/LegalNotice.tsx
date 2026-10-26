interface LegalNoticeProps {
  title?: string;
  body: string;
  tone?: "signal" | "ink";
}

/** Boxed note above a legal text: the draft warning, the Turkish language note. */
export default function LegalNotice({ title, body, tone = "signal" }: LegalNoticeProps) {
  const frame = tone === "signal" ? "border-signal bg-signal/[0.07]" : "border-ink bg-paper-deep";
  return (
    <div role="note" className={`border-l-4 px-4 py-3 ${frame}`}>
      {title && <p className="font-mono text-[11px] font-semibold tracking-[0.14em] text-signal-deep uppercase">{title}</p>}
      <p className={`text-sm leading-relaxed text-ink ${title ? "mt-1" : ""}`}>{body}</p>
    </div>
  );
}
