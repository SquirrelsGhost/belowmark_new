interface NavigationSkipLinkProps {
  label: string;
  targetId: string;
}

/** Keyboard users jump past the masthead straight to the content. */
export default function NavigationSkipLink({ label, targetId }: NavigationSkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-signal focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-paper-bright"
    >
      {label}
    </a>
  );
}
