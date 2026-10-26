import { ReactNode } from "react";

interface TeamInvitationCardProps {
  teamName: string;
  /** "Ayşe lädt Sie als Mitglied ein · Deutschland (ZVG)" */
  line: string;
  expires: string;
  /** Accept / decline buttons */
  children: ReactNode;
}

/** An open invitation addressed to the signed-in person. */
export default function TeamInvitationCard({ teamName, line, expires, children }: TeamInvitationCardProps) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-4 border-2 border-dashed border-signal bg-paper-bright px-5 py-4">
      <div className="min-w-0">
        <p className="font-narrow text-xl font-bold">{teamName}</p>
        <p className="text-sm text-ink-soft">{line}</p>
        <p className="font-mono text-[10px] text-muted">{expires}</p>
      </div>
      <div className="flex flex-wrap items-start gap-2">{children}</div>
    </li>
  );
}
