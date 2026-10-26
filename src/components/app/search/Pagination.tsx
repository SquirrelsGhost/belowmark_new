import Link from "next/link";

interface PaginationProps {
  label: string;
  pageLabel: string;
  previousLabel: string;
  nextLabel: string;
  previousHref?: string;
  nextHref?: string;
}

const LINK_CLASSES = "border border-rule-strong px-4 py-2 font-narrow text-xs font-semibold tracking-[0.1em] uppercase hover:bg-ink hover:text-paper-bright";
const DISABLED_CLASSES = "border border-rule px-4 py-2 font-narrow text-xs font-semibold tracking-[0.1em] text-muted uppercase";

/** Previous / next with the page count in between. */
export default function Pagination({ label, pageLabel, previousLabel, nextLabel, previousHref, nextHref }: PaginationProps) {
  return (
    <nav aria-label={label} className="mt-6 flex items-center justify-between gap-4">
      {previousHref ? <Link href={previousHref} className={LINK_CLASSES}>← {previousLabel}</Link> : <span className={DISABLED_CLASSES}>← {previousLabel}</span>}
      <span className="font-mono text-xs text-muted">{pageLabel}</span>
      {nextHref ? <Link href={nextHref} className={LINK_CLASSES}>{nextLabel} →</Link> : <span className={DISABLED_CLASSES}>{nextLabel} →</span>}
    </nav>
  );
}
