import { ReactNode } from "react";

interface TeamNoteItemProps {
  author: string;
  date: string;
  body: string;
  /** Delete button where allowed */
  children?: ReactNode;
}

export default function TeamNoteItem({ author, date, body, children }: TeamNoteItemProps) {
  return (
    <li className="border-l-2 border-signal pl-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-mono text-[10px] text-muted">
          <span className="font-semibold text-ink">{author}</span> · {date}
        </p>
        {children}
      </div>
      <p className="mt-1 text-sm leading-relaxed whitespace-pre-line">{body}</p>
    </li>
  );
}
