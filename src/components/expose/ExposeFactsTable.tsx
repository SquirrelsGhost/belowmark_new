import BidderFileRow from "@/components/bidderFile/BidderFileRow";
import { fill } from "@/lib/appFormat";
import { IExposeTranslation } from "@/translations/expose/IExposeTranslation";
import { ExposeFactLine, ExposeFactSource } from "@/types/expose.types";

interface ExposeFactsTableProps {
  lines: ExposeFactLine[];
  /** Further rows only the seller can give (condition, use …), already worded */
  extra: { label: string; value: string | null }[];
  reportDate: string | null;
  labels: IExposeTranslation["Facts"];
}

/** "Gutachten · S. 4 · Stichtag 12.03.2023" — the source as it is printed under a value. */
function sourceNote(source: ExposeFactSource, page: number | undefined, reportDate: string | null, labels: IExposeTranslation["Facts"]): string {
  const parts = [labels.Sources[source]];
  if (source === "report" && page) parts.push(fill(labels.ReportPage, { page }));
  if (source === "report" && reportDate) parts.push(fill(labels.ReportDate, { date: reportDate }));
  return parts.join(" · ");
}

/** The object's facts with their source; a differing value of another source is printed underneath. */
export default function ExposeFactsTable({ lines, extra, reportDate, labels }: ExposeFactsTableProps) {
  return (
    <dl className="grid grid-cols-1 gap-x-8 divide-y divide-rule sm:grid-cols-2 print:grid-cols-2">
      {lines.map((line) => {
        const note = line.source ? sourceNote(line.source, line.page, reportDate, labels) : undefined;
        const other =
          line.otherValue && line.otherSource
            ? fill(labels.Other, { source: sourceNote(line.otherSource, line.otherPage, reportDate, labels), value: line.otherValue })
            : null;
        return <BidderFileRow key={line.key} label={labels.Labels[line.key]} value={line.value} missing={labels.Missing} note={[note, other].filter(Boolean).join(" — ")} />;
      })}
      {extra.map((row) => (
        <BidderFileRow key={row.label} label={row.label} value={row.value} missing={labels.Missing} note={row.value ? labels.Sources.own : undefined} />
      ))}
    </dl>
  );
}
