import { ReactNode } from "react";

interface AppPageHeaderProps {
  eyebrow: string;
  title: string;
  lead?: string;
  /** Right-hand side, e.g. a count or an export button */
  aside?: ReactNode;
}

/**
 * Page title in the notice style: the heading sits on top of the red market
 * line, the explanation below it.
 */
export default function AppPageHeader({ eyebrow, title, lead, aside }: AppPageHeaderProps) {
  return (
    <header className="pt-8 sm:pt-10">
      <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">{eyebrow}</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-5xl leading-[0.85] sm:text-7xl">{title}</h1>
        {aside}
      </div>
      <div aria-hidden="true" className="mt-4 h-[3px] origin-left animate-draw bg-signal" />
      {lead && <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-ink-soft">{lead}</p>}
    </header>
  );
}
