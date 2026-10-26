import Link from "next/link";
import { ReactNode } from "react";

interface PortfolioObjectCellProps {
  href: string;
  title: string;
  subtitle: string;
  /** Hearing date and countdown */
  meta: string;
  /** Status select and, for won objects, the Zuschlag fields */
  children: ReactNode;
}

/** First column: which object, where it is heard, and its status. */
export default function PortfolioObjectCell({ href, title, subtitle, meta, children }: PortfolioObjectCellProps) {
  return (
    <th scope="row" className="sticky left-0 z-10 min-w-56 bg-paper-bright sm:min-w-72 p-3 text-left align-top font-normal">
      <Link href={href} className="font-narrow text-base leading-tight font-bold hover:text-signal">
        {title}
      </Link>
      <span className="mt-0.5 block font-mono text-[11px] text-muted">{subtitle}</span>
      <span className="mt-0.5 block font-mono text-[11px] text-ink-soft">{meta}</span>
      {children}
    </th>
  );
}
