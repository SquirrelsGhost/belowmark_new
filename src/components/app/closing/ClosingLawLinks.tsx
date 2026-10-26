import { ClosingLawRef } from "@/types/closing.types";

interface ClosingLawLinksProps {
  label: string;
  laws: ClosingLawRef[];
}

/** The sources of a task, each a link to the official text. */
export default function ClosingLawLinks({ label, laws }: ClosingLawLinksProps) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px]">
      <span className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">{label}</span>
      {laws.map((law) => (
        <a key={law.label} href={law.href} target="_blank" rel="noopener noreferrer" className="underline decoration-rule-strong underline-offset-4 hover:decoration-signal">
          {law.label}
        </a>
      ))}
    </p>
  );
}
