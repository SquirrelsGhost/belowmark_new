import { fill } from "@/lib/appFormat";
import { LocaleOption } from "@/lib/constants";
import { formatNumber, formatPercent } from "@/lib/format";
import { IClosingTranslation } from "@/translations/closing/IClosingTranslation";
import { PriceStatRow } from "@/types/closing.types";

interface PriceStatsRowViewProps {
  row: PriceStatRow;
  label: string;
  segmentLabel: string;
  labels: IClosingTranslation["Results"];
  minGroup: number;
  locale: LocaleOption;
  isLocked: boolean;
  isTotal?: boolean;
}

const CELL = "px-3 py-2 align-top";

/** One line of the statistics. Below the minimum group only the count is shown. */
export default function PriceStatsRowView({ row, label, segmentLabel, labels, minGroup, locale, isLocked, isTotal = false }: PriceStatsRowViewProps) {
  const isSub = row.segment !== "all";
  const hasFigures = row.medianPct !== null && !isLocked;
  const pct = (value: number | null) => (value === null ? "—" : formatPercent(value, locale));
  return (
    <tr className={isTotal ? "bg-paper-deep font-semibold" : ""}>
      <th scope="row" className={`${CELL} text-left font-normal ${isSub ? "pl-6 text-muted" : ""}`}>
        {isSub ? "" : label}
      </th>
      <td className={CELL}>{segmentLabel}</td>
      <td className={`${CELL} font-mono`}>
        {formatNumber(row.awarded, locale)}
        <span className="block text-[10px] text-muted">
          {labels.Table.Reported}: {formatNumber(row.reported, locale)}
        </span>
      </td>
      {row.medianPct === null ? (
        <td colSpan={3} className={`${CELL} font-mono text-[12px] text-muted`}>
          {fill(labels.TooFew, { n: row.awarded, min: minGroup })}
        </td>
      ) : (
        <>
          <td className={`${CELL} font-mono`}>{hasFigures ? pct(row.medianPct) : "▇▇"}</td>
          <td className={`${CELL} font-mono`}>{hasFigures ? `${pct(row.p25Pct)} – ${pct(row.p75Pct)}` : "▇▇ – ▇▇"}</td>
          <td className={`${CELL} font-mono`}>{hasFigures && row.medianBidders !== null ? formatNumber(row.medianBidders, locale) : "—"}</td>
        </>
      )}
    </tr>
  );
}
