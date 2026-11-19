interface AccountDetailRowProps {
  label: string;
  value: string;
  tone?: "default" | "verdict" | "signal";
}

const TONE_CLASSES = { default: "text-ink", verdict: "text-verdict", signal: "text-signal-deep" } as const;

/** Label left, mono value right — stacks cleanly on narrow phones and wraps whole words without mid-word breaks. */
export default function AccountDetailRow({ label, value, tone = "default" }: AccountDetailRowProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1 border-b border-rule py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <dt className="shrink-0 font-mono text-[11px] tracking-[0.14em] text-muted uppercase">{label}</dt>
      <dd className={`min-w-0 font-mono text-sm font-medium wrap-break-word sm:text-right ${TONE_CLASSES[tone]}`}>{value}</dd>
    </div>
  );
}
