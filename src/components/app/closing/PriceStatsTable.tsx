import PriceStatsRowView from "@/components/app/closing/PriceStatsRowView";
import { LocaleOption } from "@/lib/constants";
import { SegmentKey } from "@/lib/snapshot";
import { IClosingTranslation } from "@/translations/closing/IClosingTranslation";
import { PriceStats } from "@/types/closing.types";

interface PriceStatsTableProps {
  stats: PriceStats;
  labels: IClosingTranslation["Results"];
  segments: Record<SegmentKey, string>;
  locale: LocaleOption;
  /** Free plan: counts are shown, the price figures are not */
  isLocked: boolean;
}

const HEAD_CLASSES = "px-3 py-2 text-left font-mono text-[10px] font-normal tracking-[0.14em] text-muted uppercase";

/** Zuschlag in % of the Verkehrswert per region and object type. */
export default function PriceStatsTable({ stats, labels, segments, locale, isLocked }: PriceStatsTableProps) {
  if (stats.total.reported === 0) return <p className="border border-dashed border-rule-strong p-5 text-sm leading-relaxed text-ink-soft">{labels.Empty}</p>;
  const { Table } = labels;
  return (
    <div className="flex flex-col gap-3">
      {isLocked && <p className="border-l-4 border-signal pl-3 text-sm">{labels.Locked}</p>}
      <div className="overflow-x-auto border border-ink/70 bg-paper-bright">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead className="border-b-2 border-ink">
            <tr>
              <th scope="col" className={HEAD_CLASSES}>{Table.Region}</th>
              <th scope="col" className={HEAD_CLASSES}>{Table.Segment}</th>
              <th scope="col" className={HEAD_CLASSES}>{Table.Awarded}</th>
              <th scope="col" className={HEAD_CLASSES}>{Table.Median}</th>
              <th scope="col" className={HEAD_CLASSES}>{Table.Range}</th>
              <th scope="col" className={HEAD_CLASSES}>{Table.Bidders}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">
            <PriceStatsRowView row={stats.total} label={labels.Total} segmentLabel={labels.AllSegments} labels={labels} minGroup={stats.minGroup} locale={locale} isLocked={isLocked} isTotal />
            {stats.rows.map((row) => (
              <PriceStatsRowView
                key={`${row.regionCode ?? "-"}-${row.segment}`}
                row={row}
                label={row.regionName}
                segmentLabel={row.segment === "all" ? labels.AllSegments : segments[row.segment]}
                labels={labels}
                minGroup={stats.minGroup}
                locale={locale}
                isLocked={isLocked}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
