import Link from "next/link";
import { ReactNode } from "react";
import { TeamStatus } from "@/lib/team/teamConfig";
import { STATUS_TONES } from "@/lib/team/teamStyles";

interface TeamListingRowProps {
  href: string;
  /** e.g. "24 Nov" and "Di 09:00 · 2026" */
  dateLabel: string;
  timeLabel: string;
  hearingLabel: string;
  isOver: boolean;
  title: string;
  subtitle: string;
  status: TeamStatus;
  /** "Besichtigen · gesetzt von Ayşe, 26.10.2026" */
  statusLine: string;
  /** "3 Notizen" */
  notesLabel: string;
  lastNote: { byline: string; body: string } | null;
  /** Status picker and remove button */
  children: ReactNode;
}

/** One proceeding on the team's list: date rail, the agreed status, the latest note. */
export default function TeamListingRow(props: TeamListingRowProps) {
  const { href, dateLabel, timeLabel, hearingLabel, isOver, title, subtitle, status, statusLine, notesLabel, lastNote, children } = props;
  const tone = STATUS_TONES[status];
  return (
    <li className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 border-b border-rule py-5 sm:grid-cols-[7rem_minmax(0,1fr)]">
      <div className="border-r-2 border-ink pr-4 text-right">
        <p className={`font-display text-3xl leading-none ${isOver ? "text-muted" : ""}`}>{dateLabel}</p>
        <p className="mt-1 font-mono text-[11px] text-muted">{timeLabel}</p>
        <p className="mt-1 font-mono text-[10px] tracking-wide text-muted uppercase">{hearingLabel}</p>
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        <div>
          <h3 className={`font-narrow text-xl leading-tight font-bold ${status === "verworfen" ? "text-ink-soft line-through decoration-1" : ""}`}>
            <Link href={href} className="hover:text-signal">
              {title}
            </Link>
          </h3>
          <p className="mt-0.5 truncate font-mono text-[11px] text-muted">{subtitle}</p>
        </div>
        <p className={`flex items-center gap-1.5 font-mono text-[11px] ${tone.text}`}>
          <span aria-hidden="true" className={`size-2 rounded-full ${tone.dot}`} />
          {statusLine}
        </p>
        {lastNote ? (
          <blockquote className="border-l-2 border-signal pl-3 text-sm leading-relaxed">
            <p className="line-clamp-3 whitespace-pre-line">{lastNote.body}</p>
            <footer className="mt-1 font-mono text-[10px] text-muted">
              {lastNote.byline} · {notesLabel}
            </footer>
          </blockquote>
        ) : (
          <p className="border-l-2 border-rule pl-3 text-sm text-muted italic">{notesLabel}</p>
        )}
        <div className="flex flex-wrap items-start gap-3 pt-1">{children}</div>
      </div>
    </li>
  );
}
