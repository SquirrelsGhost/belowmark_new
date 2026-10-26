import Link from "next/link";

interface ClosingListingLinkProps {
  href: string;
  label: string;
}

/** Back to the Aktenblatt of the proceeding the list belongs to. */
export default function ClosingListingLink({ href, label }: ClosingListingLinkProps) {
  return (
    <Link href={href} className="mt-6 inline-flex items-center gap-2 font-narrow text-xs font-semibold tracking-[0.1em] text-ink-soft uppercase hover:text-signal">
      ← {label}
    </Link>
  );
}
