import { ReactNode } from "react";

interface TeamStackProps {
  label?: string;
  children: ReactNode;
}

/** A plain vertical list of rows or cards. */
export default function TeamStack({ label, children }: TeamStackProps) {
  return (
    <ul aria-label={label} className="mt-4 flex flex-col gap-3">
      {children}
    </ul>
  );
}
