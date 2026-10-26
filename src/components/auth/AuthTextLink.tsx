import Link from "next/link";

interface AuthTextLinkProps {
  href: string;
  label: string;
  /** Opens legal pages in a new tab so a half-filled form is not lost */
  newTab?: boolean;
  size?: "xs" | "sm";
}

const SIZE_CLASSES = { xs: "text-xs", sm: "text-sm" } as const;

/** Inline ink link with the red market-line underline. */
export default function AuthTextLink({ href, label, newTab = false, size = "sm" }: AuthTextLinkProps) {
  return (
    <Link
      href={href}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener" : undefined}
      className={`${SIZE_CLASSES[size]} font-medium text-ink underline decoration-signal decoration-2 underline-offset-4 transition-colors hover:text-signal-deep`}
    >
      {label}
    </Link>
  );
}
