import Link from "next/link";

interface FooterLinkProps {
  href: string;
  label: string;
}

export default function FooterLink({ href, label }: FooterLinkProps) {
  return (
    <li>
      <Link href={href} className="text-sm text-muted transition-colors duration-200 hover:text-ink">
        {label}
      </Link>
    </li>
  );
}
