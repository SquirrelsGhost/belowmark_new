import { ReactNode } from "react";

interface AccountPanelProps {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}

/** One block on the account sheet, separated by a heavy rule. */
export default function AccountPanel({ id, title, description, children }: AccountPanelProps) {
  return (
    <section aria-labelledby={`${id}-title`} className="border-t-2 border-ink pt-5">
      <h2 id={`${id}-title`} className="font-display text-3xl leading-none">{title}</h2>
      {description && <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">{description}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}
