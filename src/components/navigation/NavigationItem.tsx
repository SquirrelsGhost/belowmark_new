import Link from "next/link";

interface NavigationItemProps {
  href: string;
  label: string;
  isActive?: boolean;
}

const ITEM_CLASSES =
  "relative hidden px-3 py-2 font-narrow text-sm font-medium uppercase tracking-[0.08em] text-ink-soft transition-colors duration-200 hover:text-ink lg:inline-flex after:absolute after:inset-x-3 after:bottom-1 after:h-[2px] after:origin-left after:scale-x-0 after:bg-signal after:transition-transform after:duration-300 hover:after:scale-x-100";

export default function NavigationItem({ href, label, isActive = false }: NavigationItemProps) {
  return (
    <Link href={href} aria-current={isActive ? "page" : undefined} className={ITEM_CLASSES}>
      {label}
    </Link>
  );
}
