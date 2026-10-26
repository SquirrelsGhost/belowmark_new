import { ReactNode } from "react";

interface TeamCardListProps {
  label: string;
  children: ReactNode;
}

export default function TeamCardList({ label, children }: TeamCardListProps) {
  return (
    <ul aria-label={label} className="mt-8 grid gap-6 md:grid-cols-2">
      {children}
    </ul>
  );
}
