import { LegalSection } from "@/types/legal.types";

interface LegalContentsProps {
  label: string;
  sections: LegalSection[];
}

/** Sticky table of contents beside the text (large screens only). */
export default function LegalContents({ label, sections }: LegalContentsProps) {
  return (
    <nav aria-label={label} className="hidden lg:block">
      <p className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">{label}</p>
      <ol className="mt-3 border-t border-rule">
        {sections.map((section) => (
          <li key={section.id} className="border-b border-rule">
            <a href={`#${section.id}`} className="block py-2 text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline">
              {section.heading}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
