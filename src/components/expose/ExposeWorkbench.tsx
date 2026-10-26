import { ReactNode } from "react";

interface ExposeWorkbenchProps {
  children: ReactNode;
}

/** Screen-only column above the sheet: form, photos, checks. Never printed. */
export default function ExposeWorkbench({ children }: ExposeWorkbenchProps) {
  return <div className="mx-auto mb-6 flex max-w-[210mm] flex-col gap-4 print:hidden">{children}</div>;
}
