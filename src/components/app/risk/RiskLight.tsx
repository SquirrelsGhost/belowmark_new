import { RiskLevel } from "@/types/report.types";

interface RiskLightProps {
  level: RiskLevel;
  label: string;
}

/** Signal colours of the design: red line, caution amber, verdict green — grey ring for "unknown". */
const LEVEL_CLASSES: Record<RiskLevel, string> = {
  red: "bg-signal border-signal",
  yellow: "bg-caution border-caution",
  green: "bg-verdict border-verdict",
  unknown: "bg-transparent border-muted border-dashed",
};

/** One lamp of the traffic light, with its meaning in words for screen readers and print. */
export default function RiskLight({ level, label }: RiskLightProps) {
  return (
    <span className="inline-flex shrink-0 items-center gap-2">
      <span aria-hidden="true" className={`size-3.5 rounded-full border-2 ${LEVEL_CLASSES[level]}`} />
      <span className="font-mono text-[10px] tracking-[0.14em] text-ink-soft uppercase">{label}</span>
    </span>
  );
}
