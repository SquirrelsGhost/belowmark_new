interface DeadlineNextLineProps {
  label: string;
  when: string;
  distance: string;
  title: string;
  source: string | null;
}

/** "Als Nächstes · Mo, 02.11.2026 · in 7 Tagen — Sicherheit per Überweisung …" */
export default function DeadlineNextLine({ label, when, distance, title, source }: DeadlineNextLineProps) {
  return (
    <div>
      <p className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
        {label} · <span className="text-signal">{distance}</span>
      </p>
      <p className="mt-0.5 font-mono text-[13px] font-semibold">{when}</p>
      <p className="text-sm leading-snug">{title}</p>
      {source && <p className="mt-0.5 font-mono text-[10px] text-muted">{source}</p>}
    </div>
  );
}
