import { Fragment } from "react";

interface LegalGapTextProps {
  text: string;
}

const GAP_SPLIT = /(⟨[^⟩]*⟩)/;

/** Paragraph text with every open gap ⟨…⟩ printed in signal red, so nothing unfinished looks final. */
export default function LegalGapText({ text }: LegalGapTextProps) {
  return (
    <>
      {text.split(GAP_SPLIT).map((part, index) =>
        part.startsWith("⟨") ? (
          <mark key={index} className="bg-signal/10 px-0.5 font-mono text-[0.92em] text-signal-deep">
            {part}
          </mark>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}
