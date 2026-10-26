interface BillingNoticeProps {
  message: string;
  tone?: "verdict" | "signal" | "ink";
  /** Optional list under the message (open gaps in test mode) */
  items?: string[];
}

const TONES = {
  verdict: "border-verdict bg-verdict/[0.08]",
  signal: "border-signal bg-signal/[0.07]",
  ink: "border-ink bg-paper-deep",
} as const;

/** One-paragraph status line with a coloured edge. */
export default function BillingNotice({ message, tone = "ink", items }: BillingNoticeProps) {
  return (
    <div role="status" className={`border-l-4 px-4 py-3 text-sm leading-relaxed text-ink ${TONES[tone]}`}>
      <p>{message}</p>
      {items && items.length > 0 && (
        <ul className="mt-2 list-disc pl-5 font-mono text-[11px] text-ink-soft">
          {items.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
