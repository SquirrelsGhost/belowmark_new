interface PseoStatsBannerProps {
  stats: ReadonlyArray<{ label: string; value: string; accent?: boolean }>;
}

export default function PseoStatsBanner({ stats }: PseoStatsBannerProps) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-4 border-2 border-ink bg-paper-bright p-5 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="border-l-2 border-ink pl-3.5">
          <span className="block font-mono text-[11px] uppercase tracking-wider text-ink-soft">{s.label}</span>
          <span
            className={`mt-1 block font-display text-2xl sm:text-3xl ${
              s.accent ? "text-signal" : "text-ink"
            }`}
          >
            {s.value}
          </span>
        </div>
      ))}
    </div>
  );
}
