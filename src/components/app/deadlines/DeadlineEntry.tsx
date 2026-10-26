import DeadlineLawTag from "@/components/app/deadlines/DeadlineLawTag";

interface DeadlineEntryProps {
  when: string;
  /** "heute" / "in 5 Tagen" / "vorbei" */
  distance: string;
  kind: string;
  title: string;
  detail: string;
  law: Parameters<typeof DeadlineLawTag>[0]["law"];
  basisLabel: string;
  /** "Erinnerung: 7 Tage vorher · am Tag", null when none */
  reminders: string | null;
  isPast: boolean;
  isSoon: boolean;
  /** Only deadlines are marked in signal red */
  isDeadline: boolean;
  href?: string;
}

const KIND_CLASSES = "font-mono text-[10px] tracking-[0.16em] uppercase";

/** One dated step on the timeline: date, how far away, what to do, and on which law it rests. */
export default function DeadlineEntry({ when, distance, kind, title, detail, law, basisLabel, reminders, isPast, isSoon, isDeadline, href }: DeadlineEntryProps) {
  const dot = isPast ? "border-rule-strong bg-paper" : isDeadline ? "border-signal bg-signal" : "border-ink bg-paper-bright";
  return (
    <li className={`relative grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-3 pb-6 last:pb-0 ${isPast ? "opacity-55" : ""}`}>
      <span aria-hidden="true" className={`relative z-10 mt-1 size-3.5 rounded-full border-2 ${dot}`} />
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-mono text-[13px] font-semibold text-ink">{when}</span>
          <span className={`${KIND_CLASSES} ${isSoon && !isPast ? "text-signal" : "text-muted"}`}>{distance}</span>
          <span className={`${KIND_CLASSES} text-muted`}>· {kind}</span>
        </div>
        <h4 className="mt-1 font-narrow text-base leading-snug font-bold tracking-[0.02em]">
          {href ? (
            <a href={href} className="underline-offset-4 hover:underline">
              {title}
            </a>
          ) : (
            title
          )}
        </h4>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-soft">{detail}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <DeadlineLawTag law={law} basisLabel={basisLabel} />
          {reminders && <span className="font-mono text-[10px] text-muted">{reminders}</span>}
        </div>
      </div>
    </li>
  );
}
