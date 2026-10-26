import { ReactNode } from "react";
import RiskLight from "@/components/app/risk/RiskLight";
import { RiskLevel } from "@/types/report.types";

interface RiskRowProps {
  name: string;
  level: RiskLevel;
  levelLabel: string;
  /** Shown next to the name when sources contradict each other */
  conflictLabel: string | null;
  hint: string;
  /** Red and yellow rows start open — they are the ones to read */
  isOpen: boolean;
  /** The sources (RiskEvidenceItem) or the "unknown" note */
  children: ReactNode;
}

/** One risk: lamp and name in the summary, sources and the next step on click. */
export default function RiskRow({ name, level, levelLabel, conflictLabel, hint, isOpen, children }: RiskRowProps) {
  return (
    <li>
      <details className="group" open={isOpen}>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3">
          <span className="flex items-baseline gap-3">
            <span className="font-narrow text-base font-semibold">{name}</span>
            {conflictLabel && <span className="font-mono text-[10px] tracking-[0.12em] text-caution uppercase">{conflictLabel}</span>}
          </span>
          <RiskLight level={level} label={levelLabel} />
        </summary>
        <div className="flex flex-col gap-3 pb-4">
          {children}
          <p className="text-xs leading-relaxed text-muted">{hint}</p>
        </div>
      </details>
    </li>
  );
}
