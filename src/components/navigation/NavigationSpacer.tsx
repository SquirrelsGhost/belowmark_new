interface NavigationSpacerProps {
  className?: string;
}

/** Pushes the following nav children to the right edge. */
export default function NavigationSpacer({ className }: NavigationSpacerProps = {}) {
  return <span aria-hidden="true" className={className ? `flex-1 ${className}` : "flex-1"} />;
}
