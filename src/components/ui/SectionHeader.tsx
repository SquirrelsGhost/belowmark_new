import Reveal from "@/components/ui/Reveal";

interface SectionHeaderProps {
  /** Paragraph-style section number, e.g. "03" */
  number: string;
  eyebrow: string;
  title: string;
  description?: string;
  /** Light text for sections on ink background */
  inverted?: boolean;
}

/**
 * Section intro styled like a legal paragraph: "§ 03 — EYEBROW" over a
 * hairline, then a condensed headline with the red market line beneath it.
 */
export default function SectionHeader({ number, eyebrow, title, description, inverted = false }: SectionHeaderProps) {
  const ruleColor = inverted ? "border-paper/30" : "border-rule-strong";
  const muted = inverted ? "text-paper/60" : "text-muted";

  return (
    <Reveal className="grid gap-8 lg:grid-cols-12">
      <div className={`flex items-baseline justify-between border-t pt-3 font-mono text-xs tracking-wider uppercase lg:col-span-12 ${ruleColor} ${muted}`}>
        <span>§ {number} — {eyebrow}</span>
        <span aria-hidden="true">Belowmark</span>
      </div>
      <h2 className="font-display text-[clamp(2.6rem,6.5vw,5.75rem)] leading-[0.88] text-balance lg:col-span-8">{title}</h2>
      {description && (
        <div className="flex flex-col justify-end gap-4 lg:col-span-4">
          <span aria-hidden="true" className="block h-1 w-16 bg-signal" />
          <p className={`max-w-sm text-base leading-relaxed text-pretty ${muted}`}>{description}</p>
        </div>
      )}
    </Reveal>
  );
}
