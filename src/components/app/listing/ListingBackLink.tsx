import Link from "next/link";
import { APP_ROUTES } from "@/lib/appConstants";

interface ListingBackLinkProps {
  label: string;
}

/** Back to the board (keeps it simple: the board remembers nothing, the URL does). */
export default function ListingBackLink({ label }: ListingBackLinkProps) {
  return (
    <Link href={APP_ROUTES.search} className="mt-6 inline-flex items-center gap-2 font-narrow text-xs font-semibold tracking-[0.1em] text-ink-soft uppercase hover:text-signal">
      ← {label}
    </Link>
  );
}
