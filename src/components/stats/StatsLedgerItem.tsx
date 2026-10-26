import Reveal from "@/components/ui/Reveal";

interface StatsLedgerItemProps {
  value: string;
  label: string;
  /** Highlights the figure in signal red */
  isAccent?: boolean;
  delay?: number;
}

export default function StatsLedgerItem({ value, label, isAccent = false, delay = 0 }: StatsLedgerItemProps) {
  return (
    <Reveal delay={delay} className="flex flex-col-reverse justify-end gap-3 px-4 py-7 first:pl-0 sm:px-6">
      <dt className="max-w-[16ch] text-sm leading-snug text-ink-soft">{label}</dt>
      <dd className={`font-display text-[clamp(2.2rem,3.4vw,3.4rem)] leading-none whitespace-nowrap ${isAccent ? "text-signal" : ""}`}>{value}</dd>
    </Reveal>
  );
}
