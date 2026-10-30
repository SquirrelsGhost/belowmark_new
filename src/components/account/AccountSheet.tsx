import { ReactNode } from "react";

interface AccountSheetProps {
  /** <AccountPanel /> elements */
  children: ReactNode;
}

/** Right-hand column of the account page: the panels of the chosen section. */
export default function AccountSheet({ children }: AccountSheetProps) {
  return <div className="grid gap-12 lg:col-span-8 lg:col-start-5 xl:col-span-7 xl:col-start-6">{children}</div>;
}
