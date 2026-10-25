import Link from "next/link";

interface NavigationItemProps {
  href: string;
  label: string;
  isActive?: boolean;
}

const ITEM_CLASSES =
  "hidden rounded-full px-3.5 py-2 text-sm text-muted transition-colors duration-200 hover:bg-glass-strong hover:text-ink md:inline-flex";

export default function NavigationItem({ href, label, isActive = false }: NavigationItemProps) {
  return (
    <Link href={href} aria-current={isActive ? "page" : undefined} className={`${ITEM_CLASSES} ${isActive ? "text-ink" : ""}`}>
      {label}
    </Link>
  );
}
