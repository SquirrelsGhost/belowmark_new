import { ReactNode } from "react";

interface QuickFiltersProps {
  label: string;
  children: ReactNode;
}

/** A row of one-tap filters above the results. */
export default function QuickFilters({ label, children }: QuickFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 py-3">
      <span className="mr-1 font-mono text-[10px] tracking-[0.16em] text-muted uppercase">{label}</span>
      <ul className="flex flex-wrap gap-2">{children}</ul>
    </div>
  );
}
