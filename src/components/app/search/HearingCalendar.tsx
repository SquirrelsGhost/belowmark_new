import Link from "next/link";
import { ReactNode } from "react";
import { TEXT_LINK_CLASSES } from "@/lib/appStyles";

interface HearingCalendarProps {
  title: string;
  hint: string;
  /** Link that removes the date range; only set while one is active */
  clearHref?: string;
  clearLabel: string;
  children: ReactNode;
}

/**
 * "Sitzungskalender": hearings per week, hanging below the red market line —
 * the longer the bar, the more courts sit that week.
 */
export default function HearingCalendar({ title, hint, clearHref, clearLabel, children }: HearingCalendarProps) {
  return (
    <section aria-label={title} className="mt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="font-narrow text-sm font-bold tracking-[0.12em] uppercase">{title}</h2>
        <p className="font-mono text-[11px] text-muted">
          {hint}
          {clearHref && (
            <Link href={clearHref} className={`${TEXT_LINK_CLASSES} ml-3 text-signal`}>
              {clearLabel}
            </Link>
          )}
        </p>
      </div>
      <div className="relative mt-3 overflow-x-auto pb-1">
        <ol className="relative grid min-w-[640px] grid-cols-12 gap-1 border-t-[3px] border-signal">{children}</ol>
      </div>
    </section>
  );
}
