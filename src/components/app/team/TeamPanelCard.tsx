import Link from "next/link";
import { ReactNode } from "react";
import { TEXT_LINK_CLASSES } from "@/lib/appStyles";

interface TeamPanelCardProps {
  teamName: string;
  teamHref: string;
  openLabel: string;
  /** Paused / read-only line */
  notice?: string;
  children: ReactNode;
}

/** One team's view of this proceeding on the Aktenblatt. */
export default function TeamPanelCard({ teamName, teamHref, openLabel, notice, children }: TeamPanelCardProps) {
  return (
    <article className="flex flex-col gap-4 border-2 border-ink bg-paper-bright p-5">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-narrow text-xl font-bold">{teamName}</h3>
        <Link href={teamHref} className={`${TEXT_LINK_CLASSES} text-ink-soft`}>
          {openLabel} →
        </Link>
      </header>
      {notice && <p className="font-mono text-[10px] tracking-wide text-signal uppercase">{notice}</p>}
      {children}
    </article>
  );
}
