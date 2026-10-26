import Link from "next/link";

interface SortLinkProps {
  href: string;
  label: string;
  isActive: boolean;
}

/** One sort option; the active one is set in ink. */
export default function SortLink({ href, label, isActive }: SortLinkProps) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "true" : undefined}
      className={`px-2 py-1 font-narrow text-xs font-semibold tracking-[0.06em] uppercase ${isActive ? "bg-ink text-paper-bright" : "text-ink-soft hover:bg-paper-deep hover:text-ink"}`}
    >
      {label}
    </Link>
  );
}
