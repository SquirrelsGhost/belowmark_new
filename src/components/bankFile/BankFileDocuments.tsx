interface BankFileDocumentsProps {
  lead: string;
  groups: { title: string; items: string[] }[];
}

/** The papers a bank usually asks for, as boxes to tick by hand. */
export default function BankFileDocuments({ lead, groups }: BankFileDocumentsProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[12px] leading-snug text-ink-soft">{lead}</p>
      <div className="grid grid-cols-2 gap-6">
        {groups.map((group) => (
          <div key={group.title}>
            <p className="mb-1 font-narrow text-xs font-bold tracking-[0.12em] uppercase">{group.title}</p>
            <ul className="flex flex-col">
              {group.items.map((item) => (
                <li key={item} className="flex items-start gap-2 border-b border-rule py-1 text-[12px] leading-snug">
                  <span aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 border border-ink" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
