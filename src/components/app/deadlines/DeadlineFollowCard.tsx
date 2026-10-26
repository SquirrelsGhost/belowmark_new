import { ReactNode } from "react";

interface DeadlineFollowCardProps {
  title: string;
  reference: string;
  href: string | null;
  openLabel: string;
  /** "Als Nächstes" line, or why there is none */
  next: ReactNode;
  children: ReactNode;
}

/** One followed proceeding on the "Termine" page: what comes next, and its switches. */
export default function DeadlineFollowCard({ title, reference, href, openLabel, next, children }: DeadlineFollowCardProps) {
  return (
    <li className="flex flex-col gap-3 border border-ink/70 bg-paper-bright p-4">
      <div>
        <p className="font-mono text-[11px] text-muted">{reference}</p>
        <h3 className="font-narrow text-lg leading-snug font-bold">{href ? <a href={href} className="underline-offset-4 hover:underline">{title}</a> : title}</h3>
      </div>
      <div className="border-l-4 border-signal pl-3">{next}</div>
      <div className="flex flex-wrap items-center gap-3">
        {children}
        {href && (
          <a href={href} className="font-narrow text-xs font-semibold tracking-[0.1em] uppercase underline-offset-4 hover:underline">
            {openLabel} →
          </a>
        )}
      </div>
    </li>
  );
}
