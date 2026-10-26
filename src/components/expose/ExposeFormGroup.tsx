import { ReactNode } from "react";

interface ExposeFormGroupProps {
  title: string;
  children: ReactNode;
}

/** A titled block of the exposé form, three columns wide on larger screens. */
export default function ExposeFormGroup({ title, children }: ExposeFormGroupProps) {
  return (
    <fieldset className="border-t border-rule pt-3">
      <legend className="pr-2 font-narrow text-xs font-bold tracking-[0.12em] uppercase">{title}</legend>
      <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3">{children}</div>
    </fieldset>
  );
}
