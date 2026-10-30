import { ReactNode } from "react";

interface PageMainProps {
  id: string;
  children: ReactNode;
}

/** Primary main landmark for composed full-bleed pages. */
export default function PageMain({ id, children }: PageMainProps) {
  return <main id={id}>{children}</main>;
}
