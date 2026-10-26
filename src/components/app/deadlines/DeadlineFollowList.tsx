import { ReactNode } from "react";

interface DeadlineFollowListProps {
  label: string;
  children: ReactNode;
}

export default function DeadlineFollowList({ label, children }: DeadlineFollowListProps) {
  return (
    <ul aria-label={label} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {children}
    </ul>
  );
}
