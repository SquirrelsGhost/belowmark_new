import { ReactNode } from "react";

interface BidLimitInputGroupProps {
  title: string;
  children: ReactNode;
}

/** A ruled block of inputs with a small caps heading, like a section of a paper form. */
export default function BidLimitInputGroup({ title, children }: BidLimitInputGroupProps) {
  return (
    <fieldset className="border-t border-rule pt-3">
      <legend className="pr-2 font-narrow text-xs font-bold tracking-[0.14em] uppercase">{title}</legend>
      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}
