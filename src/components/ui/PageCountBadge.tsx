interface PageCountBadgeProps {
  label: string;
}

/** Monospace item count shown in a page header aside slot. */
export default function PageCountBadge({ label }: PageCountBadgeProps) {
  return <span className="font-mono text-xs text-muted">{label}</span>;
}
