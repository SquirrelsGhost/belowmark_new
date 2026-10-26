import Link from "next/link";
import { ReactNode } from "react";
import { TEXT_LINK_CLASSES } from "@/lib/appStyles";

interface TeamCardProps {
  name: string;
  href: string;
  /** "Deutschland (ZVG) · Ihre Rolle: Admin" */
  meta: string;
  /** "3 Mitglieder · 12 Objekte" */
  counts: string;
  /** Shown when the owner's plan ended */
  pausedLabel?: string;
  openLabel: string;
  /** The status tally */
  children: ReactNode;
}

/** One team on the overview, as a register card. */
export default function TeamCard({ name, href, meta, counts, pausedLabel, openLabel, children }: TeamCardProps) {
  return (
    <li className={`flex flex-col gap-4 border-2 bg-paper-bright p-5 ${pausedLabel ? "border-rule-strong" : "border-ink shadow-[5px_5px_0_0_var(--ink)]"}`}>
      <div>
        <p className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">{meta}</p>
        <h2 className="mt-1 font-narrow text-2xl leading-tight font-bold">
          <Link href={href} className="hover:text-signal">
            {name}
          </Link>
        </h2>
        <p className="mt-1 font-mono text-[11px] text-ink-soft">{counts}</p>
        {pausedLabel && <p className="mt-2 font-mono text-[10px] tracking-wide text-signal uppercase">{pausedLabel}</p>}
      </div>
      {children}
      <Link href={href} className={`${TEXT_LINK_CLASSES} text-ink`}>
        {openLabel} →
      </Link>
    </li>
  );
}
