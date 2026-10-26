import { HearingState } from "@/types/listing.types";

interface ListingDateBlockProps {
  day: string;
  month: string;
  weekday: string;
  time: string;
  status: string;
  state: HearingState;
  /** Within the next days — gets the red top edge */
  isImminent: boolean;
}

const STATUS_TONE: Record<HearingState, string> = {
  running: "bg-signal text-paper-bright",
  upcoming: "bg-paper-deep text-ink",
  past: "bg-transparent text-muted",
  cancelled: "bg-transparent text-signal",
  unknown: "bg-transparent text-muted",
};

/** Tear-off calendar sheet: weekday, big day, month, time, and the countdown. */
export default function ListingDateBlock({ day, month, weekday, time, status, state, isImminent }: ListingDateBlockProps) {
  const isOver = state === "past" || state === "cancelled";
  return (
    <div className="flex w-20 shrink-0 flex-col items-stretch sm:w-24">
      <div className={`flex flex-col items-center border border-ink/70 bg-paper-bright pb-1.5 ${isImminent ? "border-t-4 border-t-signal" : "border-t-4 border-t-ink"}`}>
        <span className="pt-1 font-mono text-[10px] tracking-[0.18em] text-muted uppercase">{weekday}</span>
        <span className={`font-display text-4xl leading-[0.95] ${isOver ? "text-muted line-through decoration-2" : ""}`}>{day}</span>
        <span className="font-mono text-[11px] tracking-[0.14em] uppercase">{month}</span>
        <span className="font-mono text-[10px] text-muted">{time}</span>
      </div>
      <span className={`mt-1.5 px-1 py-0.5 text-center font-mono text-[10px] leading-tight tracking-wide uppercase ${STATUS_TONE[state]}`}>{status}</span>
    </div>
  );
}
