import { ReactNode } from "react";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import { ROUTES } from "@/lib/constants";

interface MethodSectionProps {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  disclaimerTitle: string;
  disclaimerBody: string;
  /** <MethodStep /> elements */
  children: ReactNode;
}

/** Inverted ink section: the three-step calculation path. */
export default function MethodSection(props: MethodSectionProps) {
  return (
    <section id={ROUTES.method.slice(1)} className="scroll-mt-16 bg-ink py-20 text-paper-bright sm:py-28">
      <Container>
        <SectionHeader number={props.number} eyebrow={props.eyebrow} title={props.title} description={props.description} inverted />
        <ol className="mt-16 grid border-t border-paper/25 md:grid-cols-3">{props.children}</ol>
        <aside className="mt-14 grid gap-4 border border-paper/25 p-6 sm:grid-cols-[auto_1fr] sm:gap-10 sm:p-8">
          <p className="font-display text-2xl tracking-wide">{props.disclaimerTitle}</p>
          <p className="max-w-3xl leading-relaxed text-paper/70">{props.disclaimerBody}</p>
        </aside>
      </Container>
    </section>
  );
}
