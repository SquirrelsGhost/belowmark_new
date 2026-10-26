import { ReactNode } from "react";

interface ShareListProps {
  title: string;
  usage: string;
  note: string;
  /** <ShareCard /> elements */
  children: ReactNode;
}

/** The broker's client links, newest first, with the open-link count. */
export default function ShareList({ title, usage, note, children }: ShareListProps) {
  return (
    <section aria-label={title} className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b-2 border-ink pb-2">
        <h2 className="font-display text-3xl">{title}</h2>
        <p className="font-mono text-[11px] text-muted">{usage}</p>
      </div>
      <ul className="flex flex-col gap-3">{children}</ul>
      <p className="text-[12px] text-muted">{note}</p>
    </section>
  );
}
