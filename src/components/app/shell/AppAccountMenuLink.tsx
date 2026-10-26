import Link from "next/link";

interface AppAccountMenuLinkProps {
  href: string;
  label: string;
  /** Ledger number shown before the label, e.g. "01" */
  index: string;
}

/** One row of the account dropdown, numbered like a form field. */
export default function AppAccountMenuLink({ href, label, index }: AppAccountMenuLinkProps) {
  return (
    <Link
      href={href}
      className="group/link flex items-center gap-3 px-4 py-2.5 text-sm text-ink transition-colors hover:bg-paper focus-visible:bg-paper focus-visible:outline-none"
    >
      <span className="font-mono text-[10px] text-signal">{index}</span>
      <span className="flex-1">{label}</span>
      <span aria-hidden="true" className="text-muted transition-transform group-hover/link:translate-x-0.5">
        →
      </span>
    </Link>
  );
}
