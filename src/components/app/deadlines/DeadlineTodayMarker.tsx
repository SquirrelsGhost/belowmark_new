interface DeadlineTodayMarkerProps {
  label: string;
}

/** The red market line, here as "today" between what is done and what is ahead. */
export default function DeadlineTodayMarker({ label }: DeadlineTodayMarkerProps) {
  return (
    <li aria-label={label} className="relative z-10 -ml-1 mb-6 flex items-center gap-2">
      <span className="h-[3px] w-6 bg-signal" />
      <span className="font-mono text-[10px] font-semibold tracking-[0.18em] text-signal uppercase">{label}</span>
      <span className="h-[3px] flex-1 bg-signal/40" />
    </li>
  );
}
