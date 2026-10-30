import { ReactNode } from "react";

interface PageSectionProps {
  label: string;
  children: ReactNode;
}

/** Accessible labeled content region that prevents grid blowout. */
export default function PageSection({ label, children }: PageSectionProps) {
  return (
    <section aria-label={label} className="min-w-0">
      {children}
    </section>
  );
}
