interface InvoiceDownloadLinkProps {
  href: string;
  label: string;
  /** "Rechnung BM-2026-00001 als PDF herunterladen" */
  ariaLabel: string;
}

/** Plain download link: the route answers with the PDF as an attachment. */
export default function InvoiceDownloadLink({ href, label, ariaLabel }: InvoiceDownloadLinkProps) {
  return (
    <a
      href={href}
      download
      aria-label={ariaLabel}
      className="group inline-flex h-9 w-fit items-center gap-2 bg-ink px-3 font-narrow text-xs font-semibold tracking-[0.1em] text-paper-bright uppercase shadow-[3px_3px_0_0_var(--signal)] transition-[box-shadow,transform] hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_0_var(--signal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" strokeWidth={2.2}>
        <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14" />
      </svg>
      {label}
    </a>
  );
}
