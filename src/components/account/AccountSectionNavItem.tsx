import Link from "next/link";

interface AccountSectionNavItemProps {
  href: string;
  /** "1" — printed as "§ 1" */
  number: string;
  title: string;
  hint: string;
  isActive: boolean;
}

const BASE = "group relative flex h-full flex-col gap-1 px-4 py-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-signal lg:border-b lg:border-rule lg:py-4 lg:pl-5";
const ACTIVE = "bg-paper-bright text-ink";
const IDLE = "bg-paper text-ink-soft hover:bg-paper-bright hover:text-ink lg:bg-transparent";

/** One section link; the current one carries the red market line on its edge. */
export default function AccountSectionNavItem({ href, number, title, hint, isActive }: AccountSectionNavItemProps) {
  return (
    <li>
      <Link href={href} aria-current={isActive ? "page" : undefined} className={`${BASE} ${isActive ? ACTIVE : IDLE}`}>
        <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-[3px] transition-colors ${isActive ? "bg-signal" : "bg-transparent group-hover:bg-rule-strong/40"}`} />
        <span className="flex items-baseline gap-2">
          <span className="shrink-0 font-mono text-[11px] whitespace-nowrap text-signal">§ {number}</span>
          <span className="font-narrow text-base leading-tight font-semibold tracking-[0.04em] uppercase sm:text-lg">{title}</span>
        </span>
        <span className="font-mono text-[11px] tracking-[0.06em] text-muted">{hint}</span>
      </Link>
    </li>
  );
}
