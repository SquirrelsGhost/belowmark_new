import Icon from "@/components/ui/Icon";
import { RiskEvidence } from "@/types/report.types";

interface RiskEvidenceItemProps {
  evidence: RiskEvidence;
  sourceLabel: string;
  stanceLabel: string;
}

const STANCE_CLASSES: Record<RiskEvidence["stance"], string> = {
  present: "text-signal",
  absent: "text-verdict",
  unclear: "text-caution",
};

/** One source for a risk: where it stands, what it says, and the words themselves. */
export default function RiskEvidenceItem({ evidence, sourceLabel, stanceLabel }: RiskEvidenceItemProps) {
  return (
    <li className="flex flex-col gap-1">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[10px] tracking-[0.12em] uppercase">
        {evidence.url ? (
          <a href={evidence.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-signal hover:underline">
            {sourceLabel}
            <Icon name="arrowUpRight" className="size-3" />
          </a>
        ) : (
          <span className="text-ink">{sourceLabel}</span>
        )}
        <span className={STANCE_CLASSES[evidence.stance]}>{stanceLabel}</span>
      </div>
      <blockquote className="border-l-2 border-rule-strong pl-3 font-serif text-[15px] leading-snug text-ink-soft italic">{evidence.quote}</blockquote>
    </li>
  );
}
