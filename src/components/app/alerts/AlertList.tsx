import { ReactNode } from "react";

interface AlertListProps {
  label: string;
  children: ReactNode;
}

export default function AlertList({ label, children }: AlertListProps) {
  return (
    <ul aria-label={label} className="mt-10 grid gap-6 md:grid-cols-2">
      {children}
    </ul>
  );
}
