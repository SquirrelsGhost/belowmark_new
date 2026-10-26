import { ReactNode } from "react";

interface TeamListingProps {
  label: string;
  /** Without the heavy top rule, e.g. right under a section title */
  isFlush?: boolean;
  children: ReactNode;
}

export default function TeamListing({ label, isFlush = false, children }: TeamListingProps) {
  return (
    <ul aria-label={label} className={isFlush ? "mt-2" : "mt-6 border-t-2 border-ink"}>
      {children}
    </ul>
  );
}
