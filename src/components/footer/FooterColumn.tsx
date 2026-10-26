import { ReactNode } from "react";

interface FooterColumnProps {
  title: string;
  /** <FooterLink /> elements */
  children: ReactNode;
}

export default function FooterColumn({ title, children }: FooterColumnProps) {
  return (
    <div>
      <h3 className="border-b border-paper/20 pb-2 font-mono text-[11px] tracking-[0.18em] text-paper/50 uppercase">{title}</h3>
      <ul className="mt-4 flex flex-col gap-2.5">{children}</ul>
    </div>
  );
}
