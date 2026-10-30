import Link from "next/link";
import { ReactNode } from "react";

interface AccountOverviewTileProps {
  label: string;
  /** Main line, e.g. the plan or the invoice number */
  children: ReactNode;
  link: { href: string; label: string };
}

/** One box of "Auf einen Blick": label, the fact, a way in. */
export default function AccountOverviewTile({ label, children, link }: AccountOverviewTileProps) {
  return (
    <div className="flex flex-col gap-3 bg-paper-bright p-4">
      <p className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">{label}</p>
      <div className="flex-1 text-sm leading-relaxed text-ink">{children}</div>
      <Link
        href={link.href}
        className="group inline-flex items-center gap-2 font-narrow text-sm font-semibold tracking-[0.08em] text-ink uppercase underline-offset-4 hover:underline"
      >
        {link.label}
        <span aria-hidden="true" className="text-signal transition-transform duration-200 group-hover:translate-x-1">→</span>
      </Link>
    </div>
  );
}
