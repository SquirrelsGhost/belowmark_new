import Icon from "@/components/ui/Icon";

interface BidderFileButtonProps {
  href: string;
  label: string;
  hint: string;
}

/** Opens the printable bidder file in a new tab, where the print dialog saves it as PDF. */
export default function BidderFileButton({ href, label, hint }: BidderFileButtonProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={href}
        target="_blank"
        rel="noopener"
        className="group inline-flex h-11 items-center gap-3 bg-signal px-5 font-narrow text-sm font-semibold tracking-[0.08em] text-paper-bright uppercase shadow-[4px_4px_0_0_var(--ink)] transition-[box-shadow,transform] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--ink)]"
      >
        <Icon name="file" className="size-4" />
        {label}
      </a>
      <p className="max-w-sm text-xs leading-snug text-muted">{hint}</p>
    </div>
  );
}
