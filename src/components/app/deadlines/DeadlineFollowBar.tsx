import { ReactNode } from "react";

interface DeadlineFollowBarProps {
  status: string;
  isFollowing: boolean;
  children: ReactNode;
}

/** Follow state and the actions next to it: follow, mail switch, calendar download. */
export default function DeadlineFollowBar({ status, isFollowing, children }: DeadlineFollowBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-y border-rule py-3">
      <span className={`font-mono text-[11px] tracking-[0.1em] uppercase ${isFollowing ? "text-verdict" : "text-muted"}`}>{status}</span>
      <span className="flex-1" />
      {children}
    </div>
  );
}
