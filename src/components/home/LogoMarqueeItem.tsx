interface LogoMarqueeItemProps {
  name: string;
  /** Typeface style of the wordmark, for visual variety */
  style?: "sans" | "serif" | "mono";
}

const STYLE_CLASSES: Record<NonNullable<LogoMarqueeItemProps["style"]>, string> = {
  sans: "font-sans font-semibold tracking-tight",
  serif: "font-serif italic text-3xl",
  mono: "font-mono font-medium uppercase tracking-widest text-lg",
};

/** Placeholder wordmark — swap for real customer logos (SVG) later. */
export default function LogoMarqueeItem({ name, style = "sans" }: LogoMarqueeItemProps) {
  return (
    <span className={`text-2xl whitespace-nowrap text-subtle transition-colors duration-300 hover:text-ink ${STYLE_CLASSES[style]}`}>
      {name}
    </span>
  );
}
