import { ReactNode } from "react";

interface TeamInviteRowProps {
  /** "max@example.de · als Mitglied · gültig bis 02.11.2026" */
  line: string;
  by: string;
  /** Withdraw button */
  children: ReactNode;
}

/** An open invitation as the team's managers see it. */
export default function TeamInviteRow({ line, by, children }: TeamInviteRowProps) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 border-b border-rule py-3">
      <div className="min-w-0">
        <p className="truncate font-mono text-[12px] text-ink">{line}</p>
        <p className="font-mono text-[10px] text-muted">{by}</p>
      </div>
      {children}
    </li>
  );
}
