interface ClientSharePrivacyProps {
  title: string;
  items: string[];
}

/** What a client link stores and what it does not — said plainly next to the list. */
export default function ClientSharePrivacy({ title, items }: ClientSharePrivacyProps) {
  return (
    <aside aria-label={title} className="flex flex-col gap-2 border-l-4 border-ink bg-paper-bright px-4 py-3">
      <p className="font-narrow text-xs font-bold tracking-[0.12em] uppercase">{title}</p>
      <ul className="flex list-disc flex-col gap-1 pl-4 text-[13px] leading-snug text-ink-soft">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}
