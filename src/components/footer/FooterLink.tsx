import Link from "next/link";

interface FooterLinkProps {
  href: string;
  label: string;
  /** Opens in a new tab (official sources) */
  isExternal?: boolean;
}

export default function FooterLink({ href, label, isExternal = false }: FooterLinkProps) {
  return (
    <li>
      <Link
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="text-sm text-paper/80 underline-offset-4 transition-colors hover:text-paper-bright hover:underline"
      >
        {label}
        {isExternal && <span aria-hidden="true"> ↗</span>}
      </Link>
    </li>
  );
}
