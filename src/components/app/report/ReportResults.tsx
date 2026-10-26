import ReportFactRow from "@/components/app/report/ReportFactRow";
import ReportFacts from "@/components/app/report/ReportFacts";
import ReportFindingItem from "@/components/app/report/ReportFindingItem";
import ReportMeta from "@/components/app/report/ReportMeta";
import ReportTopic from "@/components/app/report/ReportTopic";
import { fill } from "@/lib/appFormat";
import { formatDate } from "@/lib/format";
import { LocaleOption } from "@/lib/constants";
import { IReportTranslation } from "@/translations/report/IReportTranslation";
import { GutachtenReport, ReportFactKey, ReportTopic as Topic } from "@/types/report.types";

interface ReportResultsProps {
  report: GutachtenReport;
  labels: IReportTranslation["Report"];
  locale: LocaleOption;
}

/** Order of the subjects: what the bidder asked for first (defects, rights, tenants, contamination). */
const TOPIC_ORDER: Topic[] = ["defects", "rights", "charges", "tenancy", "contamination", "heritage", "leasehold", "inspection"];
const FACT_ORDER: ReportFactKey[] = ["marketValue", "valuationDate", "yearBuilt", "livingArea", "plotArea"];

/** The read Gutachten: file line, key figures, then every subject with its quoted passages. */
export default function ReportResults({ report, labels, locale }: ReportResultsProps) {
  const missingPages = report.pageCount - report.textPageCount;
  const notes = [
    report.droppedAiQuotes > 0 ? fill(labels.Dropped, { count: report.droppedAiQuotes }) : null,
    missingPages > 0 ? fill(labels.ScanWarning, { missing: missingPages }) : null,
  ].filter((note): note is string => note !== null);

  return (
    <div className="flex flex-col gap-6">
      <ReportMeta
        line={fill(labels.Meta, { file: report.fileName, pages: report.pageCount, textPages: report.textPageCount, date: formatDate(report.analyzedAt, locale) })}
        method={report.method === "rules+ai" ? labels.MethodAi : labels.MethodRules}
        notes={notes}
      />
      <ReportFacts title={labels.FactsTitle}>
        {FACT_ORDER.map((key) => {
          const fact = report.facts.find((candidate) => candidate.key === key);
          return (
            <ReportFactRow
              key={key}
              label={labels.Facts[key]}
              value={fact?.value ?? null}
              quote={fact?.quote ?? null}
              pageLabel={fact ? fill(labels.Page, { page: fact.page }) : null}
              notStated={labels.NotStated}
            />
          );
        })}
      </ReportFacts>
      {TOPIC_ORDER.map((topic) => {
        const findings = report.findings.filter((finding) => finding.topic === topic);
        return (
          <ReportTopic key={topic} title={labels.Topics[topic]} count={findings.length} emptyLabel={labels.NothingFound}>
            {findings.map((finding, index) => (
              <ReportFindingItem
                key={`${finding.page}-${index}`}
                kindLabel={labels.Kinds[finding.kind]}
                stance={finding.stance}
                stanceLabel={labels.Stances[finding.stance]}
                quote={finding.quote}
                pageLabel={fill(labels.Page, { page: finding.page })}
                note={finding.note ? `${labels.AiNote} ${finding.note}` : null}
              />
            ))}
          </ReportTopic>
        );
      })}
    </div>
  );
}
