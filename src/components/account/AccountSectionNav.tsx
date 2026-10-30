import { ReactNode } from "react";

interface AccountSectionNavProps {
  label: string;
  /** <AccountSectionNavItem /> elements */
  children: ReactNode;
}

/** Index of the account sections, numbered like the paragraphs of a notice. */
export default function AccountSectionNav({ label, children }: AccountSectionNavProps) {
  return (
    <nav aria-label={label}>
      <ol className="grid grid-cols-2 gap-px border border-rule bg-rule lg:grid-cols-1 lg:border-0 lg:border-t-2 lg:border-ink lg:bg-transparent">
        {children}
      </ol>
    </nav>
  );
}
