interface TeamHintProps {
  text: string;
}

/** Small muted explanation next to a control. */
export default function TeamHint({ text }: TeamHintProps) {
  return <p className="max-w-md font-mono text-[10px] leading-relaxed text-muted">{text}</p>;
}
