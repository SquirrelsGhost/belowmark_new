import Icon from "@/components/ui/Icon";

interface DeadlineCalendarLinkProps {
  href: string;
  label: string;
  /** Plain text link instead of the boxed button */
  variant?: "button" | "text";
}

/** Downloads the deadlines as an .ics file with the reminder alarms in it. */
export default function DeadlineCalendarLink({ href, label, variant = "button" }: DeadlineCalendarLinkProps) {
  const classes =
    variant === "button"
      ? "inline-flex h-10 items-center gap-2 border border-rule-strong bg-paper-bright px-3 font-narrow text-xs font-semibold tracking-[0.08em] uppercase hover:border-ink"
      : "inline-flex items-center gap-1.5 font-narrow text-xs font-semibold tracking-[0.1em] uppercase underline-offset-4 hover:underline";
  return (
    <a href={href} download className={classes}>
      <Icon name="calendar" className="size-4" />
      {label}
    </a>
  );
}
