import Icon from "@/components/ui/Icon";

interface VerdictSourceTagProps {
  label: string;
  /** Official notice or statute; null for the Gutachten and the bidder's own input */
  href: string | null;
}

const TAG_CLASSES = "inline-flex items-center gap-1 border border-rule-strong px-1.5 py-0.5 font-mono text-[10px] tracking-[0.1em] uppercase";

/** Where one reason comes from — linked when the source is public. */
export default function VerdictSourceTag({ label, href }: VerdictSourceTagProps) {
  if (!href) return <span className={`${TAG_CLASSES} text-ink-soft`}>{label}</span>;
  return (
    <a href={href} target="_blank" rel="noreferrer" className={`${TAG_CLASSES} text-signal hover:bg-signal/10`}>
      {label}
      <Icon name="arrowUpRight" className="size-3" />
    </a>
  );
}
