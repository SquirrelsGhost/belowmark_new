import RiskCheckSection from "@/components/app/risk/RiskCheckSection";
import RiskEvidenceItem from "@/components/app/risk/RiskEvidenceItem";
import RiskRow from "@/components/app/risk/RiskRow";
import { fill } from "@/lib/appFormat";
import { IReportTranslation } from "@/translations/report/IReportTranslation";
import { RiskCheck, RiskEvidence } from "@/types/report.types";

interface RiskCheckPanelProps {
  check: RiskCheck;
  labels: IReportTranslation["Risk"];
}

function sourceLabel(evidence: RiskEvidence, labels: IReportTranslation["Risk"]): string {
  if (evidence.source === "notice") return labels.SourceNotice;
  return `${labels.SourceReport} · ${fill(labels.Page, { page: evidence.page ?? "?" })}`;
}

/** Fills the traffic light with the computed check: one row per risk, every source quoted. */
export default function RiskCheckPanel({ check, labels }: RiskCheckPanelProps) {
  return (
    <RiskCheckSection title={labels.Title} lead={labels.Lead} scope={check.withReport ? labels.WithReport : labels.WithoutReport} disclaimer={labels.Disclaimer}>
      {check.items.map((item) => (
        <RiskRow
          key={item.key}
          name={labels.Names[item.key]}
          level={item.level}
          levelLabel={labels.Levels[item.level]}
          conflictLabel={item.conflicting ? labels.Conflicting : null}
          hint={labels.Hints[item.key]}
          isOpen={item.level === "red" || item.level === "yellow"}
        >
          {item.evidence.length === 0 ? (
            <p className="text-sm text-ink-soft">{labels.UnknownBody}</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {item.evidence.map((evidence, index) => (
                <RiskEvidenceItem key={`${evidence.source}-${evidence.page}-${index}`} evidence={evidence} sourceLabel={sourceLabel(evidence, labels)} stanceLabel={labels.Stances[evidence.stance]} />
              ))}
            </ul>
          )}
        </RiskRow>
      ))}
    </RiskCheckSection>
  );
}
