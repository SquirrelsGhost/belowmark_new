interface NavigationVerticalLineProps {
  className?: string;
}

const LINE_CLASSES = "mx-2 hidden h-6 w-px bg-rule-strong/40 sm:block";

/** Thin divider between nav groups. */
export default function NavigationVerticalLine({ className }: NavigationVerticalLineProps = {}) {
  return <span aria-hidden="true" className={className ? `${LINE_CLASSES} ${className}` : LINE_CLASSES} />;
}
