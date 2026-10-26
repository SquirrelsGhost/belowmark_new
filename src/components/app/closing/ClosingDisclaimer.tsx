interface ClosingDisclaimerProps {
  text: string;
}

/** What the list is not: legal advice. Always above the tasks, never in small print at the end. */
export default function ClosingDisclaimer({ text }: ClosingDisclaimerProps) {
  return <p className="mt-6 max-w-3xl border-l-4 border-caution bg-caution/10 px-4 py-3 text-sm leading-relaxed">{text}</p>;
}
