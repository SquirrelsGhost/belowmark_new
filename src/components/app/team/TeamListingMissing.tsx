import { ReactNode } from "react";

interface TeamListingMissingProps {
  listingId: string;
  message: string;
  /** Remove button */
  children?: ReactNode;
}

/** A key on the team's list that the current data no longer has. */
export default function TeamListingMissing({ listingId, message, children }: TeamListingMissingProps) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 border-b border-rule py-4">
      <div className="min-w-0">
        <p className="truncate font-mono text-[11px] text-ink">{listingId}</p>
        <p className="text-sm text-muted">{message}</p>
      </div>
      {children}
    </li>
  );
}
