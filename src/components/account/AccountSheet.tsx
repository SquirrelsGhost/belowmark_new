import { ReactNode } from "react";

interface AccountSheetProps {
  /** <AccountPanel /> elements */
  children: ReactNode;
}

/** Right-hand column of the account page. */
export default function AccountSheet({ children }: AccountSheetProps) {
  return <div className="grid gap-12 lg:col-span-7 lg:col-start-6 xl:col-span-6 xl:col-start-7">{children}</div>;
}
