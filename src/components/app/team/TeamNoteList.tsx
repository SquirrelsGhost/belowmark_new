import { ReactNode } from "react";

interface TeamNoteListProps {
  title: string;
  emptyLabel: string;
  isEmpty: boolean;
  children: ReactNode;
}

/** The team's notes on one proceeding, oldest first like a file. */
export default function TeamNoteList({ title, emptyLabel, isEmpty, children }: TeamNoteListProps) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">{title}</h4>
      {isEmpty ? <p className="text-sm text-muted italic">{emptyLabel}</p> : <ol className="flex flex-col gap-3">{children}</ol>}
    </div>
  );
}
