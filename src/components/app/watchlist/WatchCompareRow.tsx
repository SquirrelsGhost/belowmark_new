import Redacted from "@/components/ui/Redacted";
import { CompareCell } from "@/lib/compareRows";

interface WatchCompareRowProps {
  label: string;
  cells: CompareCell[];
  isHighlight: boolean;
  bestLabel: string;
  notStated: string;
  isLocked: boolean;
  lockedLabel: string;
}

/** One figure across all compared proceedings; the cheapest entry gets the red line. */
export default function WatchCompareRow({ label, cells, isHighlight, bestLabel, notStated, isLocked, lockedLabel }: WatchCompareRowProps) {
  return (
    <tr className={isHighlight ? "bg-paper-deep/60" : undefined}>
      <th scope="row" className="sticky left-0 z-10 bg-paper-bright p-3 font-mono text-[10px] font-normal tracking-[0.14em] text-muted uppercase">
        {label}
      </th>
      {cells.map((cell, index) => (
        <td key={index} className={`border-l border-rule p-3 align-top ${cell.isMoney ? "font-mono" : ""} ${isHighlight ? "font-semibold" : ""}`}>
          {cell.isMoney && isLocked && cell.text !== null ? (
            <Redacted label={lockedLabel} width="sm" />
          ) : cell.text === null ? (
            <span className="text-muted">{notStated}</span>
          ) : (
            <span className={cell.isBest ? "border-b-2 border-signal text-signal" : undefined}>{cell.text}</span>
          )}
          {cell.isBest && !isLocked && <span className="mt-1 block font-mono text-[10px] tracking-wide text-signal uppercase">{bestLabel}</span>}
        </td>
      ))}
    </tr>
  );
}
