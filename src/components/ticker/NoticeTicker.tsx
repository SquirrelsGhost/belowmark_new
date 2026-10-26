import { ReactNode } from "react";

interface NoticeTickerProps {
  label: string;
  /** <NoticeTickerItem /> elements */
  children: ReactNode;
}

/**
 * Ink band with real hearings scrolling past like a wire feed. Children are
 * rendered twice for a seamless loop; the copy is hidden from assistive tech.
 */
export default function NoticeTicker({ label, children }: NoticeTickerProps) {
  return (
    <section aria-label={label} className="relative border-y-2 border-ink bg-ink text-paper-bright">
      <div className="flex items-stretch">
        <p className="relative z-10 flex shrink-0 items-center gap-2 bg-signal px-4 font-mono text-[11px] font-semibold tracking-[0.18em] uppercase sm:px-6">
          <span className="size-1.5 animate-blink bg-paper-bright" />
          {label}
        </p>
        <div className="min-w-0 flex-1 overflow-hidden mask-fade-x">
          <ul className="flex w-max animate-ticker hover:[animation-play-state:paused]">
            <li className="flex shrink-0">
              <ul className="flex">{children}</ul>
            </li>
            <li aria-hidden="true" className="flex shrink-0">
              <ul className="flex">{children}</ul>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
