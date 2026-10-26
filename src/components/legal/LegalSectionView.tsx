import LegalGapText from "@/components/legal/LegalGapText";
import { LegalSection } from "@/types/legal.types";

interface LegalSectionViewProps {
  section: LegalSection;
}

/** One numbered clause: heading on a heavy rule, facts as a ledger, then the paragraphs. */
export default function LegalSectionView({ section }: LegalSectionViewProps) {
  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-24 border-t-2 border-ink pt-5">
      <h2 id={`${section.id}-title`} className="font-narrow text-xl leading-tight font-semibold">{section.heading}</h2>
      {section.facts && (
        <dl className="mt-4 border-t border-rule">
          {section.facts.map((fact) => (
            <div key={fact.label} className="grid gap-1 border-b border-rule py-2.5 sm:grid-cols-[14rem_1fr] sm:gap-6">
              <dt className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase">{fact.label}</dt>
              <dd className="text-sm text-ink">
                <LegalGapText text={fact.value} />
              </dd>
            </div>
          ))}
        </dl>
      )}
      <div className="mt-4 grid gap-3 text-[15px] leading-relaxed text-ink-soft">
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 80)} className="text-pretty">
            <LegalGapText text={paragraph} />
          </p>
        ))}
      </div>
    </section>
  );
}
