import { ReactNode } from "react";

interface TeamEmptyProps {
  title: string;
  body: string;
  /** Optional call to action below the text */
  children?: ReactNode;
}

/** Empty state of the team pages: say how it fills up. */
export default function TeamEmpty({ title, body, children }: TeamEmptyProps) {
  return (
    <div className="mt-10 flex flex-col items-start gap-4 border-2 border-dashed border-ink/50 px-6 py-10">
      <p className="font-display text-4xl">{title}</p>
      <p className="max-w-xl text-sm leading-relaxed text-ink-soft">{body}</p>
      {children}
    </div>
  );
}
