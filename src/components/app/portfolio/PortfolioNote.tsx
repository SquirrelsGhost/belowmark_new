interface PortfolioNoteProps {
  text: string;
}

/** A plain remark above the board, e.g. that saved proceedings dropped out of the data. */
export default function PortfolioNote({ text }: PortfolioNoteProps) {
  return <p className="mt-6 border-l-4 border-caution bg-caution/10 px-3 py-2 text-sm leading-snug text-caution">{text}</p>;
}
