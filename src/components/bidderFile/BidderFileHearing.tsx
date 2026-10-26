interface BidderFileHearingProps {
  when: string;
  status: string;
  rounds: string[];
  notes: string[];
}

/** The date in large type, every round, and what to have with you on the day — each with its legal basis. */
export default function BidderFileHearing({ when, status, rounds, notes }: BidderFileHearingProps) {
  return (
    <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6">
      <div>
        <p className="font-mono text-lg font-semibold">{when}</p>
        <p className="mt-1 inline-block bg-paper-deep px-1.5 py-0.5 font-mono text-[10px] tracking-wide uppercase">{status}</p>
        {rounds.length > 1 && (
          <ul className="mt-2 flex flex-col gap-0.5 font-mono text-[11px] text-ink-soft">
            {rounds.map((round) => (
              <li key={round}>{round}</li>
            ))}
          </ul>
        )}
      </div>
      <ol className="flex list-decimal flex-col gap-1.5 pl-4 text-[12px] leading-snug marker:font-mono marker:text-signal">
        {notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ol>
    </div>
  );
}
