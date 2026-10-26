interface BidderFileNoteProps {
  note: string | null;
  empty: string;
}

/** The private note from the watch list, as written. */
export default function BidderFileNote({ note, empty }: BidderFileNoteProps) {
  if (!note?.trim()) return <p className="text-[13px] text-muted">{empty}</p>;
  return <p className="border-l-4 border-rule-strong pl-3 font-serif text-[14px] leading-relaxed whitespace-pre-line italic">{note}</p>;
}
