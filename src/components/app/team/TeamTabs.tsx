import Link from "next/link";

interface TeamTab {
  href: string;
  label: string;
  isActive: boolean;
}

interface TeamTabsProps {
  label: string;
  tabs: TeamTab[];
}

/** Switch between the team's list and its members. */
export default function TeamTabs({ label, tabs }: TeamTabsProps) {
  return (
    <nav aria-label={label} className="mt-6 flex gap-1 border-b border-rule">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          aria-current={tab.isActive ? "page" : undefined}
          className={`relative px-4 py-2.5 font-narrow text-xs font-semibold tracking-[0.1em] uppercase ${tab.isActive ? "text-ink" : "text-ink-soft hover:text-ink"}`}
        >
          {tab.label}
          <span aria-hidden="true" className={`absolute inset-x-3 -bottom-px h-[3px] ${tab.isActive ? "bg-signal" : "bg-transparent"}`} />
        </Link>
      ))}
    </nav>
  );
}
