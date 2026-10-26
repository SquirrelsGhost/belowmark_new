interface StateIndexRowProps {
  name: string;
  code: string;
  hearingsLabel: string;
  /** Bar length relative to the largest state, 0–100; null = no data */
  share: number | null;
  taxLabel: string;
}

/** One state: name, proportional bar (or hatched "no data") and transfer tax. */
export default function StateIndexRow({ name, code, hearingsLabel, share, taxLabel }: StateIndexRowProps) {
  return (
    <tr className="group border-b border-rule transition-colors hover:bg-paper-deep/60">
      <th scope="row" className="w-[38%] py-3 pr-4 font-normal">
        <span className="mr-3 hidden w-7 font-mono sm:inline-block text-[11px] text-muted uppercase">{code}</span>
        <span className="font-narrow text-base font-semibold sm:text-lg">{name}</span>
      </th>
      <td className="py-3 pr-4">
        <div className="flex items-center gap-2 sm:gap-4">
          {share === null ? (
            <span className="h-3 w-8 shrink-0 bg-hatch sm:w-24" />
          ) : (
            // Bar width is a data-driven percentage — inline style is unavoidable here
            <span className="h-3 bg-ink transition-colors group-hover:bg-signal" style={{ width: `max(4px, ${share * 0.7}%)` }} />
          )}
          <span className={`font-mono text-xs sm:text-sm ${share === null ? "text-muted italic" : ""}`}>{hearingsLabel}</span>
        </div>
      </td>
      <td className="py-3 text-right font-mono text-sm">{taxLabel}</td>
    </tr>
  );
}
