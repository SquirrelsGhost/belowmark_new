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
  variant?: "primary" | "secondary" | "ghost";
  /** Size scale */
  size?: "sm" | "md" | "lg";
  /** Shows a trailing arrow that nudges on hover */
  withArrow?: boolean;
  /** Disables the button and shows reduced opacity */
  disabled?: boolean;
  /** Accessible type attribute */
  type?: "button" | "submit" | "reset";
}

const BASE_CLASSES = [
  "group relative inline-flex items-center justify-center gap-2 rounded-full",
  "font-medium tracking-tight whitespace-nowrap",
  "transition-all duration-300 ease-out",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
  "disabled:pointer-events-none disabled:opacity-50",
].join(" ");

const VARIANT_CLASSES: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-ink text-canvas shadow-[0_0_0_1px_var(--line-strong),0_8px_32px_-8px_var(--iris)] hover:shadow-[0_0_0_1px_var(--line-strong),0_12px_48px_-6px_var(--iris)] hover:-translate-y-px",
  secondary:
    "border border-line-strong bg-glass text-ink backdrop-blur-xl hover:bg-glass-strong hover:border-ink/25",
  ghost: "text-muted hover:text-ink",
};

const SIZE_CLASSES: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-7 text-base",
};

const ARROW_CLASSES = "size-4 transition-transform duration-300 group-hover:translate-x-0.5";

/**
 * Generic Button primitive. Renders a Next.js <Link> when `href` is given.
 *
 * @example
 * <Button label="Sign in" variant="primary" href="/login" withArrow />
 */
export default function Button({
  label,
  href,
  onClick,
  variant = "primary",
  size = "md",
  withArrow = false,
  disabled = false,
  type = "button",
}: ButtonProps) {
  const className = [BASE_CLASSES, VARIANT_CLASSES[variant], SIZE_CLASSES[size]].join(" ");
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
