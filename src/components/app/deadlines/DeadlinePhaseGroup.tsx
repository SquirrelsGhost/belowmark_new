import { ReactNode } from "react";

interface DeadlinePhaseGroupProps {
  title: string;
  children: ReactNode;
}

/** One phase of the timeline (before, hearing, after) with the vertical rule its entries hang on. */
export default function DeadlinePhaseGroup({ title, children }: DeadlinePhaseGroupProps) {
  return (
    <div>
      <h3 className="mb-3 border-b border-ink pb-1 font-narrow text-xs font-bold tracking-[0.16em] uppercase">{title}</h3>
      <ol className="relative before:absolute before:top-2 before:bottom-2 before:left-[0.4rem] before:w-px before:bg-rule-strong">{children}</ol>
    </div>
  );
}
