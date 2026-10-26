interface ExposeTextProps {
  text: string;
  /** Printed when the seller wrote nothing; without it an empty text renders nothing */
  missing?: string;
  /** One line per bullet instead of paragraphs */
  asList?: boolean;
}

/** The seller's own text, verbatim: paragraphs at blank lines, or one bullet per line. */
export default function ExposeText({ text, missing, asList = false }: ExposeTextProps) {
  const trimmed = text.trim();
  if (!trimmed) return missing ? <p className="w-fit bg-hatch px-2 py-1 text-[12px] text-muted">{missing}</p> : null;
  if (asList) {
    return (
      <ul className="grid grid-cols-1 gap-x-8 gap-y-1 text-[13px] sm:grid-cols-2 print:grid-cols-2">
        {trimmed.split(/\n+/).map((line) => (
          <li key={line} className="flex gap-2 before:text-signal before:content-['—']">
            {line.trim()}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className="flex flex-col gap-2 font-serif text-[15px] leading-relaxed">
      {trimmed.split(/\n\s*\n/).map((paragraph) => (
        <p key={paragraph} className="whitespace-pre-line">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
