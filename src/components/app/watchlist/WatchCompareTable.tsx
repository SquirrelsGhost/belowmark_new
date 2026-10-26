import Link from "next/link";
import { ReactNode } from "react";

interface CompareColumn {
  key: string;
  href: string;
  title: string;
  /** Map stamp above the name */
  locator: ReactNode;
}

interface WatchCompareTableProps {
  title: string;
  columns: CompareColumn[];
  children: ReactNode;
}

/** Saved proceedings side by side; the first column stays put while the rest scroll. */
export default function WatchCompareTable({ title, columns, children }: WatchCompareTableProps) {
  return (
    <section aria-label={title} className="mt-8">
      <h2 className="font-narrow text-sm font-bold tracking-[0.12em] uppercase">{title}</h2>
      <div className="mt-3 overflow-x-auto border-2 border-ink bg-paper-bright">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b-2 border-ink">
              <th scope="col" className="sticky left-0 z-10 min-w-36 bg-paper-bright p-3" />
              {columns.map((column) => (
                <th key={column.key} scope="col" className="min-w-52 border-l border-rule p-3 align-bottom">
                  <div className="mb-2">{column.locator}</div>
                  <Link href={column.href} className="font-narrow text-xl leading-tight font-bold hover:text-signal">
                    {column.title}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">{children}</tbody>
        </table>
      </div>
    </section>
  );
}
