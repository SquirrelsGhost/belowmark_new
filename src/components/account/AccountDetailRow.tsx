interface AccountDetailRowProps {
  label: string;
  value: string;
  tone?: "default" | "verdict" | "signal";
}

const TONE_CLASSES = { default: "text-ink", verdict: "text-verdict", signal: "text-signal-deep" } as const;

/** Label left, mono value right — like a line on a court notice. */
export default function AccountDetailRow({ label, value, tone = "default" }: AccountDetailRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-rule py-3">
      <dt className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">{label}</dt>
      <dd className={`text-right font-mono text-sm font-medium break-all ${TONE_CLASSES[tone]}`}>{value}</dd>
    </div>
  );
}
