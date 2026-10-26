import { ReactNode } from "react";

interface TeamMemberRowProps {
  name: string;
  email: string;
  role: string;
  /** "seit 26.10.2026" */
  joined: string;
  isYou: boolean;
  youLabel: string;
  /** Role form, remove and handover buttons — only where the viewer may */
  children?: ReactNode;
}

/** One person in the team. */
export default function TeamMemberRow({ name, email, role, joined, isYou, youLabel, children }: TeamMemberRowProps) {
  return (
    <li className="flex flex-wrap items-start justify-between gap-4 border-b border-rule py-4">
      <div className="min-w-0">
        <p className="font-narrow text-lg leading-tight font-bold">
          {name}
          {isYou && <span className="ml-2 bg-ink px-1.5 py-0.5 align-middle font-mono text-[9px] tracking-[0.12em] text-paper-bright uppercase">{youLabel}</span>}
        </p>
        <p className="truncate font-mono text-[11px] text-ink-soft">{email}</p>
        <p className="mt-1 font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
          {role} · {joined}
        </p>
      </div>
      {children && <div className="flex flex-wrap items-start gap-2">{children}</div>}
    </li>
  );
}
