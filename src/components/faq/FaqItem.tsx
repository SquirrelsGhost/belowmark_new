import Icon from "@/components/ui/Icon";

interface FaqItemProps {
  index: number;
  question: string;
  answer: string;
  sources: string[];
  sourceLabel: string;
}

/** Native <details> accordion — works without JavaScript. */
export default function FaqItem({ index, question, answer, sources, sourceLabel }: FaqItemProps) {
  return (
    <details className="group border-b border-rule">
      <summary className="flex cursor-pointer items-start gap-5 py-6 transition-colors hover:text-signal">
        <span className="mt-1 w-8 shrink-0 font-mono text-xs text-muted">{String(index).padStart(2, "0")}</span>
        <span className="flex-1 font-narrow text-xl leading-snug font-semibold sm:text-2xl">{question}</span>
        <Icon name="plus" className="mt-1 size-5 shrink-0 transition-transform duration-300 group-open:rotate-45" />
      </summary>
      <div className="grid gap-4 pb-8 pl-[3.25rem]">
        <p className="max-w-2xl leading-relaxed text-ink-soft">{answer}</p>
        <p className="flex flex-wrap items-center gap-2 font-mono text-[11px] tracking-wider text-muted uppercase">
          {sourceLabel}
          {sources.map((source) => (
            <span key={source} className="border border-ink px-2 py-0.5 text-ink">
              {source}
            </span>
          ))}
        </p>
      </div>
    </details>
  );
}
