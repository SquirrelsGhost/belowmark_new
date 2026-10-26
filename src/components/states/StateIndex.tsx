import { ReactNode } from "react";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import { ROUTES } from "@/lib/constants";

interface StateIndexProps {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  colState: string;
  colHearings: string;
  colTax: string;
  footnote: string;
  /** <StateIndexRow /> elements */
  children: ReactNode;
}

/** All 16 federal states as a ruled register with bar lengths per open hearings. */
export default function StateIndex(props: StateIndexProps) {
  return (
    <section id={ROUTES.states.slice(1)} className="scroll-mt-24 py-20 sm:py-28">
      <Container>
        <SectionHeader number={props.number} eyebrow={props.eyebrow} title={props.title} description={props.description} />
        <table className="mt-14 w-full border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-ink font-mono text-[11px] tracking-wider text-muted uppercase">
              <th scope="col" className="py-2 pr-4 font-normal">{props.colState}</th>
              <th scope="col" className="py-2 pr-4 font-normal">{props.colHearings}</th>
              <th scope="col" className="py-2 text-right font-normal">{props.colTax}</th>
            </tr>
          </thead>
          <tbody>{props.children}</tbody>
        </table>
        <p className="mt-6 max-w-3xl font-mono text-xs leading-relaxed text-muted">{props.footnote}</p>
      </Container>
    </section>
  );
}
