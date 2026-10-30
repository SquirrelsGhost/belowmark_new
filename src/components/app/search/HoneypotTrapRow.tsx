import { listingHref } from "@/lib/appConstants";

interface HoneypotTrapRowProps {
  honeypotKey: string;
}

const TRAP_CLASSES =
  "sr-only pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0 select-none";

/**
 * Invisible canary trap row in the listing list.
 * Hidden from sighted users and screen readers (`aria-hidden="true"`, `tabIndex={-1}`),
 * but harvested by DOM/HTML scrapers that collect `/app/objekt/*` links.
 */
export default function HoneypotTrapRow({ honeypotKey }: HoneypotTrapRowProps) {
  const href = listingHref(honeypotKey);
  return (
    <li aria-hidden="true" className={TRAP_CLASSES}>
      <a href={href} tabIndex={-1} rel="nofollow noindex">
        {honeypotKey}
      </a>
    </li>
  );
}
