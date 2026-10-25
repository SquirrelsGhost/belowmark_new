import { ReactNode } from "react";

interface FooterColumnProps {
  title: string;
  /** <FooterLink /> elements */
  children: ReactNode;
}

export default function FooterColumn({ title, children }: FooterColumnProps) {
  return (
    <div>
      <h3 className="text-xs font-medium tracking-[0.18em] text-subtle uppercase">{title}</h3>
      <ul className="mt-5 flex flex-col gap-3">{children}</ul>
    </div>
  );
}
