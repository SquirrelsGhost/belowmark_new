import Link from "next/link";

interface NavigationMobileItemProps {
  href: string;
  label: string;
  isAccent?: boolean;
}

const BASE = "flex w-full items-center justify-between px-4 py-3 font-narrow text-sm font-semibold tracking-[0.08em] uppercase transition-colors";

export default function NavigationMobileItem({ href, label, isAccent = false }: NavigationMobileItemProps) {
  return (
    <Link
      href={href}
      className={`${BASE} ${isAccent ? "bg-ink text-paper-bright hover:bg-signal" : "text-ink hover:bg-paper-deep"}`}
    >
      <span>{label}</span>
      <span aria-hidden="true" className={isAccent ? "text-signal" : "text-muted"}>→</span>
    </Link>
  );
}
