import Link from "next/link";

interface NavigationItemProps {
  href: string;
  label: string;
  isActive?: boolean;
}

const ITEM_CLASSES =
  "relative hidden shrink-0 whitespace-nowrap px-2.5 py-2 font-narrow text-sm font-medium uppercase tracking-[0.06em] text-ink-soft transition-colors duration-200 hover:text-ink lg:inline-flex xl:px-3 xl:tracking-[0.08em] after:absolute after:inset-x-2.5 after:bottom-1 after:h-[2px] after:origin-left after:scale-x-0 after:bg-signal after:transition-transform after:duration-300 hover:after:scale-x-100 xl:after:inset-x-3";

export default function NavigationItem({ href, label, isActive = false }: NavigationItemProps) {
  return (
    <Link href={href} aria-current={isActive ? "page" : undefined} className={ITEM_CLASSES}>
      {label}
    </Link>
  );
}
