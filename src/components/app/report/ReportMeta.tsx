interface ReportMetaProps {
  line: string;
  method: string;
  /** Extra notes: dropped quotes, pages without text */
  notes: string[];
}

/** Which file was read, how, and what could not be read. */
export default function ReportMeta({ line, method, notes }: ReportMetaProps) {
  return (
    <div className="flex flex-col gap-1 border-y border-rule py-2 font-mono text-[11px] text-ink-soft">
      <p className="break-all">{line}</p>
      <p>{method}</p>
      {notes.map((note) => (
        <p key={note} className="text-caution">{note}</p>
      ))}
    </div>
  );
}
