import Reveal from "@/components/ui/Reveal";

interface LimitItemProps {
  index: string;
  title: string;
  body: string;
  delay?: number;
}

/** One known gap in the data, set on a hatched "missing" strip. */
export default function LimitItem({ index, title, body, delay = 0 }: LimitItemProps) {
  return (
    <Reveal delay={delay} className="flex h-full flex-col bg-paper-bright">
      <div className="flex items-center justify-between border-b border-rule bg-hatch px-6 py-3">
        <span className="font-mono text-xs text-muted">— / —</span>
        <span className="font-mono text-xs text-signal">{index}</span>
      </div>
      <div className="flex flex-col gap-3 p-6 sm:p-8">
        <h3 className="font-narrow text-2xl font-semibold">{title}</h3>
        <p className="leading-relaxed text-ink-soft">{body}</p>
      </div>
    </Reveal>
  );
}
