import Link from "next/link";
import Icon from "@/components/ui/Icon";

interface ButtonProps {
  /** Text displayed inside the button */
  label: string;
  /** Renders a link instead of a <button> when set */
  href?: string;
  /** Click handler (only for <button>) */
  onClick?: () => void;
  /** Visual variant */
  variant?: "ink" | "signal" | "outline" | "paper";
  /** Size scale */
  size?: "sm" | "md" | "lg";
  /** Shows a trailing arrow that slides on hover */
  withArrow?: boolean;
  /** Stretches to the container width */
  fullWidth?: boolean;
  /** Disables the button and shows reduced opacity */
  disabled?: boolean;
  /** Accessible type attribute */
  type?: "button" | "submit" | "reset";
}

const BASE_CLASSES = [
  "group relative inline-flex items-center justify-center gap-3 whitespace-nowrap",
  "font-narrow font-semibold uppercase tracking-[0.08em]",
  "transition-[background-color,color,box-shadow,transform] duration-200 ease-out",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal",
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
].join(" ");

const VARIANT_CLASSES: Record<NonNullable<ButtonProps["variant"]>, string> = {
  ink: "bg-ink text-paper-bright shadow-[4px_4px_0_0_var(--signal)] hover:shadow-[6px_6px_0_0_var(--signal)] hover:-translate-x-0.5 hover:-translate-y-0.5",
  signal: "bg-signal text-paper-bright shadow-[4px_4px_0_0_var(--ink)] hover:shadow-[6px_6px_0_0_var(--ink)] hover:-translate-x-0.5 hover:-translate-y-0.5",
  outline: "border border-rule-strong text-ink hover:bg-ink hover:text-paper-bright",
  paper: "bg-paper-bright text-ink shadow-[4px_4px_0_0_var(--signal)] hover:shadow-[6px_6px_0_0_var(--signal)]",
};

const SIZE_CLASSES: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-base",
};

const ARROW_CLASSES = "size-4 transition-transform duration-200 group-hover:translate-x-1";

/**
 * Hard-edged button with an offset "stamp" shadow. Renders a Next.js <Link>
 * when `href` is given.
 *
 * @example
 * <Button label="Zugang testen" href="/signup" variant="signal" withArrow />
 */
export default function Button({
  label,
  href,
  onClick,
  variant = "ink",
  size = "md",
  withArrow = false,
  fullWidth = false,
  disabled = false,
  type = "button",
}: ButtonProps) {
  const className = [BASE_CLASSES, VARIANT_CLASSES[variant], SIZE_CLASSES[size], fullWidth ? "w-full" : ""].join(" ");
  const content = (
    <>
      <span>{label}</span>
      {withArrow && <Icon name="arrowRight" className={ARROW_CLASSES} />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={className}>
      {content}
    </button>
  );
}
