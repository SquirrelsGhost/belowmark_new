import Icon from "@/components/ui/Icon";

interface CalendarLinkProps {
  href: string;
  label: string;
}

/** Downloads the hearing as an .ics file — same look as the other actions in the hearing box. */
export default function CalendarLink({ href, label }: CalendarLinkProps) {
  return (
    <a
      href={href}
      download
      className="inline-flex h-11 items-center gap-2 border border-rule-strong bg-paper-bright px-3 font-narrow text-xs font-semibold tracking-[0.08em] uppercase hover:border-ink"
    >
      <Icon name="calendar" className="size-4" />
      {label}
    </a>
  );
}
