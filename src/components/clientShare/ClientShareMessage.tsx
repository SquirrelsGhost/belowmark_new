interface ClientShareMessageProps {
  title: string;
  message: string;
}

/** The broker's own words to the client, set apart as a note — never mixed with sourced facts. */
export default function ClientShareMessage({ title, message }: ClientShareMessageProps) {
  return (
    <aside aria-label={title} className="break-inside-avoid border-l-4 border-(--brand-accent) bg-paper px-4 py-3">
      <p className="font-narrow text-xs font-bold tracking-[0.12em] uppercase">{title}</p>
      <p className="mt-1 text-sm leading-relaxed whitespace-pre-line">{message}</p>
    </aside>
  );
}
