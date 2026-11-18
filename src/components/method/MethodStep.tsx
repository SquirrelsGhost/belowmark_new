import Reveal from "@/components/ui/Reveal";

interface MethodStepProps {
  number: string;
  kicker: string;
  title: string;
  body: string;
  /** Marks the uncomfortable step in signal red */
  isHighlighted?: boolean;
  delay?: number;
}

export default function MethodStep({ number, kicker, title, body, isHighlighted = false, delay = 0 }: MethodStepProps) {
  return (
    <li className="border-b border-paper/25 last:border-b-0 md:border-r md:border-b-0 md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
      <Reveal delay={delay} className="flex h-full flex-col gap-5 py-10">
        <span
          className={`font-display text-[7rem] leading-[0.8] ${isHighlighted ? "text-signal" : "text-transparent [-webkit-text-stroke:1.5px_var(--paper-bright)]"}`}
        >
          {number}
        </span>
        <span className={`font-mono text-xs tracking-[0.2em] uppercase ${isHighlighted ? "text-signal" : "text-paper/60"}`}>
          § {number} · {kicker}
        </span>
        <h3 className="font-narrow text-2xl leading-tight font-semibold md:min-h-[3.75rem]">{title}</h3>
        <p className="leading-relaxed text-paper/70">{body}</p>
      </Reveal>
    </li>
  );
}
