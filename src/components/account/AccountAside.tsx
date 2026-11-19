import { ReactNode } from "react";

interface AccountAsideProps {
  /** <AccountHeader /> and <AccountSectionNav /> */
  children: ReactNode;
}

/** Left column of the account page; stays in view on wide screens while the sheet scrolls. */
export default function AccountAside({ children }: AccountAsideProps) {
  return <aside className="grid min-w-0 gap-8 lg:sticky lg:top-24 lg:col-span-4">{children}</aside>;
}
