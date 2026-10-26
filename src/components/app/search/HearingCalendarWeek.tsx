import Link from "next/link";

interface HearingCalendarWeekProps {
  href: string;
  /** e.g. "KW 44" */
  weekLabel: string;
  /** e.g. "26.10." */
  dateLabel: string;
  count: number;
  /** 0–1, share of the busiest week */
  share: number;
  isSelected: boolean;
  isCurrent: boolean;
  selectedLabel: string;
}

/** Bar heights are steps so the strip stays crisp (no fractional pixels). */
const STEPS = ["h-1", "h-3", "h-5", "h-7", "h-9", "h-11", "h-13", "h-15", "h-17", "h-19", "h-21"] as const;

/** One week of the hearing calendar: a bar hanging from the market line plus its count. */
export default function HearingCalendarWeek({ href, weekLabel, dateLabel, count, share, isSelected, isCurrent, selectedLabel }: HearingCalendarWeekProps) {
  const height = count === 0 ? "h-0" : STEPS[Math.max(1, Math.round(share * (STEPS.length - 1)))];
  const barTone = isSelected ? "bg-signal" : isCurrent ? "bg-ink" : "bg-ink/75 group-hover:bg-signal/80";

  return (
    <li>
      <Link
        href={href}
        aria-current={isSelected ? "true" : undefined}
        aria-label={`${weekLabel}, ${dateLabel}: ${count}${isSelected ? `, ${selectedLabel}` : ""}`}
        className={`group flex h-full flex-col items-stretch px-0.5 pb-1 ${isSelected ? "bg-signal/10" : "hover:bg-paper-deep"}`}
      >
        <span aria-hidden="true" className="flex h-[5.5rem] items-start justify-center">
          <span className={`w-full max-w-10 transition-[height,background-color] duration-300 ${height} ${barTone}`} />
        </span>
        <span className={`text-center font-mono text-[13px] font-semibold ${count === 0 ? "text-muted" : "text-ink"}`}>{count}</span>
        <span className={`text-center font-mono text-[10px] tracking-wider uppercase ${isCurrent ? "text-signal" : "text-muted"}`}>{weekLabel}</span>
        <span className="text-center font-mono text-[10px] text-muted">{dateLabel}</span>
      </Link>
    </li>
  );
}
