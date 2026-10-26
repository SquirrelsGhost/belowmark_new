import Link from "next/link";
import DeadlineMailSwitch from "@/components/app/deadlines/DeadlineMailSwitch";
import WatchButton from "@/components/app/watchlist/WatchButton";
import { TEXT_LINK_CLASSES } from "@/lib/appStyles";

interface WatchlistItemProps {
  href: string;
  /** e.g. "24.11." and "Di 09:00" */
  dateLabel: string;
  timeLabel: string;
  status: string;
  isImminent: boolean;
  isOver: boolean;
  title: string;
  subtitle: string;
  note: string | null;
  noNoteLabel: string;
  editNoteLabel: string;
  listingId: string;
  watchLabels: { watch: string; unwatch: string; error: string };
  mailReminder?: { isOn: boolean; onLabel: string; offLabel: string; errorLabel: string };
}

/** One stop on the time line: date on the rail, proceeding and own note beside it. */
export default function WatchlistItem(props: WatchlistItemProps) {
  const { href, dateLabel, timeLabel, status, isImminent, isOver, title, subtitle, note, noNoteLabel, editNoteLabel, listingId, watchLabels, mailReminder } = props;
  return (
    <li className="relative grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 border-b border-rule py-5 sm:grid-cols-[7rem_minmax(0,1fr)_auto]">
      <div className="relative border-r-2 border-ink pr-4 text-right">
        <span aria-hidden="true" className={`absolute top-2 -right-[7px] size-3 rounded-full border-2 border-paper ${isImminent ? "bg-signal" : isOver ? "bg-muted" : "bg-ink"}`} />
        <p className={`font-display text-3xl leading-none ${isOver ? "text-muted" : ""}`}>{dateLabel}</p>
        <p className="mt-1 font-mono text-[11px] text-muted">{timeLabel}</p>
        <p className={`mt-1 font-mono text-[10px] tracking-wide uppercase ${isImminent ? "text-signal" : "text-muted"}`}>{status}</p>
      </div>
      <div className="min-w-0">
        <h3 className="font-narrow text-xl leading-tight font-bold">
          <Link href={href} className="hover:text-signal">
            {title}
          </Link>
        </h3>
        <p className="mt-0.5 truncate font-mono text-[11px] text-muted">{subtitle}</p>
        <p className={`mt-3 border-l-2 pl-3 text-sm leading-relaxed whitespace-pre-line ${note ? "border-signal text-ink" : "border-rule text-muted italic"}`}>{note ?? noNoteLabel}</p>
        <Link href={`${href}#listing-note`} className={`${TEXT_LINK_CLASSES} mt-2 inline-block text-ink-soft`}>
          {editNoteLabel} →
        </Link>
      </div>
      <div className="col-start-2 flex flex-wrap items-center gap-2 sm:col-start-auto sm:flex-col sm:items-end">
        {mailReminder && (
          <DeadlineMailSwitch
            listingKey={listingId}
            isOn={mailReminder.isOn}
            onLabel={mailReminder.onLabel}
            offLabel={mailReminder.offLabel}
            errorLabel={mailReminder.errorLabel}
          />
        )}
        <WatchButton listingId={listingId} isSaved watchLabel={watchLabels.watch} unwatchLabel={watchLabels.unwatch} errorLabel={watchLabels.error} />
      </div>
    </li>
  );
}
