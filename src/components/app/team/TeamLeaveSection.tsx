import { ReactNode } from "react";

interface TeamLeaveSectionProps {
  title: string;
  body: string;
  /** Leave button, or the owner's hint when leaving is not possible */
  children: ReactNode;
}

/** "Team verlassen" with what happens to your data. */
export default function TeamLeaveSection({ title, body, children }: TeamLeaveSectionProps) {
  return (
    <section aria-label={title} className="mt-12 flex max-w-xl flex-col items-start gap-3 border border-rule-strong bg-paper-bright p-5">
      <h3 className="font-narrow text-lg font-bold">{title}</h3>
      <p className="text-sm leading-relaxed text-ink-soft">{body}</p>
      {children}
    </section>
  );
}
