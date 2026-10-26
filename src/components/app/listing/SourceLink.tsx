import Icon from "@/components/ui/Icon";

interface SourceLinkProps {
  href: string;
  label: string;
  /** Host shown on the right, so people see where they are going */
  host?: string;
  isPrimary?: boolean;
  /** Same-site download (calendar file) instead of an external page */
  isDownload?: boolean;
}

/** A row link to an official page or a download. */
export default function SourceLink({ href, label, host, isPrimary = false, isDownload = false }: SourceLinkProps) {
  return (
    <a
      href={href}
      {...(isDownload ? { download: true } : { target: "_blank", rel: "noreferrer" })}
      className={`group flex items-center justify-between gap-3 px-1 py-3 ${isPrimary ? "font-semibold text-signal" : "text-ink"} hover:bg-paper-bright`}
    >
      <span className="text-sm">{label}</span>
      <span className="flex items-center gap-2 font-mono text-[11px] text-muted">
        {host}
        <Icon name={isDownload ? "file" : "arrowUpRight"} className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </a>
  );
}
