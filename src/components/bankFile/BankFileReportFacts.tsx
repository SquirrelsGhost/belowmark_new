import BidderFileRow from "@/components/bidderFile/BidderFileRow";
import { fill } from "@/lib/appFormat";
import { IReportTranslation } from "@/translations/report/IReportTranslation";
import { GutachtenReport } from "@/types/report.types";

interface BankFileReportFactsProps {
  report: GutachtenReport | null;
  title: string;
  noReport: string;
  reportFrom: string;
  factLabels: IReportTranslation["Report"]["Facts"];
  pageLabel: string;
}

/** Key figures as printed in the uploaded Gutachten — verbatim, with page, never recalculated. */
export default function BankFileReportFacts({ report, title, noReport, reportFrom, factLabels, pageLabel }: BankFileReportFactsProps) {
  return (
    <div className="mt-4">
      <p className="mb-1 font-narrow text-xs font-bold tracking-[0.12em] uppercase">{title}</p>
      {!report || report.facts.length === 0 ? (
        <p className="bg-hatch px-2 py-1.5 text-[12px] text-ink-soft">{noReport}</p>
      ) : (
        <>
          <p className="text-[11px] text-muted">{fill(reportFrom, { file: report.fileName })}</p>
          <dl className="grid grid-cols-2 gap-x-8 divide-y divide-rule">
            {report.facts.map((fact) => (
              <BidderFileRow key={fact.key} label={factLabels[fact.key]} value={fact.value} missing="—" note={fill(pageLabel, { page: fact.page })} />
            ))}
          </dl>
        </>
      )}
    </div>
  );
}
