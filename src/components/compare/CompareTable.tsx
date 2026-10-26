import { ReactNode } from "react";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import { ROUTES } from "@/lib/constants";

interface CompareTableProps {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  colCriterion: string;
  colManual: string;
  colBelowmark: string;
  /** <CompareRow /> elements */
  children: ReactNode;
}

const HEAD_CELL = "px-4 py-3 text-left font-mono text-[11px] font-normal tracking-wider uppercase";

/** Manual research vs. Belowmark, as a ruled comparison table. */
export default function CompareTable(props: CompareTableProps) {
  return (
    <section id={ROUTES.compare.slice(1)} className="scroll-mt-24 py-20 sm:py-28">
      <Container>
        <SectionHeader number={props.number} eyebrow={props.eyebrow} title={props.title} description={props.description} />
        <div className="mt-14 overflow-x-auto border-2 border-ink">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="border-b-2 border-ink">
                <th scope="col" className={`${HEAD_CELL} w-1/4 text-muted`}>{props.colCriterion}</th>
                <th scope="col" className={`${HEAD_CELL} text-muted`}>{props.colManual}</th>
                <th scope="col" className={`${HEAD_CELL} bg-ink text-paper-bright`}>{props.colBelowmark}</th>
              </tr>
            </thead>
            <tbody>{props.children}</tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
