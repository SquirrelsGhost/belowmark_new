import RiskLight from "@/components/app/risk/RiskLight";
import { fill } from "@/lib/appFormat";
import { IBankFileTranslation } from "@/translations/bankFile/IBankFileTranslation";
import { IReportTranslation } from "@/translations/report/IReportTranslation";
import { RiskCheck, RiskItem } from "@/types/report.types";

interface BankFileRisksProps {
  check: RiskCheck;
  labels: IReportTranslation["Risk"];
  lead: string;
  sourceLabels: IBankFileTranslation["Object"]["RiskFrom"];
}

/** Where a risk light comes from: the notice, Gutachten pages, or no source at all. */
function sourceOf(item: RiskItem, labels: BankFileRisksProps["sourceLabels"]): string {
  const pages = [...new Set(item.evidence.flatMap((evidence) => (evidence.page === null ? [] : [evidence.page])))];
  const parts = [];
  if (item.evidence.some((evidence) => evidence.source === "notice")) parts.push(labels.notice);
  if (pages.length > 0) parts.push(fill(labels.report, { pages: pages.join(", ") }));
  return parts.length > 0 ? parts.join(" · ") : labels.none;
}

/** The rights and risks a bank asks about first (Wohnrecht, Nießbrauch, Mieter …), each with its source. */
export default function BankFileRisks({ check, labels, lead, sourceLabels }: BankFileRisksProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[12px] leading-snug text-ink-soft">{lead}</p>
      <ul className="grid grid-cols-2 gap-x-8">
        {check.items.map((item) => (
          <li key={item.key} className="flex items-center justify-between gap-3 border-b border-rule py-1.5 text-[13px]">
            <span>
              {labels.Names[item.key]}
              <span className="block font-mono text-[10px] text-muted">
                {sourceOf(item, sourceLabels)}
                {item.conflicting && ` · ${labels.Conflicting}`}
              </span>
            </span>
            <RiskLight level={item.level} label={labels.Levels[item.level]} />
          </li>
        ))}
      </ul>
    </div>
  );
}
