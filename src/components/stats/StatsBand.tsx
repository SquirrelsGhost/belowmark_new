import { ReactNode } from "react";
import Container from "@/components/ui/Container";
import { ROUTES } from "@/lib/constants";

interface StatsBandProps {
  /** <StatItem /> elements */
  children: ReactNode;
}

/** Full-width band of key figures, separated by hairlines. */
export default function StatsBand({ children }: StatsBandProps) {
  return (
    <section id={ROUTES.stats.slice(1)} className="scroll-mt-28 py-16">
      <Container>
        <dl className="grid grid-cols-2 overflow-hidden rounded-3xl border border-line md:grid-cols-4 [&>*]:border-line [&>*:not(:last-child)]:border-r max-md:[&>*:nth-child(2)]:border-r-0 max-md:[&>*:nth-child(-n+2)]:border-b">
          {children}
        </dl>
      </Container>
    </section>
  );
}
