import { ReactNode } from "react";

interface NoticeFieldProps {
  label: string;
  children: ReactNode;
}

/** Label/value pair on the notice card. */
export default function NoticeField({ label, children }: NoticeFieldProps) {
  return (
    <div className="border-b border-rule py-2.5">
      <dt className="font-mono text-[10px] tracking-wider text-muted uppercase">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium">{children}</dd>
    </div>
  );
}
