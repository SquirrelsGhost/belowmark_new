import { ReactNode } from "react";

interface AccountDetailsProps {
  /** <AccountDetailRow /> elements */
  children: ReactNode;
}

/** Ledger-style list of account facts. */
export default function AccountDetails({ children }: AccountDetailsProps) {
  return <dl className="border-t border-rule">{children}</dl>;
}
