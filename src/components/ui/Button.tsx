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
  /** Stretches to the container width and allows long labels to wrap cleanly */
  fullWidth?: boolean;
  /** Disables the button and shows reduced opacity */
  disabled?: boolean;
  /** Accessible type attribute */
  type?: "button" | "submit" | "reset";
}

const BASE_CLASSES = [
  "group relative inline-flex max-w-full items-center justify-center gap-2.5 sm:gap-3",
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

const INLINE_SIZE_CLASSES: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 px-3.5 text-xs whitespace-nowrap sm:px-4",
  md: "h-11 px-5 text-sm whitespace-nowrap",
  lg: "min-h-14 px-6 py-3 text-base whitespace-normal text-center leading-tight sm:px-7",
};

const FULL_SIZE_CLASSES: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "min-h-9 w-full px-4 py-2 text-xs whitespace-normal text-center leading-snug",
  md: "min-h-11 w-full px-5 py-2.5 text-sm whitespace-normal text-center leading-snug",
  lg: "min-h-14 w-full px-4 py-3.5 text-sm whitespace-normal text-center leading-tight sm:px-6 sm:text-base",
};

const ARROW_CLASSES = "size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1";

/**
 * Hard-edged button with an offset "stamp" shadow. Renders a Next.js <Link>
 * when `href` is given. Full-width buttons wrap multi-word CTA labels cleanly
 * so long localized texts never overflow mobile or card containers.
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
  const sizeClass = fullWidth ? FULL_SIZE_CLASSES[size] : INLINE_SIZE_CLASSES[size];
  const className = [BASE_CLASSES, VARIANT_CLASSES[variant], sizeClass].join(" ");
  const content = (
    <>
      <span className="min-w-0 wrap-break-word">{label}</span>
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
