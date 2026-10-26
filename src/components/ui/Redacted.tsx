interface RedactedProps {
  /** Screen-reader text, e.g. "geschwärzt" */
  label: string;
  /** Visual width of the bar */
  width?: "xs" | "sm" | "md" | "lg";
}

const WIDTH_CLASSES: Record<NonNullable<RedactedProps["width"]>, string> = {
  xs: "w-10",
  sm: "w-16",
  md: "w-24",
  lg: "w-36",
};

/** Black redaction bar — values that are only visible with access. */
export default function Redacted({ label, width = "md" }: RedactedProps) {
  return (
    <span className={`inline-block h-[0.95em] translate-y-[0.1em] -rotate-[0.6deg] bg-ink align-baseline ${WIDTH_CLASSES[width]}`}>
      <span className="sr-only">{label}</span>
    </span>
  );
}
