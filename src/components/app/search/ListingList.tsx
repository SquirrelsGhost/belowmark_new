import { ReactNode } from "react";

interface ListingListProps {
  label: string;
  children: ReactNode;
}

/** The ruled list of proceedings. */
export default function ListingList({ label, children }: ListingListProps) {
  return (
    <ol aria-label={label} className="divide-y divide-rule border-b border-rule">
      {children}
    </ol>
  );
}
