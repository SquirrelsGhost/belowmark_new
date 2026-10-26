import Link from "next/link";
import { ReactNode } from "react";
import { TEXT_LINK_CLASSES } from "@/lib/appStyles";

interface AlertCardProps {
  name: string;
  summary: string[];
  isActive: boolean;
  statusLabel: string;
  /** e.g. "12 offene Treffer" */
  matches: string;
  /** Which mails the alert sends, e.g. "Neue Verfahren · Terminänderungen" */
  notifies: string;
  /** Last mail and last check */
  meta: string;
  searchHref: string;
  searchLabel: string;
  /** Pause / resume / delete buttons */
  children: ReactNode;
}

/** One saved search as a register card: name, filters, state, and what to do with it. */
export default function AlertCard({ name, summary, isActive, statusLabel, matches, notifies, meta, searchHref, searchLabel, children }: AlertCardProps) {
  return (
    <li className={`border-2 bg-paper-bright p-5 ${isActive ? "border-ink shadow-[5px_5px_0_0_var(--ink)]" : "border-rule-strong"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={`font-mono text-[10px] tracking-[0.16em] uppercase ${isActive ? "text-verdict" : "text-muted"}`}>
            <span aria-hidden="true" className={`mr-1.5 inline-block size-2 rounded-full ${isActive ? "bg-verdict" : "bg-muted"}`} />
            {statusLabel}
          </p>
          <h2 className={`mt-1 font-narrow text-2xl leading-tight font-bold ${isActive ? "" : "text-ink-soft"}`}>{name}</h2>
        </div>
        <p className="font-display text-3xl leading-none text-signal">{matches}</p>
      </div>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {summary.map((part) => (
          <li key={part} className="border border-rule-strong px-2 py-0.5 font-mono text-[11px] text-ink-soft">
            {part}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-ink-soft">{notifies}</p>
      <p className="mt-1 font-mono text-[10px] text-muted">{meta}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-rule pt-4">
        <Link href={searchHref} className={`${TEXT_LINK_CLASSES} text-ink`}>
          {searchLabel} →
        </Link>
        <span className="flex-1" />
        {children}
      </div>
    </li>
  );
}
